/** 실제 광고 계정 연동 전 자리표시자. AdSense 승인 후 이 위치에 실제 광고 단위 코드로 교체한다. */
export default function AdSlot({ label = "광고" }: { label?: string }) {
  return (
    <div className="no-print flex h-16 items-center justify-center rounded-xl border border-dashed border-white/15 bg-white/[0.03] text-[11px] text-white/30">
      {label} 영역 (AdSense)
    </div>
  );
}
