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

export type PhotoAspect = "4/5" | "3/2" | "4/3" | "1/1";

export type AboutPhoto = {
  file: string;
  aspect: PhotoAspect;
  alt: string;
  caption?: string;
  ready?: boolean;
};

export type LiftResult = number | "none";

export type Meet = {
  slug: string;
  name: string;
  host: string;
  date: string;
  federation?: string;
  equipment?: string;
  division?: string;
  weightClassKg?: number;
  squat?: LiftResult;
  bench?: LiftResult;
  deadlift?: LiftResult;
  total?: LiftResult;
  dots?: number;
  placing?: string;
  story: string[];
  instagramUrl?: string;
  photo: AboutPhoto;
};

export type AboutVideo = {
  id: string;
  title: string;
};

export type AboutBlock = {
  paragraphs: string[];
  photos: AboutPhoto[];
  bullets?: string[];
  chips?: string[];
  chipsLabel?: string;
};
