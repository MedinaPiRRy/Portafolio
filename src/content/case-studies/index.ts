import type { CaseStudy } from "../types";
import { goateez } from "./goateez";

const caseStudies: Record<string, CaseStudy> = {
  goateez,
};

export const caseStudySlugs = Object.keys(caseStudies);

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies[slug];
}

export function hasCaseStudy(slug: string): boolean {
  return slug in caseStudies;
}
