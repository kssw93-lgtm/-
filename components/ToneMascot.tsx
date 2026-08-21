import type { ToneStyleId } from "@/lib/session";

/**
 * 사진풍 일러스트 생성 도구가 없어 코드로 직접 그린 벡터 캐릭터.
 * SajuDial과 같은 방식(순수 SVG, 외부 리소스 없음)이라 비용이 전혀 들지 않는다.
 */
export default function ToneMascot({ style, className }: { style: ToneStyleId; className?: string }) {
  if (style === "mz") return <MzMascot className={className} />;
  if (style === "joseon") return <JoseonMascot className={className} />;
  return <StandardMascot className={className} />;
}

function StandardMascot({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="mz-bg-standard" cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#3a2f63" />
          <stop offset="100%" stopColor="#181229" />
        </radialGradient>
        <radialGradient id="mz-orb" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#fff6df" />
          <stop offset="60%" stopColor="#e8cd94" />
          <stop offset="100%" stopColor="#c9a35c" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="60" r="58" fill="url(#mz-bg-standard)" />
      <circle cx="26" cy="24" r="1.6" fill="#e8cd94" opacity="0.8" />
      <circle cx="98" cy="30" r="1.2" fill="#e8cd94" opacity="0.6" />
      <circle cx="90" cy="90" r="1.4" fill="#e8cd94" opacity="0.7" />
      {/* 후드 */}
      <path d="M60 22c-20 0-33 16-33 36 0 14 6 24 12 30h42c6-6 12-16 12-30 0-20-13-36-33-36Z" fill="#241a3d" stroke="#c9a35c" strokeOpacity="0.5" strokeWidth="1.5" />
      <path d="M60 30c-15 0-25 12-25 27 0 3 .3 6 .8 9h48.4c.5-3 .8-6 .8-9 0-15-10-27-25-27Z" fill="#100b1c" />
      {/* 얼굴 안쪽 */}
      <ellipse cx="60" cy="66" rx="17" ry="14" fill="#2c2148" />
      <path d="M51 65c1.5-2 3.5-2 5 0M64 65c1.5-2 3.5-2 5 0" stroke="#e8cd94" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M56 74c2 1.5 6 1.5 8 0" stroke="#e8cd94" strokeOpacity="0.6" strokeWidth="1.3" strokeLinecap="round" />
      {/* 손 위 구슬 */}
      <circle cx="60" cy="96" r="9" fill="url(#mz-orb)" />
      <path d="M46 100c3-6 8-9 14-9s11 3 14 9" fill="none" stroke="#c9a35c" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function MzMascot({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="mz-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ff6fb1" />
          <stop offset="100%" stopColor="#5ec9ff" />
        </linearGradient>
        <linearGradient id="mz-lens" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffe66d" />
          <stop offset="100%" stopColor="#ff6fb1" />
        </linearGradient>
      </defs>
      <circle cx="60" cy="60" r="58" fill="url(#mz-bg)" />
      {/* 스파클 */}
      <path d="M22 26l2.4 5.4L30 34l-5.6 2.6L22 42l-2.4-5.4L14 34l5.6-2.6L22 26Z" fill="#fff" opacity="0.9" />
      <path d="M96 78l1.8 4 4 1.8-4 1.8-1.8 4-1.8-4-4-1.8 4-1.8 1.8-4Z" fill="#fff" opacity="0.85" />
      {/* 캡 모자 */}
      <path d="M32 52c0-16 12.5-28 28-28s28 12 28 28v4H32v-4Z" fill="#1c1f2b" />
      <ellipse cx="60" cy="56" rx="34" ry="7" fill="#12141c" />
      <rect x="60" y="46" width="14" height="6" rx="3" fill="#ff6fb1" />
      {/* 얼굴 */}
      <ellipse cx="60" cy="76" rx="26" ry="24" fill="#ffd9b3" />
      {/* 선글라스 */}
      <rect x="35" y="72" width="20" height="14" rx="7" fill="#14151d" />
      <rect x="65" y="72" width="20" height="14" rx="7" fill="#14151d" />
      <rect x="35" y="72" width="20" height="14" rx="7" fill="url(#mz-lens)" opacity="0.35" />
      <rect x="65" y="72" width="20" height="14" rx="7" fill="url(#mz-lens)" opacity="0.35" />
      <path d="M55 78h10" stroke="#14151d" strokeWidth="3" />
      {/* 입 */}
      <path d="M52 94q8 7 16 0" stroke="#7a4a2b" strokeWidth="2.4" strokeLinecap="round" fill="none" />
      {/* 볼터치 */}
      <circle cx="40" cy="90" r="4" fill="#ff9bb8" opacity="0.6" />
      <circle cx="80" cy="90" r="4" fill="#ff9bb8" opacity="0.6" />
    </svg>
  );
}

function JoseonMascot({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="mz-bg-joseon" cx="35%" cy="25%" r="85%">
          <stop offset="0%" stopColor="#5c2020" />
          <stop offset="100%" stopColor="#241010" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="60" r="58" fill="url(#mz-bg-joseon)" />
      {/* 갓(전통 모자) */}
      <ellipse cx="60" cy="46" rx="30" ry="5.5" fill="#161616" />
      <path d="M46 46c0-10 6-17 14-17s14 7 14 17" fill="none" stroke="#161616" strokeWidth="10" strokeLinecap="round" />
      <ellipse cx="60" cy="30" rx="5.5" ry="4" fill="#161616" />
      {/* 얼굴 */}
      <ellipse cx="60" cy="72" rx="22" ry="21" fill="#ffe3c2" />
      <path d="M50 71c1.5-1.8 3.5-1.8 5 0M65 71c1.5-1.8 3.5-1.8 5 0" stroke="#3a2416" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M56 82q4 3 8 0" stroke="#7a4a2b" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <circle cx="46" cy="80" r="3.4" fill="#f2a3a3" opacity="0.6" />
      <circle cx="74" cy="80" r="3.4" fill="#f2a3a3" opacity="0.6" />
      {/* 옷깃(한복) */}
      <path d="M34 108c2-14 12-22 26-22s24 8 26 22Z" fill="#7a1f1f" />
      <path d="M60 86v22" stroke="#e8cd94" strokeWidth="2" />
      <path d="M48 90l12-4 12 4-6 8h-12l-6-8Z" fill="#f3ecdd" />
      {/* 부채 */}
      <path d="M92 98c-8-2-14-8-16-16 8 0 15 4 19 11 1.2 2 .5 5.6-3 5Z" fill="#e8cd94" stroke="#c9a35c" strokeWidth="1" />
    </svg>
  );
}
