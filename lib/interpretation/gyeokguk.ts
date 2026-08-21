import gyeokgukJson from "@/data/gyeokguk.json";
import { hiddenStemsOf } from "@/lib/calc/hidden-stems";
import { getTenGod } from "@/lib/calc/ten-gods";
import { stemById } from "@/lib/calc/data";
import type { SajuResult, TenGod } from "@/lib/calc/types";

export interface Gyeokguk {
  tenGod: TenGod;
  name: string;
  subtitle: string;
  strength: string;
  weakness: string;
}

const GYEOKGUK_TABLE = gyeokgukJson as Record<TenGod, { name: string; subtitle: string; strength: string; weakness: string }>;

/**
 * 격국(格局): 계산 규칙서 46번 원칙대로, 계산 엔진(월지 본기·일간 등 원자료)까지는 이미
 * 확보돼 있고, 그 위에서 "월지 본기가 일간에게 어떤 십신인가"로 격국명을 정하는 것은
 * 해석 엔진의 역할이다. 참고 예시(정해일주+경술월주 → 정재격)와 정확히 일치하는 방식.
 *
 * 겁재격/양인격 구분: 전통적으로 "양인(陽刃)"은 양간(甲丙戊庚壬)의 겁재 자리에만 쓰고,
 * 음간(乙丁己辛癸)의 겁재는 그냥 겁재격으로 부른다. gyeokguk.json의 "geopjae" 항목은
 * 양인격 기준으로 작성했고, 음간일 때는 "겁재격"으로 이름만 교체한다(설명 텍스트는 공유).
 */
export function computeGyeokguk(saju: SajuResult): Gyeokguk {
  const primaryHidden = hiddenStemsOf(saju.pillars.monthPillar.branch).find((h) => h.role === "primary");
  if (!primaryHidden) throw new Error("월지 본기를 찾을 수 없습니다.");

  const dayStem = saju.pillars.dayPillar.stem;
  const tenGod = getTenGod(dayStem, primaryHidden.stem);
  const info = GYEOKGUK_TABLE[tenGod];

  if (tenGod === "geopjae" && stemById(dayStem).yinYang === "yin") {
    return { tenGod, ...info, name: "겁재격" };
  }
  return { tenGod, ...info };
}
