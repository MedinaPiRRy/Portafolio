import type { SkillGroup } from "./types";

export const skills: SkillGroup[] = [
  {
    label: "Languages",
    items: [
      "Java",
      "JavaScript",
      "TypeScript",
      "C",
      "C#",
      "HTML5",
      "CSS3",
      "Bash",
      "PHP",
    ],
  },
  {
    label: "Technologies",
    items: [
      "Node.js",
      "Next.js",
      "ASP.NET",
      "Angular",
      "React",
      "SQL",
      "Tailwind",
      "Bootstrap",
      "VBA",
    ],
  },
  {
    label: "Cloud",
    items: ["AWS", "Azure", "Docker"],
  },
  {
    label: "Practices",
    items: ["SDLC", "Agile", "Git/CI/CD", "Wireshark", "Postman", "JIRA"],
  },
  {
    label: "AI-Assisted Development",
    items: [
      "LLM-driven debugging and testing",
      "Custom GPTs",
      "Copilot / Codex",
      "AI agents for dev workflows",
    ],
  },
];
