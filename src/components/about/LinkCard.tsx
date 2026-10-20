type LinkCardProps = {
  href: string;
  title: string;
  description: string;
};

export function LinkCard({ href, title, description }: LinkCardProps) {
  const host = new URL(href).hostname.replace(/^www\./, "");

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex flex-col gap-2 rounded-lg border border-surface-border bg-surface p-4 transition-colors hover:border-accent-dim sm:p-5"
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
