import type { ExperienceEntry } from "./types";

export const experience: ExperienceEntry[] = [
  {
    role: "Data Analyst",
    org: "AMJ Campbell",
    location: "Mississauga, ON",
    start: "Nov 2022",
    end: "Dec 2023",
    bullets: [
      "Designed and built, as sole developer, a pricing calculator and location-based API that standardized pricing across 50+ warehouses for 50+ teams.",
      "Automated data workflows with SQL, Excel, Power BI and VBA, saving an estimated 1+ hour per person per day across 50+ teams.",
      "Wrote 20+ guides for RAMP inventory software, consolidated into a 120+ page master manual for training and onboarding.",
    ],
    stack: ["Next.js", "React", "MariaDB", "SQL", "Power BI", "VBA"],
  },
  {
    role: "Service Desk & Hardware Repair (Co-op)",
    org: "City of Mississauga",
    location: "Mississauga, ON",
    start: "Jan 2024",
    end: "Aug 2025",
    bullets: [
      "Handled about 500 incident tickets per 4-month term in ServiceNow, documenting symptoms and steps tried for clean handoffs.",
      "Triaged and escalated issues to the correct group among 50+ specialized support teams.",
      "Resolved first-level software, hardware and connectivity issues for city staff, and repaired and deployed hardware from faulty peripherals to new servers for a city location.",
    ],
    stack: ["ServiceNow"],
  },
];
