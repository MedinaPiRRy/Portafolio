import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { CaseStudyView } from "@/components/case-study/CaseStudyView";
import { ProjectPager } from "@/components/case-study/ProjectPager";
import { caseStudySlugs, getCaseStudy, hasCaseStudy } from "@/content/case-studies";
import { projects } from "@/content/projects";
import { site } from "@/content/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudySlugs.map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: PageProps<"/projects/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const project = projects.find((p) => p.slug === slug);
  const study = getCaseStudy(slug);
  if (!project || !study) return {};

  const title = `${project.name}: case study`;
  const fullTitle = `${title} | ${site.name}`;
  const description = study.summary.what;

  return {
    title,
    description,
    alternates: { canonical: `/projects/${slug}` },
    openGraph: {
      type: "article",
      url: `${site.url}/projects/${slug}`,
      title: fullTitle,
      description,
      siteName: site.name,
    },
    twitter: { card: "summary_large_image", title: fullTitle, description },
  };
}

export default async function ProjectPage(props: PageProps<"/projects/[slug]">) {
  const { slug } = await props.params;
  const project = projects.find((p) => p.slug === slug);
  const study = getCaseStudy(slug);
  if (!project || !study) notFound();

  const withStudy = projects.filter((p) => hasCaseStudy(p.slug));
  const index = withStudy.findIndex((p) => p.slug === slug);
  const previous = withStudy[(index - 1 + withStudy.length) % withStudy.length];
  const next = withStudy[(index + 1) % withStudy.length];

  return (
    <>
      <Nav />
      <main className="flex-1">
        <CaseStudyView project={project} study={study} />
        {withStudy.length > 1 && <ProjectPager previous={previous} next={next} />}
      </main>
      <Footer />
    </>
  );
}
