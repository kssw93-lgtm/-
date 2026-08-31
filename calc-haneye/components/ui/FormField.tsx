import type { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}

export function FormField({
  label,
  htmlFor,
  error,
  hint,
  required,
  children,
}: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-ink">
        {label}
        {required && (
          <span className="ml-0.5 text-danger" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
      {hint && !error ? (
        <p className="text-xs text-ink-muted">{hint}</p>
      ) : null}
      {error ? (
        <p role="alert" className="text-xs text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
