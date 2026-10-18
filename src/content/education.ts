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
      "Capstone: as one of two developers on a 5-person team, built the backend for a client's full-stack e-store (Angular, TypeScript, Node.js, Web API, SQL) with role-based access control, logging and deployment.",
      "Coursework (87% average): iOS (SwiftUI), OOP in Java, web programming, ASP.NET Core/C#, AWS, IT Process Management (ITIL v4), data structures in C, network security.",
    ],
  },
];

export const certifications: Certification[] = [
  {
    name: "Technical Support Fundamentals",
    issuer: "Google",
  },
  {
    name: "Foundations: Data, Data, Everywhere",
    issuer: "Google",
  },
];
