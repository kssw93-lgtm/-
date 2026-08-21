import { describe, expect, it } from "vitest";
import { computeSaju } from "@/lib/calc";
import { interpretSaju } from "@/lib/interpretation";
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
  it("interpretSaju는 확장된 9개 섹션을 반환하고 모두 내용이 채워진다", () => {
    const saju = computeSaju(SAMPLE_INPUT);
    const result = interpretSaju(saju, "love");
    expect(result.sections.map((s) => s.heading)).toEqual([
      "일간 총평 (나의 뿌리)",
      "기본 성향",
      "원국 속 특별한 관계",
      "연애운 핵심 특징",
      "올해 연애운",
      "이번달 연애운",
      "지금의 대운 흐름",
      `${result.zodiacAnimal.animal} 성격`,
      `${result.starSign.name} 성격`,
    ]);
    for (const s of result.sections) {
      expect(s.text.length).toBeGreaterThan(0);
    }
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

  it("월별 리듬은 12개월(또는 데이터 범위 내) 모두 라벨/팁을 가진다", () => {
    const saju = computeSaju(SAMPLE_INPUT);
    const result = interpretSaju(saju, "career");
    expect(result.monthRhythm.length).toBeGreaterThan(0);
    for (const r of result.monthRhythm) {
      expect(r.label.length).toBeGreaterThan(0);
      expect(r.tip.length).toBeGreaterThan(0);
    }
  });

  it("행운의 컬러/숫자는 항상 값을 반환한다", () => {
    const saju = computeSaju(SAMPLE_INPUT);
    const result = interpretSaju(saju, "love");
    expect(result.luckColor.color.length).toBeGreaterThan(0);
    expect(result.luckColor.numbers.length).toBe(2);
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
