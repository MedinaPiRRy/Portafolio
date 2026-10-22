import type { CaseStudy } from "../types";
import { scentWardrobeCommit, scentWardrobeExcerpts as x } from "./scent-wardrobe-excerpts";

export const scentWardrobe: CaseStudy = {
  slug: "scent-wardrobe",
  summary: {
    what: "A personal, offline fragrance collection manager for the desktop, with a layering engine and a wear diary.",
    why: "To keep a fragrance collection in one place, log what you wear and how each scent performs on you, and get layering and daily suggestions, all in a single local file with no account and no cloud.",
    role: "Personal project, built solo: all 24 commits in the repository are mine. It covers the Electron main process, the typed IPC layer, the SQLite database and migrations, two scoring engines, the importers, backup and restore, the React interface, the tests, and the CI and release pipeline.",
    outcome:
      "Version 1.0.0 is released with installers for Windows and macOS (Intel and Apple Silicon). The test suite has 344 tests in 32 files, and CI runs the typecheck, the tests and a production build on Windows and macOS.",
  },
  sourceNote: `Excerpts are verbatim from the public repository at commit \`${scentWardrobeCommit}\`, with file paths and line numbers.`,
  sections: [
    {
      id: "architecture",
      title: "Architecture",
      blocks: [
        {
          type: "p",
          text: "An Electron app with three parts. The **main process** (Node) owns everything with side effects: the SQLite file, the images and backups folders, and the network. The **renderer** is a React 19 interface built with Vite and Tailwind CSS 4, which never touches the database. A small **preload script** connects them by exposing one typed `window.api`. A shared folder, `src/shared`, holds the types and the two scoring engines as plain TypeScript, so both sides can use them and they can be tested without Electron.",
        },
        {
          type: "diagram",
          title: "Process layout",
          width: 420,
          height: 330,
          boxes: [
            { x: 20, y: 16, w: 380, h: 46, lines: ["Renderer (Chromium)", "React 19 pages and components"] },
            { x: 20, y: 100, w: 380, h: 40, lines: ["Preload", "exposes one typed window.api"] },
            { x: 20, y: 176, w: 380, h: 50, lines: ["Main process (Node)", "IPC handlers · database · files · network"] },
            { x: 20, y: 262, w: 170, h: 46, lines: ["SQLite file", "better-sqlite3, WAL mode"] },
            { x: 230, y: 262, w: 170, h: 46, lines: ["Images and backups", "in the user data folder"] },
          ],
          arrows: [
            { points: [[210, 62], [210, 100]], labels: [{ x: 222, y: 86, text: "calls window.api" }] },
            { points: [[210, 140], [210, 176]], labels: [{ x: 222, y: 162, text: "ipcRenderer.invoke" }] },
            { points: [[105, 226], [105, 262]] },
            { points: [[315, 226], [315, 262]] },
          ],
          description:
            "The interface calls `window.api`, which the preload script forwards to the main process with `ipcRenderer.invoke`. The main process alone reads and writes the SQLite database and the images and backups folders. The shared engines and types (not drawn) are imported by both the main process and the renderer.",
        },
        {
          type: "list",
          items: [
            "The database is one SQLite file opened with `better-sqlite3`, a native module that is rebuilt for Electron on install (`electron-rebuild` in `postinstall`).",
            "Only one window and one copy of the app can run: a second launch just focuses the first, because two copies would fight over the database (`requestSingleInstanceLock`).",
            "If the data file is damaged, locked or read-only, the app explains what happened, offers to open the data folder, and quits instead of leaving an invisible process running.",
            "Everything is local. The only network use is weather lookups (Open-Meteo), Fragrantica imports and downloading the pictures those imports reference.",
          ],
        },
      ],
    },
    {
      id: "ipc",
      title: "The typed IPC contract",
      blocks: [
        {
          type: "p",
          text: "All communication between the interface and the main process goes through one TypeScript interface, `Api`, in `src/shared/ipc.ts`. It groups calls by area (`fragrances`, `wardrobe`, `wears`, `layering`, `backup` and so on). Channel names such as `fragrances:list` are not typed by hand: a mapped type derives them from the methods of `Api`.",
        },
        { type: "code", excerpt: x.ipcChannels },
        {
          type: "p",
          text: "That one type is enforced on both ends. In the preload script the object is declared `const api: Api`, so leaving out a method is a compile error. In the main process the handlers are a `Record` keyed by `ChannelName`, so adding a method to `Api` forces a handler to be written.",
        },
        { type: "code", excerpt: x.preloadApi },
        { type: "code", excerpt: x.ipcRecord },
        {
          type: "p",
          text: "Calls that can fail in expected ways return a `Result<T>`, which is either `{ ok: true, data }` or `{ ok: false, code, message }`, so the interface shows a message instead of handling thrown errors. Before any handler runs, the sender is checked.",
        },
        {
          type: "code",
          excerpt: x.ipcHandlers,
          note: "Every channel is registered through one loop, so the trusted-sender check cannot be forgotten on an individual handler.",
        },
      ],
    },
    {
      id: "database",
      title: "Database and migrations",
      blocks: [
        {
          type: "p",
          text: "SQLite through `better-sqlite3`, opened in WAL mode with foreign keys on. Its synchronous API suits a single-user desktop app, and the whole library is one file that is easy to back up. The schema has 8 versions, tracked with SQLite’s `user_version` pragma.",
        },
        { type: "code", excerpt: x.migrationRunner },
        {
          type: "list",
          items: [
            "Each migration runs in its own transaction together with the version bump, so a failed upgrade leaves the previous version intact.",
            "A data file from a newer version of the app is refused with a clear message instead of being opened and possibly damaged.",
            "SQLite cannot alter a CHECK constraint, so version 5 (five wardrobes) rebuilds the `wardrobe_items` table: it drops the triggers, creates a new table, copies the rows over, swaps it in and recreates the triggers.",
            "A test builds a library at every schema version and upgrades it to the current one without losing a row (see Testing).",
          ],
        },
        {
          type: "table",
          caption: "Core tables (migration 1, with later additions)",
          headers: ["Table", "Holds", "Design note"],
          rows: [
            ["`fragrances`", "Name, house, year, concentration, description, image path", "A unique index on lower-cased name, house and concentration stops duplicates that differ only by case."],
            ["`notes`, `accords` and their join tables", "Notes by layer and accords with a strength", "Accord strengths feed the layering and recommendation engines."],
            ["`wardrobe_items`", "Which wardrobe a fragrance is in, shelf position, rating", "A CHECK limits the wardrobe to five values (version 5)."],
            ["`bottles`", "Type (full bottle, travel/mini, decant, sample), size, remaining millilitres, millilitres per spray, price, status", "CHECK constraints keep sizes positive and status within a fixed set."],
            ["`wear_log` and `wear_deductions`", "Each wear with sprays, activity, weather, projection, longevity and compliments; the volume each wear took from each bottle", "A CHECK requires a wear to reference a fragrance or a layered combo."],
            ["`layer_combos` and items", "Combinations tried, with a spray ratio and a rating", "Rated combos train the layering engine."],
            ["`catalog_fragrances`", "An optional imported dataset for fuzzy search", "Kept separate so backups can leave it out."],
          ],
        },
        { type: "h3", text: "Rules enforced inside the database" },
        {
          type: "p",
          text: "The wishlist rule is that a fragrance cannot be on the wishlist without a smell impression written down, and that impression cannot be blanked or deleted while it is there. The API checks it first, but four triggers enforce it in the database as a last line of defence.",
        },
        { type: "code", excerpt: x.wishlistTrigger },
      ],
    },
    {
      id: "wardrobes",
      title: "Wardrobes and the shelf",
      blocks: [
        {
          type: "p",
          text: "Fragrances live in five wardrobes: My Collection, Wishlist, To Try, Had and Garbage Perfumes. Moving a fragrance between them keeps its wears, bottles and notes. Had stores years worn, a memory and why it left (finished, sold or gifted), and Garbage Perfumes stores why it was disliked.",
        },
        {
          type: "p",
          text: "The shelf draws each bottle to a size that reflects its volume, on a log scale so a 2 ml sample is short and a 200 ml bottle is tall but mid sizes stay distinguishable, with a liquid level taken from the remaining millilitres. Samples and decants with no larger bottle live on a separate decant rack. Bottles can be reordered by drag and drop with dnd-kit, and the shelf can be searched, filtered by season and sorted several ways.",
        },
        { type: "code", excerpt: x.bottleHeight },
      ],
    },
    {
      id: "wear-log",
      title: "The wear log",
      blocks: [
        {
          type: "p",
          text: "Logging a wear records sprays, activity, weather, projection, longevity and compliments. Sprays are deducted from the bottle’s remaining volume, and the exact amount is stored in `wear_deductions`, so editing or deleting a wear gives the right volume back without ever exceeding the bottle’s size.",
        },
        { type: "code", excerpt: x.deduct },
        {
          type: "list",
          items: [
            "Wears added for past days are diary entries, marked with a `backfilled` flag, and leave bottle levels alone. Regression tests cover editing both diary entries and real wears.",
            "A wear whose day is over and that has no longevity figure triggers a follow-up prompt asking how long it lasted, which can be completed or dismissed.",
            "A per-fragrance default spray count can be set (a check limits it to 1 to 60), and a fragrance you wore but do not own can be added as a marked “foreign” entry.",
            "The calendar groups wears by local day and shows usage as a heat map. The date maths is tested across month boundaries and daylight-saving changes.",
            "Stats cover the most worn and neglected fragrances, wears and millilitres used per month, bottles running low and cost per wear. A bottle can carry a market price with the date and source it was checked.",
          ],
        },
      ],
    },
    {
      id: "layering",
      title: "The layering engine",
      blocks: [
        {
          type: "p",
          text: "The Layering Lab takes two or three fragrances with a spray ratio and returns a 0 to 100 score, a verdict, the reasons behind it and a written description of the blend. The engine is pure TypeScript in `src/shared/layering`, with no Electron or database dependency.",
        },
        {
          type: "p",
          text: "Each pair of fragrances starts from a neutral 50 and gains or loses points from six components. Every reason that moves the score is returned with its point impact and a sentence, so the interface can explain the result.",
        },
        { type: "code", excerpt: x.scoreBudget },
        {
          type: "table",
          caption: "Score components for one pair of fragrances",
          headers: ["Component", "Range", "How it is computed"],
          rows: [
            ["Accord affinity", "up to ±35", "A matrix scores every pair of accords between the two fragrances, weighted by how strong both are. The average is scaled by a gain so a clearly good or bad pairing lands near ±1."],
            ["Shared notes", "up to +10", "A note present in both adds 2.5 points, or 3.5 if it sits in a different layer of the other fragrance, which bridges the two."],
            ["Competition", "up to −14", "Only clearly strong projectors count as loud. Two loud fragrances at similar strength compete."],
            ["Redundancy", "up to −22", "Above 80% cosine similarity between accord profiles, layering adds little."],
            ["Season and time of day", "up to ±8, plus −3 to +2", "Cosine similarity of the community season votes (up to ±8), plus a smaller day-or-night adjustment (−3 to +2)."],
            ["Learned taste", "up to ±12", "Combos you rated before nudge similar pairings up or down."],
          ],
        },
        { type: "code", excerpt: x.pairScore },
        {
          type: "p",
          text: "Spray count and projection set how much each fragrance dominates the blend. A strong projector counts for more, from 0.5× at “intimate” up to 1.7× at “enormous”. For a mix of three, the pair scores are averaged, each weighted by the product of the two fragrances’ dominance weights, and three strong projectors together lose 4 points. Verdicts follow fixed thresholds: 78 or more is a great pairing, 58 or more is worth testing, a very similar pair is flagged as redundant, and anything lower is likely to clash.",
        },
        { type: "h3", text: "Learning your taste" },
        {
          type: "p",
          text: "The taste component compares the pair being scored with every pair inside the combos you have rated. Similar pairs, by cosine similarity of their accord profiles, vote with a weight equal to the square of the similarity, and the vote is how far the rating sits from the middle. The extra 0.5 in the denominator stops a single data point from swinging the score as far as several would.",
        },
        { type: "code", excerpt: x.tasteLearning },
        { type: "code", excerpt: x.competition },
      ],
    },
    {
      id: "recommendations",
      title: "Recommendations",
      blocks: [
        {
          type: "p",
          text: "Recommendations suggest what to wear for an activity, a time of day and the weather. The engine is pure TypeScript in `src/shared/recommend`. It scores each fragrance in the collection from 0 to 100 as a weighted sum of six fits, then adds rotation and rating points. When data is missing for a component it contributes a neutral 0.5, so it neither helps nor hurts.",
        },
        {
          type: "table",
          caption: "The six weighted fits (weights sum to 1, so a perfect match is 100 before the adjustments)",
          headers: ["Fit", "Weight", "What it measures"],
          rows: [
            ["Activity", "0.30", "Built-in profiles such as office, gym, casual, date, night out and formal, each with accords it likes and dislikes, a preferred projection and a longevity need."],
            ["Temperature", "0.20", "Heavy, sweet, warm fragrances suit cold weather; light, fresh ones suit heat."],
            ["Season", "0.17", "How strongly the community wears it in this season, with some credit for neighbouring seasons."],
            ["Longevity", "0.15", "Whether it typically lasts as long as the activity needs."],
            ["Day or night", "0.10", "The share of the community that wears it at this time of day."],
            ["Humidity", "0.08", "High humidity amplifies heavy fragrances; fresh ones are unaffected."],
          ],
        },
        { type: "code", excerpt: x.recommendScore },
        {
          type: "p",
          text: "Every result carries its breakdown, a line per component with the points it contributed, plus a written explanation. Weather comes from Open-Meteo for a saved location, or you can enter it by hand. With neither, the engine assumes a typical temperature for the month and says so in the result.",
        },
        { type: "code", excerpt: x.rotation },
        {
          type: "p",
          text: "Rotation keeps suggestions varied: a fragrance worn yesterday loses 10 points and one worn three days ago loses 3, while one left alone for 14 days gains 2 and for 30 days gains 4. Your own rating can move a score by at most 2 points, so it only breaks ties. The engine also suggests the best pair among the leaders by running them through the layering engine.",
        },
      ],
    },
    {
      id: "importers",
      title: "Importers",
      blocks: [
        { type: "h3", text: "Dataset files" },
        {
          type: "p",
          text: "An optional dataset adds fuzzy search and prefilled forms. The importer reads CSV (also TSV and TXT), JSON lines, and SQLite files, chosen by file extension. Files are streamed in chunks, so a very large dump never has to fit in memory. The CSV reader follows RFC 4180 (quoted fields, escaped quotes, embedded newlines, CRLF), picks the delimiter that appears most often in the header, and detects files that are not UTF-8. In a JSON-lines file a damaged line is skipped instead of aborting a long import.",
        },
        {
          type: "p",
          text: "The app suggests a column mapping, detects known presets, and shows a preview before anything is written. Importing reports progress, and can replace the existing dataset.",
        },
        { type: "h3", text: "Fragrantica pages and lists" },
        {
          type: "p",
          text: "A fragrance page can be imported from its link, and a member’s public Have, Want, Had and custom shelf lists can be previewed and imported. Lists can also come from pasted text or a CSV, so no account details are involved. The preview says what would be added before it is added. Pages are fetched at least three seconds apart, with a 30-second page timeout.",
        },
        {
          type: "p",
          text: "Pages are loaded in a special window. It is rendered but invisible, because a fully hidden window does not trigger the page’s lazy loading, and it is revealed only if the site asks for a human check or a login.",
        },
        { type: "code", excerpt: x.scrapeWindow },
        {
          type: "p",
          text: "Pictures referenced by an import are downloaded by the main process only from an allow-list: https only, no embedded credentials, port 443 only, and only the picture host and Fragrantica. A redirect is checked again, downloads are capped at 12 MB, and images are resized to at most 900 px tall and stored under generated file names.",
        },
        { type: "code", excerpt: x.imageAllow },
      ],
    },
    {
      id: "backup",
      title: "Backup and restore",
      blocks: [
        {
          type: "p",
          text: "A backup is one zip file containing a consistent snapshot of the database, all cached images and a manifest. The snapshot uses SQLite’s online backup, so it is safe while the app is running. The imported dataset, which can be very large and can be imported again from its original file, is left out unless you ask for it. A backup is written under a `.partial` name and renamed only when complete, so a half-written backup never has the real name.",
        },
        { type: "code", excerpt: x.partialRename },
        {
          type: "p",
          text: "Restoring treats the zip as untrusted. Only three kinds of entry are ever read, picture names must match the 16-hex-digit names the app generates, paths are flattened into the images folder, and there are hard limits: 3 GiB for the database, 50 MiB per image, 1 MiB for the manifest and 50,000 entries.",
        },
        { type: "code", excerpt: x.restoreEntry },
        {
          type: "p",
          text: "Everything is extracted into a temporary folder and checked before the live data is touched: the manifest must match, a backup from a newer schema is refused, and SQLite’s `integrity_check` must pass.",
        },
        { type: "code", excerpt: x.integrityCheck },
        {
          type: "p",
          text: "The swap is copy-then-rename: an older backup is first migrated to the current schema, copied next to the live file, and only then renamed into place, so a full disk cannot destroy the current database. If the backup has no dataset but the current database does, the dataset is carried over. The app restarts after a restore.",
        },
        { type: "code", excerpt: x.swapRestore },
        {
          type: "p",
          text: "Automatic backups are made weekly, the newest eight are kept, and manual and pre-restore backups are never pruned.",
        },
      ],
    },
    {
      id: "security",
      title: "Security",
      blocks: [
        {
          type: "p",
          text: "A desktop app that renders web content and reads files from outside is a security surface, so the main process treats everything crossing the boundary as untrusted.",
        },
        {
          type: "table",
          caption: "Controls and where they live",
          headers: ["Control", "How it works", "Where"],
          rows: [
            ["Renderer isolation", "Context isolation and the sandbox are on, and Node integration is off", "`main/index.ts`"],
            ["IPC trust", "Handlers refuse any sender other than the app’s own page, so a web page or pop-up cannot call the main process", "`security.ts`, `ipc.ts`"],
            ["Navigation", "The window never navigates away or opens new windows; external links open in the browser", "`main/index.ts`"],
            ["Content Security Policy", "`default-src 'self'`, scripts only from the app’s own files, images from the app, `data:` and the `scentimg:` scheme", "`renderer/index.html`"],
            ["Untrusted pages", "The Fragrantica window is sandboxed with no preload, no Node, no permissions, no pop-ups, and https-only navigation", "`scrapeWindow.ts`"],
            ["Allow-lists", "Fragrantica hosts (look-alike domains are refused) and picture hosts (https, no credentials, port 443)", "`security.ts`"],
            ["Image protocol", "A custom `scentimg://` scheme serves only plain file names from inside the images folder", "`images.ts`"],
            ["Archives", "Size and entry limits, path flattening and an integrity check before restore", "`backupCore.ts`"],
            ["Spreadsheet export", "Text cells that start like a formula (`=`, `+`, `-`, `@`) are prefixed so they stay text, and numbers are untouched", "`db/exportCsv.ts`"],
            ["Input size", "Absurdly long names and note lists are rejected, while normal and unusual text is accepted", "`db/editing.ts`, tested in `regressions.test.ts`"],
            ["Data safety", "A newer data version is refused, one app instance at a time, a damaged file is explained and never overwritten", "`migrations.ts`, `main/index.ts`"],
          ],
        },
        { type: "code", excerpt: x.trustedSender },
        { type: "code", excerpt: x.webPreferences },
        { type: "code", excerpt: x.navigationLock },
      ],
    },
    {
      id: "interface",
      title: "The interface",
      blocks: [
        {
          type: "p",
          text: "React 19 with React Router 7, Tailwind CSS 4 and Recharts for the stats and accord charts. Themes are dark, light, or “Match Windows”, which follows the operating system and updates live; the choice is remembered between launches. The window remembers its size and position, and has a minimum size of 1100 × 640. A top-level error boundary keeps a rendering error from blanking the app.",
        },
        { type: "h3", text: "Dialogs and keyboard" },
        {
          type: "p",
          text: "Dialogs are modal (`role=\"dialog\"`, `aria-modal`), trap focus inside while open, and return focus to where it was when they close. Escape closes only the top-most layer: layers register on a stack, so a nested dialog closes before the panel beneath it.",
        },
        { type: "code", excerpt: x.escapeStack },
        { type: "h3", text: "Muted text" },
        {
          type: "p",
          text: "Components dim text with opacity classes such as `text-cream/40`. Anything fainter than a per-theme floor is raised to that floor, because the stylesheet states the target as WCAG AA contrast (4.5:1) against the panel colours of both themes.",
        },
        { type: "code", excerpt: x.mutedFloor },
      ],
    },
    {
      id: "testing",
      title: "Testing",
      blocks: [
        {
          type: "p",
          text: "There are 32 test files with 344 tests, run with Vitest. Counting by reading the code gives 332 test calls, and the data-driven ones expand to 344: `it.each` over six calendar months adds five, and `describe.each` over all eight schema versions adds seven. Nothing else generates tests dynamically.",
        },
        {
          type: "p",
          text: "The native SQLite module is compiled for Electron’s runtime, so the tests run under Electron’s own Node, and the real database layer is exercised with in-memory databases.",
        },
        { type: "code", excerpt: x.testRunner },
        {
          type: "table",
          caption: "What the tests cover",
          headers: ["Area", "What is checked"],
          rows: [
            ["Layering engine (39 tests)", "Pair scoring, verdicts, blends, learned taste and the description text, without Electron or a database."],
            ["Recommender (34 tests)", "Each fit, rotation, ratings, missing data and the combo suggestion."],
            ["Migrations", "A library built at every schema version upgrades to the current one without losing a row; a newer version is refused."],
            ["Wears, bottles and wardrobes", "Spray deduction and refunds, diary entries, follow-ups, moving between wardrobes, and regressions."],
            ["Backup and restore (17 tests)", "Round trip, snapshots of a database being written to, older and newer schemas, hostile archives, limits, and the temporary-file swap."],
            ["Importers", "CSV and JSON-lines parsing, broken files, binary files with a `.csv` name, huge or pathological pasted text, and non-Fragrantica links."],
            ["Security helpers", "Host look-alikes, picture addresses, stored file names, CSV formula cells and the IPC sender check."],
            ["Performance", "A library of 400 fragrances and 6,000 wears must list, search, summarise and export quickly (limits are generous to avoid flakiness)."],
            ["Date maths", "Month grids, leap years, six-week months, and no repeated or skipped day across daylight-saving changes."],
          ],
        },
        {
          type: "code",
          excerpt: x.migrationChainTest,
          note: "This runs once for each of the 8 schema versions, which is why one `it` in the source is 8 tests at run time.",
        },
        {
          type: "p",
          text: "Separate end-to-end scripts in `scripts/e2e` drive the packaged app through Chromium’s debug port with a throw-away profile: a smoke test (including that IPC works from the packaged page, which guards the trusted-sender check), user-flow checks, and the script that takes the README screenshots from built-in sample data. They are run by hand, so CI covers the typecheck, the tests and the production build.",
        },
      ],
    },
    {
      id: "delivery",
      title: "CI and releases",
      blocks: [
        {
          type: "p",
          text: "CI runs on every push to `main` and every pull request, on both Windows and macOS: install, typecheck, the tests and a production build.",
        },
        { type: "code", excerpt: x.ciWorkflow },
        {
          type: "p",
          text: "Pushing a version tag such as `v1.0.0` starts the release workflow. It builds three installers in parallel (Windows x64, macOS Intel and macOS Apple Silicon), running the typecheck and the tests before packaging each one, and a final job attaches them to a GitHub Release with generated notes. The v1.0.0 release has all three. The installers are built with electron-builder (an NSIS installer for Windows and DMG images for macOS), with the SQLite module unpacked from the app archive.",
        },
        {
          type: "p",
          text: "The installers are not code-signed or notarized, so Windows SmartScreen and macOS Gatekeeper warn on first launch, and the release notes explain how to open them. The installers bundle the MIT licence and third-party notices, which a script generates from the dependency tree.",
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
            ["Electron 44", "Desktop shell", "A real desktop app with a local file database and no server, on Windows and macOS."],
            ["TypeScript", "Everything", "One shared contract between main and renderer, and engines that are tested as plain code."],
            ["React 19 and React Router 7", "The interface", "Components for the shelf, dialogs and pages."],
            ["electron-vite and Vite", "Build and hot reload", "One setup for the main process, the preload script and the renderer."],
            ["Tailwind CSS 4", "Styling", "A small set of theme tokens that flip between dark and light."],
            ["better-sqlite3", "The database", "Synchronous, fast, transactional SQLite in the main process, with one file that is easy to back up."],
            ["dnd-kit", "Drag and drop", "Reordering shelves and building a blend in the Layering Lab."],
            ["Recharts", "Charts", "The stats and accord charts."],
            ["yauzl and yazl", "Reading and writing zip files", "Streaming backups with entry-by-entry checks on restore."],
            ["Vitest 5", "Tests", "Fast tests for the engines and the database layer."],
            ["electron-builder", "Installers", "An NSIS installer for Windows and DMG images for macOS."],
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
            ["One typed `Api` contract for IPC", "A missing method or handler is a compile error", "Every new call touches three files"],
            ["SQLite in the main process only", "The renderer cannot corrupt data; one file to back up", "Every data access goes through IPC"],
            ["Pure engines in `src/shared`", "Testable without Electron or a database", "Engines see only the data passed to them"],
            ["Scores built from explicit, capped components", "Every score can explain itself", "Weights are hand-tuned rather than learned"],
            ["Database triggers for key rules", "A bug in the API cannot break the rule", "Rules live in two places"],
            ["Restore through a temporary folder, then swap", "A failed or hostile restore never touches live data", "A restore needs free disk space"],
            ["Tests under Electron’s Node", "The real native database module is tested", "Tests need Electron installed"],
            ["Unsigned installers", "No signing certificate to buy or manage", "Operating-system warnings on first launch"],
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
            "**Sign and notarize the installers**, which removes the first-launch warnings on both platforms.",
            "**Add automatic updates**, so a new release reaches installed copies.",
            "**Run the end-to-end scripts in CI** against the packaged build.",
            "**Automate accessibility checks**, for example by running axe-core inside the end-to-end scripts, so the contrast floor and the dialog behaviour are verified on every change.",
          ],
        },
      ],
    },
  ],
};
