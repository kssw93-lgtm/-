import { Calculator } from "lucide-react";

interface EmptyResultStateProps {
  message?: string;
}

export function EmptyResultState({
  message = "아직 계산 결과가 없습니다. 입력값을 채우고 계산하기 버튼을 눌러주세요.",
}: EmptyResultStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-hairline py-12 text-center">
      <Calculator aria-hidden="true" className="h-8 w-8 text-ink-muted" />
      <p className="max-w-[240px] text-sm text-ink-muted">{message}</p>
    </div>
  );
}
