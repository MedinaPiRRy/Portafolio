# ~/daniel-medina-lopez

```text
daniel@gta:~$ whoami
Daniel Medina Lopez
Computer Systems Engineer
```

Hi, and welcome to the repo behind my portfolio. The site is styled like a terminal, so expect green text, monospace type and a blinking cursor.

I'm a Sheridan College grad (2025) who builds full-stack apps, APIs and data tools, and I'm looking for full-time full-stack or software developer roles in the GTA, hybrid or remote. This README is the guided tour: what's on the site, where to click, and how it's built.

## The tour

The site has two kinds of pages: the home page and the pages it links to.

### 1. Home (`/`)

One long scroll with five stops. The nav bar sticks to the top, and the link for the section you're in lights up as you scroll.

| Stop | What you'll find |
| --- | --- |
| `01 Featured projects` | Four cards: GOAT'eez, FinanceTrackerApp, ScentWardrobe and Admin-Dashboard. Each has a **Learn More** button that opens the full write-up. |
| `02 Experience` | Two jobs on a timeline: Data Analyst at AMJ Campbell and the Service Desk co-op at the City of Mississauga. The line draws itself as you scroll. |
| `03 Skills` | Languages, frameworks, databases, testing tools, IT support and the AI tools I work with. |
| `04 Education` | My advanced diploma at Sheridan, plus two Google certifications. |
| `05 Contact` | Email, phone, GitHub and LinkedIn. Everything is a real link. |

The hero up top also has a **Download resume** button.

### 2. Project case studies (`/projects/<name>`)

Each project card opens a page written for two kinds of reader:

- **Recruiters:** an "At a glance" box at the top (what it is, why it exists, my role, the outcome). That's the 30-second version.
- **Engineers:** a "Deep dive" below it, with a table of contents. It covers architecture diagrams, data models, security, testing, CI/CD, trade-offs and what I'd improve next, plus short code excerpts with file paths and line numbers.

There are four: [`goateez`](src/content/case-studies/goateez.ts), [`finance-tracker`](src/content/case-studies/finance-tracker.ts), [`scent-wardrobe`](src/content/case-studies/scent-wardrobe.ts) and [`admin-dashboard`](src/content/case-studies/admin-dashboard.ts). Previous and next links at the bottom let you hop between them.

### 3. About (`/about`)

The part of the portfolio that isn't code:

- Moving from Armenia, Quindío, Colombia to Canada at 16
- Working through college
- The animals (8 dogs and 5 cats so far, and yes, they run the house)
- Family
- **Powerlifting**, with a meet timeline, my numbers from the public OpenPowerlifting record (including the DQ at my first meet, on purpose), video recaps and links

## How to get around

- **Mouse:** click the nav links in the top bar. The thin green bar under it shows how far down the page you are.
- **Keyboard:** press `Tab` to move through everything. Focus rings are always visible, and links get the same hover effects when focused.
- **Phone:** it's responsive down to 375px wide. Hover effects switch to quick tap feedback.
- **Prefer less motion?** Turn on "reduce motion" in your OS. The site skips every animation and shows everything at once.

## Easter eggs (sort of)

- The `whoami` line in the hero types itself out.
- Hover anything: tech chips, cards, timeline entries and contact rows all react.
- The timeline dots pulse when you hover their entry.

## Under the hood

- **Next.js 16** (App Router), **TypeScript** and **Tailwind CSS v4**
- Statically generated and deployed on **Vercel**
- No CMS and no database: all the copy lives in typed files in [`src/content`](src/content)
- The only runtime dependencies are `next`, `react` and `react-dom`
- All the motion is plain CSS plus one small shared `IntersectionObserver` ([`MotionRoot`](src/components/motion/MotionRoot.tsx)). There's no animation library, content is visible without JavaScript, and it adds no layout shift
- Lighthouse on a production build: accessibility, best practices and SEO at 100, performance 95 or higher on mobile and 100 on desktop
- Real metadata: Open Graph images, sitemap, robots and JSON-LD

## Run it yourself

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000). For a production build:

```bash
npm run build
npm start
```

## Editing the content

Everything on the site comes from `src/content/*.ts`, so you can change text without touching a component:

| File | Controls |
| --- | --- |
| [`site.ts`](src/content/site.ts) | Name, tagline, summary, contact details |
| [`projects.ts`](src/content/projects.ts) | The project cards on the home page |
| [`case-studies/`](src/content/case-studies) | One file per project page |
| [`experience.ts`](src/content/experience.ts), [`education.ts`](src/content/education.ts), [`skills.ts`](src/content/skills.ts) | Those home page sections |
| [`about.ts`](src/content/about.ts) | The About page, meets and videos |

The resume button reads `public/resume.pdf`. If that file is missing, the button hides itself and the build logs a warning.

## Metadata

- Open Graph images are generated at build time: [`src/app/opengraph-image.tsx`](src/app/opengraph-image.tsx), plus one for About and one for each project
- `sitemap.xml` and `robots.txt`: [`src/app/sitemap.ts`](src/app/sitemap.ts) and [`src/app/robots.ts`](src/app/robots.ts)
- Person JSON-LD: [`src/app/layout.tsx`](src/app/layout.tsx)

The canonical site URL comes from `NEXT_PUBLIC_SITE_URL` if it's set, then Vercel's production URL, then `http://localhost:3000` (see [`src/content/site.ts`](src/content/site.ts)).

## Deploying

1. Push the repo to GitHub.
2. In Vercel, choose **Add New, then Project**, and import the repo. The Next.js preset needs no changes.
3. Deploy. Every push to `main` redeploys.
4. For a custom domain, go to **Project, Settings, Domains, Add** and add the DNS records Vercel shows.
5. Once the domain is live, set `NEXT_PUBLIC_SITE_URL=https://your-domain` under **Settings, Environment Variables** and redeploy, so the canonical URL, sitemap and OG tags use it.

## Say hi

`medina.khe@gmail.com` · [GitHub](https://github.com/MedinaPiRRy) · [LinkedIn](https://linkedin.com/in/daniel-medina-lopez)

If you made it this far, you read the README. That already puts you ahead of most people.
