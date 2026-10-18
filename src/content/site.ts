// Set NEXT_PUBLIC_SITE_URL once a custom domain exists; until then Vercel's production URL is used.
function resolveSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "http://localhost:3000";
}

export const site = {
  name: "Daniel Medina Lopez",
  role: "Computer Systems Engineer",
  tagline: "I build full-stack applications, APIs, and data-driven tools.",
  summary:
    "Sheridan College graduate (2025) who has shipped production tools and supported enterprise users. Built, as sole developer, a pricing app and API used by 50+ teams across 50+ warehouses, and handled ~500 ServiceNow tickets per term at the City of Mississauga. Works end to end in TypeScript, Angular, React/Next.js, Node.js and SQL.",
  location: "Oakville / Mississauga, ON",
  email: "medina.khe@gmail.com",
  phone: "(647) 410-6006",
  github: "https://github.com/MedinaPiRRy",
  linkedin: "https://linkedin.com/in/daniel-medina-lopez",
  resumeUrl: "/resume.pdf",
  url: resolveSiteUrl(),
  openTo:
    "Open to full-time full-stack / software developer roles in the GTA — hybrid or remote.",
};
