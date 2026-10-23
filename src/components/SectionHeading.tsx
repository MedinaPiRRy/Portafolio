import type { CSSProperties } from "react";

type SectionHeadingProps = {
  id: string;
  index: string;
  title: string;
};

const step = (i: number, slide = false) =>
  ({
    "--i": i,
    ...(slide ? { "--rx": "calc(var(--dist-sm) * -1)" } : {}),
  }) as CSSProperties;

export function SectionHeading({ id, index, title }: SectionHeadingProps) {
  return (
    <div className="mb-8 flex items-center gap-4" data-reveal-group>
      <span
        className="font-mono text-sm text-accent"
        aria-hidden="true"
        data-reveal-child="left"
        style={step(0, true)}
      >
        {index}
      </span>
      <h2
        id={id}
        className="font-mono text-xl font-medium tracking-tight text-foreground sm:text-2xl"
        data-reveal-child="left"
        style={step(1, true)}
      >
        {title}
      </h2>
      <span
        className="h-px flex-1 bg-surface-border"
        aria-hidden="true"
        data-reveal-child="draw"
        style={step(2)}
      />
    </div>
  );
}
