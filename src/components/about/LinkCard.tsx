import type { CSSProperties } from "react";
type LinkCardProps = {
  href: string;
  title: string;
  description: string;
  index?: number;
};

export function LinkCard({
  href,
  title,
  description,
  index = 0,
}: LinkCardProps) {
  const host = new URL(href).hostname.replace(/^www\./, "");

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="lift flex flex-col gap-2 rounded-lg border border-surface-border bg-surface p-4 sm:p-5"
      data-reveal-child="up"
      style={{ "--i": index } as CSSProperties}
    >
      <span className="font-semibold tracking-tight text-foreground">
        {title}
        <span className="sr-only"> (opens in a new tab)</span>
      </span>
      <span className="text-sm leading-relaxed text-muted">{description}</span>
      <span className="font-mono text-xs text-accent">
        {host} <span aria-hidden="true">↗</span>
      </span>
    </a>
  );
}
