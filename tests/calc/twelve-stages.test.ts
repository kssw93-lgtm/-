import { describe, expect, it } from "vitest";
import { computeTwelveStage } from "@/lib/calc/twelve-stages";
import type { BranchId, StemId } from "@/lib/calc/types";

describe("십이운성 계산", () => {
  // 고전 건록(祿) 위치 표와 교차검증: 甲祿寅·乙祿卯·丙戊祿巳·丁己祿午·庚祿申·辛祿酉·壬祿亥·癸祿子
  const knownGeonrok: [StemId, BranchId][] = [
    ["jia", "yin"],
    ["yi", "mao"],
    ["bing", "si"],
    ["ding", "wu"],
    ["wu", "si"],
    ["ji", "wu"],
    ["geng", "shen"],
    ["xin", "you"],
    ["ren", "hai"],
    ["gui", "zi"],
  ];

  it("10개 천간 모두 고전 건록 위치와 일치한다", () => {
    for (const [stem, branch] of knownGeonrok) {
      expect(computeTwelveStage(stem, branch)).toBe("geonrok");
    }
  });

  it("양간은 순행, 음간은 역행한다 — 장생 다음 칸이 목욕인지로 검증", () => {
    // 갑(양간) 장생=해 → 다음 순행 칸(자)이 목욕
    expect(computeTwelveStage("jia", "hai")).toBe("jangsaeng");
    expect(computeTwelveStage("jia", "zi")).toBe("mokyok");
    // 을(음간) 장생=오 → 역행이므로 이전 칸(사)이 목욕
    expect(computeTwelveStage("yi", "wu")).toBe("jangsaeng");
    expect(computeTwelveStage("yi", "si")).toBe("mokyok");
  });
});
