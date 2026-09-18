# Portfolio — Daniel Medina Lopez

Personal portfolio site. Next.js (App Router) + TypeScript + Tailwind CSS, deployed on Vercel.

## Stack

- Next.js (App Router), TypeScript
- Tailwind CSS v4
- No CMS, no database — content lives in typed files under [`src/content`](src/content)

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Editing content

All copy (projects, experience, skills, education, contact info) lives in `src/content/*.ts`. Edit those files — no component changes needed for text updates.

Before deploying, drop a resume PDF at `public/resume.pdf`.

## Deployment

Deployed to Vercel. Push to `main` to trigger a production deploy.
