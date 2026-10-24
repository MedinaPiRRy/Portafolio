import { site } from "@/content/site";
import { hasResume } from "@/lib/resume";

export function Hero() {
  return (
    <section
      id="top"
      className="mx-auto flex max-w-4xl flex-col gap-6 px-4 pb-16 pt-14 sm:px-6 sm:pb-24 sm:pt-20"
    >
      <p
        className="hero-rise flex items-center font-mono text-sm text-muted"
        style={{ "--i": 0 } as React.CSSProperties}
      >
        <span className="text-accent">daniel@gta</span>
        <span className="text-muted">:~$</span>
        <span className="ml-2 inline-flex items-center text-foreground">
          <span className="hero-typed">whoami</span>
          <span
            className="hero-cursor ml-1 inline-block h-4 w-2 translate-y-px bg-accent"
            aria-hidden="true"
          />
        </span>
      </p>

      <div
        className="hero-rise flex flex-col gap-1"
        style={{ "--i": 1 } as React.CSSProperties}
      >
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          {site.name}
        </h1>
        <p className="flex flex-wrap items-center gap-x-4 font-mono text-xs text-muted sm:text-sm">
          <a
            href={`mailto:${site.email}`}
            className="sweep inline-flex min-h-6 items-center transition-colors [--sweep-bottom:0.2rem] hover:text-accent"
          >
            {site.email}
          </a>
          <a
            href={site.phoneHref}
            className="sweep inline-flex min-h-6 items-center transition-colors [--sweep-bottom:0.2rem] hover:text-accent"
          >
            {site.phone}
          </a>
        </p>
      </div>

      <p
        className="hero-rise font-mono text-base text-accent sm:text-lg"
        style={{ "--i": 2 } as React.CSSProperties}
      >
        {site.role}
      </p>

      <p
        className="hero-rise max-w-xl text-base leading-relaxed text-foreground sm:text-lg"
        style={{ "--i": 3 } as React.CSSProperties}
      >
        {site.tagline}
      </p>

      <p
        className="hero-rise max-w-2xl text-sm leading-relaxed text-muted sm:text-base"
        style={{ "--i": 4 } as React.CSSProperties}
      >
        {site.summary}
      </p>

      <div
        className="hero-fade flex flex-wrap gap-3 pt-2"
        style={{ "--i": 5 } as React.CSSProperties}
      >
        <a
          href="#projects"
          className="btn-sweep rounded-md border border-accent bg-accent px-5 py-2.5 font-mono text-sm font-medium text-background"
        >
          View projects
        </a>
        {hasResume && (
          <a
            href={site.resumeUrl}
            download
            className="btn-sweep rounded-md border border-surface-border px-5 py-2.5 font-mono text-sm font-medium text-foreground [--fill:var(--accent)] hover:border-accent focus-visible:border-accent"
          >
            Download resume
          </a>
        )}
      </div>
    </section>
  );
}
