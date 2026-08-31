import { adsEnabled } from "@/lib/constants/site";

interface AdSlotProps {
  id: string;
  label?: string;
}

/**
 * 향후 애드센스 연동을 대비한 자리 컴포넌트입니다.
 * NEXT_PUBLIC_ENABLE_ADS가 "true"가 아니면 아무 것도 렌더링하지 않습니다.
 * 현재 이 프로젝트는 어떤 광고 스크립트나 퍼블리셔 ID도 포함하지 않습니다.
 */
export function AdSlot({ id, label = "광고 영역" }: AdSlotProps) {
  if (!adsEnabled) return null;

  return (
    <div
      id={id}
      role="complementary"
      aria-label={label}
      className="flex min-h-[100px] items-center justify-center rounded-card border border-dashed border-hairline bg-surface-subtle text-xs text-ink-muted"
    >
      {label}
    </div>
  );
}
