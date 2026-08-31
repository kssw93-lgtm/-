import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "./cn";

export interface AccordionItemData {
  question: string;
  answer: ReactNode;
}

interface AccordionProps {
  items: AccordionItemData[];
}

export function Accordion({ items }: AccordionProps) {
  return (
    <div className="divide-y divide-hairline overflow-hidden rounded-card border border-hairline bg-white">
      {items.map((item) => (
        <details key={item.question} className="group p-5">
          <summary
            className={cn(
              "flex cursor-pointer list-none items-center justify-between gap-4",
              "text-[15px] font-medium text-ink marker:content-none",
              "rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            )}
          >
            <span>{item.question}</span>
            <ChevronDown
              aria-hidden="true"
              className="h-4 w-4 shrink-0 text-ink-muted transition-transform group-open:rotate-180"
            />
          </summary>
          <div className="pt-3 text-sm leading-relaxed text-ink-soft">
            {item.answer}
          </div>
        </details>
      ))}
    </div>
  );
}
