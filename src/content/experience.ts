import type { ExperienceEntry } from "./types";

export const experience: ExperienceEntry[] = [
  {
    role: "Data Analyst",
    org: "AMJ Campbell",
    location: "Mississauga, ON",
    start: "Nov 2022",
    end: "Dec 2023",
    bullets: [
      "Led development of a pricing calculator web app and location-based backend API used by internal teams to standardize pricing.",
      "Automated data workflows with SQL, Excel, Power BI, and VBA.",
      "Authored operational documentation for internal workflows and onboarding.",
    ],
    stack: ["Express.js", "Node.js", "React", "MariaDB", "Postman"],
  },
  {
    role: "Service Desk & Hardware Repair (Co-op)",
    org: "City of Mississauga",
    location: "Mississauga, ON",
    start: "Jan 2024",
    end: "Aug 2025",
    bullets: [
      "Logged and triaged enterprise incident tickets.",
      "Supported users across software, hardware, and connectivity issues.",
      "Escalated tickets across 50+ specialized teams.",
    ],
    stack: [],
  },
];
