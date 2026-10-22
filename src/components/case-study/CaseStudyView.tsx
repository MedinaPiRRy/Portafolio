import Link from "next/link";
import type { CaseStudy, Project } from "@/content/types";
import { ChipList } from "../ChipList";
import { Section } from "../Section";
import { CaseBlocks } from "./CaseBlocks";
import { renderInline } from "./inline";

type CaseStudyViewProps = {
  project: Project;
  study: CaseStudy;
};

const pad = (n: number) => String(n).padStart(2, "0");

export function CaseStudyView({ project, study }: CaseStudyViewProps) {
  const glance: [string, string][] = [
    ["What it is", study.summary.what],
    ["Why it exists", study.summary.why],
    ["My role", study.summary.role],
    ["Outcome", study.summary.outcome],
  ];

  return (
    <>
      <header className="mx-auto flex max-w-4xl flex-col gap-4 px-4 pb-2 pt-10 sm:px-6 sm:pt-14">
        <Link
          href="/#projects"
          prefetch={false}
          className="inline-flex min-h-6 items-center self-start font-mono text-sm text-muted transition-colors hover:text-accent"
        >
          <span aria-hidden="true">←&nbsp;</span>All projects
        </Link>
        <p className="font-mono text-sm text-muted">
          <span className="text-accent">daniel@gta</span>
          <span>:~$</span>
          <span className="ml-2 break-all text-foreground">
            cat projects/{project.slug}.md
          </span>
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          {project.name}
        </h1>
        <p className="font-mono text-base text-accent sm:text-lg">
          {project.kind}
          <span aria-hidden="true"> · </span>
          <span className="sr-only">, </span>
          {project.year}
        </p>
      </header>

      <Section id="at-a-glance" index="//" title="At a glance" compact>
        <div className="flex flex-col gap-6">
          <dl className="flex flex-col gap-px overflow-hidden rounded-lg border border-surface-border bg-surface-border">
            {glance.map(([label, text]) => (
              <div
                key={label}
                className="grid gap-1 bg-surface p-4 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-6 sm:p-5"
              >
                <dt className="font-mono text-xs text-accent">{label}</dt>
                <dd className="leading-relaxed text-foreground/90">
                  {renderInline(text)}
                </dd>
              </div>
            ))}
          </dl>

          <ChipList items={project.stack} label={`${project.name} tech stack`} />

          <div className="flex flex-wrap gap-x-5 gap-y-1 font-mono text-sm">
            {project.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`${project.name}: ${link.label} (opens in a new tab)`}
                className="inline-flex min-h-6 items-center text-accent underline-offset-4 hover:underline"
              >
                {link.label} <span aria-hidden="true">&nbsp;↗</span>
              </a>
            ))}
          </div>
        </div>
      </Section>

      <Section id="deep-dive" index="//" title="Deep dive" compact>
        <div className="flex flex-col gap-6">
          <p className="max-w-3xl leading-relaxed text-foreground/90">
            For engineers: how it is built, from architecture to code, with the
            decisions and trade-offs behind each part. {renderInline(study.sourceNote)}
          </p>
          <nav
            aria-label="Deep dive contents"
            className="rounded-lg border border-surface-border bg-surface p-4"
          >
            <ol className="grid gap-x-8 gap-y-0.5 sm:grid-cols-2">
              {study.sections.map((s, i) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="inline-flex min-h-6 items-center gap-2 font-mono text-sm text-muted transition-colors hover:text-accent"
                  >
                    <span className="text-accent" aria-hidden="true">
                      {pad(i + 1)}
                    </span>
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </Section>

      {study.sections.map((s, i) => (
        <Section key={s.id} id={s.id} index={pad(i + 1)} title={s.title} compact>
          <CaseBlocks blocks={s.blocks} />
        </Section>
      ))}
    </>
  );
}
