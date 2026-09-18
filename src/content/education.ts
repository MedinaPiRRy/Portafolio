import type { EducationEntry, Certification } from "./types";

export const education: EducationEntry[] = [
  {
    credential: "Advanced Diploma",
    field: "Information Systems Engineering (Co-op)",
    org: "Sheridan College",
    location: "Oakville, ON",
    start: "2022",
    end: "2025",
    details: [
      "3.3 GPA — 87% average in major coursework",
      "Capstone: full-stack enterprise web app (Angular, TypeScript, Node.js, Web API, SQL, role-based access control, logging, deployment)",
    ],
  },
];

export const certifications: Certification[] = [
  {
    name: "Technical Support Fundamentals",
    issuer: "Google Career Certificates",
  },
  {
    name: "Foundations: Data, Data, Everywhere",
    issuer: "Google Career Certificates",
  },
];
