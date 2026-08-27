import { describe, expect, it } from "vitest";
import { computeSaju } from "@/lib/calc";
import { describeRelations } from "@/lib/interpretation/relations-narrative";

describe("describeRelations — 천간 戊(wu)/지지 午(wu) 로마자 id 충돌 방지", () => {
  // 이 생년월일시는 년주 乙亥·월주 壬午·일주 丁丑·시주 丙午로 계산되어(午가 월지·시지에
  // 두 번 등장), 지지 관계(자형·해·원진 등)에 午가 여러 번 걸린다. 실제 원국에는 戊이라는
  // 글자가 전혀 없는데도, 예전 로직은 로마자 id("wu")만 보고 천간 戊으로 잘못 표시했다.
  const saju = computeSaju({
    year: 1995,
    month: 6,
    day: 15,
    hour: 12,
    minute: 0,
    gender: "female",
    calendarType: "solar",
    isLeapMonth: false,
  });

  it("원국에 없는 글자(戊)를 지어내지 않는다", () => {
    const text = describeRelations(saju);
    expect(text).not.toContain("戊");
  });

  it("실제 원국에 있는 지지 관계는 정확한 한자(午)로 표시한다", () => {
    expect(saju.relations.some((h) => h.type !== "stem_combine" && h.members.includes("wu"))).toBe(true);
    const text = describeRelations(saju);
    expect(text).toContain("午");
  });

  it("받침 없는 관계 이름(해)에는 '가'를, 받침 있는 이름(형)에는 '이'를 붙인다", () => {
    expect(saju.relations.some((h) => h.type === "branch_harm")).toBe(true);
    const text = describeRelations(saju);
    expect(text).toContain("해가 있어요");
    expect(text).not.toContain("해이 있어요");
    expect(text).toContain("형이 있어요");
  });
});
