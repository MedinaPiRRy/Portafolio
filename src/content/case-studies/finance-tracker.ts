import type { CaseStudy } from "../types";
import { financeTrackerCommit, financeTrackerExcerpts as x } from "./finance-tracker-excerpts";

export const financeTracker: CaseStudy = {
  slug: "finance-tracker",
  summary: {
    what: "A private personal and household finance tracker for the desktop. It imports bank statements, sorts transactions, tracks budgets and goals, and forecasts cash, all from one local file.",
    why: "To see where money goes without handing a bank login to a cloud service. There is no account, no sync and no analytics, and a statement can be imported again without double counting.",
    role: "Personal project, built solo: all 8 commits in the repository are mine. It covers the Electron shell, the SQLite schema and upgrades, the statement importers, the classification and forecasting logic, the React interface and its eight themes, the tests, and the CI and release pipeline.",
    outcome:
      "Four releases (1.0.0 to 1.3.0), each with installers for Windows, macOS (Intel and Apple Silicon) and Linux built by GitHub Actions. The test suite has 635 tests in 43 files, and CI runs the typecheck, the tests and a production build on every push to `main`.",
  },
  sourceNote: `Excerpts are verbatim from the public repository at commit \`${financeTrackerCommit}\`, with file paths and line numbers.`,
  sections: [
    {
      id: "architecture",
      title: "Architecture",
      blocks: [
        {
          type: "p",
          text: "An Electron app split by what each part is allowed to do. The **renderer** (React 19, bundled with Vite) draws the interface and never touches the database or the file system. A **preload script** exposes a single function to it. The **main process** receives each call by name and runs the matching handler, and the handlers use the **database layer** and a **core** of pure functions that have no database and no interface.",
        },
        {
          type: "diagram",
          title: "How a request travels",
          width: 420,
          height: 404,
          boxes: [
            { x: 20, y: 16, w: 380, h: 46, lines: ["Renderer (Chromium)", "React 19 pages, ECharts charts"] },
            { x: 20, y: 100, w: 380, h: 40, lines: ["Preload", "window.financeApi.call(method, ...args)"] },
            { x: 20, y: 176, w: 380, h: 50, lines: ["Main process (Node)", "dispatch() looks the name up in handlers.ts"] },
            { x: 20, y: 262, w: 170, h: 46, lines: ["src/db", "SQLite queries"] },
            { x: 230, y: 262, w: 170, h: 46, lines: ["src/core", "pure logic, no I/O"] },
            { x: 20, y: 342, w: 380, h: 46, lines: ["finance.db and backups/", "in the user data folder"] },
          ],
          arrows: [
            { points: [[210, 62], [210, 100]], labels: [{ x: 222, y: 86, text: "one function" }] },
            { points: [[210, 140], [210, 176]], labels: [{ x: 222, y: 162, text: "ipcRenderer.invoke" }] },
            { points: [[105, 226], [105, 262]] },
            { points: [[315, 226], [315, 262]] },
            { points: [[105, 308], [105, 342]] },
          ],
          description:
            "The interface calls one function exposed by the preload script, which forwards the call to the main process. The main process looks the method name up in a fixed list of 150 handlers. Handlers read and write SQLite through the database layer and call the core for calculations. Only the database layer touches the data file and the backups folder.",
        },
        {
          type: "table",
          caption: "Where the code lives (lines of TypeScript, measured at the commit above)",
          headers: ["Folder", "Lines", "Responsibility"],
          rows: [
            ["`src/core`", "1,691", "Money, dates, statement parsing, classification, categorization, budgets, goals, insights, recurring detection, debt payoff and the forecast. No database and no interface."],
            ["`src/db`", "4,518", "The schema, upgrades, queries, imports, the review queue, households and backups of data."],
            ["`src/importers`", "205", "CSV and Excel readers that turn a file into rows of text."],
            ["`src/main`, `src/preload`", "684", "The Electron shell, the dispatcher, the list of handlers, and file-level maintenance."],
            ["`src/renderer`", "5,980", "The React interface."],
            ["`src/demo`", "283", "A seeded generator for sample data."],
            ["`tests`", "6,121", "43 test files and their helpers."],
          ],
        },
        {
          type: "list",
          items: [
            "Because every operation is a plain function of a database, almost everything can be tested without starting Electron. The test suite runs on plain Node in CI on Linux.",
            "A development bridge (`scripts/dev-api.ts`) serves the same handlers over HTTP on `127.0.0.1`, so the interface can be built and checked in an ordinary browser. The renderer’s `api()` helper uses the Electron bridge when it exists and `fetch('/api')` otherwise.",
            "Only one copy of the app can run: a second launch focuses the first, because two copies writing one database file could corrupt it (`requestSingleInstanceLock`).",
            "Nothing in `src` makes a network request. A search of the source finds no URLs and no network modules, and the Content Security Policy sets `connect-src 'self'`.",
          ],
        },
      ],
    },
    {
      id: "bridge",
      title: "One door between the interface and the computer",
      blocks: [
        {
          type: "p",
          text: "The preload script exposes exactly one function. The interface cannot reach the file system, the database or Node. It can only name an operation and pass arguments.",
        },
        { type: "code", excerpt: x.preload },
        {
          type: "p",
          text: "The main process answers through `dispatch`, which always replies with `{ ok, data }` or `{ ok: false, error }`. It looks the method up with `Object.hasOwn`, so names that every object inherits, such as `constructor` or `toString`, are not callable. An error written for the person (an ordinary `Error`) is shown as is, but a `TypeError`, a SQLite error or anything that is not an `Error` is logged and replaced with a plain sentence, so internals never reach the screen.",
        },
        { type: "code", excerpt: x.dispatch },
      ],
    },
    {
      id: "data-model",
      title: "Data model",
      blocks: [
        {
          type: "p",
          text: "SQLite through `better-sqlite3`, in WAL mode with foreign keys on. The schema has 24 tables and four explicit indexes (one of them partial, covering only transactions waiting for review). The rules that keep the numbers trustworthy are simple and stated once.",
        },
        {
          type: "list",
          items: [
            "**Money is integer cents.** Amounts are stored and summed as integers, and dates are ISO `YYYY-MM-DD` text. The one decimal value near money is the exchange rate a person types for a foreign-currency cash tip; the converted amount is what counts, and it is stored in cents.",
            "**Balances are derived.** An account’s balance is its opening balance plus the sum of its transactions, so it can always be checked by hand. A credit card or loan is negative when money is owed. Investments are the exception: their value moves with the market, so it is entered by hand and kept as a history of valuations.",
            "**Five transaction kinds**: `income`, `expense`, `refund`, `transfer` and `unclassified`. Only the first three count in the dashboard. A transfer between two accounts is two linked rows that cancel out, so paying a credit card never looks like spending.",
            "**People are profiles.** A profile is either a person or the single `household` profile that owns shared accounts. Each person has their own categories.",
          ],
        },
        { type: "code", excerpt: x.txnTable, note: "`${V4_TXN_COLUMNS}` is a template placeholder: it adds the columns for money between two people and for the foreign-currency tip fields." },
        {
          type: "table",
          caption: "The 24 tables, grouped",
          headers: ["Group", "Tables"],
          rows: [
            ["People and accounts", "`profile`, `account`, `account_valuation`"],
            ["Money in and how it was sorted", "`txn`, `import_batch`, `category`, `category_rule`, `source_rule`, `amount_rule`"],
            ["Plans and debts", "`budget`, `budget_category`, `goal`, `goal_debt`, `debt`, `debt_history`, `debt_terms`, `debt_payment`, `recurring`, `recurring_dismissed`"],
            ["Households", "`household_budget`, `household_budget_group`"],
            ["Net worth", "`asset`, `asset_value`"],
            ["Preferences", "`setting` (kept in the database so it travels with a backup)"],
          ],
        },
        {
          type: "p",
          text: "Constraints do some of the checking. `CHECK` clauses restrict transaction kinds, account types and sources to fixed sets, budgets cannot be negative, goal targets must be positive, and a goal’s debt link must point at exactly one of an account or a tracked debt. `UNIQUE (profile_id, fingerprint)` is what makes importing idempotent.",
        },
        { type: "h3", text: "Safe upgrades" },
        {
          type: "p",
          text: "The schema version lives in SQLite’s `user_version` pragma (it is 3 now). Before any upgrade the whole database file is copied next to itself as `finance.db.bak-v<old>-<time>` and only the newest three copies are kept. Each step runs in a transaction. Foreign keys are switched off for the step, then `foreign_key_check` must come back empty before the step is committed, otherwise the step is rolled back. A database made by a newer version of the app is refused.",
        },
        { type: "code", excerpt: x.migrationLoop },
        {
          type: "p",
          text: "Each step can also name tables that it would drop, and the upgrade refuses to run if any of them holds rows. The two steps so far (version 2 added remembered sources, loan payments, subcategories, amount rules and assets; version 3 added the tax and interest marks) only add things, so those lists are empty. The guard is there for the first step that has to rebuild a table.",
        },
      ],
    },
    {
      id: "import",
      title: "The statement import pipeline",
      blocks: [
        {
          type: "p",
          text: "A statement goes through parse, normalise, classify, categorize, duplicate check and preview before anything is saved. The commit step then re-validates every row, because the interface is never trusted.",
        },
        { type: "h3", text: "Reading the file" },
        {
          type: "p",
          text: "CSV is read with PapaParse. Excel (`.xlsx` and `.xlsm`) is read by a small custom reader built on `fflate` and `fast-xml-parser`. It works on the raw XML, never runs macros, and unpacks only five kinds of part of the zip: the workbook, its relationships, shared strings, styles and the worksheets. Only the first sheet is read. A part that claims to unpack to more than the limit is refused before any memory is spent on it.",
        },
        { type: "code", excerpt: x.xlsxFilter },
        {
          type: "table",
          caption: "Limits applied to a statement file",
          headers: ["Limit", "Value", "Why"],
          rows: [
            ["File size", "5 MB", "A statement is far smaller; a larger file is probably the wrong one."],
            ["Rows", "20,000", "Statements are a few hundred rows."],
            ["Cells", "2,000,000", "Stops a sheet that claims thousands of columns from filling memory with empty cells."],
            ["Unpacked size of one part", "About 50 MB for statements", "Stops a zip bomb."],
            ["File type", "`.csv`, `.txt`, `.tsv`, `.xlsx`, `.xlsm`", "PDF statements are refused with a message that points to the CSV or Excel download."],
          ],
        },
        { type: "code", excerpt: x.statementLimits },
        {
          type: "p",
          text: "Rows then go through `parseStatement`. It recognises CIBC’s headerless card and chequing exports and any file with Date, Description and Amount, or Debit and Credit, columns. For anything else the person says once which column is which, and the layout is remembered for that account. Dates such as 03/04/2026 are resolved from the whole column (a part above 12 settles the order); when it is genuinely ambiguous the app assumes month first and warns. Amounts such as `(12.00)`, `$1,234.50` and `-12` are parsed to whole cents, and impossible dates like 30 February are refused.",
        },
        {
          type: "p",
          text: "The app also suggests which account a file belongs to, using the strongest evidence first: the identical file imported before (recognised by its SHA-256 hash even if renamed), the same column layout, a file name that matches an account, a card-style export when there is exactly one card, and finally the account used last. When two accounts match a file name equally, it asks instead of guessing.",
        },
        { type: "h3", text: "Classifying a line" },
        {
          type: "p",
          text: "The first pass is a fixed list of rules, with no model and no guessing about people. Anything whose meaning depends on why the money moved, such as an e-transfer, a deposit or an ATM withdrawal, is sent to the review queue with a plain-language question.",
        },
        { type: "code", excerpt: x.classifyChequing },
        { type: "h3", text: "Never recording a transaction twice" },
        {
          type: "p",
          text: "Duplicates are handled in layers. The preview marks a line as already in the app when the account holds a row with the same date and amount, consuming one existing row per staged line so that two identical coffees stay two rows. A second identical line inside the same file is held back until the person confirms it is real. A row with the same amount a day or two away and a similar name is only hinted at, since the bank’s posting date can differ from the purchase date.",
        },
        { type: "code", excerpt: x.duplicateMatch },
        {
          type: "p",
          text: "At commit, every row gets a fingerprint made from the profile, account, date, amount and cleaned merchant name, plus an occurrence number. The database’s unique constraint on the fingerprint then makes a repeated import a no-op. Importing the same file into a different account is refused unless the person confirms, because it would record every transaction twice. The whole commit runs in one transaction, so a file that fails halfway saves nothing.",
        },
        { type: "code", excerpt: x.fingerprint },
      ],
    },
    {
      id: "review",
      title: "The review queue: ask instead of guess",
      blocks: [
        {
          type: "p",
          text: "An e-transfer might be rent, a reimbursement, a gift or money from a partner, and the statement does not say. Those rows are stored as `unclassified` with a reason, and they are left out of income and spending until the person decides. The queue is split into tabs (Possible income, Money in, Money out, Transfers and investments) and grouped by source, which is the cleaned bank description and, for an e-transfer, the other person’s name. One decision can clear every waiting row from that source.",
        },
        {
          type: "list",
          items: [
            "**“Always do this” is opt-in.** Nothing is remembered unless the person ticks the box. The rule is stored per profile and per direction (money in and money out are separate), is applied to everything already waiting and to future imports, and can be forgotten in Settings.",
            "**Old items are set aside, not pushed.** Anything waiting for more than 90 days (a setting with choices of 30, 90, 180 or 365) moves to an Older tab. The badge and banners count recent items only, and the statistics pages show a notice instead.",
            "**Decisions cannot flip the meaning of money.** Income must be money in, an expense must be money out, and a category has to belong to the same person and match the kind. The checks run in the main process, not only in the interface.",
            "**Money between two people is its own decision** (“between us”). It becomes a transfer with a counterparty, so it is never income or spending for either person, and the name is remembered so the next one is recognised.",
          ],
        },
        { type: "code", excerpt: x.reviewSigns },
      ],
    },
    {
      id: "categorizing",
      title: "Categorization without AI",
      blocks: [
        {
          type: "p",
          text: "Categorization is rules that run on the person’s own machine, in a fixed order of priority. The lowest number wins, and among equals the longest, most specific pattern wins.",
        },
        {
          type: "table",
          caption: "Where a category comes from, strongest first",
          headers: ["Source", "Priority", "Notes"],
          rows: [
            ["Rules by amount", "Overrides the rest", "“At gas stations, up to $30 is snacks, more is gas.” Matches whole words in the cleaned merchant name and only looks at money going out."],
            ["Rules the person created or corrected", "10", "Their own word beats anything the app inferred."],
            ["Learned rules", "20", "Rules the app saved from earlier categorizations."],
            ["The person’s history", "60", "The most common category for a merchant, only if it covers at least 60% of that merchant’s rows."],
            ["Built-in keywords", "Last", "Seven tags (dining, groceries, transport, subscriptions, health, shopping, fees) matched against Canadian merchants and mapped to the person’s own category names."],
          ],
        },
        {
          type: "p",
          text: "Subcategories allow one level (`category.parent_id`). Everything that adds spending up (dashboard, budgets, forecast, goals and household groups) rolls a subcategory into its main category, unless the subcategory has a budget of its own, in which case it counts there. The built-in keywords only ever choose main categories; a subcategory is chosen by the person or by a rule.",
        },
        {
          type: "p",
          text: "The app is Canada-first by design: amounts are Canadian dollars, and the bank formats and merchant keywords are tuned for Canada. Other banks import through the column mapper, but other currencies are supported only for cash tips.",
        },
      ],
    },
    {
      id: "recurring",
      title: "Recurring payments and reversed charges",
      blocks: [
        {
          type: "p",
          text: "`detectRecurring` finds subscriptions, rent, utilities and pay in a person’s own transactions. It is pure: the same transactions always give the same answer. A group of payments to one merchant counts as regular when all of these hold:",
        },
        {
          type: "list",
          items: [
            "It happened at least three times, counting one charge per day.",
            "The median gap fits weekly (5 to 9 days), every two weeks (12 to 16), monthly (26 to 35) or quarterly (80 to 100), and at least 75% of gaps are within a small tolerance of the ideal period.",
            "The amount is steady: at least 80% of payments are within 15% of the median (25% for income, never less than $1). Groceries and fuel recur often but fail this test on purpose.",
            "It is still going: the last payment is within one and a half periods plus a week of today.",
          ],
        },
        { type: "code", excerpt: x.recurringRules },
        {
          type: "p",
          text: "The opposite question is “did this stop?”. A tracked item is only questioned when the account has data that reaches past the date it was due, so a statement that has not been imported yet can never trigger a false alarm.",
        },
        { type: "code", excerpt: x.findStopped },
        {
          type: "p",
          text: "Banks sometimes charge a monthly fee and refund it a moment later. `pairReversals` pairs a charge with a refund of exactly the same amount, in the same account and the same category, within seven days (matching the category as well keeps a friend’s $17 e-transfer from cancelling a $17 bill). Closest pairs win and each refund is used once. Paired charges are then not suggested as bills, not counted as tracked costs and not shown as unusual purchases.",
        },
        { type: "code", excerpt: x.pairReversals },
      ],
    },
    {
      id: "planning",
      title: "Forecast and debt payoff",
      blocks: [
        {
          type: "p",
          text: "The forecast walks forward month by month from today’s balances. Income streams are either regular (pay, tracked recurring income) or irregular (everything else that came in, grouped by category, with a poor-month and a good-month level taken from history). Spending is the tracked bills plus everyday spending by category, with each bill taken out of its category so it is not counted twice. The what-if (change income or spending by a percentage, switch off a bill, add a second job or a one-off event, pay extra toward debt) is the same walk with different numbers.",
        },
        { type: "code", excerpt: x.forecastWalk },
        {
          type: "p",
          text: "Every forecast is run three times, for expected income and for irregular income at its poorer and better levels, so the result is a range and not one number.",
        },
        { type: "code", excerpt: x.forecastCases },
        {
          type: "p",
          text: "The debt step is shared with the payoff planner, so the two screens cannot disagree. The planner supports three strategies: highest interest first (avalanche), smallest balance first (snowball) and minimum payments only. Interest is charged monthly at the annual rate divided by 12 on the balance carried into the month, and payments are made after interest. When the person has not entered terms, it assumes a 19.99% rate on cards, a minimum of the larger of $25 and 3% for cards, and a three-year schedule for loans, and it suggests about 60% of what is left over each month, rounded down to $5 steps. It stops at 600 months and says so if the payments barely cover the interest.",
        },
        { type: "code", excerpt: x.stepDebts },
        {
          type: "p",
          text: "Goal ideas follow the same caution. They are worked out from the person’s own numbers (clearing cards first, a one-month and then a three-month emergency fund, loans, growing an investment account), each with its reason, and the monthly amount is capped at 60% of what is left over.",
        },
      ],
    },
    {
      id: "households",
      title: "Couples and households",
      blocks: [
        {
          type: "p",
          text: "There are three setups: just me, me and my partner (two people with separate finances side by side), and the same plus a shared household that owns joint accounts, a household budget and shared goals. Money moved between two people, or into a shared account, is a transfer with `counterparty_profile_id` set, so it is never income or spending for either side.",
        },
        {
          type: "p",
          text: "Each person names their categories differently, so the household view combines them through category groups. “Fast Food & Dining” and “Dining & Takeout” both fall in the group “Dining”. Groups are guessed from the category name by a list of patterns, and a person can override any of them.",
        },
        {
          type: "p",
          text: "The two halves of a transfer between accounts (a chequing payment to a card and the card’s payment received) are linked by `pairTransfers`: equal and opposite amounts, different accounts, within seven days, nearest first, each row used once. It is safe to run repeatedly because it only touches rows that are not yet linked, and it looks candidates up by amount instead of comparing every pair.",
        },
        { type: "code", excerpt: x.pairTransfers },
      ],
    },
    {
      id: "taxes",
      title: "Taxes and interest",
      blocks: [
        {
          type: "p",
          text: "One page shows what was paid and what was received in taxes and in interest, by month and year, with the net. `classifyCost` decides what one transaction counts as, in a fixed order. A mark on the payment itself wins over everything, including “leave this out”. An account the person removed from the page is skipped. Then the category’s setting applies (or a guess from its name until it is set), and last an expense whose own words say “interest” counts.",
        },
        { type: "code", excerpt: x.costOrder },
        {
          type: "p",
          text: "The side is decided by the direction of the money, not the label: money out is paid (a refund reduces it), and money in is received, such as a GST/HST credit or interest earned. Bank fees are not interest, and phrases such as “no interest”, “interest-free” and “waived” are excluded. Transfers, and lines still waiting in review, can never be marked.",
        },
      ],
    },
    {
      id: "backup",
      title: "Backups, restore and erasing",
      blocks: [
        {
          type: "p",
          text: "Data lives in `finance.db` in the user data folder. Backups are made with SQLite’s `VACUUM INTO`, which gives a consistent copy while the app is open. Automatic backups are on by default: the first time the app opens each day it writes `auto-<date>.db` and keeps the newest 10 (the choices are off, 5, 10 or 20). Backups made by hand keep the newest 30.",
        },
        { type: "code", excerpt: x.autoBackup },
        {
          type: "p",
          text: "Restoring is deliberately cautious. A backup is chosen by name from the listed files, never by path, and the name must match a fixed pattern. The file is opened read-only and must pass SQLite’s `integrity_check`, look like this app’s database, and not come from a newer version. The current data is saved first as a `before-restore` copy, so a restore can itself be undone. The backup is copied beside the database and renamed into place in one step, after the old journal files are removed so they can never be applied to the restored file.",
        },
        { type: "code", excerpt: x.backupProblem },
        { type: "code", excerpt: x.restoreDatabase },
        {
          type: "list",
          items: [
            "**Sample data is a separate database file.** `sample.db` is created on demand, and a small state file records which one is open. No code path writes sample rows into `finance.db`, and a backup made while the sample is open goes to its own folder, so it is never offered as a restore point for real data. The generator is seeded, so the same setup produces the same data.",
            "**“Erase all my data” erases everything.** It needs a typed word, optionally keeps one fresh backup, and removes the database and its journal files, the sample, the state file, the pre-upgrade copies and every other backup.",
            "**The Windows installer offers a fresh start.** When it finds existing data it shows a page offering to erase it (with a confirmation, and a separate option for backup copies), with `/WIPE` and `/WIPEBACKUPS` for unattended installs. The uninstaller asks whether to keep or delete the data. A small `FinanceTracker-Wipe-Data.exe`, compiled during the Windows build with the C# compiler that ships with Windows, can erase the data on demand.",
          ],
        },
      ],
    },
    {
      id: "security",
      title: "Security and privacy",
      blocks: [
        {
          type: "p",
          text: "The privacy promise (no account, no cloud, no bank login, no analytics) is enforced by how the app is built, not just stated. There is no network code in the source, the renderer cannot reach anything except one narrow door, and every input from a file or from the interface is limited and validated.",
        },
        {
          type: "table",
          caption: "Controls and where they live",
          headers: ["Control", "How it works", "Where"],
          rows: [
            ["Renderer isolation", "Context isolation and the sandbox are on, and Node integration is off", "`main/index.ts`"],
            ["Content Security Policy", "`default-src 'self'`, no inline scripts, `connect-src 'self'`, `object-src 'none'`, `frame-src 'none'`, `form-action 'none'` and `base-uri 'none'`. Styles allow `'unsafe-inline'`.", "`renderer/index.html`"],
            ["Navigation", "Pop-ups are denied and the window can only navigate to the app’s own page", "`main/index.ts`"],
            ["Narrow bridge", "One function, a fixed list of handlers, own-property lookup, internal errors replaced with plain sentences", "`preload`, `dispatch.ts`"],
            ["Statement files", "Size, row and cell limits, a part filter and zip-bomb check for Excel, only the first sheet read", "`importers/`"],
            ["Money and date validation", "Impossible dates (30 February) refused, impossible sign combinations refused, names compared without case or accents", "`core/`, `db/`"],
            ["Spreadsheet export", "Text cells that start with `=`, `+`, `-`, `@`, a tab or a return get a leading apostrophe so a spreadsheet will not run them as formulas; plain numbers are left alone", "`db/exportCsv.ts`"],
            ["SQL", "Prepared statements with bound parameters. The one statement that cannot take a parameter, `VACUUM INTO`, gets its path with quotes escaped.", "`db/`, `handlers.ts`"],
            ["Restore", "Chosen by listed name, integrity-checked, older or equal schema only, saved current data first", "`main/maintenance.ts`"],
            ["Destructive actions", "Erasing needs a typed word and is refused while sample data is open. Deleting an account, removing a person or the household, and deleting duplicate rows each make a backup first.", "`handlers.ts`"],
            ["Development bridge", "Loopback address only, and a request must be JSON and must not name a foreign origin", "`scripts/dev-api.ts`"],
          ],
        },
        { type: "code", excerpt: x.navigationLock },
        { type: "code", excerpt: x.devApiGuard },
        {
          type: "p",
          text: "The theme script is a separate file, not an inline script, so the policy can forbid inline scripts. A test checks that `index.html` has none and that the script lists the same styles as the app.",
        },
      ],
    },
    {
      id: "interface",
      title: "The interface",
      blocks: [
        {
          type: "p",
          text: "React 19 with no router library. The app has 14 pages in the personal sidebar, and the household view has its own smaller sidebar. Charts are ECharts (bar and line) on a canvas, wrapped in a component that reads its colours from the active theme’s CSS tokens and rebuilds when the theme changes.",
        },
        { type: "code", excerpt: x.chart },
        { type: "h3", text: "Back and forward that remember the page" },
        {
          type: "p",
          text: "`nav.tsx` keeps a history of visited pages, up to 100 entries, with Alt+Left and Alt+Right. Each visit has an id, and pages keep their filters, month, tab and page number with `useKept`, which stores state under that id. Pressing Back returns to the page as it was left.",
        },
        { type: "code", excerpt: x.useKept },
        {
          type: "p",
          text: "Long lists are paged 50 rows at a time with page controls, and the page number is remembered the same way, which keeps screens responsive on large databases.",
        },
        { type: "h3", text: "Eight styles" },
        {
          type: "p",
          text: "Settings has a picker with a live preview for Light, Dark, Business, GirlMath, Programmer, Cozy, Casual and ADHD (calm, with strong colour kept for what needs attention), plus a default that follows the operating system. A tiny script loaded before the page is drawn applies the saved style, so there is no flash of the wrong theme.",
        },
        { type: "code", excerpt: x.themeInit },
        {
          type: "p",
          text: "Accessibility is checked by tests, not left to taste. Each style must define every colour token, and its text, status colours, focus ring and chart series have to pass contrast and colour-vision checks. Another test fails if a page or component writes a colour by hand instead of using a token, so a later change cannot quietly bypass the checks.",
        },
        { type: "code", excerpt: x.contrastTests },
        { type: "code", excerpt: x.noHandColours },
        {
          type: "list",
          items: [
            "Navigation is a labelled `nav`, with `aria-current` on the open page and labelled badges for counts.",
            "Charts are `role=\"img\"` with a label. Pagination is a labelled `nav` and announces the page politely.",
            "Focus outlines are styled for inputs, buttons, table sort buttons and linked figures, and the animation on a flashed row is switched off under `prefers-reduced-motion`.",
            "A top-level error boundary shows a calm message (with the details folded away) instead of a blank window, and clears itself when the person navigates elsewhere.",
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
          text: "There are 635 tests in 43 files, run with Vitest 5, and I confirmed the count by running the suite. They use plain Node and in-memory or temporary SQLite databases, so no Electron is needed. Many of them are written to find ways the app could be wrong rather than to confirm it works.",
        },
        {
          type: "table",
          caption: "What the tests cover",
          headers: ["Area", "What is checked"],
          rows: [
            ["Parsing", "Statement formats, thousands separators, brackets, dollar signs and trailing minus, leap days and year boundaries, a zero amount or empty line never becoming a transaction, files that are not statements."],
            ["Importing", "A 3,800-line statement previews and commits every line once, and importing it again adds nothing. Two or three genuinely identical purchases are all kept. An overlapping statement adds only the new lines. One invalid row commits nothing. Undo removes exactly one import's rows."],
            ["Hostile files", "A zip bomb, a damaged zip, a single cell far down and to the right, an enormous unterminated quoted field, thousands of columns, and more rows than the limit."],
            ["The review queue", "Sign rules for each decision, remembered sources, and that rules apply only in their own direction."],
            ["Households", "Shared accounts, money between people, household budgets, and a sample-data consistency check in all three setups."],
            ["Planning", "Budgets and subcategory roll-up, goals, the forecast, recurring detection and stopped bills, reversals, goal ideas and the debt planner."],
            ["Taxes and interest", "A bank fee is not interest, “no interest” promotions are not interest paid, and look-alike names are ignored."],
            ["Upgrades and backups", "Upgrading a version 1 database keeps every row and backs the file up first. A failed restore leaves the current database in place and no half-copied file behind. Sample backups stay out of the real list."],
            ["Every page on an empty database", "Each page answers without an error on an empty database, and when the only account is closed."],
            ["Themes", "All eight styles define every token and pass the contrast checks; saved values fall back safely."],
          ],
        },
        { type: "h3", text: "Hostile arguments to every handler" },
        {
          type: "p",
          text: "One test calls every handler except `close` (149 of the 150) with 24 sets of malformed arguments: wrong types, `NaN`, `1e308`, a 200,000-character string, a path-like string, SQL-like text, `__proto__`, objects without a prototype and impossible dates. It then asserts that nothing threw out of `dispatch`, nothing hung (an 8-second timeout), the database passes `integrity_check`, `foreign_key_check` is empty, every money column still holds whole integers, and no error message leaks internals such as SQLite error names, stack frames, file paths or JavaScript type errors. Two findings from earlier audit passes are kept as named regression tests: the dispatcher used to accept inherited names like `constructor`, and malformed arguments used to surface messages like “x.trim is not a function”.",
        },
        { type: "code", excerpt: x.hostileDispatch },
        { type: "h3", text: "Speed on a large database" },
        {
          type: "p",
          text: "A performance test builds a database of 100,000 transactions over five years (30,000 in CI to keep shared machines quick), times the main screens, a 3,800-line import preview and commit, and a backup, and fails if anything takes more than 15 seconds. A second test reads SQLite’s query plans and fails if listing by profile and date, filtering by account and date, the fingerprint lookup used by import, or the review queue scan the whole transaction table.",
        },
      ],
    },
    {
      id: "delivery",
      title: "CI and releases",
      blocks: [
        {
          type: "p",
          text: "CI runs on every push to `main` and every pull request: install, typecheck, the tests and a production build.",
        },
        { type: "code", excerpt: x.ciWorkflow },
        {
          type: "p",
          text: "Pushing a tag that starts with `v` runs the release workflow on Windows, macOS and Ubuntu. Each runner installs dependencies, runs the tests and builds its installer with electron-builder, then attaches it to a GitHub release with generated notes. Each of the four releases (1.0.0, 1.1.0, 1.2.0, 1.3.0) has five files: a Windows installer, the wipe tool, macOS images for Apple Silicon and Intel, and a Linux AppImage. The eight most recent workflow runs on GitHub (CI and releases) all succeeded.",
        },
        {
          type: "p",
          text: "The installers are not code-signed, so Windows SmartScreen and macOS Gatekeeper warn on first launch, and the README explains how to open them. I run and test the app on Windows. The macOS and Linux installers are produced by the workflow and I have not tested them myself.",
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
            ["Electron 44", "Desktop shell", "A real desktop app with a local file database and no server."],
            ["TypeScript 7", "Everything", "One language end to end, and handler types shared with the interface."],
            ["React 19, Vite 7, electron-vite", "Interface and build", "One build for the main process, the preload script and the renderer, with hot reload."],
            ["better-sqlite3", "The database", "Synchronous, fast, transactional SQLite in one file that is easy to back up."],
            ["ECharts 6", "Charts", "Canvas charts that are clickable and can follow the theme tokens."],
            ["PapaParse", "CSV", "Robust parsing of quoted and malformed CSV."],
            ["fflate and fast-xml-parser", "Excel", "A small read-only reader that unpacks only the parts it needs."],
            ["Vitest 5", "Tests", "Fast tests of the pure core and the database layer."],
            ["electron-builder", "Installers", "NSIS for Windows, DMG for macOS, AppImage for Linux."],
            ["GitHub Actions", "CI and releases", "Typecheck, tests and build on every push, installers on every tag."],
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
            ["Integer cents everywhere", "No rounding drift; balances can be checked by hand", "Display and parsing need care"],
            ["Balances derived from transactions", "A balance can never disagree with its transactions", "A mismatch with the bank is the person’s to track down, so the app offers tools to match it"],
            ["Ask in a review queue instead of guessing", "Ambiguous money is never silently misclassified", "More decisions for the person, softened by “always do this” rules"],
            ["Rules, not AI", "Deterministic, explainable, and nothing leaves the machine", "Less clever than a trained model; the person corrects what it misses"],
            ["Pure `core` with no I/O", "Fast, exact unit tests of the maths", "Data has to be gathered and passed in by the database layer"],
            ["One bridge function with a handler list", "A tiny attack surface and one place to test", "Arguments are type-checked in the interface but arrive untyped at runtime, so every handler has to validate its input"],
            ["Fingerprint plus preview-level duplicate checks", "Overlapping or renamed statements never double count", "A genuinely repeated line has to be confirmed"],
            ["Restore from a listed backup through a temporary file", "A failed or hostile restore never touches live data", "You can only restore backups the app has listed"],
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
            "**Run the packaged app in CI.** The main process has a self-test mode (`FINANCE_SMOKE=1`) that checks the interface loads and the database answers, but no workflow runs it yet. Running it on each operating system would also let me verify the macOS and Linux installers.",
            "**Sign and notarize the installers**, which removes the first-launch warnings, and add automatic updates.",
            "**Add a sender check to the bridge** as defence in depth: the window can only load the app’s own page today, but confirming the calling frame on each call would not depend on that.",
            "**Tighten the Content Security Policy** by moving inline style attributes into classes so `style-src` no longer needs `'unsafe-inline'`.",
            "**Run the release workflow’s typecheck** (CI already does on `main`, but a tag build runs only the tests) and add an automated accessibility scan of the real pages, in addition to the colour-token checks.",
            "**Read every sheet of an Excel statement**, not only the first, and add PDF statements.",
          ],
        },
      ],
    },
  ],
};
