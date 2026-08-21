import stemsJson from "@/data/stems.json";
import branchesJson from "@/data/branches.json";
import sexagenaryJson from "@/data/sexagenary-cycle.json";
import hiddenStemsJson from "@/data/hidden-stems.json";
import fiveElementsJson from "@/data/five-elements.json";
import stemRelationsJson from "@/data/stem-relations.json";
import branchRelationsJson from "@/data/branch-relations.json";
import voidBranchesJson from "@/data/void-branches.json";
import kstHistoryJson from "@/data/kst-history.json";

import type { BranchId, ElementId, HiddenStemEntry, StemId, YinYang } from "./types";

export interface StemData {
  index: number;
  id: StemId;
  hanja: string;
  reading: string;
  element: ElementId;
  yinYang: YinYang;
}

export interface BranchData {
  index: number;
  id: BranchId;
  hanja: string;
  reading: string;
  element: ElementId;
  yinYang: YinYang;
  season: "spring" | "summer" | "autumn" | "winter";
}

export const STEMS = stemsJson as StemData[];
export const BRANCHES = branchesJson as BranchData[];
export const SEXAGENARY = sexagenaryJson as { index: number; stem: StemId; branch: BranchId; hanja: string }[];
export const HIDDEN_STEMS = hiddenStemsJson as Record<BranchId, HiddenStemEntry[]>;
export const FIVE_ELEMENTS = fiveElementsJson as {
  elements: ElementId[];
  generates: Record<ElementId, ElementId>;
  controls: Record<ElementId, ElementId>;
};
export const STEM_RELATIONS = stemRelationsJson as { combine: { source: StemId; target: StemId }[] };
export const BRANCH_RELATIONS = branchRelationsJson as {
  sixCombine: { source: BranchId; target: BranchId }[];
  clash: { source: BranchId; target: BranchId }[];
  threeCombine: { branches: BranchId[]; element: ElementId }[];
  directionalCombine: { branches: BranchId[]; element: ElementId }[];
  punishment: { type: "triple" | "pair" | "self"; branches: BranchId[] }[];
  break: { source: BranchId; target: BranchId }[];
  harm: { source: BranchId; target: BranchId }[];
  resentment: { source: BranchId; target: BranchId }[];
};
export const VOID_BRANCHES = voidBranchesJson as unknown as {
  byXunStartBranch: Partial<Record<BranchId, BranchId[]>>;
};
export const KST_HISTORY = kstHistoryJson as {
  version: string;
  meridianPeriods: { periodStart: string; periodEnd: string | null; referenceMeridian: number; utcOffsetMinutes: number }[];
  daylightSavingPeriods: { year: number; startLocal: string; endLocal: string; offsetMinutes: number }[];
};

const STEM_BY_ID = new Map(STEMS.map((s) => [s.id, s]));
const BRANCH_BY_ID = new Map(BRANCHES.map((b) => [b.id, b]));
const SEXAGENARY_INDEX_BY_PAIR = new Map(SEXAGENARY.map((e) => [`${e.stem}|${e.branch}`, e.index]));

export function sexagenaryIndexOf(stem: StemId, branch: BranchId): number {
  const idx = SEXAGENARY_INDEX_BY_PAIR.get(`${stem}|${branch}`);
  if (idx === undefined) throw new Error(`Invalid stem/branch pair: ${stem}/${branch}`);
  return idx;
}

export function stemById(id: StemId): StemData {
  const s = STEM_BY_ID.get(id);
  if (!s) throw new Error(`Unknown stem id: ${id}`);
  return s;
}

export function branchById(id: BranchId): BranchData {
  const b = BRANCH_BY_ID.get(id);
  if (!b) throw new Error(`Unknown branch id: ${id}`);
  return b;
}

export function stemHanja(id: StemId): string {
  return stemById(id).hanja;
}

export function branchHanja(id: BranchId): string {
  return branchById(id).hanja;
}

export function pillarHanja(stem: StemId, branch: BranchId): string {
  return `${stemHanja(stem)}${branchHanja(branch)}`;
}
