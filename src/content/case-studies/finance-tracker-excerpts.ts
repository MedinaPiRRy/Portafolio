// Verbatim excerpts from FinanceTrackerApp at commit db04dfb.
// Generated from git by line range; do not edit by hand.
// Each excerpt carries its file path and line range so it can be checked against the source.
export const financeTrackerCommit = "db04dfb";

export const financeTrackerExcerpts = {
  dispatch: {
    path: "FinanceTrackerApp/src/main/dispatch.ts",
    lines: "7-22",
    code: "export async function dispatch(handlers: Record<string, unknown>, method: string, args: unknown[] | undefined): Promise<ApiResult> {\n  const fn = Object.hasOwn(handlers, method) ? handlers[method] : undefined // not inherited members such as \"constructor\" or \"toString\"\n  if (typeof fn !== 'function') {\n    console.error(`Unknown method ${method}`)\n    return { ok: false, error: 'Something went wrong. Reload the page and try again.' }\n  }\n  try {\n    return { ok: true, data: (await (fn as (...a: unknown[]) => unknown)(...(args ?? []))) ?? null }\n  } catch (err) {\n    // A message written for the person (an ordinary Error) is shown as it is. Anything else is a malformed request or an internal fault: it is\n    // logged here and the person gets a plain sentence instead of \"x.trim is not a function\" or a SQL error.\n    const internal = !(err instanceof Error) || err instanceof TypeError || err instanceof RangeError || err instanceof ReferenceError || err instanceof SyntaxError || /^SQLITE_|^SqliteError/.test((err as { code?: string }).code ?? err.name)\n    if (internal) { console.error(`Handler ${method} failed:`, err); return { ok: false, error: 'That could not be done because the request was not valid. Reload the page and try again.' } }\n    return { ok: false, error: err.message }\n  }\n}",
  },
  preload: {
    path: "FinanceTrackerApp/src/preload/index.ts",
    lines: "3-6",
    code: "// The only door between the UI and the rest of the computer: one function that calls a named handler.\ncontextBridge.exposeInMainWorld('financeApi', {\n  call: (method: string, ...args: unknown[]) => ipcRenderer.invoke('api', method, args) as Promise<{ ok: boolean; data?: unknown; error?: string }>\n})",
  },
  navigationLock: {
    path: "FinanceTrackerApp/src/main/index.ts",
    lines: "65-72",
    code: "// Nothing in this app should ever navigate away or open other windows: the pages contain no outside links, so any attempt is refused.\nwin.webContents.setWindowOpenHandler(() => ({ action: 'deny' }))\nconst own = process.env.ELECTRON_RENDERER_URL ? new URL(process.env.ELECTRON_RENDERER_URL).origin : null\nconst ownFile = pathToFileURL(path.join(__dirname, '../renderer/index.html')).href\nwin.webContents.on('will-navigate', (e, url) => {\n  const ok = own ? new URL(url).origin === own : url.split('#')[0] === ownFile\n  if (!ok) e.preventDefault()\n})",
  },
  devApiGuard: {
    path: "FinanceTrackerApp/scripts/dev-api.ts",
    lines: "15-20",
    code: "if (req.method !== 'POST' || req.url !== '/api') { res.writeHead(404).end(); return }\n// Only the UI served by `npm run dev:web` may call this. A web page on any other origin can still send a \"simple\" cross-origin POST, so the\n// request has to be JSON (which makes the browser ask permission first, and this server never grants it) and must not name a foreign origin.\nconst origin = req.headers.origin\nif (origin !== undefined && !/^http:\\/\\/(localhost|127\\.0\\.0\\.1):5173$/.test(origin)) { res.writeHead(403).end(); return }\nif (!/^application\\/json\\b/i.test(req.headers['content-type'] ?? '')) { res.writeHead(415).end(); return }",
  },
  parseMoney: {
    path: "FinanceTrackerApp/src/core/money.ts",
    lines: "7-26",
    code: "/** Parses \"1,234.50\", \"-12\", \"(12.00)\", \"$5\" into cents. Returns null if not a number. */\nexport function parseMoneyToCents(input: string | number | null | undefined): number | null {\n  if (input === null || input === undefined) return null\n  if (typeof input === 'number') return Number.isFinite(input) ? toCents(input) : null\n  let s = input.trim()\n  if (s === '') return null\n  let negative = false\n  if (/^\\(.*\\)$/.test(s)) {\n    negative = true\n    s = s.slice(1, -1)\n  }\n  s = s.replace(/[$,\\s]/g, '')\n  if (s.startsWith('-')) {\n    negative = !negative\n    s = s.slice(1)\n  }\n  if (!/^\\d+(\\.\\d+)?$/.test(s)) return null\n  const cents = toCents(Number(s))\n  return negative ? -cents : cents\n}",
  },
  txnTable: {
    path: "FinanceTrackerApp/src/db/schema.ts",
    lines: "188-207",
    code: "CREATE TABLE txn (\n  id               INTEGER PRIMARY KEY,\n  profile_id       INTEGER NOT NULL REFERENCES profile(id),\n  account_id       INTEGER NOT NULL REFERENCES account(id),\n  posted_date      TEXT NOT NULL,\n  amount_cents     INTEGER NOT NULL,\n  description      TEXT NOT NULL,\n  description_raw  TEXT,\n  category_id      INTEGER REFERENCES category(id),\n  kind             TEXT NOT NULL CHECK (kind IN ('income','expense','refund','transfer','unclassified')),\n  transfer_group   TEXT,\n  notes            TEXT,\n${V4_TXN_COLUMNS}  review_reason    TEXT,                      -- non-NULL = waiting in the review queue\n  reviewed_at      TEXT,\n  source           TEXT NOT NULL CHECK (source IN ('import','manual','cash_entry','sample')),\n  import_batch_id  INTEGER REFERENCES import_batch(id),\n  fingerprint      TEXT NOT NULL,\n  created_at       TEXT NOT NULL DEFAULT (datetime('now')),\n  UNIQUE (profile_id, fingerprint)\n);",
  },
  migrationLoop: {
    path: "FinanceTrackerApp/src/db/open.ts",
    lines: "61-77",
    code: "while (version < SCHEMA_VERSION) {\n  const next = version + 1\n  const m = MIGRATIONS[next]\n  if (!m) throw new Error(`No migration from schema v${version} to v${next}.`)\n  db.pragma('foreign_keys = OFF') // tables are dropped and recreated; checked before each step is committed\n  try { db.transaction(() => {\n    for (const t of m.guard) {\n      const n = (db.prepare(`SELECT COUNT(*) AS n FROM ${t}`).get() as { n: number }).n\n      if (n > 0) throw new Error(`Upgrade stopped: table \"${t}\" contains ${n} rows and would be dropped. Nothing was changed.`)\n    }\n    db.exec(m.sql)\n    db.pragma(`user_version = ${next}`)\n    // checked before the upgrade is committed, so inconsistent data rolls the whole step back and the version number stays where it was\n    if ((db.pragma('foreign_key_check') as unknown[]).length) throw new Error('Upgrade left inconsistent data, so it was undone and nothing was changed. The backup copy was kept.')\n  })() } finally { db.pragma('foreign_keys = ON') }\n  version = next\n}",
  },
  fingerprint: {
    path: "FinanceTrackerApp/src/db/import.ts",
    lines: "255-259",
    code: "const base = sha(profileId, accountId, r.date, r.amountCents, r.key)\nconst n = (seen.get(base) ?? 0) + 1\nseen.set(base, n)\nconst fingerprint = `imp-${base}#${n}`\nif (db.prepare('SELECT 1 FROM txn WHERE profile_id = ? AND fingerprint = ?').get(profileId, fingerprint)) { result.skippedExisting++; continue } // true repeat of an earlier import",
  },
  duplicateMatch: {
    path: "FinanceTrackerApp/src/db/import.ts",
    lines: "138-152",
    code: "// 1) already in the app: consume existing rows with the same date + amount, one per staged row\nconst left = new Map([...existing].map(([k, v]) => [k, [...v]]))\nconst consumed = new Set<number>()\nfor (const r of out) {\n  const hit = left.get(`${r.date}|${r.amountCents}`)?.shift()\n  if (hit) { r.status = 'duplicate'; r.matchedTxnId = hit.id; r.matchedDescription = hit.description; r.include = false; consumed.add(hit.id) }\n}\n// 2) the same line twice in this file: the second copy is held back until the user confirms it is a real second purchase\nconst seenLines = new Map<string, number>()\nfor (const r of out) {\n  const k = `${r.date}|${r.amountCents}|${r.raw}`\n  const n = (seenLines.get(k) ?? 0) + 1\n  seenLines.set(k, n)\n  if (n > 1 && r.status === 'new') { r.status = 'repeat'; r.include = false }\n}",
  },
  classifyChequing: {
    path: "FinanceTrackerApp/src/core/classify.ts",
    lines: "50-66",
    code: "// ---- chequing / savings lines ----\nif (/E-?TRANSFER/.test(d)) {\n  // Why someone sent or received money varies, so the user always decides.\n  return R('unclassified', `E-transfer ${moneyIn ? 'received' : 'sent'}: what was it for? (income, reimbursement, loan, transfer...)`)\n}\nif (/INTERNET TRANSFER.*\\bTO CARD\\b/.test(d)) return R('transfer')\nif (/INTERNET TRANSFER.*\\b(FROM|TO) ACCOUNT\\b/.test(d)) return R('transfer')\nif (/MEMO - INVESTMENT|DISATF|INVESTMENT/.test(d)) return R('unclassified', 'Money moved to or from an investment or another account: which one?')\nif (/INTERNET TRANSFER\\s+\\d+\\s*$/.test(d)) return R('unclassified', 'Transfer with no destination shown: where did the money go or come from?')\nif (/SERVICE CHARGE DISCOUNT|FEE REBATE|FEE REVERSAL/.test(d)) return R('refund', null, 'fees', true)\nif (!moneyIn && FEE.test(d)) return R('expense', null, 'fees', true)\nif (/ATM (DEPOSIT|WITHDRAWAL)/.test(d)) return R('unclassified', `ATM ${moneyIn ? 'deposit' : 'withdrawal'}: tips, cash for spending, or a transfer?`)\nif (/INTERNET DEPOSIT|MOBILE DEPOSIT|BRANCH.*DEPOSIT|DEPOSIT/.test(d) && moneyIn) return R('unclassified', 'Deposit: where did this money come from?')\nif (moneyIn && /ELECTRONIC FUNDS TRANSFER PAY\\b|PAYROLL|DIRECT DEPOSIT/.test(d)) return R('income', null, null, true)\nif (moneyIn && /GOVERNMENT|CANADA|CRA\\b|GST|CCB/.test(d)) return R('income', null, null, true)\nif (moneyIn) return R('unclassified', 'Money received: what was it?')\nreturn R('expense', null, null, true)",
  },
  reviewSigns: {
    path: "FinanceTrackerApp/src/db/review.ts",
    lines: "75-86",
    code: "if (decision.kind === 'income') {\n  if (t.amount_cents <= 0) throw new Error('Income must be money coming in')\n  checkCategory(decision.categoryId, 'income')\n}\nif (decision.kind === 'expense') {\n  if (t.amount_cents >= 0) throw new Error('An expense must be money going out')\n  checkCategory(decision.categoryId, 'expense')\n}\nif (decision.kind === 'refund') {\n  if (t.amount_cents <= 0) throw new Error('A refund/reimbursement must be money coming in')\n  checkCategory(decision.categoryId, 'expense')\n}",
  },
  xlsxFilter: {
    path: "FinanceTrackerApp/src/importers/xlsxReader.ts",
    lines: "62-79",
    code: "/** The only parts of the package this reader looks at. Everything else (images, macros, charts) is never unpacked. */\nconst NEEDED = /^xl\\/(workbook\\.xml|_rels\\/workbook\\.xml\\.rels|sharedStrings\\.xml|styles\\.xml|worksheets\\/[^/]+\\.xml)$/\n\n/** Default ceiling for one unpacked part. A real workbook sheet is a few MB; a \"zip bomb\" claims gigabytes. */\nexport const MAX_PART_BYTES = 200 * 1024 * 1024\n\n/**\n * Same reader for in-memory files (e.g. an uploaded statement); nothing is written to disk. Only the parts it needs are unpacked, and a part that\n * would unpack to more than `maxPartBytes` is refused before any memory is spent on it.\n */\nexport function readWorkbookBuffer(data: Uint8Array, maxPartBytes: number = MAX_PART_BYTES): Workbook {\n  const zip = unzipSync(new Uint8Array(data), {\n    filter: (f) => {\n      if (!NEEDED.test(f.name)) return false\n      if (f.originalSize > maxPartBytes) throw new Error('That spreadsheet unpacks to far more data than a statement could hold, so it was not opened.')\n      return true\n    }\n  })",
  },
  statementLimits: {
    path: "FinanceTrackerApp/src/importers/statementFile.ts",
    lines: "15-19",
    code: "export function readStatementRows(fileName: string, data: Uint8Array): string[][] {\n  if (data.byteLength > MAX_STATEMENT_BYTES) throw new Error('That file is larger than 5 MB, which is far more than a statement should be. Is it the right file?')\n  const lower = fileName.toLowerCase()\n  if (lower.endsWith('.pdf')) throw new Error('PDF statements are not supported yet. Download the CSV or Excel version from your bank instead.')\n  let rows: string[][]",
  },
  recurringRules: {
    path: "FinanceTrackerApp/src/core/recurringDetect.ts",
    lines: "59-74",
    code: "if (rows.length < MIN_OCCURRENCES) continue\nconst intervals = rows.slice(1).map((r, i) => daysBetween(rows[i]!.date, r.date))\nconst freq = classify(median(intervals))\nif (!freq) continue\nconst regular = intervals.filter((d) => Math.abs(d - PERIOD[freq]) <= TOLERANCE[freq]).length / intervals.length\nif (regular < 0.75) continue\n\nconst direction = rows[0]!.direction\nconst amounts = rows.map((r) => Math.abs(r.amountCents))\nconst mid = median(amounts)\nconst tol = Math.max(100, mid * (direction === 'income' ? 0.25 : 0.15))\nconst steady = amounts.filter((a) => Math.abs(a - mid) <= tol).length / amounts.length\nif (steady < 0.8) continue\n\nconst last = rows[rows.length - 1]!\nif (daysBetween(last.date, today) > PERIOD[freq] * 1.5 + 7) continue // it stopped a while ago: not a current bill",
  },
  findStopped: {
    path: "FinanceTrackerApp/src/core/recurringDetect.ts",
    lines: "122-136",
    code: "export function findStopped(items: TrackedItem[]): Stopped[] {\n  const out: Stopped[] = []\n  for (const it of items) {\n    const period = PERIOD[it.frequency as keyof typeof PERIOD]\n    if (!period || !it.coverageEnd) continue\n    const seen = [it.lastSeen, it.checkedAt].filter((x): x is string => !!x).sort().pop()\n    if (!seen) continue\n    const grace = Math.max(5, Math.round(period * 0.25))\n    const expected = addDays(seen, period)\n    const missed = Math.floor(daysBetween(seen, it.coverageEnd) / period)\n    const needed = period <= 15 ? 2 : 1\n    if (it.coverageEnd > addDays(expected, grace) && missed >= needed) out.push({ id: it.id, name: it.name, lastSeen: it.lastSeen ?? seen, expectedBy: expected, missed })\n  }\n  return out\n}",
  },
  pairReversals: {
    path: "FinanceTrackerApp/src/core/offsets.ts",
    lines: "38-47",
    code: "// closest pairs first, so a rebate goes to the charge it really belongs to\noptions.sort((a, b) => a.gap - b.gap || a.charge.date.localeCompare(b.charge.date) || a.charge.id - b.charge.id || a.credit.id - b.credit.id)\nconst usedCredits = new Set<number>()\nconst out = new Map<number, number>()\nfor (const o of options) {\n  if (usedCredits.has(o.credit.id) || out.has(o.charge.id)) continue\n  usedCredits.add(o.credit.id)\n  out.set(o.charge.id, o.credit.id)\n}\nreturn out",
  },
  costOrder: {
    path: "FinanceTrackerApp/src/core/costs.ts",
    lines: "45-55",
    code: "export function classifyCost(r: CostRow): CostClass | null {\n  if (r.kind !== 'expense' && r.kind !== 'refund' && r.kind !== 'income') return null\n  const side: CostSide = r.kind === 'income' ? 'received' : 'paid'\n  if (r.markedPurpose === 'tax' || r.markedPurpose === 'interest') return { kind: r.markedPurpose, side, why: 'marked' }\n  if (r.markedPurpose === 'none') return null\n  if (r.accountExcluded) return null\n  const purpose = r.categoryPurpose ?? (r.categoryName ? guessPurpose(r.categoryName) : 'none')\n  if (purpose === 'tax' || purpose === 'interest') return { kind: purpose, side, why: 'category' }\n  if (r.categoryPurpose === null && r.kind !== 'income' && looksLikeInterest(r.description)) return { kind: 'interest', side, why: 'wording' }\n  return null\n}",
  },
  forecastWalk: {
    path: "FinanceTrackerApp/src/core/forecast.ts",
    lines: "108-119",
    code: "const res = debts.length ? stepDebts(debts, input.debtBudgetCents, input.strategy) : []\nconst paid = res.reduce((a, r) => a + r.paidCents, 0)\nconst interest = res.reduce((a, r) => a + r.interestCents, 0)\ntotalInterest += interest\ndebts = debts.map((d) => ({ ...d, balanceCents: res.find((r) => r.id === d.id)!.balanceCents })).filter((d) => d.balanceCents > 0)\nif (debts.length === 0 && debtFree === null) debtFree = month\n\ncash += income - expense - goalPut - paid\nsetAside += goalPut\nconst debtTotal = debts.reduce((a, d) => a + d.balanceCents, 0)\nif (cash < 0 && firstShortfall === null) firstShortfall = month\nif (cash < lowest.cents) lowest = { month, cents: cash }",
  },
  forecastCases: {
    path: "FinanceTrackerApp/src/core/forecast.ts",
    lines: "125-132",
    code: "/** Runs the forecast three times: expected income, and irregular income at its poorer and better levels. */\nexport function projectForecast(input: ForecastInput): ForecastResult {\n  return {\n    expected: walk(input, (s) => s.monthlyCents),\n    low: walk(input, (s) => (s.kind === 'irregular' ? Math.min(s.lowCents, s.monthlyCents) : s.monthlyCents)),\n    high: walk(input, (s) => (s.kind === 'irregular' ? Math.max(s.highCents, s.monthlyCents) : s.monthlyCents))\n  }\n}",
  },
  stepDebts: {
    path: "FinanceTrackerApp/src/core/debtPlan.ts",
    lines: "51-68",
    code: "  const rows = balances.map((d) => {\n    const interest = d.balanceCents > 0 ? interestFor(d.balanceCents, d.aprBps) : 0\n    const owed = d.balanceCents + interest\n    const min = Math.min(owed, d.minPaymentCents)\n    return { id: d.id, aprBps: d.aprBps, balance: d.balanceCents, interest, owed, paid: min }\n  })\n  if (strategy !== 'minimum') {\n    let extra = Math.max(0, budgetCents - rows.reduce((s, r) => s + r.paid, 0))\n    const order = [...rows].filter((r) => r.owed > r.paid).sort((a, b) => (strategy === 'avalanche' ? b.aprBps - a.aprBps || a.owed - b.owed : a.owed - b.owed || b.aprBps - a.aprBps))\n    for (const r of order) {\n      if (extra <= 0) break\n      const add = Math.min(extra, r.owed - r.paid)\n      r.paid += add\n      extra -= add\n    }\n  }\n  return rows.map((r) => ({ id: r.id, paidCents: r.paid, interestCents: r.interest, balanceCents: r.owed - r.paid }))\n}",
  },
  pairTransfers: {
    path: "FinanceTrackerApp/src/db/transfers.ts",
    lines: "17-34",
    code: "for (const a of open) {\n  if (used.has(a.id)) continue\n  let best: (typeof open)[number] | undefined\n  let bestDist = Infinity\n  for (const b of byAmount.get(-a.c) ?? []) {\n    if (b.id === a.id || used.has(b.id) || b.acc === a.acc || b.c !== -a.c) continue\n    const dist = Math.abs(daysBetween(a.d, b.d))\n    if (dist <= 7 && dist < bestDist) { best = b; bestDist = dist }\n  }\n  if (best) {\n    used.add(a.id)\n    used.add(best.id)\n    const g = `xfer-${Math.min(a.id, best.id)}`\n    set.run(g, a.id)\n    set.run(g, best.id)\n    pairs++\n  }\n}",
  },
  restoreDatabase: {
    path: "FinanceTrackerApp/src/main/maintenance.ts",
    lines: "108-124",
    code: "export function restoreDatabase(backupsDir: string, name: string, target: string, saveCurrent: (file: string) => void, closeDb: () => void): { restored: string; safetyBackup: string } {\n  if (!BACKUP_NAME.test(name)) throw new Error('Choose a backup from the list.')\n  const source = path.join(backupsDir, name)\n  if (!fs.existsSync(source)) throw new Error('That backup no longer exists. Reload the list.')\n  const bad = backupProblem(source)\n  if (bad) throw new Error(bad)\n  const safety = path.join(backupsDir, `before-restore-${new Date().toISOString().replace(/[:.]/g, '-')}.db`)\n  saveCurrent(safety) // if this fails, nothing has been touched\n  const staged = `${target}.restoring`\n  try { fs.copyFileSync(source, staged) } catch (e) { fs.rmSync(staged, { force: true }); throw e } // nothing has been touched yet if this fails\n  closeDb()\n  try {\n    for (const ext of ['-wal', '-shm']) fs.rmSync(target + ext, { force: true }) // an old journal must never be applied to the restored file\n    fs.renameSync(staged, target) // replaces the current database in one step\n  } catch (e) { fs.rmSync(staged, { force: true }); throw e }\n  return { restored: name, safetyBackup: path.basename(safety) }\n}",
  },
  backupProblem: {
    path: "FinanceTrackerApp/src/main/maintenance.ts",
    lines: "91-102",
    code: "export function backupProblem(file: string): string | null {\n  let db: Database.Database | null = null\n  try {\n    db = new Database(file, { readonly: true, fileMustExist: true })\n    if (db.pragma('integrity_check', { simple: true }) !== 'ok') return 'That backup is damaged (its integrity check failed).'\n    const v = db.pragma('user_version', { simple: true }) as number\n    if (v < 1) return 'That file is not a backup made by this app.'\n    if (v > SCHEMA_VERSION) return 'That backup was made by a newer version of the app. Update the app first.'\n    if (!db.prepare(\"SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'profile'\").get()) return 'That file is not a backup made by this app.'\n    return null\n  } catch { return 'That backup could not be opened.' } finally { db?.close() }\n}",
  },
  autoBackup: {
    path: "FinanceTrackerApp/src/main/maintenance.ts",
    lines: "24-33",
    code: "export function autoBackupIfDue(dir: string, keep: number, today: string, make: (file: string) => void): string | null {\n  if (keep <= 0) return null\n  fs.mkdirSync(dir, { recursive: true })\n  const file = path.join(dir, `auto-${today}.db`)\n  let made: string | null = null\n  if (!fs.existsSync(file)) { make(file); made = file }\n  const autos = fs.readdirSync(dir).filter((f) => AUTO.test(f)).sort()\n  for (const f of autos.slice(0, Math.max(0, autos.length - keep))) fs.rmSync(path.join(dir, f), { force: true })\n  return made\n}",
  },
  hostileDispatch: {
    path: "FinanceTrackerApp/tests/audit-handlers.test.ts",
    lines: "94-108",
    code: "describe('the dispatcher only runs real handlers', () => {\n  // Was audit finding A-02: dispatch() looked the name up with handlers[method], so inherited members such as \"constructor\" and \"toString\" were callable.\n  for (const name of ['constructor', 'toString', 'isPrototypeOf']) {\n    it(`refuses the inherited object member \"${name}\"`, async () => {\n      const r = await dispatch(handlers, name, [])\n      expect(r.ok).toBe(false)\n    })\n  }\n  for (const name of ['__proto__', 'hasOwnProperty', 'valueOf']) {\n    it(`refuses the member \"${name}\"`, async () => {\n      const r = await dispatch(handlers, name, [])\n      expect(r.ok).toBe(false)\n    })\n  }\n})",
  },
  contrastTests: {
    path: "FinanceTrackerApp/tests/themes.test.ts",
    lines: "50-55",
    code: "for (const id of STYLE_IDS) {\n  it(`${id}: text, status colours, focus and chart colours pass the checks`, () => {\n    // Dark is kept exactly as it was; its blue and green series are the one pair that is close for tritanopia (4.0, as before)\n    expect(colourProblems(styleTokens(id, all), { cvdFloor: id === 'dark' ? 3.5 : 8 })).toEqual([])\n  })\n}",
  },
  noHandColours: {
    path: "FinanceTrackerApp/tests/themes.test.ts",
    lines: "79-93",
    code: "it('no page or component writes a colour by hand', () => {\n  const bad: string[] = []\n  const walk = (d: string) => {\n    for (const f of fs.readdirSync(d, { withFileTypes: true })) {\n      const p = path.join(d, f.name)\n      if (f.isDirectory()) walk(p)\n      else if (/\\.(tsx?)$/.test(f.name) && f.name !== 'themes.ts') {\n        const src = fs.readFileSync(p, 'utf8')\n        if (/#[0-9a-fA-F]{6}\\b|#[0-9a-fA-F]{3}\\b(?![0-9a-zA-Z])|rgba?\\(|hsla?\\(/.test(src.replace(/&#\\d+;/g, ''))) bad.push(path.relative(RENDERER, p))\n      }\n    }\n  }\n  walk(RENDERER)\n  expect(bad).toEqual([])\n})",
  },
  themeInit: {
    path: "FinanceTrackerApp/src/renderer/public/theme-init.js",
    lines: "1-9",
    code: "// Runs before the page is drawn (loaded from index.html, which the app's security policy only allows as a file, not inline),\n// so the saved style is in place from the first paint. Keep the list in step with src/renderer/themes.ts (a test checks this).\n(function () {\n  try {\n    var ids = ['light', 'dark', 'business', 'girlmath', 'programmer', 'cozy', 'casual', 'adhd']\n    var v = localStorage.getItem('theme')\n    if (ids.indexOf(v) !== -1) document.documentElement.setAttribute('data-theme', v)\n  } catch (e) { /* storage unavailable: the default look is used */ }\n})()",
  },
  chart: {
    path: "FinanceTrackerApp/src/renderer/components/Chart.tsx",
    lines: "36-53",
    code: "useEffect(() => {\n  if (!el.current) return\n  const chart = echarts.init(el.current, undefined, { renderer: 'canvas' })\n  const colors = readColors()\n  chart.setOption({ textStyle: { fontFamily: colors.font }, ...build(colors) })\n  if (clickable) {\n    chart.on('click', (p) => clickRef.current?.(String(p.name), { seriesName: String(p.seriesName ?? ''), dataIndex: p.dataIndex ?? 0 }))\n    chart.getZr().on('mousemove', (e) => { chart.getZr().setCursorStyle(e.target ? 'pointer' : 'default') })\n  }\n  const ro = new ResizeObserver(() => chart.resize())\n  ro.observe(el.current)\n  return () => {\n    ro.disconnect()\n    chart.dispose()\n  }\n}, [build, resolved, clickable])\n\nreturn <div ref={el} className=\"chart\" style={{ height }} role=\"img\" aria-label={label} />",
  },
  useKept: {
    path: "FinanceTrackerApp/src/renderer/nav.tsx",
    lines: "57-64",
    code: "/** Like useState, but the value comes back when the person returns to this page with the back button. */\nexport function useKept<T>(name: string, initial: T | (() => T)): [T, Dispatch<SetStateAction<T>>] {\n  const { entryId, store } = useContext(KeptContext)\n  const key = `${entryId}:${name}`\n  const [value, setValue] = useState<T>(() => (store.has(key) ? (store.get(key) as T) : typeof initial === 'function' ? (initial as () => T)() : initial))\n  useEffect(() => { store.set(key, value) }, [store, key, value])\n  return [value, setValue]\n}",
  },
  ciWorkflow: {
    path: "FinanceTrackerApp/.github/workflows/ci.yml",
    lines: "1-19",
    code: "name: CI\non:\n  push:\n    branches: [main]\n  pull_request:\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: 22\n          cache: npm\n      - run: npm ci\n      - run: npm run typecheck\n      - run: npm test\n      - run: npm run build",
  },
} as const;
