"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/components/ui/cn";

interface ResultCopyButtonProps {
  getText: () => string;
  className?: string;
}

export function ResultCopyButton({ getText, className }: ResultCopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(getText());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        "inline-flex h-11 items-center justify-center gap-1.5 rounded-lg border border-hairline bg-white px-4 text-sm font-medium text-ink-soft",
        "hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
        className
      )}
      aria-label="계산 결과 복사하기"
    >
      {copied ? (
        <>
          <Check aria-hidden="true" className="h-4 w-4 text-positive" />
          복사됨
        </>
      ) : (
        <>
          <Copy aria-hidden="true" className="h-4 w-4" />
          결과 복사하기
        </>
      )}
    </button>
  );
}
