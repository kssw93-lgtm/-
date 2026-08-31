"use client";

import { Input } from "./Input";
import { formatNumberWithComma, parseCurrencyInput } from "@/lib/utils/currency";

interface CurrencyInputProps {
  id: string;
  name: string;
  value: number | undefined;
  onValueChange: (value: number) => void;
  onBlur?: () => void;
  invalid?: boolean;
  placeholder?: string;
  ariaDescribedBy?: string;
}

export function CurrencyInput({
  id,
  name,
  value,
  onValueChange,
  onBlur,
  invalid,
  placeholder,
  ariaDescribedBy,
}: CurrencyInputProps) {
  const text =
    value !== undefined && Number.isFinite(value)
      ? formatNumberWithComma(value)
      : "";

  return (
    <div className="relative">
      <Input
        id={id}
        name={name}
        inputMode="numeric"
        invalid={invalid}
        placeholder={placeholder}
        value={text}
        aria-describedby={ariaDescribedBy}
        className="pr-9"
        onChange={(event) => {
          const raw = event.target.value;
          const digitsOnly = raw.replace(/[^0-9]/g, "");
          if (digitsOnly === "") {
            onValueChange(NaN);
            return;
          }
          onValueChange(parseCurrencyInput(digitsOnly));
        }}
        onBlur={onBlur}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-ink-muted"
      >
        원
      </span>
    </div>
  );
}
