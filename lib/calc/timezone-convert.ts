export interface LocalBirthDateTime {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  timeZone: string;
}

export interface ResolvedBirthDateTime {
  utcMillis: number;
  /** A repeated wall-clock time during the autumn clock change has two valid instants. */
  ambiguous: boolean;
}

interface ZonedParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}

function formatterFor(timeZone: string): Intl.DateTimeFormat {
  try {
    return new Intl.DateTimeFormat("en-CA-u-ca-gregory-nu-latn", {
      timeZone,
      calendar: "gregory",
      numberingSystem: "latn",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    });
  } catch {
    throw new Error("Choose a valid time zone for the place where you were born.");
  }
}

function zonedPartsAt(formatter: Intl.DateTimeFormat, instant: number): ZonedParts {
  const parts = Object.fromEntries(
    formatter.formatToParts(new Date(instant)).map(({ type, value }) => [type, value])
  );
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour),
    minute: Number(parts.minute),
  };
}

function sameMinute(a: ZonedParts, b: ZonedParts): boolean {
  return a.year === b.year && a.month === b.month && a.day === b.day && a.hour === b.hour && a.minute === b.minute;
}

/**
 * Resolve a birth time recorded in an IANA time zone. Sampling both sides of the date
 * boundary captures the offsets around daylight-saving changes. If the local clock
 * repeated a time, the earlier occurrence is selected deterministically.
 */
export function resolveLocalBirthDateTime(input: LocalBirthDateTime): ResolvedBirthDateTime {
  const formatter = formatterFor(input.timeZone);
  const wallClock = Date.UTC(input.year, input.month - 1, input.day, input.hour, input.minute);
  const expected: ZonedParts = {
    year: input.year,
    month: input.month,
    day: input.day,
    hour: input.hour,
    minute: input.minute,
  };

  // Offsets are derived from several nearby instants so both sides of a DST transition
  // are considered without assuming that a region's current offset applied at birth.
  const offsets = new Set<number>();
  for (const hours of [-48, -24, -12, 0, 12, 24, 48]) {
    const sample = wallClock + hours * 60 * 60 * 1000;
    const local = zonedPartsAt(formatter, sample);
    const localAsUtc = Date.UTC(local.year, local.month - 1, local.day, local.hour, local.minute);
    offsets.add(localAsUtc - sample);
  }

  const candidates = [...offsets]
    .map((offset) => wallClock - offset)
    .filter((instant) => sameMinute(zonedPartsAt(formatter, instant), expected))
    .sort((a, b) => a - b);

  if (candidates.length === 0) {
    throw new Error("That local time did not occur because the clocks changed for daylight saving time. Adjust the birth time and try again.");
  }

  return { utcMillis: candidates[0], ambiguous: candidates.length > 1 };
}

/** Return the calendar date used by this calculator after converting an instant to KST. */
export function toKstCalendarDate(utcMillis: number): { year: number; month: number; day: number } {
  const kst = new Date(utcMillis + 9 * 60 * 60 * 1000);
  return { year: kst.getUTCFullYear(), month: kst.getUTCMonth() + 1, day: kst.getUTCDate() };
}
