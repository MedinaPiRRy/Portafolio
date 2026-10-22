import type { CaseStudy } from "../types";
import { excerpts, goateezCommit } from "./goateez-excerpts";

export const goateez: CaseStudy = {
  slug: "goateez",
  summary: {
    what: "A print-on-demand store where customers design a custom shirt in the browser, review a proof, and pay through Stripe.",
    why: "The shop sells custom-printed shirts. The store lets customers design and preview a shirt themselves, with guest checkout or an account, and gives staff an admin console to track the resulting orders.",
    role: "Team project with one other developer. I built the Angular migration, the Express API, the database migrations, authentication, checkout and the Stripe webhook, the admin tools, saved designs and the security fixes below. I did not build the visual front-end: my teammate designed the look, layout and copy, and also built the designer’s upload and mobile handling and the contact form.",
    outcome:
      "Live at goateez.ca. Prices are computed on the server, orders are marked paid only by signed Stripe webhooks, sessions use rotating refresh tokens, and a Supabase row-level-security exposure was closed and is checked by a repeatable script.",
  },
  sourceNote: `The repository is private, so there is no repo link. Code excerpts are verbatim from commit \`${goateezCommit}\`, shown with file paths and line numbers.`,
  sections: [
    {
      id: "who-built-what",
      title: "Who built what",
      blocks: [
        {
          type: "p",
          text: "GOAT’eez has two developers. These counts come from `git blame` on the current code, so they show who wrote the lines that are live today, not who committed last.",
        },
        {
          type: "table",
          caption: "Authorship by area, from git blame on the current code",
          headers: ["Area", "Mostly", "Evidence"],
          rows: [
            [
              "Express API (`backend/src`)",
              "Me",
              "4,429 of 4,728 lines. Most of the rest is the contact form (228 lines).",
            ],
            [
              "Migrations and scripts (`backend/migrations`, `backend/scripts`)",
              "Me",
              "All 5 migrations and all 15 script files.",
            ],
            [
              "Angular services, guards, interceptor (`src/app/core`)",
              "Me",
              "All 1,100 current lines.",
            ],
            [
              "Cart, proof, purchase, account and admin pages",
              "Me",
              "Almost entirely mine in git blame. The My Designs page is shared.",
            ],
            [
              "Designer (`src/assets/js/designer.js`, 2,209 lines)",
              "Shared",
              "1,018 lines mine, 1,191 my teammate’s. Mine: the save, load and versioning layer, the zone model, the text and image tools, the size and quote flow, and the hand-off to the proof page. My teammate’s: the upload pipeline, mobile and touch handling, snap guides, the contrast warning and the colour tools.",
            ],
            [
              "Visual design: look, layout, copy",
              "My teammate",
              "The design came from my teammate. I ported it into Angular, which is why git blame credits me with much of the CSS and home template, and my teammate has kept refining it since (most home page and help page commits are theirs).",
            ],
            [
              "Contact form (`contact.controller.js`)",
              "My teammate",
              "228 lines.",
            ],
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
          text: "The browser runs an Angular 22 application that is server-rendered with `@angular/ssr` and talks to a separate Express 5 API. The API is the only component that touches the database or file storage: SQL goes through `postgres.js` and Supabase Storage is used through a service-role client, both from the server. Payments use redirect-based Stripe Checkout, so card details never pass through either application.",
        },
        {
          type: "diagram",
          title: "System overview",
          width: 420,
          height: 330,
          boxes: [
            { x: 20, y: 16, w: 380, h: 50, lines: ["Browser", "Angular 22 (SSR) + Fabric.js designer"] },
            { x: 20, y: 140, w: 170, h: 66, lines: ["Express 5 API", "the only data access"] },
            { x: 270, y: 140, w: 130, h: 66, lines: ["Stripe Checkout", "hosted payment"] },
            { x: 20, y: 262, w: 170, h: 52, lines: ["Postgres", "(Supabase)"] },
            { x: 220, y: 262, w: 180, h: 52, lines: ["Storage", "private bucket"] },
          ],
          arrows: [
            {
              points: [[105, 66], [105, 140]],
              labels: [
                { x: 115, y: 98, text: "httpOnly cookies" },
                { x: 115, y: 112, text: "+ CSRF header" },
              ],
            },
            {
              points: [[335, 66], [335, 140]],
              labels: [{ x: 345, y: 107, text: "redirect" }],
            },
            {
              points: [[270, 190], [190, 190]],
              labels: [
                { x: 230, y: 162, text: "signed", anchor: "middle" },
                { x: 230, y: 176, text: "webhook", anchor: "middle" },
              ],
            },
            {
              points: [[70, 206], [70, 262]],
              labels: [{ x: 80, y: 238, text: "SQL" }],
            },
            {
              points: [[150, 206], [150, 234], [310, 234], [310, 262]],
              labels: [{ x: 162, y: 228, text: "service-role client" }],
            },
          ],
          description:
            "The browser talks to the Express API using httpOnly cookies and a CSRF header, and is redirected to Stripe for payment. Stripe calls the API back with a signed webhook. The API alone reads and writes Postgres and the private storage bucket on Supabase. Transactional email goes out from the API over HTTPS to Resend (not drawn).",
        },
        {
          type: "p",
          text: "Rendering is chosen per route in `src/app/app.routes.server.ts`. Pages are prerendered by default. `blueprint/:token` is rendered on the server for each request because it depends on a shared design. `admin/orders/:id` is client-only because it is private, per-order data with nothing worth prerendering.",
        },
        { type: "h3", text: "Middleware order is deliberate" },
        {
          type: "p",
          text: "The API applies, in order: security headers, CORS locked to one origin, the Stripe webhook with a raw body, the JSON parser, the cookie parser, a rate limiter on `/api`, the routes, a 404 handler and a central error handler.",
        },
        {
          type: "code",
          excerpt: excerpts.webhookOrder,
          note: "Stripe signs the raw request bytes. If `express.json()` ran first, the body would already be parsed and every signature check would fail, so the webhook route sits above the JSON parser and uses `express.raw()`. The 25 MB JSON limit is left over from when designs travelled as base64.",
        },
        { type: "h3", text: "How the API is organized" },
        {
          type: "list",
          items: [
            "`modules/<feature>/` holds routes, controller, zod schemas and (where there is logic) a service. Services know nothing about `req` or `res`.",
            "`repositories/` is the only place that writes SQL.",
            "`services/` wraps outside systems: email through Resend and file storage through Supabase.",
            "`middleware/` holds the cross-cutting pieces: auth, CSRF, validation, rate limits, uploads and error handling.",
          ],
        },
        { type: "h3", text: "The designer is a separate script" },
        {
          type: "p",
          text: "The canvas editor is `assets/js/designer.js`, plain JavaScript on Fabric.js 5.3.1, loaded at runtime by the Angular `Designer` component. The two talk through a tiny `window.GOATEEZ_DESIGNER` API (`isDirty`, `stashForAccount`, `leaving`), which lets Angular warn before a visitor leaves with an unsaved design (`src/app/pages/designer/designer.ts`).",
        },
      ],
    },
    {
      id: "data-model",
      title: "Data model",
      blocks: [
        {
          type: "p",
          text: "PostgreSQL on Supabase. Queries are plain SQL written with `postgres.js` tagged templates, which turn every interpolated value into a bound parameter, so there is no string-built SQL and no ORM (`backend/src/config/db.js`).",
        },
        {
          type: "table",
          caption: "Main tables and the thinking behind them",
          headers: ["Table", "Holds", "Design note"],
          rows: [
            [
              "`users`",
              "Accounts, role (`customer`, `admin`, `superadmin`), password hash, `email_verified`",
              "Guest checkout creates a passwordless user keyed by email, so every order has an owner.",
            ],
            [
              "`refresh_tokens`",
              "One row per issued refresh token",
              "Stores only a SHA-256 hash. `family_id` groups the tokens from one login so a replay can revoke the whole family. A partial index covers live tokens (migration 001).",
            ],
            [
              "`user_tokens`",
              "Email-verification and password-reset tokens",
              "Hash only, with an expiry, single use (`used_at`) and a `CHECK` on the type (migration 005).",
            ],
            [
              "`products`",
              "One row per blank-tee colour and size",
              "Migration 002 seeds 5 colours × 7 sizes = 35 SKUs. The customer’s artwork lives on the order, not the product.",
            ],
            [
              "`carts`, `cart_items`",
              "One active cart per user",
              "Abandoned carts get a 30-day expiry. Replacing a cart is a transaction.",
            ],
            [
              "`orders`, `order_items`",
              "Order totals, status, shipping snapshot; items with a JSONB `product_snapshot`, `custom_image_key` and `design_id`",
              "Snapshots keep history correct if products or designs change later.",
            ],
            [
              "`order_status_history`",
              "Every status change",
              "Written by a database trigger, so the API never double-logs.",
            ],
            [
              "`payments`",
              "Stripe payments",
              "`gateway_txn_id` is unique, so a repeated webhook cannot create a second row.",
            ],
            [
              "`designs`",
              "Saved designs: `design_json`, `preview_key`, `version`, `parent_design_id`, `share_token`",
              "A new version is a new row pointing at its parent, so history is never overwritten (migrations 003 and 004).",
            ],
            [
              "`admin_activity_log`",
              "Audit trail",
              "Who did what to which entity, with details as JSON and the IP address.",
            ],
            [
              "`addresses`",
              "Saved shipping addresses",
              "Used to pre-fill checkout for signed-in customers.",
            ],
          ],
        },
        {
          type: "callout",
          label: "Where the schema lives",
          text: "The base schema (users, products, orders and so on) was created directly in Supabase and is not in the repository. Only the five numbered migrations are versioned, and they were run by hand in the Supabase SQL editor. The order-number and status-history triggers also live there. Versioning the whole schema is on the list under “What I’d improve next”.",
        },
      ],
    },
    {
      id: "auth",
      title: "Authentication and sessions",
      blocks: [
        {
          type: "table",
          caption: "The three session cookies (`backend/src/utils/cookies.js`)",
          headers: ["Cookie", "Holds", "Flags"],
          rows: [
            [
              "`gz_access`",
              "Short-lived JWT carrying the user id and role (15 minutes by default)",
              "httpOnly, SameSite=Strict, Secure in production",
            ],
            [
              "`gz_refresh`",
              "Opaque random refresh token (7 days by default)",
              "httpOnly, SameSite=Strict, Secure in production, scoped to `/api/auth` so it is not sent on every request",
            ],
            [
              "`gz_csrf`",
              "Random CSRF token",
              "Readable by JavaScript on purpose (double submit), SameSite=Strict, Secure in production",
            ],
          ],
        },
        { type: "h3", text: "Refresh tokens are opaque, hashed and rotated" },
        {
          type: "p",
          text: "A refresh token is 48 random bytes. Only its SHA-256 hash is stored, so a database leak yields nothing a client could present. It is not a JWT on purpose: being opaque and stored is what makes server-side revocation possible.",
        },
        { type: "code", excerpt: excerpts.refreshToken },
        {
          type: "p",
          text: "Every login starts a new token family. Each refresh revokes the token that was presented and issues a new one in the same family. If a token that was already revoked is ever presented again, the whole family is revoked and the user has to log in again.",
        },
        { type: "code", excerpt: excerpts.refreshRotation },
        { type: "h3", text: "CSRF protection for cookie auth" },
        {
          type: "p",
          text: "Because authentication rides on cookies, a hostile site could try to trigger state-changing requests. The server sets the `gz_csrf` cookie, the Angular interceptor copies it into an `X-CSRF-Token` header on every non-GET request, and the middleware requires the two to match. Login and register are exempt because there is no session yet, and they issue the cookie instead.",
        },
        { type: "code", excerpt: excerpts.csrf },
        { type: "h3", text: "Passwords and abuse controls" },
        {
          type: "list",
          items: [
            "Passwords are hashed with bcrypt at cost 12 (`utils/password.js`). Input is validated with zod: at least 8 and at most 200 characters.",
            "A general limit of 300 requests per 15 minutes per IP applies to `/api`, and a stricter 20 per 15 minutes applies to login, register, verify-email, forgot-password and reset-password.",
            "A wrong email and a wrong password return the same “Invalid email or password” message.",
            "Changing a password or resetting it revokes every refresh token for that user.",
          ],
        },
        { type: "h3", text: "In the browser" },
        {
          type: "p",
          text: "`AuthService` holds no tokens, only the current user as a signal, restored with `GET /api/auth/me` when the app starts. The HTTP interceptor sends credentials, adds the CSRF header, and on a 401 makes one silent call to `/api/auth/refresh` and retries the request (`src/app/core/auth/auth.interceptor.ts`). Route guards (`authGuard`, `adminGuard`, `guestGuard`) wait for the initial `/me` check so a page reload does not bounce the user. They improve the experience only; the API enforces access on its own.",
        },
      ],
    },
    {
      id: "designer",
      title: "The designer",
      blocks: [
        {
          type: "p",
          text: "Customers design on two canvases, Front and Back. Each is drawn at a fixed 500 × 625 in print coordinates with a dashed print-zone rectangle (200 × 290 on the front, 200 × 310 on the back). Only the on-screen size is scaled to fit small screens, so print coordinates never change. Text and images can be dragged, scaled, rotated and layered, and the shirt colour is chosen from a palette.",
        },
        { type: "h3", text: "Saving: design JSON, not pixels" },
        {
          type: "p",
          text: "A design is serialized per zone with Fabric’s `toObject`, plus a few custom properties. Images are never embedded: an image object keeps only its storage key and its `src` is blanked, so saved designs stay small and the real file stays in the private bucket. `_bgCount` records how many background objects (the shirt photo, the print-zone rectangle, its label) sit beneath the customer’s own, so only the customer’s content is saved.",
        },
        { type: "code", excerpt: excerpts.serializeZone },
        {
          type: "p",
          text: "On load, each image key is re-signed through `/api/uploads/sign`, because signed URLs expire. Saving first uploads a flattened preview PNG, then posts the JSON. “Save as new version” posts to `/api/designs/:id/version`. If the visitor is not logged in, the API answers 401 and the payload is stashed in `sessionStorage` to be saved after login or registration. After a successful save, uploads that ended up unused are deleted, and only keys under the user’s own `user/<id>/` prefix can be deleted.",
        },
        { type: "h3", text: "From design to order" },
        {
          type: "p",
          text: "Requesting a proof renders each used zone to a 2× PNG, uploads each one, and puts the order (colour, sizes and quantities, zone image keys and the design JSON) in `sessionStorage` before navigating to `/proof`. The proof page can add the order to the `localStorage` cart or go straight to the purchase page.",
        },
        { type: "h3", text: "Upload pipeline (my teammate’s code)" },
        {
          type: "p",
          text: "Photos go through a staged pipeline in the browser before anything is uploaded: read the file with a timeout, convert HEIC to JPEG, check the resolution, shrink if needed, optionally remove the background, then upload with progress. HEIC is decoded natively where the browser can (Safari) and otherwise with `heic2any`, loaded on demand.",
        },
        {
          type: "table",
          caption: "Upload pipeline limits (`designer.js`)",
          headers: ["Setting", "Value", "Behaviour"],
          rows: [
            ["Minimum short side", "800 px", "Refused as too small to print well."],
            ["Recommended short side", "1500 px", "Below this the customer is warned and can continue."],
            ["Maximum long side", "4000 px", "Larger images are scaled down."],
            ["Upload ceiling", "18 MB", "The client shrinks the image until it fits; the server limit is 20 MB."],
            ["File read timeout", "90 s", "Covers photos still downloading from iCloud on a phone."],
          ],
        },
        {
          type: "p",
          text: "Background removal is optional and runs in the browser with `@imgly/background-removal` 1.5.3 (loaded from esm.sh); its model downloads on first use. On the server, multer keeps uploads in memory, allows one file of up to 20 MB, and accepts PNG, JPEG or WebP only, which is why HEIC is converted on the client.",
        },
        { type: "h3", text: "Mobile and touch (my teammate’s code)" },
        {
          type: "list",
          items: [
            "`fitCanvasToScreen` changes only the CSS size and does nothing when the size is unchanged, because iPhone Safari fires resize events whenever its address bar moves.",
            "A small patch to Fabric’s touch handler lets a finger on empty canvas scroll the page instead of being swallowed.",
            "Script fonts (Pacifico, Lobster, Caveat, Satisfy) get zero letter spacing, because any spacing makes Fabric draw letters one by one and breaks connected scripts.",
            "Centre-snap guides, and a warning when the text and shirt colours have a contrast ratio below 2.5.",
          ],
        },
        {
          type: "callout",
          label: "Trade-off",
          text: "Because `designer.js` is loaded as a plain script, it is not type-checked or unit-tested the way the Angular code is, and Fabric.js is fetched from a CDN at runtime instead of being bundled. In exchange the editor stays decoupled from the Angular build.",
        },
      ],
    },
    {
      id: "checkout",
      title: "Cart, checkout and payments",
      blocks: [
        {
          type: "p",
          text: "The guest cart is an array in `localStorage` (`goateez_cart`). On login or registration the app posts it to `/api/cart/claim`. The API expands each design into one cart row per size, finds the matching blank-tee SKU by colour and size, and prices each line from the server’s tier table. Replacing the cart is a single transaction, and a no-op when the items have not changed, so logging in repeatedly does not create a new abandoned cart each time.",
        },
        { type: "h3", text: "The server owns the prices" },
        {
          type: "p",
          text: "Pricing is $34 per shirt, $28 at 3 or more and $22 at 10 or more per design, with $12 shipping that is free from $100, plus 13% HST. The client sends quantities and options only. `priceCart` recomputes every amount, so editing the total in dev tools changes nothing.",
        },
        { type: "code", excerpt: excerpts.unitPrice },
        {
          type: "p",
          text: "The same numbers are duplicated in `src/app/core/pricing.ts` purely so the purchase page can show what Stripe will charge. The server wins if the two ever drift.",
        },
        { type: "h3", text: "Creating the order" },
        {
          type: "list",
          items: [
            "Recompute the price from the quantities. Anything price-like in the request is ignored.",
            "Resolve the buyer: the logged-in user, or find-or-create a passwordless user from the checkout email.",
            "In one transaction, insert a `pending_payment` order and its items. Only storage keys from the designer are kept, never client-supplied URLs.",
            "Create a Stripe Checkout Session for the server-computed total, with the order id in its metadata, and return its URL.",
          ],
        },
        { type: "h3", text: "The webhook is the source of truth" },
        {
          type: "p",
          text: "An order is marked paid only by Stripe’s `checkout.session.completed` webhook, never by the browser reaching the success page, because a closed tab would otherwise lose the payment. The handler verifies Stripe’s signature over the raw body, ignores sessions that are not `paid`, and then runs an idempotent transition. A bad signature returns 400, and a handler error returns 500 so that Stripe retries.",
        },
        { type: "code", excerpt: excerpts.markPaid },
        { type: "code", excerpt: excerpts.recordPayment },
        {
          type: "p",
          text: "Two layers make duplicate deliveries harmless. The `WHERE status = 'pending_payment'` condition means only the first delivery changes the order, and `ON CONFLICT (gateway_txn_id) DO NOTHING` stops a second payment row. After that the handler converts the buyer’s active cart and sends a confirmation to the buyer and a notification to the shop. Both emails are best-effort and can never fail the webhook.",
        },
        {
          type: "callout",
          label: "Trade-off",
          text: "Stripe receives one line item that represents the whole order, such as “3 shirt(s) across 1 design(s)”, because pricing is tiered per design. That keeps the Stripe total identical to the server’s total, at the cost of a less detailed Stripe receipt.",
        },
      ],
    },
    {
      id: "designs-storage",
      title: "Saved designs, blueprints and storage",
      blocks: [
        {
          type: "p",
          text: "Uploads go to a private Supabase Storage bucket. The database stores the object key, never a URL, and the API signs a short-lived read URL on demand (one hour by default). Keys are namespaced as `user/<id>/…` or `guest/…` and end with a timestamp and 8 random bytes (`services/storage.service.js`). Guests can upload while designing, so uploads accept an optional session, and the CSRF check applies only when a session cookie is present.",
        },
        { type: "h3", text: "Versions" },
        {
          type: "p",
          text: "Saving a new version inserts a row with `parent_design_id` set and `version + 1`, inside a transaction that first checks the parent belongs to the user. History is a recursive query that walks up to the root and then down through every descendant, so opening history from version 2 still shows versions 1 to N. Every design query is scoped by `user_id`.",
        },
        { type: "h3", text: "Blueprints (shared designs)" },
        {
          type: "p",
          text: "A design becomes a shareable blueprint when its owner enables sharing: the API stores a random 24-byte token. Anyone with the link can view a read-only copy. The public endpoint returns the design’s name, the owner’s first name, the colour and the design JSON, and never the owner’s id or email. Saving a copy into an account requires login and creates a fresh version 1, leaving the original and its history untouched. Revoking sharing just clears the token.",
        },
      ],
    },
    {
      id: "admin",
      title: "Admin console",
      blocks: [
        {
          type: "p",
          text: "Everything under `/api/admin` requires a login and the `admin` or `superadmin` role. User management also requires `superadmin`, and every write needs the CSRF header.",
        },
        {
          type: "list",
          items: [
            "**Orders:** list with status filters, search and views such as awaiting fulfilment and shipped. The detail page shows every printed zone image (signed URLs) and the full status history.",
            "**Editing an order:** the form sends the whole order, and the controller diffs it against the stored one, writes only real changes, and records each field’s before and after in `admin_activity_log`. In the UI a review step comes before saving.",
            "**Money is derived on the server:** line total is quantity × unit price, the subtotal is the sum of the lines, and the total is subtotal + shipping + tax. Edits never charge or refund through Stripe.",
            "**Products:** create, update and activate or deactivate. A SKU cannot change after creation.",
            "**Users:** search, and role changes by a superadmin, each logged.",
            "**Fulfilment is manual:** statuses such as `sent_to_printeez`, `in_production` and `shipped` are moved by an admin. There is no integration with a printer in this codebase.",
          ],
        },
        { type: "code", excerpt: excerpts.roleGuard, note: "A superadmin cannot change their own role, which prevents locking the last superadmin out." },
      ],
    },
    {
      id: "accounts-email",
      title: "Accounts, email and password reset",
      blocks: [
        {
          type: "p",
          text: "Email verification and password reset use one-time tokens: 32 random bytes emailed as a link, with only the SHA-256 hash stored. Verification links last 24 hours and reset links one hour. Creating a new token invalidates earlier unused ones of the same type, so only the newest link works.",
        },
        {
          type: "p",
          text: "Password reset does not reveal which emails have accounts: the endpoint behaves the same either way, and quietly does nothing for guest accounts that have no password.",
        },
        {
          type: "code",
          excerpt: excerpts.resetPassword,
          note: "One transaction sets the new hash, revokes every refresh token and burns the reset token, so anyone holding the old credentials is signed out.",
        },
        {
          type: "p",
          text: "Email goes out through Resend’s HTTP API with plain `fetch` and no SDK. Without an API key the service logs and skips instead of failing, so development works without email. A welcome email is sent once, on first verification. Signed-in customers can change their password (current password required, other sessions revoked, current session re-issued), save addresses that pre-fill checkout, and see their orders.",
        },
        { type: "h3", text: "Contact form (my teammate’s code)" },
        {
          type: "p",
          text: "The public contact form is validated on the server and defended by a hidden honeypot field. Browser autofill can copy a visitor’s own name or email into that field, so a match with those is treated as autofill and the message still goes through. There is a per-IP rate limit (5 per 10 minutes by default), header fields are stripped of newlines to prevent header injection, and the message is handed to `msmtp` with fixed arguments and no shell.",
        },
      ],
    },
    {
      id: "security",
      title: "Security",
      blocks: [
        {
          type: "p",
          text: "Security shaped the backend structure early: commit `c87696d` is titled “Re-structure backend to allow for middleware and security”, and the auth, CSRF, validation and rate-limit layers were built on top of it.",
        },
        {
          type: "table",
          caption: "Controls and where they live",
          headers: ["Control", "How it works", "Where"],
          rows: [
            ["Security headers", "Helmet defaults", "`app.js`"],
            ["CORS", "A single allowed origin (`CLIENT_URL`), credentials enabled", "`config/cors.js`"],
            ["Input validation", "A zod schema per route; invalid bodies get a 400 before reaching the service", "`middleware/validate.js`"],
            ["SQL injection", "Tagged-template queries only, so values are always bound parameters", "`config/db.js`"],
            ["Token theft", "Tokens in httpOnly cookies, nothing sensitive in JavaScript-readable storage", "`utils/cookies.js`"],
            ["CSRF", "Double-submit token on every unsafe method", "`middleware/csrf.js`"],
            ["Brute force", "Per-IP limits, stricter on auth routes", "`middleware/rateLimit.js`"],
            ["Money integrity", "Server-computed prices, signed webhook, idempotent transitions", "`modules/checkout/`"],
            ["Error leakage", "Production 500s return a generic message; stack traces appear only outside production", "`middleware/errorHandler.js`"],
            ["Uploads", "Memory storage, 20 MB cap, one file, image types only, private bucket", "`upload.middleware.js`, `storage.service.js`"],
            ["Secrets", "Read from environment variables at boot, and the server refuses to start if a required one is missing. `.env` files and the Angular `environment*.ts` files are git-ignored", "`config/env.js`, `.gitignore`"],
            ["Audit trail", "Every privileged action logged with the admin, entity, details and IP", "`adminLog.repository.js`"],
          ],
        },
        { type: "h3", text: "The row-level-security exposure I fixed" },
        {
          type: "p",
          text: "Supabase exposes every table in the `public` schema through an automatically generated REST API, reachable by anyone holding the project’s public anon key, and relies on row-level security (RLS) to decide what that key can see. GOAT’eez never used that API: Express talks to Postgres directly, as a role that bypasses RLS. But the tables had RLS switched off, so the side door existed anyway. Supabase’s security advisor flagged it as `rls_disabled_in_public` and `sensitive_columns_exposed`.",
        },
        {
          type: "p",
          text: "The fix was to enable RLS on every public table so the anon key gets nothing. I also wrote a script that proves it three ways. It lists any public table where RLS is still off. It confirms that Express can still read its own data despite RLS. And it acts as an outsider: it calls `/rest/v1/<table>` with the anon key for all 16 tables and passes only if the result is empty or refused. It refuses to run with the service-role key, because that would bypass RLS and give false failures, and it never prints row contents or key values.",
        },
        { type: "code", excerpt: excerpts.rlsCheck, note: "The script is meant to be re-run at every phase gate, so a new table created without RLS is caught. The SQL that enabled RLS was applied in the Supabase dashboard; the committed artifact is this verification script." },
        { type: "h3", text: "Other fixes in the history (my teammate’s commits)" },
        {
          type: "list",
          items: [
            "Removed a public test page that registered accounts against the production API (`88eee62`).",
            "Upgraded dependencies in October; the commit message reports `npm audit` at 0 vulnerabilities afterwards (`b36ff7d`).",
            "Hardened the contact form’s honeypot handling (`9e21ba4`, `e3fb5c8`).",
          ],
        },
      ],
    },
    {
      id: "testing",
      title: "Testing",
      blocks: [
        {
          type: "p",
          text: "The strongest tests are on the backend. There are 14 test scripts in `backend/scripts`, named by development phase, that run against the real database. Most boot the real Express app and make HTTP calls to it, and they delete the rows they created (the catalogue and RLS checks are read-only). The payment test uses Stripe in test mode. A fifteenth script, `setAdmin.js`, promotes the first admin.",
        },
        {
          type: "table",
          caption: "What the backend scripts cover",
          headers: ["Script", "Covers"],
          rows: [
            ["`testPhase1`", "Migration, repositories and the database connection in one round trip."],
            ["`testPhase2`", "The full cookie-based auth lifecycle."],
            ["`testPhase3`", "Pricing unit tests, a signed webhook, idempotency and a rejected bad signature."],
            ["`testPhase4`", "Order history, profile, saved-address CRUD with default logic, and cart claim."],
            ["`testPhase5`", "The blank-tee catalogue and the colour and size resolver."],
            ["`testPhase5_5`", "Change password: wrong current password, new password works, old one fails, CSRF required."],
            ["`testPhase5b`", "Role checks (customers get 403), admin status changes, the history trigger and the activity log."],
            ["`testPhase5c`", "Cart claim persistence with no churn, product CRUD, superadmin role management and the self-demotion guard."],
            ["`testPhase6`", "Storage round trip: upload, fetch the signed URL, re-sign, clean up."],
            ["`testPhase6_5`", "Verification and reset flows, anti-enumeration, and session revocation."],
            ["`testPhase7`", "Designs API: save, versions, ownership scoping, history, CSRF."],
            ["`testPhase7c`", "Blueprint sharing: public view, copy, revoke."],
            ["`testAdminOrderEdit`", "Order detail and edit: diffing, server-side money, the activity log."],
            ["`test-sec-rls-lockdown`", "The RLS check described above."],
          ],
        },
        {
          type: "p",
          text: "The checkout test builds a correctly signed `checkout.session.completed` event the way Stripe does (HMAC-SHA256 over the timestamp and body) and posts it to the real webhook route.",
        },
        { type: "code", excerpt: excerpts.signWebhook },
        {
          type: "p",
          text: "It then asserts that the order moved to `payment_received`, that exactly one payment row exists with the right amount, that delivering the same event again returns 200 without a second row, and that a bad signature is rejected with 400.",
        },
        { type: "code", excerpt: excerpts.idempotencyTest },
        {
          type: "callout",
          label: "Known gaps",
          text: "The scripts are run by hand: there is no CI configuration in the repository. On the Angular side there are only the generated “should create” specs (9 `it` blocks across 8 files), and `designer.js` has no automated tests.",
        },
      ],
    },
    {
      id: "delivery",
      title: "Build, delivery and performance",
      blocks: [
        {
          type: "p",
          text: "The Angular app builds with `@angular/build:application` in server output mode, with `src/server.ts` as the SSR entry and prerendering as the default. Production budgets warn at 500 kB and fail at 1 MB for the initial bundle, and warn at 12 kB and fail at 16 kB for any single component stylesheet. Output files carry content hashes.",
        },
        {
          type: "code",
          excerpt: excerpts.cacheRules,
          note: "My teammate’s caching rules. Hashed build files can be cached for a year because a new build produces new names. Everything else keeps a fixed name, so browsers must re-check it, which stops visitors seeing old images after a file is replaced.",
        },
        { type: "h3", text: "Reliability" },
        {
          type: "list",
          items: [
            "The API fails fast: it will not start if a required environment variable is missing or the database cannot be reached.",
            "On SIGTERM or SIGINT it stops accepting requests, closes the HTTP server and the database pool, and force-exits after 10 seconds if cleanup hangs.",
            "A `/health` endpoint answers without touching the database, for uptime probes.",
            "The database pool is capped at 10 connections with a 20-second idle timeout and a 10-second connect timeout.",
          ],
        },
        { type: "h3", text: "Performance choices" },
        {
          type: "list",
          items: [
            "Designs travel as JSON with images by key, never as embedded pixels.",
            "Uploads are shrunk in the browser and show real progress (XMLHttpRequest, because `fetch` cannot report upload progress).",
            "Pages are prerendered, and the designer scales its canvas with CSS only.",
          ],
        },
        {
          type: "callout",
          label: "Not in the repository",
          text: "Hosting, process management, any reverse proxy and CI are not in the repository, so this page does not describe them.",
        },
      ],
    },
    {
      id: "stack",
      title: "Tech stack",
      blocks: [
        {
          type: "table",
          caption: "What each piece does and why it is used",
          headers: ["Piece", "Used for", "Why it is used"],
          rows: [
            ["Angular 22 and `@angular/ssr`", "Storefront, routing, guards, prerendering", "Typed services and guards, prerendered public pages, hydration."],
            ["Express 5", "The API", "A small, explicit middleware pipeline where order matters, such as the webhook’s raw body."],
            ["Supabase Postgres with `postgres.js`", "All persistence", "Plain SQL with bound parameters, no ORM layer to hide queries."],
            ["Supabase Storage", "A private bucket for design images", "Keys in the database, signed URLs generated on demand."],
            ["Stripe Checkout", "Payments", "Card data never touches the app, and signed webhooks drive order state."],
            ["Fabric.js 5.3.1", "The canvas editor", "Objects serialize to JSON and rebuild into fully editable designs."],
            ["zod 4", "Request validation", "One schema per route, rejected before any logic runs."],
            ["jsonwebtoken, bcrypt, helmet, express-rate-limit, multer, cookie-parser", "Sessions, hashing, headers, limits, uploads, cookies", "Each does one security job and is configured in one place."],
            ["Resend", "Transactional email", "Called with `fetch`, so no SDK, and skipped safely without a key."],
            ["Vitest 4", "Angular unit tests", "The test runner behind `ng test`."],
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
            ["Express is the only data accessor", "One place to enforce rules; the browser never holds database credentials", "Every feature needs an endpoint"],
            ["Opaque, hashed, rotating refresh tokens instead of JWTs", "Revocable on the server, with theft detection", "A database lookup on each refresh"],
            ["Cookies instead of tokens in `localStorage`", "Tokens are unreadable by scripts", "Needs CSRF protection"],
            ["Server-authoritative pricing, mirrored on the client", "Accurate preview and a tamper-proof charge", "Two copies to keep in sync"],
            ["Designs saved as JSON with image keys", "Small payloads, versionable, images stay private", "Images must be re-signed on load"],
            ["The designer as a plain script", "Decoupled from the Angular build", "Not type-checked or tested; a CDN dependency"],
            ["JSONB snapshots on order items", "History stays correct after products or designs change", "Harder to query"],
            ["Database triggers for order numbers and status history", "Cannot be forgotten by application code", "Logic lives outside the repository"],
            ["One Stripe line item per order", "Stripe’s total always equals the server’s", "A less detailed receipt"],
            ["Hand-run SQL migrations", "No tooling to set up", "No repeatable history"],
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
            "**Make paying atomic.** Mark the order paid and record the payment in one transaction. Today, if the payment insert failed after the order was marked paid, Stripe’s retry would skip the order as already processed and the payment row would never be written.",
            "**Make refresh rotation safe under concurrency.** Allow one refresh in flight in the Angular interceptor and a short grace window on the server, so parallel requests made when an access token expires cannot be mistaken for token theft.",
            "**Version the whole schema.** Put every table, trigger and RLS policy in migrations run by a tool, instead of by hand in the SQL editor.",
            "**Turn the scripts into a suite and run it in CI.** Replace the generated Angular specs with real ones.",
            "**Schedule the cleanup helpers.** `deleteExpired` for refresh tokens and `purgeExpired` for abandoned carts are written, but nothing calls them yet.",
            "**Bundle Fabric.js and port `designer.js` to TypeScript**, with tests.",
            "**Real tax rates.** Tax is a flat 13% and the province lookup is a one-entry map waiting for real data.",
            "**Shrink the 25 MB JSON limit**, now that images go to storage.",
            "**Rewrite the README.** It still says the backend has no source.",
          ],
        },
      ],
    },
  ],
};
