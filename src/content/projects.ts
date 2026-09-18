import type { Project } from "./types";

export const projects: Project[] = [
  {
    slug: "erms",
    name: "ERMS — Enterprise Resource Management System",
    problem:
      "A capstone team (3 students) needed a role-based internal tool for managing employees, projects, and task assignments with proper access control and auditability.",
    build:
      "Built the MVC front end and a decoupled Web API on ASP.NET Core, with EF Core against SQL Server. Implemented Admin/Manager/Employee role-based access enforced at the controller level, CRUD across Employees/Projects/TaskItems with relational integrity, NLog logging across major actions, and 59 xUnit/Moq tests. Migrated the database to Azure SQL and deployed the app to Azure App Service.",
    stack: [
      "ASP.NET Core MVC",
      "ASP.NET Core Web API",
      "Entity Framework Core",
      "SQL Server",
      "Azure",
      "xUnit",
      "Moq",
      "NLog",
    ],
    repoUrl: "https://github.com/MedinaPiRRy/ERMS-ASP.NET",
    liveUrl: "https://ermsappcapstone.azurewebsites.net/",
    featured: true,
  },
  {
    slug: "price-calculator",
    name: "Pricing Calculator & Distance API",
    problem:
      "AMJ Campbell needed to standardize how internal teams calculated shipment pricing based on drivable distance to the nearest facility, replacing an inconsistent manual process.",
    build:
      "Built a Next.js app backed by a MariaDB database and an Express/Node.js API. Orders are geocoded and matched to the closest facility, then priced using drivable distance from the Google Maps Distance Matrix API. Added session-token authentication with expiring sessions, a unique-link sign-up flow, and a token-based forgot-password flow with hashed credentials.",
    stack: [
      "Next.js",
      "Node.js",
      "Express.js",
      "MariaDB",
      "Google Maps API",
    ],
    repoUrl: "https://github.com/MedinaPiRRy/PriceCalculatorNextJS",
    featured: true,
  },
  {
    slug: "vertice-home-inspections",
    name: "Vertice Home Inspections",
    problem:
      "A home inspection contractor needed a professional web presence to promote his services to clients.",
    build:
      "Designed and built a marketing site end-to-end and deployed it to production for a real client.",
    stack: ["Next.js", "TypeScript"],
    repoUrl: "https://github.com/MedinaPiRRy/VerticeHomeInspections",
    liveUrl: "https://vertice-home-inspections.vercel.app",
    featured: true,
  },
  {
    slug: "gym-buddy-tracker",
    name: "GymBuddy Tracker",
    problem:
      "Term project for a Hybrid Mobile Applications course: build a cross-platform app to help users track workout progress over time.",
    build:
      "Built a hybrid mobile app for logging and tracking gym progress, covering navigation, state, and UI for a mobile form factor.",
    stack: ["TypeScript", "HTML", "SCSS"],
    repoUrl: "https://github.com/MedinaPiRRy/GymBuddyTracker",
    featured: true,
  },
];
