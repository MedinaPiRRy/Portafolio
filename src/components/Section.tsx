import type { ReactNode } from "react";
import { SectionHeading } from "./SectionHeading";

type SectionProps = {
  id: string;
  index: string;
  title: string;
  compact?: boolean;
  children: ReactNode;
};

export function Section({
  id,
  index,
  title,
  compact = false,
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={`mx-auto max-w-4xl px-4 sm:px-6 ${
        compact ? "py-8 sm:py-10" : "py-12 sm:py-16"
      }`}
    >
      <SectionHeading id={`${id}-heading`} index={index} title={title} />
      {children}
    </section>
  );
}
