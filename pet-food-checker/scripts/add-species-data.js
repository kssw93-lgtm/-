/**
 * 기존 강아지 전용 foods.json(단일 safety 필드)을 dog/cat 이중 구조로 변환합니다.
 * 대부분의 항목은 고양이도 동일한 위험도를 가지지만, 종에 따라 위험도가
 * 다르다고 알려진 항목만 CAT_OVERRIDES에서 별도로 조정합니다.
 *
 * 사용법: node scripts/add-species-data.js
 * (이미 dog/cat 구조인 foods.json에 다시 실행하면 안전하게 무시됩니다.)
 */
const fs = require("fs");
const path = require("path");

const FOODS_PATH = path.join(__dirname, "..", "data", "foods.json");

// id -> 고양이 안전 정보 중 개와 다르게 적용해야 하는 필드만 지정
const CAT_OVERRIDES = {
  3: {
    // 자일리톨: 중독 사례 대부분 개에서 보고됨, 고양이는 상대적으로 드묾
    safety: "위험",
    notes:
      "개보다 중독 사례가 적게 보고되지만 안전성이 확인되지 않았으니 피하는 것이 좋습니다.",
  },
  4: {
    // 마카다미아너트: 고양이에서는 심각한 중독 사례가 잘 보고되지 않음
    safety: "주의",
    symptoms: "뚜렷한 중독 사례는 적으나 소화불량 가능",
    emergency: "다량 섭취 시 병원 상담",
    notes:
      "개만큼 심각한 중독 사례는 보고되지 않았지만 예방적으로 급여하지 않는 것이 좋습니다.",
  },
  14: {
    notes:
      "고양이는 특히 아세트아미노펜(타이레놀) 성분에 치명적입니다. 사람 상비약은 반드시 손이 닿지 않는 곳에 보관하세요.",
  },
  31: {
    notes:
      "성묘 대부분도 유당 분해 효소가 줄어들어 소화 문제가 흔하게 나타납니다.",
  },
  40: {
    // 감귤류 정유 성분은 고양이의 간 대사 능력이 낮아 더 위험할 수 있음
    safety: "위험",
    notes:
      "고양이는 감귤류 정유 성분을 대사하는 능력이 개보다 낮아 더 위험할 수 있습니다.",
  },
  58: {
    notes:
      "방광·요로 결석 병력이 있는 고양이는 수산염이 많은 채소를 피하는 것이 좋습니다.",
  },
  68: {
    safety: "주의",
    safe_amount: "아주 소량",
    notes:
      "성묘가 되면 유당 분해 효소가 줄어들어 개보다 배탈이 더 자주 발생합니다.",
  },
  69: {
    safety: "주의",
    notes: "저염이라도 유제품 소화가 어려운 고양이가 많아 아주 소량만 주세요.",
  },
  78: {
    safety: "주의",
    notes:
      "고양이가 특히 좋아하지만 자주 급여하면 수은 축적과 티아민 결핍 위험이 있어 가끔 소량만 급여하세요.",
  },
  85: {
    notes:
      "방광·요로 결석 병력이 있는 고양이는 수산염이 많은 채소를 피하는 것이 좋습니다.",
  },
};

const CAT_GENERAL_NOTE_SUFFIX =
  " (고양이는 육식동물이라 채소·과일류가 필수 영양소는 아니며, 간식으로 아주 소량만 급여하세요.)";

const PLANT_CATEGORIES = new Set(["채소", "과일", "곡물"]);

function buildCatInfo(dogInfo, item) {
  const override = CAT_OVERRIDES[item.id] || {};
  const merged = { ...dogInfo, ...override };

  if (
    dogInfo.safety === "안전" &&
    PLANT_CATEGORIES.has(item.category) &&
    !override.notes
  ) {
    merged.notes = `${dogInfo.notes}${CAT_GENERAL_NOTE_SUFFIX}`;
  }

  return merged;
}

function migrate() {
  const raw = JSON.parse(fs.readFileSync(FOODS_PATH, "utf8"));

  const migrated = raw.map((item) => {
    if (item.dog && item.cat) {
      return item; // 이미 마이그레이션된 항목
    }

    const dogInfo = {
      safety: item.safety,
      toxic_component: item.toxic_component,
      symptoms: item.symptoms,
      emergency: item.emergency,
      safe_amount: item.safe_amount,
      notes: item.notes,
    };

    return {
      id: item.id,
      name: item.name,
      category: item.category,
      dog: dogInfo,
      cat: buildCatInfo(dogInfo, item),
    };
  });

  fs.writeFileSync(FOODS_PATH, JSON.stringify(migrated, null, 2) + "\n");
  console.log(`migrated ${migrated.length} items -> dog/cat schema`);
}

migrate();
