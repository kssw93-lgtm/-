import relationTypesJson from "@/data/relation-types.json";
import { stemHanja, branchHanja } from "@/lib/calc/data";
import type { RelationHit, SajuResult, StemId } from "@/lib/calc/types";

const RELATION_TYPES = relationTypesJson as Record<string, { name: string; desc: string }>;
const STEM_IDS = new Set([
  "jia", "yi", "bing", "ding", "wu", "ji", "geng", "xin", "ren", "gui",
]);

function memberHanja(id: string): string {
  return STEM_IDS.has(id) ? stemHanja(id as StemId) : branchHanja(id as never);
}

/**
 * 계산 규칙서 33~41번: 계산 엔진은 합충형파해원진의 "존재 여부"만 산출하고(saju.relations),
 * 그 의미 해석은 해석 엔진 영역이다(58번: 존재와 해석 분리). 이미 계산된 실제 관계를
 * 그대로 나열해 서술한다 — 패턴이 아니라 이 사람의 원국에 실제로 있는 조합만 언급한다.
 */
export function describeRelations(saju: SajuResult): string {
  const hits = saju.relations;
  if (hits.length === 0) {
    return "이번 원국에는 뚜렷하게 강한 합충 관계가 나타나지 않아요. 여덟 글자가 비교적 독립적으로 각자의 역할을 하는 구조라고 볼 수 있어요.";
  }

  // 같은 (type, members) 조합 중복 제거
  const seen = new Set<string>();
  const uniqueHits: RelationHit[] = [];
  for (const h of hits) {
    const key = `${h.type}|${[...h.members].sort().join(",")}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueHits.push(h);
    }
  }

  const sentences = uniqueHits.slice(0, 5).map((h) => {
    const info = RELATION_TYPES[h.type];
    const hanjaList = h.members.map(memberHanja).join(h.members.length > 2 ? "" : "-");
    return `${hanjaList} ${info.name}이 있어요. ${info.desc}.`;
  });

  return `당신의 원국에는 다음과 같은 관계가 눈에 띄어요. ${sentences.join(" ")}`;
}
