import { describe, expect, it } from "vitest";
import { resolveLocalBirthDateTime, toKstCalendarDate } from "./timezone-convert";
import { computeSaju } from "./index";

describe("resolveLocalBirthDateTime", () => {
  it("uses the historical standard-time offset for a winter birth in New York", () => {
    const resolved = resolveLocalBirthDateTime({
      year: 2024, month: 1, day: 15, hour: 12, minute: 0, timeZone: "America/New_York",
    });
    expect(resolved.utcMillis).toBe(Date.UTC(2024, 0, 15, 17, 0));
    expect(resolved.ambiguous).toBe(false);
  });

  it("applies daylight-saving time for a summer birth in New York", () => {
    const resolved = resolveLocalBirthDateTime({
      year: 2024, month: 7, day: 15, hour: 12, minute: 0, timeZone: "America/New_York",
    });
    expect(resolved.utcMillis).toBe(Date.UTC(2024, 6, 15, 16, 0));
  });

  it("rejects a local time skipped by the spring clock change", () => {
    expect(() => resolveLocalBirthDateTime({
      year: 2024, month: 3, day: 10, hour: 2, minute: 30, timeZone: "America/New_York",
    })).toThrow(/did not occur/);
  });

  it("chooses the earlier instant when autumn clocks repeat a local time", () => {
    const resolved = resolveLocalBirthDateTime({
      year: 2024, month: 11, day: 3, hour: 1, minute: 30, timeZone: "America/New_York",
    });
    expect(resolved.utcMillis).toBe(Date.UTC(2024, 10, 3, 5, 30));
    expect(resolved.ambiguous).toBe(true);
  });

  it("normalizes an international date across the Korea date boundary", () => {
    const resolved = resolveLocalBirthDateTime({
      year: 2024, month: 1, day: 1, hour: 1, minute: 0, timeZone: "Pacific/Kiritimati",
    });
    expect(toKstCalendarDate(resolved.utcMillis)).toEqual({ year: 2023, month: 12, day: 31 });
  });

  it("rejects invalid IANA time-zone names", () => {
    expect(() => resolveLocalBirthDateTime({
      year: 2024, month: 1, day: 1, hour: 12, minute: 0, timeZone: "Mars/Olympus",
    })).toThrow(/valid time zone/);
  });

  it("calculates an overseas birth as the same chart as its equivalent KST moment", () => {
    const overseas = computeSaju({
      year: 2000, month: 7, day: 15, hour: 5, minute: 0, gender: "female",
      calendarType: "solar", isLeapMonth: false, timeZone: "America/Los_Angeles",
    });
    const koreaTime = computeSaju({
      year: 2000, month: 7, day: 15, hour: 21, minute: 0, gender: "female",
      calendarType: "solar", isLeapMonth: false, timeZone: "Asia/Seoul",
    });

    expect(overseas.solarBirthDate).toEqual(koreaTime.solarBirthDate);
    expect(overseas.pillars).toEqual(koreaTime.pillars);
  });
});
