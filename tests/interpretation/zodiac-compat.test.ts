import { describe, expect, it } from "vitest";
import { getZodiacCompat, STAR_SIGN_ELEMENT } from "@/lib/interpretation/zodiac-compat";
import { getZodiacCareerFit } from "@/lib/interpretation/zodiac-career";
import type { BranchId } from "@/lib/calc/types";
import zodiacAnimalsJson from "@/data/zodiac-animals.json";

const ALL_BRANCHES: BranchId[] = ["zi", "chou", "yin", "mao", "chen", "si", "wu", "wei", "shen", "you", "xu", "hai"];
const ALL_SIGNS = Object.keys(STAR_SIGN_ELEMENT);
const ANIMAL_OF: Record<BranchId, string> = Object.fromEntries(
  (zodiacAnimalsJson as { branch: BranchId; animal: string }[]).map((z) => [z.branch, z.animal])
) as Record<BranchId, string>;

describe("띠 궁합 (지지 관계 재사용)", () => {
  it.each(ALL_BRANCHES)("%s는 육합 상대 띠가 정확히 1개 있다(모든 지지는 육합 짝이 있음)", (branch) => {
    const compat = getZodiacCompat(branch, "virgo");
    expect(compat.animalBest.labels.length).toBe(1);
  });

  it.each(ALL_BRANCHES)("%s는 삼합 상대 띠가 2개 있다", (branch) => {
    const compat = getZodiacCompat(branch, "virgo");
    expect(compat.animalGood.labels.length).toBe(2);
  });

  it("닭띠(酉)는 용띠와 육합, 뱀띠·소띠와 삼합, 토끼띠·쥐띠·개띠·호랑이띠와 노력형이다", () => {
    const compat = getZodiacCompat("you", "virgo");
    expect(compat.animalBest.labels).toEqual(["용띠"]);
    expect(compat.animalGood.labels.sort()).toEqual(["뱀띠", "소띠"].sort());
    expect(compat.animalEffort.labels.sort()).toEqual(["개띠", "쥐띠", "토끼띠", "호랑이띠"].sort());
  });

  it.each(ALL_BRANCHES)("%s의 결과에는 자기 자신의 띠가 포함되지 않는다", (branch) => {
    const compat = getZodiacCompat(branch, "virgo");
    const all = [...compat.animalBest.labels, ...compat.animalGood.labels, ...compat.animalEffort.labels];
    expect(all).not.toContain(ANIMAL_OF[branch]);
  });
});

describe("별자리 궁합 (4원소 배속)", () => {
  it.each(ALL_SIGNS)("%s는 같은 원소의 다른 별자리가 정확히 2개 있다", (sign) => {
    const compat = getZodiacCompat("zi", sign);
    expect(compat.starBest.labels.length).toBe(2);
  });

  it.each(ALL_SIGNS)("%s는 보완 원소의 별자리가 정확히 2개 있다(정반대 별자리는 제외)", (sign) => {
    const compat = getZodiacCompat("zi", sign);
    expect(compat.starGood.labels.length).toBe(2);
  });

  it.each(ALL_SIGNS)("%s의 정반대 별자리는 잘 맞는 편 목록에 중복으로 나오지 않는다", (sign) => {
    const compat = getZodiacCompat("zi", sign);
    const overlap = compat.starGood.labels.filter((l) => compat.starChallenging.labels.includes(l));
    expect(overlap).toEqual([]);
  });

  it("처녀자리(흙)는 황소자리·염소자리와 같은 원소, 물고기자리와 정반대다(물고기자리는 보완 원소지만 정반대라 잘 맞는 편에서는 제외)", () => {
    const compat = getZodiacCompat("zi", "virgo");
    expect(compat.starBest.labels.sort()).toEqual(["염소자리", "황소자리"].sort());
    expect(compat.starChallenging.labels).toEqual(["물고기자리"]);
    expect(compat.starGood.labels.sort()).toEqual(["게자리", "전갈자리"].sort());
  });
});

describe("띠·별자리로 보는 직업 적성", () => {
  it("동일 인물(같은 띠+별자리)은 항상 같은 직업 적성이 나온다(결정론적)", () => {
    const a = getZodiacCareerFit("you", "virgo");
    const b = getZodiacCareerFit("you", "virgo");
    expect(a).toEqual(b);
  });

  it.each(ALL_BRANCHES)("%s는 fields/desc가 채워진 결과를 반환한다", (branch) => {
    const fit = getZodiacCareerFit(branch, "virgo");
    expect(fit.animal.fields.length).toBeGreaterThan(0);
    expect(fit.animal.desc.length).toBeGreaterThan(0);
  });

  it.each(ALL_SIGNS)("%s는 fields/desc가 채워진 결과를 반환한다", (sign) => {
    const fit = getZodiacCareerFit("zi", sign);
    expect(fit.star.fields.length).toBeGreaterThan(0);
    expect(fit.star.desc.length).toBeGreaterThan(0);
  });
});
