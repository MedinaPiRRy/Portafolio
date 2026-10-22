import type { CaseStudy } from "../types";
import { adminDashboard } from "./admin-dashboard";
import { goateez } from "./goateez";

const caseStudies: Record<string, CaseStudy> = {
  goateez,
  "admin-dashboard": adminDashboard,
};

export const caseStudySlugs = Object.keys(caseStudies);

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies[slug];
}

export function hasCaseStudy(slug: string): boolean {
  return slug in caseStudies;
}
