import type { Project } from "./types";

export const projects: Project[] = [
  {
    slug: "goateez",
    name: "GOAT’eez",
    kind: "E-commerce · team project",
    year: "2026",
    problem: "A team-built online store for custom shirts, live at goateez.ca.",
    built: [
      "Angular migration, backend, database schema, APIs and a multi-zone Fabric.js shirt designer.",
      "Cookie-based auth with refresh tokens, email verification, password reset, and role-based admin dashboards with activity logs.",
      "Stripe checkout and webhooks, guest-to-account cart merging, and shareable saved designs.",
      "Found and fixed Supabase row-level security (RLS) vulnerabilities.",
    ],
    stack: [
      "Angular (SSR)",
      "TypeScript",
      "Express",
      "Supabase (PostgreSQL)",
      "Stripe",
      "Fabric.js",
      "Vitest",
    ],
    links: [{ label: "Live site", href: "https://goateez.ca/" }],
    image: {
      src: "/projects/goateez.png",
      alt: "The GOAT’eez homepage: a “Wear Your G.O.A.T.” headline beside an illustrated goat in a baseball jersey, with Create Design and View the Gallery buttons.",
      width: 1440,
      height: 900,
    },
    note: "Team project: teammates built the visual front-end and I built everything else listed above. The code lives in a teammate’s private repository, so there is no repo link. Happy to walk through it in an interview.",
  },
  {
    slug: "finance-tracker",
    name: "FinanceTrackerApp",
    kind: "Desktop app",
    year: "2026",
    problem:
      "A private personal and household finance tracker that runs entirely on your computer: no account, no cloud, no bank login.",
    built: [
      "Imports CSV/Excel bank statements with a row-by-row preview, and never records a transaction twice, even from overlapping or renamed files.",
      "Budgets, goals, a debt payoff planner, a forecast with what-if scenarios, and recurring-charge detection.",
      "Shipped 4 releases with Windows and macOS installers built by GitHub Actions.",
      "635 tests in 43 files, including colour-contrast checks for every app theme.",
    ],
    stack: [
      "Electron",
      "React",
      "TypeScript",
      "SQLite",
      "ECharts",
      "Vitest",
      "GitHub Actions",
    ],
    links: [
      {
        label: "Repo",
        href: "https://github.com/MedinaPiRRy/FinanceTrackerApp",
      },
      {
        label: "Download",
        href: "https://github.com/MedinaPiRRy/FinanceTrackerApp/releases",
      },
    ],
    image: {
      src: "/projects/finance-tracker.png",
      alt: "FinanceTracker household overview with sample data: combined income, spending, net and money in accounts, and a table splitting each category by person.",
      width: 1344,
      height: 841,
    },
  },
  {
    slug: "scent-wardrobe",
    name: "ScentWardrobe",
    kind: "Desktop app",
    year: "2026",
    problem:
      "Keeps track of the fragrances you have, want, wish to try or dislike, logs what you wear, and helps you discover layering combinations.",
    built: [
      "A layering engine that scores pairings 0–100 and adjusts to your ratings, plus recommendations from weather and activity.",
      "Typed IPC contract between the renderer and main process, enforced at compile time.",
      "SQLite with 8 versioned migrations; a test upgrades a library from every schema version without losing a row.",
      "344 automated tests, including importers fed hostile input.",
    ],
    stack: [
      "Electron",
      "React",
      "TypeScript",
      "SQLite",
      "Tailwind CSS",
      "Vitest",
    ],
    links: [
      {
        label: "Repo",
        href: "https://github.com/MedinaPiRRy/ScentWardrobe",
      },
      {
        label: "Download",
        href: "https://github.com/MedinaPiRRy/ScentWardrobe/releases",
      },
    ],
    image: {
      src: "/projects/scent-wardrobe.png",
      alt: "ScentWardrobe collection shelf in the dark theme: five fragrance bottles drawn to scale on a wooden shelf, with a drawer for decants and samples below.",
      width: 1280,
      height: 720,
    },
  },
  {
    slug: "admin-dashboard",
    name: "Admin-Dashboard",
    kind: "Web app",
    year: "2024–2026",
    problem:
      "A SaaS-style admin dashboard: sign in to see live business metrics and manage users, products and orders.",
    built: [
      "Credentials auth with NextAuth v5 (bcrypt, JWT sessions); every dashboard route is protected by middleware.",
      "Server Actions for all create/update/delete, re-checking the session and validating input on the server.",
      "Metrics computed from MongoDB aggregations: week-over-week change, a 7-day chart, monthly revenue and inventory reports. Nothing is hard-coded.",
    ],
    stack: [
      "Next.js",
      "React",
      "MongoDB",
      "Mongoose",
      "NextAuth",
      "Recharts",
      "Tailwind CSS",
    ],
    links: [
      {
        label: "Repo",
        href: "https://github.com/MedinaPiRRy/Admin-Dashboard",
      },
    ],
  },
];
