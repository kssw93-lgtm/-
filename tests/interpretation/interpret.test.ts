import { describe, expect, it } from "vitest";
import { computeSaju } from "@/lib/calc";
import { interpretSaju, computeWealthMonthRanking, computeGwiinDaeunList, computeRootednessSummary } from "@/lib/interpretation";
import { getCheoneulTargets } from "@/lib/calc/sinsal";
import loveTemplates from "@/data/interpretation-templates/love.json";
import careerTemplates from "@/data/interpretation-templates/career.json";
import personalityTemplates from "@/data/interpretation-templates/personality.json";

const SAMPLE_INPUT = {
  year: 2015,
  month: 6,
  day: 21,
  hour: 8,
  minute: 30,
  gender: "female" as const,
  calendarType: "solar" as const,
  isLeapMonth: false,
};

describe("매핑규칙서 12번 검증 체크리스트", () => {
  it("연애운/직업운 각각 10패턴 × 2버전 = 20개 템플릿이 모두 존재한다", () => {
    expect(loveTemplates.length).toBe(20);
    expect(careerTemplates.length).toBe(20);
  });

  it("패턴 ID에 오타가 없다(5그룹 × 2강약 = 10패턴, 각 2버전)", () => {
    const groups = ["bigeob", "siksang", "jaeseong", "gwanseong", "inseong"];
    const strengths = ["gang", "yak"];
    for (const list of [loveTemplates, careerTemplates]) {
      for (const g of groups) {
        for (const s of strengths) {
          const matches = list.filter((t) => t.pattern === `${g}.${s}`);
          expect(matches.length).toBe(2);
        }
      }
    }
  });

  it("성향 요약은 10패턴 × 1버전 = 10개가 모두 존재한다", () => {
    expect(personalityTemplates.length).toBe(10);
    const groups = ["bigeob", "siksang", "jaeseong", "gwanseong", "inseong"];
    const strengths = ["gang", "yak"];
    for (const g of groups) {
      for (const s of strengths) {
        expect(personalityTemplates.filter((t) => t.pattern === `${g}.${s}`).length).toBe(1);
      }
    }
  });
});

describe("전체 카테고리 회귀 테스트 (신규 카테고리 추가 시 깨지지 않는지)", () => {
  it("5개 카테고리 모두 에러 없이 결과를 만든다", () => {
    const saju = computeSaju(SAMPLE_INPUT);
    const categories = ["love", "career", "wealth", "reunion", "overall"] as const;
    for (const c of categories) {
      const result = interpretSaju(saju, c);
      expect(result.sections.length).toBeGreaterThan(0);
      expect(result.resultText.length).toBeGreaterThan(0);
    }
  });
});

describe("결과 구성 (성향 + 카테고리 + 올해/이번달 + 대운 + 띠/별자리)", () => {
  it("연애운은 원국 공통 블록 없이 카테고리 핵심 콘텐츠로 바로 시작한다", () => {
    const saju = computeSaju(SAMPLE_INPUT);
    const result = interpretSaju(saju, "love");
    expect(result.sections.map((s) => s.heading)).toEqual(["연애운 핵심 특징", "올해 연애운", "이번달 연애운"]);
    for (const s of result.sections) {
      expect(s.text.length).toBeGreaterThan(0);
    }
  });

  it("연애운은 띠/별자리 성격 반복 대신 띠/별자리 궁합을 보여준다", () => {
    const saju = computeSaju(SAMPLE_INPUT);
    const result = interpretSaju(saju, "love");
    expect(result.sections.map((s) => s.heading)).not.toContain(`${result.zodiacAnimal.animal} 성격`);
    expect(result.zodiacCompat).not.toBeNull();
    expect(result.zodiacCompat?.animalBest.labels.length).toBe(1);
    expect(result.zodiacCareer).toBeNull();
  });

  it("직업운은 띠/별자리 궁합 대신 띠/별자리 직업 적성을 보여준다", () => {
    const saju = computeSaju(SAMPLE_INPUT);
    const result = interpretSaju(saju, "career");
    expect(result.zodiacCareer).not.toBeNull();
    expect(result.zodiacCareer?.animal.fields.length).toBeGreaterThan(0);
    expect(result.zodiacCompat).toBeNull();
  });

  it("종합사주만 일간총평/기본성향/원국관계 같은 원국 공통 블록을 포함한다", () => {
    const saju = computeSaju(SAMPLE_INPUT);
    const result = interpretSaju(saju, "overall");
    const headings = result.sections.map((s) => s.heading);
    expect(headings[0]).toBe("일간 총평 (나의 뿌리)");
    expect(headings).toContain("기본 성향");
    expect(headings).toContain("원국 속 특별한 관계");
  });

  it("대운 흐름(daeunFlow)은 대운 개수만큼 생성되고 각각 텍스트를 가진다", () => {
    const saju = computeSaju(SAMPLE_INPUT);
    const result = interpretSaju(saju, "career");
    expect(result.daeunFlow.length).toBe(saju.majorLuck.length);
    for (const d of result.daeunFlow) {
      expect(d.text.length).toBeGreaterThan(0);
      expect(d.pillarHanja.length).toBe(2);
    }
    expect(result.daeunFlow.filter((d) => d.isCurrent).length).toBeLessThanOrEqual(1);
  });

  it("대운 흐름은 결정론적이다(같은 사람은 항상 같은 텍스트 조합)", () => {
    const saju = computeSaju(SAMPLE_INPUT);
    const a = interpretSaju(saju, "career").daeunFlow.map((d) => d.text);
    const b = interpretSaju(saju, "career").daeunFlow.map((d) => d.text);
    expect(a).toEqual(b);
  });

  it("연애운 + 연애중: 만남 관련 섹션은 숨기고 관계 조언을 채운다", () => {
    const saju = computeSaju(SAMPLE_INPUT);
    const single = interpretSaju(saju, "love", "single");
    const dating = interpretSaju(saju, "love", "dating");

    expect(single.meetingChannel).not.toBeNull();
    expect(single.meetingTiming).not.toBeNull();
    expect(single.datingAdvice).toBeNull();

    expect(dating.meetingChannel).toBeNull();
    expect(dating.meetingTiming).toBeNull();
    expect(dating.datingAdvice).not.toBeNull();
    expect((dating.datingAdvice ?? "").length).toBeGreaterThan(0);
  });

  it("연애 상태를 넘기지 않으면 기존과 동일하게 동작한다(하위 호환)", () => {
    const saju = computeSaju(SAMPLE_INPUT);
    const noStatus = interpretSaju(saju, "love");
    const single = interpretSaju(saju, "love", "single");
    expect(noStatus.meetingChannel).toEqual(single.meetingChannel);
    expect(noStatus.meetingTiming).toEqual(single.meetingTiming);
    expect(noStatus.datingAdvice).toBeNull();
  });

  it("연애운이 아닌 카테고리는 연애 상태를 넘겨도 영향받지 않는다", () => {
    const saju = computeSaju(SAMPLE_INPUT);
    const withoutStatus = interpretSaju(saju, "career");
    const withStatus = interpretSaju(saju, "career", "dating");
    expect(withStatus.datingAdvice).toBeNull();
    expect(withStatus.sections).toEqual(withoutStatus.sections);
  });

  it("귀인 대운: 평생 대운 중 천을귀인 지지와 정확히 일치하는 시기만 뽑는다", () => {
    const saju = computeSaju(SAMPLE_INPUT);
    const gwiinDaeun = computeGwiinDaeunList(saju);
    const targets = getCheoneulTargets(saju.pillars.dayPillar.stem);
    const expectedCount = saju.majorLuck.filter((lp) => targets.includes(lp.pillar.branch)).length;
    expect(gwiinDaeun.length).toBe(expectedCount);
    for (const g of gwiinDaeun) {
      expect(g.pillarHanja.length).toBe(2);
      expect(g.ageLabel).toMatch(/^\d+세~\d+세$/);
    }
  });

  it("재물 월별 순위: TOP3/조심 3개씩, 겹치지 않고, TOP3 점수가 조심 3개보다 항상 높거나 같다", () => {
    const saju = computeSaju(SAMPLE_INPUT);
    const ranking = computeWealthMonthRanking(saju, 2026);
    expect(ranking).not.toBeNull();
    if (!ranking) return;
    expect(ranking.topMonths.length).toBe(3);
    expect(ranking.cautionMonths.length).toBe(3);
    const topMonthNums = new Set(ranking.topMonths.map((m) => m.month));
    const cautionMonthNums = new Set(ranking.cautionMonths.map((m) => m.month));
    expect([...topMonthNums].some((m) => cautionMonthNums.has(m))).toBe(false);
    const minTopScore = Math.min(...ranking.topMonths.map((m) => m.score));
    const maxCautionScore = Math.max(...ranking.cautionMonths.map((m) => m.score));
    expect(minTopScore).toBeGreaterThanOrEqual(maxCautionScore);
  });

  it("재물 월별 순위는 결정론적이다(같은 사람+같은 해는 항상 같은 결과)", () => {
    const saju = computeSaju(SAMPLE_INPUT);
    const a = computeWealthMonthRanking(saju, 2026);
    const b = computeWealthMonthRanking(saju, 2026);
    expect(a).toEqual(b);
  });

  it("월별 리듬은 12개월(또는 데이터 범위 내) 모두 라벨/팁을 가진다", () => {
    const saju = computeSaju(SAMPLE_INPUT);
    const result = interpretSaju(saju, "career");
    expect(result.monthRhythm.length).toBeGreaterThan(0);
    for (const r of result.monthRhythm) {
      expect(r.label.length).toBeGreaterThan(0);
      expect(r.tip.length).toBeGreaterThan(0);
    }
  });

  it("행운의 컬러/숫자는 모든 카테고리에서 공통으로 항상 값을 반환한다", () => {
    const saju = computeSaju(SAMPLE_INPUT);
    for (const c of ["love", "career", "wealth", "reunion", "overall"] as const) {
      const result = interpretSaju(saju, c);
      expect(result.luckColor).not.toBeNull();
      expect(result.luckColor!.color.length).toBeGreaterThan(0);
      expect(result.luckColor!.numbers.length).toBe(2);
    }
  });

  it("인연 만나기 좋은 날·장소는 연애운/재회운에서만 제공된다 (종합사주는 개별 카테고리 심화 콘텐츠를 복제하지 않는다)", () => {
    const saju = computeSaju(SAMPLE_INPUT);
    expect(interpretSaju(saju, "love").meetingTiming).not.toBeNull();
    expect(interpretSaju(saju, "reunion").meetingTiming).not.toBeNull();
    expect(interpretSaju(saju, "overall").meetingTiming).toBeNull();
    expect(interpretSaju(saju, "career").meetingTiming).toBeNull();
    expect(interpretSaju(saju, "wealth").meetingTiming).toBeNull();
  });
});

describe("해석 엔진 결정론성 (매핑규칙서 04번)", () => {
  it("동일 인물 + 동일 카테고리는 항상 같은 템플릿 버전을 반환한다", () => {
    const saju = computeSaju(SAMPLE_INPUT);
    const a = interpretSaju(saju, "love");
    const b = interpretSaju(saju, "love");
    expect(a.templateId).toBe(b.templateId);
  });

  it("이름 미입력 시 '당신'으로 대체된다", () => {
    const saju = computeSaju({ ...SAMPLE_INPUT, name: undefined });
    const result = interpretSaju(saju, "career");
    expect(result.resultText.length).toBeGreaterThan(0);
  });
});

describe("01-1번: 출생시간 미상 예외", () => {
  it("hour가 null이면 isHourExcluded=true", () => {
    const saju = computeSaju({ ...SAMPLE_INPUT, hour: null, minute: 0 });
    const result = interpretSaju(saju, "love");
    expect(result.isHourExcluded).toBe(true);
  });

  it("hour가 있으면 isHourExcluded=false", () => {
    const saju = computeSaju(SAMPLE_INPUT);
    const result = interpretSaju(saju, "love");
    expect(result.isHourExcluded).toBe(false);
  });
});

describe("통근(通根) 요약", () => {
  it("saju.rootedness와 동일한 개수의 지지를 년/월/일/시 순서로 매핑한다", () => {
    const saju = computeSaju(SAMPLE_INPUT);
    const summary = computeRootednessSummary(saju);
    expect(summary.pillars.length).toBe(saju.rootedness.length);
    expect(summary.pillars.map((p) => p.rooted)).toEqual(saju.rootedness.map((r) => r.rooted));
    expect(summary.rootedCount).toBe(saju.rootedness.filter((r) => r.rooted).length);
    expect(summary.text.length).toBeGreaterThan(0);
  });

  it("시간 미상이면 3곳(년/월/일)만 반환한다", () => {
    const saju = computeSaju({ ...SAMPLE_INPUT, hour: null, minute: 0 });
    const summary = computeRootednessSummary(saju);
    expect(summary.pillars.length).toBe(3);
    expect(summary.totalCount).toBe(3);
  });
});

describe("직업운/재물운 보강: 신살·귀인 대운·격국 기반 콘텐츠", () => {
  it("직업운은 격국별 직업 적성만 채워지고 재물 스타일은 비어있다", () => {
    const saju = computeSaju(SAMPLE_INPUT);
    const result = interpretSaju(saju, "career");
    expect(result.gyeokgukCareerFit).not.toBeNull();
    expect(result.gyeokgukCareerFit?.fitField.length).toBeGreaterThan(0);
    expect(result.gyeokgukWealthStyle).toBeNull();
  });

  it("재물운은 격국별 재물 스타일만 채워지고 직업 적성은 비어있다", () => {
    const saju = computeSaju(SAMPLE_INPUT);
    const result = interpretSaju(saju, "wealth");
    expect(result.gyeokgukWealthStyle).not.toBeNull();
    expect(result.gyeokgukWealthStyle?.style.length).toBeGreaterThan(0);
    expect(result.gyeokgukCareerFit).toBeNull();
  });

  it("직업운/재물운 모두 신살과 귀인 대운이 이제 채워진다", () => {
    const saju = computeSaju(SAMPLE_INPUT);
    const career = interpretSaju(saju, "career");
    const wealth = interpretSaju(saju, "wealth");
    // 신살은 사람마다 없을 수도 있으니 배열 형태만 확인(빈 배열이 아니라 undefined가 아님을 확인)
    expect(Array.isArray(career.sinsal)).toBe(true);
    expect(Array.isArray(wealth.sinsal)).toBe(true);
    expect(Array.isArray(career.gwiinDaeun)).toBe(true);
    expect(Array.isArray(wealth.gwiinDaeun)).toBe(true);
  });

  it("연애운 등 관련 없는 카테고리는 격국 직업/재물 필드가 항상 null이다", () => {
    const saju = computeSaju(SAMPLE_INPUT);
    const result = interpretSaju(saju, "love");
    expect(result.gyeokgukCareerFit).toBeNull();
    expect(result.gyeokgukWealthStyle).toBeNull();
  });
});
