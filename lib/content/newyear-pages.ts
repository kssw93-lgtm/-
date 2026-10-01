/** "OO년 신년운세" 페이지로 미리 만들어 둔 연도 목록. 새 연도를 추가하려면
 * data/newyear-branch-relation.json의 카피는 그대로 재사용되고, 이 배열에 연도만
 * 추가하면 /newyear/[year], /newyear/[year]/[branch] 정적 페이지가 함께 늘어난다. */
export const NEWYEAR_YEARS = [2027] as const;
