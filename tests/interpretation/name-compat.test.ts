import { describe, expect, it } from "vitest";
import { computeNameCompat, NameCompatInputError } from "@/lib/interpretation/name-compat";

describe("computeNameCompat", () => {
  it("이름 순서를 바꿔 입력해도 항상 같은 결과를 낸다", () => {
    const a = computeNameCompat("홍길동", "김철수");
    const b = computeNameCompat("김철수", "홍길동");
    expect(a.score).toBe(b.score);
    expect(a.title).toBe(b.title);
  });
  it("같은 이름 조합은 항상 같은 결과를 낸다(결정론적)", () => {
    const a = computeNameCompat("홍길동", "김철수");
    const b = computeNameCompat("홍길동", "김철수");
    expect(a).toEqual(b);
  });
  it("다른 이름 조합은 다른 결과가 나올 수 있다", () => {
    const a = computeNameCompat("홍길동", "김철수");
    const c = computeNameCompat("홍길동", "이영희");
    expect(a.score === c.score && a.title === c.title).toBe(false);
  });
  it("점수는 항상 30~99 범위 안에 있다", () => {
    const pairs: [string, string][] = [["가", "나"], ["다라마", "바사아"], ["자", "자"], ["테스트이름", "다른이름"]];
    for (const [x, y] of pairs) {
      const r = computeNameCompat(x, y);
      expect(r.score).toBeGreaterThanOrEqual(30);
      expect(r.score).toBeLessThanOrEqual(99);
    }
  });
  it("빈 이름은 에러를 던진다", () => {
    expect(() => computeNameCompat("", "김철수")).toThrow(NameCompatInputError);
    expect(() => computeNameCompat("  ", "김철수")).toThrow(NameCompatInputError);
  });
  it("너무 긴 이름은 에러를 던진다", () => {
    expect(() => computeNameCompat("가".repeat(11), "김철수")).toThrow(NameCompatInputError);
  });
  it("앞뒤 공백은 무시하고 같은 결과를 낸다", () => {
    const a = computeNameCompat("홍길동", "김철수");
    const b = computeNameCompat("  홍길동  ", " 김철수 ");
    expect(a).toEqual(b);
  });
});
