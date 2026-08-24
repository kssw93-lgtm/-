import { describe, expect, it } from "vitest";
import { getWorkRelationships } from "@/lib/interpretation/work-relationships";
import { computeSaju } from "@/lib/calc";
import { interpretSaju } from "@/lib/interpretation";
import type { PatternGroup } from "@/lib/interpretation/feature-extract";

const ALL_GROUPS: PatternGroup[] = ["bigeob", "siksang", "jaeseong", "gwanseong", "inseong"];

describe("직장 내 인간관계 (data/work-relationships.json)", () => {
  it.each(ALL_GROUPS)("%s는 boss/peer/subordinate 세 문구가 모두 채워져 있다", (group) => {
    const r = getWorkRelationships(group);
    expect(r.boss.length).toBeGreaterThan(0);
    expect(r.peer.length).toBeGreaterThan(0);
    expect(r.subordinate.length).toBeGreaterThan(0);
  });

  it("그룹마다 서로 다른 문구를 반환한다(재탕 아님)", () => {
    const a = getWorkRelationships("bigeob");
    const b = getWorkRelationships("gwanseong");
    expect(a.boss).not.toBe(b.boss);
    expect(a.peer).not.toBe(b.peer);
    expect(a.subordinate).not.toBe(b.subordinate);
  });
});

describe("interpretSaju에서 workRelationships는 직업운/종합사주에서만 채워진다", () => {
  const SAMPLE_INPUT = {
    year: 1990,
    month: 3,
    day: 15,
    hour: 10,
    minute: 0,
    gender: "male" as const,
    calendarType: "solar" as const,
    isLeapMonth: false,
  };

  it("직업운에서만 workRelationships가 채워진다 (종합사주는 개별 카테고리 심화 콘텐츠를 복제하지 않는다)", () => {
    const saju = computeSaju(SAMPLE_INPUT);
    expect(interpretSaju(saju, "career").workRelationships).not.toBeNull();
    expect(interpretSaju(saju, "overall").workRelationships).toBeNull();
    expect(interpretSaju(saju, "love").workRelationships).toBeNull();
    expect(interpretSaju(saju, "wealth").workRelationships).toBeNull();
    expect(interpretSaju(saju, "reunion").workRelationships).toBeNull();
  });
});
