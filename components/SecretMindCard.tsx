"use client";

interface Props {
  partnerLabel: string;
  teaser: string;
}

/**
 * 재미 콘텐츠: 상대방의 "속마음"을 살짝 엿보는 컨셉으로 문구를 보여준다.
 * 실제로는 상대방의 실제 생년월일로 계산된 groupBtoA(십신 관계)를 그대로 재사용한
 * 것이라 지어낸 내용은 아니다 — 다만 "마음을 읽는다"는 확정적 표현이 아니라
 * 재미로 보는 콘텐츠임을 분명히 한다.
 *
 * 예전엔 이 카드만 별도로 가짜 타이머 광고를 거쳐야 열렸는데, 결과 진입 자체가
 * 이제 진짜 보상형 광고 게이트(ResultUnlockGate)를 한 번 거치므로 같은 결과 안에서
 * 또 광고를 요구하지 않는다 — 정책상 "새로운 결과 1건당 보상형 광고 최대 1회"를
 * 지키기 위해 잠금 없이 바로 연다.
 */
export default function SecretMindCard({ partnerLabel, teaser }: Props) {
  return (
    <div className="rounded-2xl border border-[color:var(--color-gold)]/40 bg-gradient-to-b from-[color:var(--color-gold)]/10 to-transparent p-6">
      <p className="mb-2 text-xs font-semibold text-[color:var(--color-gold-light)]">
        🔮 {partnerLabel}의 속마음, 살짝 엿보면
      </p>
      <p className="text-base leading-relaxed">{teaser}</p>
      <p className="mt-3 text-xs text-white/40">
        {partnerLabel}의 사주로 계산된 십신 관계를 재미있게 풀어본 내용이에요. 가볍게 즐겨주세요 :)
      </p>
    </div>
  );
}
