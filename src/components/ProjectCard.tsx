import Image from "next/image";
import type { Project } from "@/content/types";

type ProjectCardProps = {
  project: Project;
  index: number;
};

export function ProjectCard({ project, index }: ProjectCardProps) {
  const number = String(index + 1).padStart(2, "0");

  return (
    <article
      aria-labelledby={`project-${project.slug}`}
      className="group rounded-lg border border-surface-border bg-surface transition-colors hover:border-accent-dim"
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
        <Image
          src={project.image.src}
          alt={project.image.alt}
          width={project.image.width}
          height={project.image.height}
          sizes="(min-width: 896px) 896px, 100vw"
          className="aspect-[16/9] w-full border-b border-surface-border object-cover object-top"
        />
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

        <ul className="flex flex-col gap-2.5">
          {project.built.map((item) => (
            <li key={item} className="flex gap-3 text-sm leading-relaxed sm:text-base">
              <span
                className="select-none font-mono text-accent"
                aria-hidden="true"
              >
                ▸
              </span>
              <span className="text-foreground/90">{item}</span>
            </li>
          ))}
        </ul>

        <ul
          aria-label={`${project.name} tech stack`}
          className="flex flex-wrap gap-2"
        >
          {project.stack.map((tech) => (
            <li
              key={tech}
              className="rounded border border-surface-border px-2 py-1 font-mono text-xs text-muted"
            >
              {tech}
            </li>
          ))}
        </ul>

        {project.note && (
          <p className="border-l-2 border-accent-dim pl-3 text-sm leading-relaxed text-muted">
            {project.note}
          </p>
        )}

        <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-surface-border pt-4 font-mono text-sm">
          {project.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              aria-label={`${project.name}: ${link.label} (opens in a new tab)`}
              className="text-accent underline-offset-4 hover:underline"
            >
              {link.label} <span aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </div>
    </article>
  );
}
