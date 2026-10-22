import { site } from "@/content/site";
import { hasResume } from "@/lib/resume";

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

      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          {site.name}
        </h1>
        <p className="flex flex-wrap items-center gap-x-4 font-mono text-xs text-muted sm:text-sm">
          <a
            href={`mailto:${site.email}`}
            className="inline-flex min-h-6 items-center transition-colors hover:text-accent"
          >
            {site.email}
          </a>
          <a
            href={site.phoneHref}
            className="inline-flex min-h-6 items-center transition-colors hover:text-accent"
          >
            {site.phone}
          </a>
        </p>
      </div>

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
        {hasResume && (
          <a
            href={site.resumeUrl}
            download
            className="rounded-md border border-surface-border px-5 py-2.5 font-mono text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
          >
            Download resume
          </a>
        )}
      </div>
    </section>
  );
}
