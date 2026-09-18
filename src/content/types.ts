export type Project = {
  slug: string;
  name: string;
  problem: string;
  build: string;
  stack: string[];
  repoUrl: string;
  liveUrl?: string;
  featured?: boolean;
};

export type ExperienceEntry = {
  role: string;
  org: string;
  location: string;
  start: string;
  end: string;
  bullets: string[];
  stack: string[];
};

export type SkillGroup = {
  label: string;
  items: string[];
};

export type EducationEntry = {
  credential: string;
  field: string;
  org: string;
  location: string;
  start: string;
  end: string;
  details: string[];
};

export type Certification = {
  name: string;
  issuer: string;
};
