/**
 * 삼각함수 결과를 그대로 SVG 속성에 넣으면 서버(Node)와 클라이언트(브라우저) JS 엔진의
 * 부동소수점 문자열 직렬화 자릿수가 미세하게 달라져 하이드레이션 경고가 난다.
 * 고정 소수 둘째자리로 반올림해 서버/클라이언트 출력 문자열을 항상 동일하게 만든다.
 */
function round(n: number): number {
  return Math.round(n * 100) / 100;
}

/** 장식용 사주 원반 그래픽. 실제 일러스트 대신 코드로 그린 골드 라인아트 — 캐릭터 없이도 브랜드 분위기를 만든다. */
export default function SajuDial({ className }: { className?: string }) {
  const stems = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
  const branches = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

  return (
    <svg viewBox="0 0 400 400" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="200" cy="200" r="196" stroke="#c9a35c" strokeOpacity="0.35" strokeWidth="1" />
      <circle cx="200" cy="200" r="168" stroke="#c9a35c" strokeOpacity="0.5" strokeWidth="1" />
      <circle cx="200" cy="200" r="120" stroke="#c9a35c" strokeOpacity="0.7" strokeWidth="1" />
      <circle cx="200" cy="200" r="60" stroke="#e8cd94" strokeOpacity="0.8" strokeWidth="1.5" />

      {stems.map((s, i) => {
        const angle = (i / stems.length) * Math.PI * 2 - Math.PI / 2;
        const x = round(200 + Math.cos(angle) * 144);
        const y = round(200 + Math.sin(angle) * 144);
        return (
          <text
            key={s}
            x={x}
            y={y}
            fill="#e8cd94"
            fillOpacity="0.85"
            fontSize="15"
            textAnchor="middle"
            dominantBaseline="central"
          >
            {s}
          </text>
        );
      })}

      {branches.map((b, i) => {
        const angle = (i / branches.length) * Math.PI * 2 - Math.PI / 2;
        const x = round(200 + Math.cos(angle) * 182);
        const y = round(200 + Math.sin(angle) * 182);
        return (
          <text
            key={b}
            x={x}
            y={y}
            fill="#c9a35c"
            fillOpacity="0.6"
            fontSize="13"
            textAnchor="middle"
            dominantBaseline="central"
          >
            {b}
          </text>
        );
      })}

      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i / 24) * Math.PI * 2;
        const x1 = round(200 + Math.cos(angle) * 120);
        const y1 = round(200 + Math.sin(angle) * 120);
        const x2 = round(200 + Math.cos(angle) * 168);
        const y2 = round(200 + Math.sin(angle) * 168);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#c9a35c" strokeOpacity="0.25" strokeWidth="1" />;
      })}
    </svg>
  );
}
