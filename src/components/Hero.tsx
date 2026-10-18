import { site } from "@/content/site";

export function Hero() {
  return (
    <section
      id="top"
      className="mx-auto flex max-w-4xl flex-col gap-6 px-4 pb-16 pt-14 sm:px-6 sm:pb-24 sm:pt-20"
    >
      <p className="flex items-center font-mono text-sm text-muted">
        <span className="text-accent">daniel@gta</span>
        <span className="text-muted">:~$</span>
        <span className="ml-2 text-foreground">whoami</span>
        <span
          className="animate-blink ml-1 inline-block h-4 w-2 translate-y-px bg-accent"
          aria-hidden="true"
        />
      </p>

      <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
        {site.name}
      </h1>

      <p className="font-mono text-base text-accent sm:text-lg">
        {site.role}
      </p>

      <p className="max-w-xl text-base leading-relaxed text-foreground sm:text-lg">
        {site.tagline}
      </p>

      <p className="max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
        {site.summary}
      </p>

      <div className="flex flex-wrap gap-3 pt-2">
        <a
          href="#projects"
          className="rounded-md border border-accent bg-accent px-5 py-2.5 font-mono text-sm font-medium text-background transition-colors hover:bg-accent-dim hover:border-accent-dim"
        >
          View projects
        </a>
        <a
          href={site.resumeUrl}
          download
          className="rounded-md border border-surface-border px-5 py-2.5 font-mono text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
        >
          Download resume
        </a>
      </div>
    </section>
  );
}
