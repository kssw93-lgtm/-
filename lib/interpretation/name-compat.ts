import nameCompatTierJson from "@/data/name-compat-tier.json";
import { hashSeed } from "./template-select";

interface NameCompatTier {
  min: number;
  title: string;
  emoji: string;
  summary: string;
  tags: string[];
}

const TIERS = nameCompatTierJson as NameCompatTier[];
const MAX_NAME_LENGTH = 10;

export interface NameCompatResult {
  nameA: string;
  nameB: string;
  score: number;
  title: string;
  emoji: string;
  summary: string;
  tags: string[];
}

export class NameCompatInputError extends Error {}

function normalizeName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) throw new NameCompatInputError("이름을 입력해주세요.");
  if (trimmed.length > MAX_NAME_LENGTH) throw new NameCompatInputError(`이름은 ${MAX_NAME_LENGTH}자 이하로 입력해주세요.`);
  return trimmed;
}

/**
 * 재미로 보는 콘텐츠 — 실제 성명학(획수·발음오행)에 기반한 계산이 아니다. 두 이름을
 * 정렬된 순서로 합쳐 결정론적 해시를 뽑을 뿐이라, 이름 순서를 바꿔 입력해도(A,B든
 * B,A든) 항상 같은 결과가 나온다. 같은 이름 조합이면 언제 확인해도 같은 결과.
 */
export function computeNameCompat(rawNameA: string, rawNameB: string): NameCompatResult {
  const nameA = normalizeName(rawNameA);
  const nameB = normalizeName(rawNameB);

  const [first, second] = [nameA, nameB].sort();
  const seed = hashSeed(`${first}|${second}|name-compat`);
  const score = 30 + (seed % 70); // 30~99

  const tier = TIERS.find((t) => score >= t.min) ?? TIERS[TIERS.length - 1];
  const tagPick = tier.tags[seed % tier.tags.length];
  const otherTags = tier.tags.filter((t) => t !== tagPick);
  const secondTag = otherTags[(seed >> 3) % Math.max(otherTags.length, 1)] ?? tagPick;

  return {
    nameA,
    nameB,
    score,
    title: tier.title,
    emoji: tier.emoji,
    summary: tier.summary,
    tags: [tagPick, secondTag].filter((v, i, arr) => arr.indexOf(v) === i),
  };
}
