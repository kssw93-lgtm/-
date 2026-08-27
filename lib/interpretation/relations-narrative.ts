import relationTypesJson from "@/data/relation-types.json";
import { stemHanja, branchHanja } from "@/lib/calc/data";
import type { BranchId, RelationHit, SajuResult, StemId } from "@/lib/calc/types";

const RELATION_TYPES = relationTypesJson as Record<string, { name: string; desc: string }>;

/**
 * 천간 戊(wu)와 지지 午(wu)처럼 로마자 표기(id)가 겹치는 글자가 있어, 문자열만 보고
 * 천간/지지를 추측하면 틀린 한자를 표시할 수 있다("戊-戊 형" 처럼 실제 원국에 없는
 * 글자가 나타나는 식). 관계 종류(type)가 이미 천간/지지를 확정해주므로 그걸 기준으로
 * 판단한다 — 천간합(stem_combine)만 천간이고, 나머지 관계는 전부 지지다.
 */
function memberHanja(id: string, isStem: boolean): string {
  return isStem ? stemHanja(id as StemId) : branchHanja(id as BranchId);
}

/** 받침 유무에 따라 "이/가"를 고른다 — "해가 있어요"(받침 없음) vs "형이 있어요"(받침 있음). */
function subjectParticle(word: string): "이" | "가" {
  const code = word.charCodeAt(word.length - 1) - 0xac00;
  if (code < 0 || code > 11171) return "이";
  return code % 28 === 0 ? "가" : "이";
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
    const isStem = h.type === "stem_combine";
    const hanjaList = h.members.map((id) => memberHanja(id, isStem)).join(h.members.length > 2 ? "" : "-");
    return `${hanjaList} ${info.name}${subjectParticle(info.name)} 있어요. ${info.desc}.`;
  });

  return `당신의 원국에는 다음과 같은 관계가 눈에 띄어요. ${sentences.join(" ")}`;
}
