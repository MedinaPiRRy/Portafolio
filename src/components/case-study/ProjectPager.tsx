import Link from "next/link";
import type { Project } from "@/content/types";

type ProjectPagerProps = {
  previous: Project;
  next: Project;
};

function PagerLink({
  project,
  direction,
}: {
  project: Project;
  direction: "previous" | "next";
}) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      prefetch={false}
      className={`lift flex min-h-6 flex-col gap-1 rounded-lg border border-surface-border bg-surface p-4 ${
        direction === "next" ? "sm:items-end sm:text-right" : ""
      }`}
      data-reveal={direction === "previous" ? "left" : "right"}
    >
      <span className="font-mono text-xs text-muted">
        {direction === "previous" ? (
          <>
            <span aria-hidden="true">←&nbsp;</span>Previous project
          </>
        ) : (
          <>
            Next project<span aria-hidden="true">&nbsp;→</span>
          </>
        )}
      </span>
      <span className="font-semibold tracking-tight text-foreground">
        {project.name}
      </span>
    </Link>
  );
}

export function ProjectPager({ previous, next }: ProjectPagerProps) {
  return (
    <nav
      aria-label="More projects"
      className="mx-auto grid max-w-4xl gap-4 overflow-x-clip px-4 pb-16 pt-8 sm:grid-cols-2 sm:px-6"
    >
      <PagerLink project={previous} direction="previous" />
      <PagerLink project={next} direction="next" />
    </nav>
  );
}
