import type { ReactNode } from "react";
import { SectionHeading } from "./SectionHeading";

type SectionProps = {
  id: string;
  index: string;
  title: string;
  children: ReactNode;
};

export function Section({ id, index, title, children }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="mx-auto max-w-4xl scroll-mt-16 px-4 py-12 sm:px-6 sm:py-16"
    >
      <SectionHeading id={`${id}-heading`} index={index} title={title} />
      {children}
    </section>
  );
}
