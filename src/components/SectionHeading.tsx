type SectionHeadingProps = {
  index: string;
  title: string;
};

export function SectionHeading({ index, title }: SectionHeadingProps) {
  return (
    <div className="mb-8 flex items-center gap-4">
      <span className="font-mono text-sm text-accent" aria-hidden="true">
        {index}
      </span>
      <h2 className="font-mono text-xl font-medium tracking-tight text-foreground sm:text-2xl">
        {title}
      </h2>
      <span className="h-px flex-1 bg-surface-border" aria-hidden="true" />
    </div>
  );
}
