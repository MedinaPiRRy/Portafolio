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

Before deploying, drop a resume PDF at `public/resume.pdf`. Until that file exists, the "Download resume" button is hidden and the build logs a warning.

## Metadata

- Open Graph image: `src/app/opengraph-image.tsx` (generated at build, JetBrains Mono from `assets/fonts`)
- Icons: `src/app/icon.svg`, `favicon.ico`, `apple-icon.png`
- `sitemap.xml` and `robots.txt`: `src/app/sitemap.ts`, `src/app/robots.ts`
- Person JSON-LD: `src/app/layout.tsx`

The canonical site URL comes from `NEXT_PUBLIC_SITE_URL` if set, otherwise Vercel's production URL, otherwise `http://localhost:3000` (see `src/content/site.ts`).

## Deployment

1. Push this repo to GitHub.
2. In Vercel, **Add New → Project**, import the repo. The Next.js preset needs no changes.
3. Deploy. Every push to `main` redeploys.
4. Custom domain: **Project → Settings → Domains → Add**, then add the DNS records Vercel shows.
5. After the domain is live, set `NEXT_PUBLIC_SITE_URL=https://your-domain` under **Settings → Environment Variables** and redeploy so the canonical URL, sitemap and OG tags use it.
