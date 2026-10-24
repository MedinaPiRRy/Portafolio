import Image from "next/image";
import Link from "next/link";
import { hasCaseStudy } from "@/content/case-studies";
import type { Project } from "@/content/types";
import { BulletList } from "./BulletList";
import { ChipList } from "./ChipList";

type ProjectCardProps = {
  project: Project;
  index: number;
};

export function ProjectCard({ project, index }: ProjectCardProps) {
  const number = String(index + 1).padStart(2, "0");

  return (
    <article
      aria-labelledby={`project-${project.slug}`}
      className="lift rounded-lg border border-surface-border bg-surface"
      data-reveal={index % 2 === 0 ? "left" : "right"}
    >
      <div className="flex items-center justify-between gap-4 border-b border-surface-border px-4 py-2.5 font-mono text-xs text-muted sm:px-5">
        <span className="whitespace-nowrap">
          <span className="text-accent">{number}</span>
          <span aria-hidden="true"> ─ </span>
          {project.slug}
        </span>
        <span className="text-right">
          {project.kind}{" "}
          <span className="whitespace-nowrap">
            <span aria-hidden="true">· </span>
            {project.year}
          </span>
        </span>
      </div>

      {project.image && (
        <div
          className="zoom-frame aspect-[16/9] w-full border-b border-surface-border"
          data-reveal-group
        >
          <div className="h-full w-full" data-reveal-child="clip">
            <Image
              src={project.image.src}
              alt={project.image.alt}
              width={project.image.width}
              height={project.image.height}
              sizes="(min-width: 896px) 896px, 100vw"
              className="zoom-img h-full w-full object-cover object-top"
            />
          </div>
        </div>
      )}

      <div className="flex flex-col gap-5 px-4 py-5 sm:px-6 sm:py-6">
        <div className="flex flex-col gap-2">
          <h3
            id={`project-${project.slug}`}
            className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
          >
            {project.name}
          </h3>
          <p className="leading-relaxed text-muted">{project.problem}</p>
        </div>

        <BulletList items={project.built} />

        <ChipList items={project.stack} label={`${project.name} tech stack`} />

        {project.note && (
          <p className="border-l-2 border-accent-dim pl-3 text-sm leading-relaxed text-muted">
            {project.note}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-surface-border pt-4 font-mono text-sm">
          {hasCaseStudy(project.slug) && (
            <Link
              href={`/projects/${project.slug}`}
              prefetch={false}
              aria-label={`Learn More about ${project.name}`}
              className="btn-sweep inline-flex min-h-9 items-center gap-1 rounded-md border border-accent bg-accent px-4 font-medium text-background"
            >
              Learn More <span aria-hidden="true">→</span>
            </Link>
          )}
          {project.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              aria-label={`${project.name}: ${link.label} (opens in a new tab)`}
              className="btn-sweep -mx-2 inline-flex min-h-6 items-center gap-1.5 rounded px-2 text-accent [--fill-text:var(--accent)] [--fill:color-mix(in_srgb,var(--accent)_16%,transparent)]"
            >
              {link.label} <span aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </div>
    </article>
  );
}
