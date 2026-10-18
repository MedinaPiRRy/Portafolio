import { projects } from "@/content/projects";
import { ProjectCard } from "./ProjectCard";
import { SectionHeading } from "./SectionHeading";

export function Projects() {
  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="mx-auto max-w-4xl scroll-mt-16 px-4 py-12 sm:px-6 sm:py-16"
    >
      <SectionHeading id="projects-heading" index="01" title="Featured projects" />
      <div className="flex flex-col gap-6">
        {projects.map((project, i) => (
          <ProjectCard key={project.slug} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}
