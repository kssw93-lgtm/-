import { describe, expect, it } from "vitest";
import { computeSaju } from "@/lib/calc";
import { computeCompatibility } from "@/lib/interpretation/compatibility";
import { computeCompatibilityAxes, getConflictPoint, getSecretMindTeaser } from "@/lib/interpretation/compatibility-axes";

describe("궁합 계산", () => {
  it("두 사람의 사주를 각각 독립적으로 계산해 비교한다(계산 규칙서 60번)", () => {
    const a = computeSaju({
      year: 2000, month: 6, day: 15, hour: 10, minute: 0,
      gender: "female", calendarType: "solar", isLeapMonth: false,
    });
    const b = computeSaju({
      year: 2001, month: 3, day: 3, hour: 14, minute: 30,
      gender: "male", calendarType: "solar", isLeapMonth: false,
    });
    const result = computeCompatibility(a, b);
    expect(result.textAtoB.length).toBeGreaterThan(0);
    expect(result.textBtoA.length).toBeGreaterThan(0);
    expect(result.elementRelation.length).toBeGreaterThan(0);
    expect(["bigeob", "siksang", "jaeseong", "gwanseong", "inseong"]).toContain(result.groupAtoB);
    expect(["bigeob", "siksang", "jaeseong", "gwanseong", "inseong"]).toContain(result.groupBtoA);
  });

  it("동일 두 사람은 항상 동일한 궁합 결과가 나온다(결정론적)", () => {
    const a = computeSaju({
      year: 2003, month: 9, day: 9, hour: null, minute: 0,
      gender: "male", calendarType: "solar", isLeapMonth: false,
    });
    const b = computeSaju({
      year: 2004, month: 11, day: 20, hour: null, minute: 0,
      gender: "female", calendarType: "solar", isLeapMonth: false,
    });
    const r1 = computeCompatibility(a, b);
    const r2 = computeCompatibility(a, b);
    expect(r1.groupAtoB).toBe(r2.groupAtoB);
    expect(r1.textAtoB).toBe(r2.textAtoB);
    expect(r1.elementRelation).toBe(r2.elementRelation);
  });
});

describe("궁합 요약 6축", () => {
  const BASE = {
    groupAtoB: "inseong" as const,
    groupBtoA: "inseong" as const,
    textAtoB: "t1",
    textBtoA: "t2",
    elementRelation: "같은 기운",
    elementRelationTier: "same" as const,
    dayBranchRelation: null,
  };

  it("성격 궁합: 같은 오행(same)이면 잘 맞아요, 상극(controls)이면 노력이 필요해요", () => {
    const same = computeCompatibilityAxes({ ...BASE, elementRelationTier: "same" });
    expect(same.personality.tier).toBe("good");
    const controls = computeCompatibilityAxes({ ...BASE, elementRelationTier: "controls" });
    expect(controls.personality.tier).toBe("challenging");
  });

  it("대화 궁합: 어느 한쪽이라도 식상이면 잘 맞아요, 아니면 무난해요", () => {
    const withSiksang = computeCompatibilityAxes({ ...BASE, groupAtoB: "siksang" });
    expect(withSiksang.communication.tier).toBe("good");
    const without = computeCompatibilityAxes(BASE);
    expect(without.communication.tier).toBe("neutral");
  });

  it("감정/결혼 궁합: 육합이면 둘 다 잘 맞아요, 충이면 둘 다 노력이 필요해요(관성 유무와 무관)", () => {
    const combine = computeCompatibilityAxes({
      ...BASE,
      dayBranchRelation: { type: "branch_six_combine", name: "육합", desc: "d" },
    });
    expect(combine.emotional.tier).toBe("good");
    expect(combine.marriage.tier).toBe("good");

    const clash = computeCompatibilityAxes({
      ...BASE,
      groupAtoB: "gwanseong",
      dayBranchRelation: { type: "branch_clash", name: "충", desc: "d" },
    });
    expect(clash.emotional.tier).toBe("challenging");
    expect(clash.marriage.tier).toBe("challenging");
  });

  it("결혼 궁합: 배우자궁 관계가 없어도 관성이 있으면 잘 맞아요로 판정한다", () => {
    const result = computeCompatibilityAxes({ ...BASE, groupBtoA: "gwanseong" });
    expect(result.marriage.tier).toBe("good");
  });

  it("아무 조건도 해당하지 않으면 생활/금전/결혼 궁합은 무난해요로 판정한다", () => {
    const result = computeCompatibilityAxes(BASE);
    expect(result.daily.tier).toBe("neutral");
    expect(result.money.tier).toBe("neutral");
    expect(result.marriage.tier).toBe("neutral");
  });
});

describe("관계에서 함께 신경 쓰면 좋은 점 (배우자궁 관계 기반)", () => {
  it("관계가 없으면 null", () => {
    expect(getConflictPoint(null)).toBeNull();
  });

  it("육합이면 null(긍정적 관계라 조심할 점 카드를 띄우지 않음)", () => {
    expect(getConflictPoint({ type: "branch_six_combine", name: "육합", desc: "d" })).toBeNull();
  });

  it.each(["branch_clash", "branch_break", "branch_harm", "branch_resentment"] as const)(
    "%s는 title/desc가 채워진 결과를 반환한다",
    (type) => {
      const result = getConflictPoint({ type, name: "n", desc: "d" });
      expect(result).not.toBeNull();
      expect(result?.title.length).toBeGreaterThan(0);
      expect(result?.desc.length).toBeGreaterThan(0);
    }
  );
});

describe("상대방 마음 살짝 엿보기 (groupBtoA 재사용)", () => {
  const BASE = {
    groupAtoB: "inseong" as const,
    groupBtoA: "inseong" as const,
    textAtoB: "t1",
    textBtoA: "t2",
    elementRelation: "같은 기운",
    elementRelationTier: "same" as const,
    dayBranchRelation: null,
  };

  it.each(["bigeob", "siksang", "jaeseong", "gwanseong", "inseong"] as const)(
    "groupBtoA=%s면 해당 그룹의 문구를 반환한다",
    (groupBtoA) => {
      const teaser = getSecretMindTeaser({ ...BASE, groupBtoA });
      expect(teaser.length).toBeGreaterThan(0);
    }
  );

  it("groupBtoA가 다르면 다른 문구가 나온다(동일 문구 재탕 아님)", () => {
    const a = getSecretMindTeaser({ ...BASE, groupBtoA: "bigeob" });
    const b = getSecretMindTeaser({ ...BASE, groupBtoA: "jaeseong" });
    expect(a).not.toBe(b);
  });
});
