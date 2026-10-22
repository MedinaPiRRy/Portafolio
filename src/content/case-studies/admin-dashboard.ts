import type { CaseStudy } from "../types";
import { adminDashboardCommit, adminDashboardExcerpts as x } from "./admin-dashboard-excerpts";

export const adminDashboard: CaseStudy = {
  slug: "admin-dashboard",
  summary: {
    what: "A SaaS-style admin dashboard that shows live business metrics and manages users, products and orders.",
    why: "A portfolio project that covers a complete full-stack app end to end: authenticated access, create, read, update and delete, and metrics computed from a real database instead of hard-coded numbers.",
    role: "Personal project. I wrote the original 2024 app: the interface, the CSS, the login and route protection, and the first versions of the pages. In October 2026 I used Claude Code to audit and finish it, which produced most of the current data layer, validation and error handling, and the seed script. By git blame that pass accounts for about two-thirds of the current JavaScript.",
    outcome:
      "Runs against a seeded MongoDB dataset. Every figure on the dashboard is computed from aggregation queries, writes are validated on the server, and the demo account is protected from edits and deletion.",
  },
  sourceNote: `Excerpts are verbatim from the public repository at commit \`${adminDashboardCommit}\`, with file paths and line numbers.`,
  sections: [
    {
      id: "history",
      title: "How it was built",
      blocks: [
        {
          type: "p",
          text: "The repository starts in March 2024 as a Create Next App project. The 36 commits from 2024 are mine and cover the interface and early versions of the pages. In October 2026 the app was reworked in five commits made with Claude Code (the author is recorded as Claude, with a co-author trailer), merged through three pull requests: preparing the repo for portfolio use (seed data, an example environment file, docs, database connection fixes), an audit-and-finish pass, a dependency upgrade to resolve `npm audit` findings, a larger demo dataset with generated avatars and product images, and a switch from route-level loading files to in-page Suspense.",
        },
        {
          type: "table",
          caption: "Who wrote the current code (git blame, current lines)",
          headers: ["Area", "Mine", "Claude Code pass"],
          rows: [
            ["Data layer and Server Actions (`app/lib/*.js`)", "171", "493"],
            ["Seed and image scripts (`scripts`)", "0", "228"],
            ["Auth config and middleware (`authconfig.js`, `middleware.js`)", "28", "0"],
            ["Auth provider (`auth.js`)", "33", "24"],
            ["Dashboard pages (`app/dashboard`)", "248", "515"],
            ["UI components (`app/(ui)`, JSX)", "278", "238"],
            ["CSS", "1,595", "216"],
            ["All JavaScript (JS, JSX, MJS)", "844", "1,578"],
          ],
        },
      ],
    },
    {
      id: "architecture",
      title: "Architecture",
      blocks: [
        {
          type: "p",
          text: "A Next.js 15 App Router application on React 19. Pages are Server Components that call data functions directly, so there is no separate API layer. Changes are made with Server Actions. The few interactive pieces (such as the search box, pagination, the charts, the delete button and the form buttons) are small Client Components. Data lives in MongoDB through Mongoose, and sessions are JWTs from Auth.js (next-auth v5 beta).",
        },
        {
          type: "diagram",
          title: "Request flow",
          width: 420,
          height: 320,
          boxes: [
            { x: 20, y: 16, w: 380, h: 46, lines: ["Browser", "server-rendered pages + small client components"] },
            { x: 20, y: 100, w: 380, h: 40, lines: ["Middleware", "sends visitors without a session to /login"] },
            { x: 20, y: 176, w: 380, h: 50, lines: ["Server Components + Server Actions", "data.js for reads, actions.js for writes"] },
            { x: 20, y: 262, w: 380, h: 40, lines: ["MongoDB", "users · products · orders"] },
          ],
          arrows: [
            { points: [[210, 62], [210, 100]], labels: [{ x: 222, y: 86, text: "request or form post" }] },
            { points: [[210, 140], [210, 176]], labels: [{ x: 222, y: 162, text: "signed in" }] },
            { points: [[210, 226], [210, 262]], labels: [{ x: 222, y: 248, text: "Mongoose" }] },
          ],
          description:
            "A request first passes through the Auth.js middleware, which redirects visitors who have no session. Signed-in requests reach Server Components, which read through `data.js`, and Server Actions, which write through `actions.js`. Both talk to MongoDB through Mongoose.",
        },
        { type: "h3", text: "Server Components read, Server Actions write" },
        {
          type: "p",
          text: "Each page awaits its data functions on the server and sends finished HTML. The list pages read `searchParams` (a Promise in Next 15) and put their table inside a `Suspense` boundary keyed by the search term and page, so the page shell renders immediately and only the table shows a loading state.",
        },
        { type: "code", excerpt: x.usersPage },
      ],
    },
    {
      id: "data-model",
      title: "Data model",
      blocks: [
        {
          type: "table",
          caption: "Three Mongoose models (`app/lib/models.js`)",
          headers: ["Collection", "Fields", "Rules"],
          rows: [
            [
              "Users",
              "`username`, `email`, `password` (bcrypt hash), `img`, `isAdmin`, `isActive`, `phone`, `address`",
              "Unique `username` (3 to 30 characters) and unique, lower-cased `email`. Timestamps on every document.",
            ],
            [
              "Products",
              "`title`, `desc`, `price`, `stock`, `category`, `img`, `color`, `size`",
              "Unique `title`; price and stock cannot be negative; category is required.",
            ],
            [
              "Orders",
              "`customer`, `product`, `quantity`, `amount`, `status`",
              "Status is one of `pending`, `done` or `cancelled`; quantity is at least 1; an index on `createdAt` (newest first).",
            ],
          ],
        },
        {
          type: "callout",
          label: "Orders are denormalised on purpose",
          text: "An order stores the customer’s name and the product’s title as plain text. The code comment gives the reason: the transactions pages stay simple and the history survives user and product deletes.",
        },
        {
          type: "p",
          text: "Models are registered with `mongoose.models.X || mongoose.model(...)`, which avoids re-registration errors when modules reload. The database connection is cached on `globalThis`, so hot reloads and serverless invocations reuse one connection, and a failed attempt clears the cached promise so the next request can retry.",
        },
        { type: "code", excerpt: x.connectCache },
      ],
    },
    {
      id: "auth",
      title: "Authentication and access",
      blocks: [
        {
          type: "p",
          text: "Auth.js is configured in two files. `authconfig.js` has no database or bcrypt imports and is the one the middleware uses, because middleware runs in the Edge runtime. `auth.js` extends it with the credentials provider, which does talk to the database.",
        },
        { type: "code", excerpt: x.authSplit },
        {
          type: "p",
          text: "For `/dashboard` and `/`, the `authorized` callback returns false without a session, which sends the visitor to `/login`. A signed-in user who visits any other page, such as `/login`, is redirected to `/dashboard`. The matcher skips `api`, `static`, `_next` and any path with a file extension.",
        },
        { type: "code", excerpt: x.authorize },
        {
          type: "p",
          text: "Both values must be non-empty strings before the database is touched. Inactive users cannot sign in. A wrong username or password returns `null`, while unexpected errors, such as an unreachable database, are thrown so the login form can show a generic message instead of claiming the password was wrong. The session is a JWT: one callback adds `username`, `img` and `isAdmin` to the token and another copies them onto the session object. The login action re-throws Next’s redirect error so a successful sign-in can complete.",
        },
        {
          type: "callout",
          label: "How access works",
          text: "Access is by session: any active account can sign in. `isAdmin` is data stored on the user and shown in the interface (the sidebar, settings, the users list and the Teams page).",
        },
      ],
    },
    {
      id: "metrics",
      title: "Dashboard metrics",
      blocks: [
        {
          type: "p",
          text: "Every number on the dashboard is computed from the database. The overview page runs its three data calls in parallel with `Promise.all`, and the revenue and inventory totals each come from one aggregation.",
        },
        {
          type: "code",
          excerpt: x.weeklyAggregate,
          note: "One pass over completed orders returns the all-time total, the order count, this week’s revenue and last week’s revenue, using `$cond` to split the periods. That single query feeds both the Revenue card and its week-over-week change.",
        },
        {
          type: "p",
          text: "`percentChange` returns `null` when there is no previous value to compare with, and the card then hides the badge instead of showing a misleading figure. Time-series queries fill in empty days and months with zeros so the charts have no gaps.",
        },
        { type: "code", excerpt: x.dailyOrders },
        {
          type: "list",
          items: [
            "**Overview:** total users (with active, inactive and new in the last 7 days), revenue from completed orders, products with units in stock, inventory value and a low-stock count (under 20 units), the latest orders, and a 7-day chart of orders and revenue. Hovering a card flips it to show more detail.",
            "**Revenue:** completed revenue per month for the last six months as a chart and table, plus average order value and pending revenue.",
            "**Reports:** inventory by category (products, units and value), the ten lowest-stock products, and user counts by role and status.",
            "**Teams:** the administrators and the number of client accounts.",
            "**Charts:** Recharts, as client components fed by data fetched on the server.",
          ],
        },
      ],
    },
    {
      id: "writes",
      title: "Writes and validation",
      blocks: [
        {
          type: "p",
          text: "All writes are Server Actions in `app/lib/actions.js`. Every mutation begins by requiring a session. Form values are read through a small helper that trims strings, and the rules are checked on the server: passwords must match and have at least 8 characters, hashed with bcrypt (cost 10), and a blank password on the edit form leaves the existing one unchanged. Products need a title, a category from a fixed list when created, a finite non-negative price and a non-negative whole-number stock.",
        },
        { type: "h3", text: "Errors become short codes" },
        {
          type: "p",
          text: "Database errors are mapped to a short code: a duplicate key (MongoDB error 11000) becomes a friendly duplicate message, a validation or cast error becomes “invalid”, and anything else is logged and reported as a generic failure. The action then redirects back to the form with `?error=<code>`.",
        },
        { type: "code", excerpt: x.errorCode },
        {
          type: "p",
          text: "The `Notice` component looks the code up in a fixed table, and an unknown error code falls back to the generic failure message, so nothing from the URL is ever printed on the page. Errors are announced with `role=\"alert\"` and success messages with `role=\"status\"`. Redirects are issued after the `try/catch`, because Next implements `redirect()` by throwing.",
        },
        { type: "code", excerpt: x.notice },
        { type: "h3", text: "Guards on destructive actions" },
        {
          type: "p",
          text: "Deleting a user checks that the record exists, that it is not the protected demo account, and that it is not the account currently signed in. Editing the protected account is blocked the same way. After a write, `revalidatePath` refreshes the affected lists, and the form buttons use `useFormStatus` to show a pending state and to ask for confirmation before a delete.",
        },
        { type: "code", excerpt: x.deleteGuards },
      ],
    },
    {
      id: "lists",
      title: "Lists, search and pagination",
      blocks: [
        {
          type: "p",
          text: "List state lives in the URL (`q`, `page` and, for orders, `status`), so a filtered view can be shared or bookmarked and the back button behaves. The status filter is a row of links, and the server accepts only values from the allowed list.",
        },
        {
          type: "code",
          excerpt: x.usersQuery,
          note: "Search text is escaped before it becomes a regular expression. Results are sorted by `createdAt` and then `_id`, so pages stay stable, and the count and the page of results are fetched together. Password hashes are excluded with the `-password` projection.",
        },
        {
          type: "p",
          text: "The search box debounces input for 300 ms, resets to page 1 and clears any message left from a previous action. Pagination shows five rows per page and clamps invalid page numbers.",
        },
        { type: "code", excerpt: x.search },
        {
          type: "p",
          text: "Detail pages validate the id with `mongoose.isValidObjectId` before querying and treat a bad or missing id as not found.",
        },
      ],
    },
    {
      id: "interface",
      title: "Interface details",
      blocks: [
        {
          type: "list",
          items: [
            "Loading states use `role=\"status\"`, and the avatars on list rows are decorative, with empty alt text.",
            "Role and form selects carry labels, and there are error boundaries for the app, the dashboard and not-found pages.",
            "Component styles are CSS Modules, with Tailwind CSS 4 loaded globally.",
            "The root path redirects to `/dashboard` with a temporary redirect.",
          ],
        },
      ],
    },
    {
      id: "demo-data",
      title: "Demo data and the seed script",
      blocks: [
        {
          type: "p",
          text: "`npm run seed` clears the users, products and orders collections and inserts a deterministic demo dataset: 32 users (7 administrators, 6 inactive), 37 products across 8 categories, and about 285 orders (mostly completed, some cancelled and pending). Orders are generated with a small linear-congruential random generator, so every run produces the same data, and with dates relative to the moment the script runs, so the “last 7 days” widgets have something to show.",
        },
        { type: "code", excerpt: x.seedRandom },
        {
          type: "p",
          text: "Avatars and product images are SVGs generated from the same sample data by `scripts/generate-images.mjs`, and the output is committed so nobody needs to run it. One seeded account is read-only so a public demo cannot be locked out.",
        },
      ],
    },
    {
      id: "security",
      title: "Security",
      blocks: [
        {
          type: "table",
          caption: "Controls and where they live",
          headers: ["Control", "How it works", "Where"],
          rows: [
            ["Route protection", "Middleware redirects visitors without a session away from `/dashboard` and `/`", "`authconfig.js`, `middleware.js`"],
            ["Mutations", "Every Server Action checks the session before doing anything", "`actions.js`"],
            ["Passwords", "bcrypt hashes; list and detail queries exclude the hash", "`actions.js`, `data.js`"],
            ["Input", "Strings trimmed and type-checked, numbers validated, Mongoose validators run on update", "`actions.js`, `models.js`"],
            ["Regex injection", "Search text is escaped before it becomes a `RegExp`", "`data.js`"],
            ["Text injection through the URL", "`?error=` is looked up in a fixed message table", "`notice.jsx`"],
            ["XSS", "React escapes output, and the app code uses no raw HTML injection", "whole app"],
            ["Secrets", "The database URL is read from the environment, and the app throws if it is missing; local env files are git-ignored", "`utils.js`, `.gitignore`"],
            ["Demo safety", "The demo account cannot be edited or deleted, and nobody can delete their own account", "`actions.js`, `constants.js`"],
            ["Dependencies", "Upgraded to resolve `npm audit` findings, with overrides pinning patched transitive packages", "`package.json`"],
          ],
        },
      ],
    },
    {
      id: "delivery",
      title: "Build and deployment",
      blocks: [
        {
          type: "p",
          text: "Scripts: `dev`, `build`, `start`, `lint` (ESLint with the Next.js core-web-vitals rules) and `seed`, which loads `.env.local` or `.env` when they exist. The README describes deploying to Vercel and documents the environment variables: the MongoDB connection string, the Auth.js secret, and an Auth.js URL used only for local development.",
        },
        {
          type: "list",
          items: [
            "Queries run in parallel and read lean documents, which are plain objects rather than full Mongoose documents.",
            "List pages stream their shell first and fill in the table behind `Suspense`.",
            "Avatars and product images are small static SVGs served through `next/image`.",
          ],
        },
      ],
    },
    {
      id: "stack",
      title: "Tech stack",
      blocks: [
        {
          type: "table",
          caption: "What each piece does and what it buys here",
          headers: ["Piece", "Used for", "What it buys here"],
          rows: [
            ["Next.js 15 (App Router)", "Routing, rendering, Server Actions, middleware", "Server-rendered pages that read data directly and forms that work without a separate API."],
            ["React 19", "Components, `useFormStatus`", "Pending states on forms and delete buttons."],
            ["MongoDB with Mongoose 8", "Persistence and aggregation", "Schemas with validators, and aggregation pipelines for the dashboard figures."],
            ["Auth.js (next-auth v5 beta)", "Credentials sign-in and JWT sessions", "Edge-safe middleware config separated from the Node-only provider."],
            ["bcrypt", "Password hashing", "Slow, salted hashes for stored passwords."],
            ["Recharts", "Charts", "Line and bar charts from plain data."],
            ["CSS Modules and Tailwind CSS 4", "Styling", "Scoped component styles."],
            ["use-debounce", "Search input", "Fewer requests while typing."],
          ],
        },
      ],
    },
    {
      id: "decisions",
      title: "Decisions and trade-offs",
      blocks: [
        {
          type: "table",
          caption: "Key decisions and what each one costs",
          headers: ["Decision", "Benefit", "Cost"],
          rows: [
            ["Server Components query the database directly", "Less code and no client-side fetching", "Pages are tied to the data layer"],
            ["Server Actions for writes", "Plain forms with validation on the server", "Feedback travels through redirects"],
            ["List state in the URL", "Shareable views and a working back button", "Each change is a navigation"],
            ["Denormalised orders", "Simple transaction pages that survive deletes", "Names can drift from the user or product record"],
            ["Auth config split in two files", "Middleware stays light", "Two files to keep in step"],
            ["Messages by code, not text", "Nothing from the URL reaches the page", "Each message needs an entry in the table"],
            ["Deterministic seed with relative dates", "The same demo every run", "Re-seed to keep the recent-days widgets fresh"],
          ],
        },
      ],
    },
    {
      id: "next",
      title: "What I’d improve next",
      blocks: [
        {
          type: "list",
          items: [
            "**Use roles for authorization.** `isAdmin` is stored and displayed today. Restricting user management and product changes to administrators would make it a real permission.",
            "**Add automated tests.** Vitest for the aggregation functions and the Server Actions, and Playwright for sign-in and the create, edit and delete flows.",
            "**Add CI** that runs lint, build and tests on every push.",
            "**Limit sign-in attempts** with a rate limiter.",
            "**Index the searched fields** or move to prefix search, since case-insensitive regular expressions cannot use a normal index as the data grows.",
          ],
        },
      ],
    },
  ],
};
