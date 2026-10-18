export type ProjectLink = {
  label: string;
  href: string;
};

export type ProjectImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type Project = {
  slug: string;
  name: string;
  kind: string;
  year: string;
  problem: string;
  built: string[];
  stack: string[];
  links: ProjectLink[];
  image?: ProjectImage;
  note?: string;
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
