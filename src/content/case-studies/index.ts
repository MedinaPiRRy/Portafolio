import type { CaseStudy } from "../types";
import { adminDashboard } from "./admin-dashboard";
import { financeTracker } from "./finance-tracker";
import { goateez } from "./goateez";
import { scentWardrobe } from "./scent-wardrobe";

const caseStudies: Record<string, CaseStudy> = {
  goateez,
  "admin-dashboard": adminDashboard,
  "scent-wardrobe": scentWardrobe,
  "finance-tracker": financeTracker,
};

export const caseStudySlugs = Object.keys(caseStudies);

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies[slug];
}

export function hasCaseStudy(slug: string): boolean {
  return slug in caseStudies;
}
