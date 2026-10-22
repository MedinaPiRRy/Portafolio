import { notFound } from "next/navigation";
import { caseStudySlugs, getCaseStudy } from "@/content/case-studies";
import { projects } from "@/content/projects";
import { ogContentType, ogSize, renderOgCard } from "@/lib/og-card";

export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return caseStudySlugs.map((slug) => ({ slug }));
}

function clip(text: string, max: number) {
  if (text.length <= max) return text;
  return `${text.slice(0, max).replace(/\s+\S*$/, "")}…`;
}

export default async function ProjectOpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  const study = getCaseStudy(slug);
  if (!project || !study) notFound();

  return renderOgCard({
    command: `cat projects/${slug}.md`,
    title: project.name,
    subtitle: `${project.kind} · ${project.year}`,
    body: clip(study.summary.what, 130),
    footer: "Case study · Daniel Medina Lopez",
  });
}
