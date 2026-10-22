// Verbatim excerpts from ScentWardrobe at commit 5c822ef.
// Generated from git by line range; do not edit by hand.
// Each excerpt carries its file path and line range so it can be checked against the source.
export const scentWardrobeCommit = "5c822ef";

export const scentWardrobeExcerpts = {
  ipcChannels: {
    path: "ScentWardrobe/src/shared/ipc.ts",
    lines: "191-196",
    code: "/** Channel names such as `fragrances:list`, derived from the promise-returning methods of `Api`. */\nexport type ChannelName = {\n  [G in keyof Api & string]: {\n    [M in keyof Api[G] & string]: Api[G][M] extends (...a: never[]) => Promise<unknown> ? `${G}:${M}` : never\n  }[keyof Api[G] & string]\n}[keyof Api & string]",
  },
  ipcRecord: {
    path: "ScentWardrobe/src/main/ipc.ts",
    lines: "66-70",
    code: "export function registerIpc(db: Db, dbPath: string): void {\n  const paths = { dbPath, imagesDir: join(app.getPath('userData'), 'images') }\n  const handlers: Record<ChannelName, (...args: any[]) => unknown> = {\n    'app:dbInfo': () => dbInfo(db, dbPath),\n    'app:paths': () => appPaths(paths),",
  },
  ipcHandlers: {
    path: "ScentWardrobe/src/main/ipc.ts",
    lines: "243-249",
    code: "for (const [channel, fn] of Object.entries(handlers)) {\n  ipcMain.handle(channel, (event, ...args) => {\n    // Only the app's own page may call the main process, never a web page or a pop-up.\n    if (!isTrustedSender(event.senderFrame?.url ?? '', process.env['ELECTRON_RENDERER_URL'])) throw new Error('Request refused: untrusted sender.')\n    return fn(...args)\n  })\n}",
  },
  preloadApi: {
    path: "ScentWardrobe/src/preload/index.ts",
    lines: "4-13",
    code: "const call =\n  (channel: string) =>\n  (...args: unknown[]) =>\n    ipcRenderer.invoke(channel, ...args)\n\nconst c = <T>(channel: string) => call(channel) as T\n\nconst api: Api = {\n  app: { dbInfo: c('app:dbInfo'), paths: c('app:paths'), openDataFolder: c('app:openDataFolder') },\n  backup: { list: c('backup:list'), create: c('backup:create'), exportAs: c('backup:exportAs'), restore: c('backup:restore'), openFolder: c('backup:openFolder') },",
  },
  trustedSender: {
    path: "ScentWardrobe/src/main/security.ts",
    lines: "28-41",
    code: "/**\n * True for the app's own page: the packaged file:// page, or the dev server's origin when running `npm run dev`.\n * `devUrl` is only set in development (electron-vite).\n */\nexport function isTrustedSender(frameUrl: string, devUrl?: string): boolean {\n  if (devUrl) {\n    try {\n      return new URL(frameUrl).origin === new URL(devUrl).origin\n    } catch {\n      return false\n    }\n  }\n  return /^file:\\/\\/\\/.*\\/renderer\\/index\\.html(?:[?#].*)?$/i.test(frameUrl)\n}",
  },
  webPreferences: {
    path: "ScentWardrobe/src/main/index.ts",
    lines: "39-44",
    code: "webPreferences: {\n  preload: join(__dirname, '../preload/index.js'),\n  contextIsolation: true,\n  nodeIntegration: false,\n  sandbox: true\n}",
  },
  navigationLock: {
    path: "ScentWardrobe/src/main/index.ts",
    lines: "50-57",
    code: "// The app window never navigates away or opens new windows; external links go to the browser.\nwin.webContents.setWindowOpenHandler(({ url }) => {\n  if (/^https?:\\/\\//.test(url)) void shell.openExternal(url)\n  return { action: 'deny' }\n})\nwin.webContents.on('will-navigate', (e, url) => {\n  if (url !== win.webContents.getURL()) e.preventDefault()\n})",
  },
  migrationRunner: {
    path: "ScentWardrobe/src/main/db/migrations.ts",
    lines: "342-357",
    code: "export function runMigrations(db: Database.Database, list: Migration[] = migrations): number {\n  let version = currentVersion(db)\n  const newest = list.reduce((n, m) => Math.max(n, m.version), 0)\n  if (version > newest) {\n    // Data written by a newer version of the app: opening it here could damage it.\n    throw new Error(`This data file was made by a newer version of Scent Wardrobe (data version ${version}, this app understands up to ${newest}). Install the latest version of the app.`)\n  }\n  for (const m of list.filter((x) => x.version > version).sort((a, b) => a.version - b.version)) {\n    db.transaction(() => {\n      db.exec(m.sql)\n      db.pragma(`user_version = ${m.version}`)\n    })()\n    version = m.version\n  }\n  return version\n}",
  },
  wishlistTrigger: {
    path: "ScentWardrobe/src/main/db/migrations.ts",
    lines: "157-163",
    code: "-- Wishlist rule, enforced in the database as a last line of defence (the API checks it first).\nCREATE TRIGGER wishlist_needs_impression_insert\nBEFORE INSERT ON wardrobe_items\nWHEN NEW.wardrobe = 'wishlist' AND NOT EXISTS (\n  SELECT 1 FROM smell_impression WHERE fragrance_id = NEW.fragrance_id AND length(trim(text)) > 0\n)\nBEGIN SELECT RAISE(ABORT, 'WISHLIST_IMPRESSION_REQUIRED'); END;",
  },
  scoreBudget: {
    path: "ScentWardrobe/src/shared/layering/engine.ts",
    lines: "16-26",
    code: "// Score budget, in points around a neutral 50.\nconst AFFINITY_POINTS = 35\nconst AFFINITY_GAIN = 4\nconst NOTES_MAX = 10\nconst COMPETITION_MAX = 14\nconst REDUNDANCY_MAX = 22\nconst SEASON_POINTS = 8\nconst TASTE_MAX = 12\n\nexport const VERDICT_GREAT = 78\nexport const VERDICT_WORTH_TESTING = 58",
  },
  pairScore: {
    path: "ScentWardrobe/src/shared/layering/engine.ts",
    lines: "240-255",
    code: "// 5. seasons\nconst sea = seasonScore(A, B)\nreasons.push(...sea.reasons.map((r) => ({ ...r, text: tag(r.text) })))\n\n// 6. learned taste\nconst taste = tasteAdjustment(A, B, opts.history)\nif (Math.abs(taste.points) >= 1.5 && taste.strongest) {\n  reasons.push({\n    kind: 'taste',\n    impact: round1(taste.points),\n    text: tag(taste.points > 0 ? `You rated a similar pairing ${taste.strongest.rating}/10 before.` : `You rated a similar pairing only ${taste.strongest.rating}/10 before.`)\n  })\n}\n\nconst score = clamp(50 + affPoints + nb.points - competition - redundancy + sea.points + taste.points, 0, 100)\nreturn { a: A.id, b: B.id, ai: 0, bi: 0, score, reasons, redundancy }",
  },
  tasteLearning: {
    path: "ScentWardrobe/src/shared/layering/engine.ts",
    lines: "181-195",
    code: "for (const combo of history) {\n  const vecs = combo.items.map((i) => toVec(i.accords))\n  for (let i = 0; i < vecs.length; i++) {\n    for (let j = i + 1; j < vecs.length; j++) {\n      const sim = Math.max((cosine(a, vecs[i]) + cosine(b, vecs[j])) / 2, (cosine(a, vecs[j]) + cosine(b, vecs[i])) / 2)\n      if (sim < 0.6) continue\n      const hit: TasteHit = { weight: sim * sim, resid: (combo.rating - 5.5) / 4.5, rating: combo.rating }\n      weighted += hit.weight * hit.resid\n      weights += hit.weight\n      if (!strongest || hit.weight > strongest.weight) strongest = hit\n    }\n  }\n}\n// The +0.5 keeps a single data point from swinging the score as much as several would.\nreturn { points: weights > 0 ? clamp((weighted / (weights + 0.5)) * TASTE_MAX, -TASTE_MAX, TASTE_MAX) : 0, strongest }",
  },
  competition: {
    path: "ScentWardrobe/src/shared/layering/engine.ts",
    lines: "226-233",
    code: "// 3. two loud fragrances competing\nconst wa = weightOf(x)\nconst wb = weightOf(y)\nconst shareA = wa + wb > 0 ? wa / (wa + wb) : 0.5\n// Only clearly strong projectors count as loud: an average one (2.5) does not compete.\nconst loud = (p: number | null | undefined) => clamp((clamp(p ?? DEFAULT_PROJECTION, 1, 4) - 2.5) / 1.5, 0, 1)\nconst competition = COMPETITION_MAX * Math.min(loud(A.projection), loud(B.projection)) * (1 - Math.abs(2 * shareA - 1))\nif (competition >= 3) reasons.push({ kind: 'competition', impact: -round1(competition), text: tag(`Both are strong projectors at similar strength, so they compete for attention. Spray one less.`) })",
  },
  recommendScore: {
    path: "ScentWardrobe/src/shared/recommend/engine.ts",
    lines: "132-146",
    code: "add('season', `Suits ${season}`, seasonFit(item, season), WEIGHTS.season)\nadd('daynight', `Fits the ${ctx.timeOfDay}`, dayNightFit(item, ctx.timeOfDay), WEIGHTS.daynight)\nadd('temperature', `Right for ${Math.round(tempC)} °C`, temperatureFit(item, tempC), WEIGHTS.temperature)\nadd('humidity', `Handles ${Math.round(humidity)}% humidity`, humidityFit(item, humidity), WEIGHTS.humidity)\nadd('activity', `Fits ${ctx.activity || 'the occasion'}`, activityFit(item, profile).fit, WEIGHTS.activity)\nadd('longevity', 'Lasts long enough', longevityFit(item, profile.longevityNeed), WEIGHTS.longevity)\n\nconst days = daysSince(item.lastWornAt, ctx.now)\nconst rot = rotationPoints(days, item.wearsLast7Days ?? 0)\nconst rate = ratingPoints(item.rating)\nlines.push({ key: 'rotation', label: days === null ? 'Never worn yet' : `Worn ${days === 0 ? 'today' : `${days} day${days === 1 ? '' : 's'} ago`}`, fit: null, points: round1(rot) })\nif (rate !== 0) lines.push({ key: 'rating', label: `Rated ${item.rating}/10`, fit: null, points: round1(rate) })\n\nconst raw = lines.reduce((s, l) => s + l.points, 0)\nconst score = clamp(Math.round(raw), 0, 100)",
  },
  rotation: {
    path: "ScentWardrobe/src/shared/recommend/engine.ts",
    lines: "111-120",
    code: "/** Points for variety: recently worn fragrances lose points, ones left alone for a while gain a few. */\nexport function rotationPoints(days: number | null, wearsLast7Days = 0): number {\n  if (days === null) return 3 // never worn: gently encourage trying it\n  const recent = [-14, -10, -6, -3][days] ?? 0\n  const boost = days >= 30 ? 4 : days >= 14 ? 2 : 0\n  return recent + boost - Math.max(wearsLast7Days - 1, 0) * 2\n}\n\n/** My rating only breaks ties: at most +-2 points. */\nexport const ratingPoints = (rating: number | null | undefined): number => (rating == null ? 0 : clamp(((rating - 5.5) / 4.5) * 2, -2, 2))",
  },
  restoreEntry: {
    path: "ScentWardrobe/src/main/backupCore.ts",
    lines: "136-143",
    code: "if (name.endsWith('/')) return done()\nconst isImage = name.startsWith(IMAGE_PREFIX)\n// Never trust paths from an archive: only the three known kinds of entry are read, and pictures only under the\n// names the app itself gives them (16 hex digits and .png), always flattened into the images folder.\nconst target = name === DB_ENTRY ? dbFile : name === MANIFEST_ENTRY ? join(dir, MANIFEST_ENTRY) : isImage && isStoredImageName(basename(name)) ? join(imagesDir, basename(name)) : null\nif (!target) return done()\nconst cap = name === DB_ENTRY ? limits.dbBytes : name === MANIFEST_ENTRY ? limits.manifestBytes : limits.imageBytes\nif (entry.uncompressedSize > cap) return reject(new BackupError('This archive contains a file that is far larger than a backup should have.'))",
  },
  integrityCheck: {
    path: "ScentWardrobe/src/main/backupCore.ts",
    lines: "155-167",
    code: "const manifestFile = join(dir, MANIFEST_ENTRY)\nif (!gotDb || !existsSync(manifestFile)) throw new BackupError('This zip is not a Scent Wardrobe backup.')\nmanifest = JSON.parse(readFileSync(manifestFile, 'utf8')) as Manifest\nif (manifest.format !== BACKUP_FORMAT) throw new BackupError('This zip is not a Scent Wardrobe backup.')\nif (manifest.schemaVersion > latestSchema()) throw new BackupError('This backup was made by a newer version of Scent Wardrobe. Update the app first.')\n\nconst check = new Database(dbFile, { readonly: true })\ntry {\n  const result = check.pragma('integrity_check', { simple: true })\n  if (result !== 'ok') throw new BackupError('The database inside this backup is damaged.')\n} finally {\n  check.close()\n}",
  },
  swapRestore: {
    path: "ScentWardrobe/src/main/backupCore.ts",
    lines: "200-204",
    code: "// Copy first, then swap: if the copy fails (disk full), the current database is still there.\nconst incoming = `${paths.dbPath}.restoring`\ncopyFileSync(prepared.dbFile, incoming)\nfor (const ext of ['-wal', '-shm']) rmSync(paths.dbPath + ext, { force: true })\nrenameSync(incoming, paths.dbPath)",
  },
  partialRename: {
    path: "ScentWardrobe/src/main/backupCore.ts",
    lines: "79-83",
    code: "mkdirSync(join(destZip, '..'), { recursive: true })\nconst partial = `${destZip}.partial`\nawait pipeline(zip.outputStream, createWriteStream(partial))\nrenameSync(partial, destZip) // a half-written backup never has the real name\nreturn { path: destZip, bytes: statSync(destZip).size, manifest }",
  },
  scrapeWindow: {
    path: "ScentWardrobe/src/main/fragrantica/scrapeWindow.ts",
    lines: "22-35",
    code: "  webPreferences: { sandbox: true, contextIsolation: true, nodeIntegration: false, partition: 'persist:fragrantica', backgroundThrottling: false }\n})\nwin.setIgnoreMouseEvents(true)\nconst wc = win.webContents\nwc.setWindowOpenHandler(() => ({ action: 'deny' }))\nconst httpsOnly = (e: { preventDefault(): void }, url: string) => {\n  if (!url.startsWith('https://')) e.preventDefault()\n}\nwc.on('will-navigate', httpsOnly)\nwc.on('will-redirect', httpsOnly)\nwc.on('will-attach-webview', (e) => e.preventDefault())\nwc.session.setPermissionRequestHandler((_wc, _perm, cb) => cb(false))\nwc.session.setPermissionCheckHandler(() => false)\nreturn win",
  },
  imageAllow: {
    path: "ScentWardrobe/src/main/security.ts",
    lines: "14-23",
    code: "export function isAllowedImageUrl(raw: string): boolean {\n  try {\n    const u = new URL(raw)\n    if (u.protocol !== 'https:' || u.username || u.password || (u.port && u.port !== '443')) return false\n    const h = u.hostname.toLowerCase()\n    return IMAGE_HOSTS.some((d) => h === d || h.endsWith(`.${d}`)) || isFragranticaHost(h)\n  } catch {\n    return false\n  }\n}",
  },
  deduct: {
    path: "ScentWardrobe/src/main/db/wears.ts",
    lines: "53-61",
    code: "function deduct(db: Db, wearId: number, bottle: BottleRow, sprays: number): { before: number; after: number; ml: number } {\n  const ml = Math.min(sprays * bottle.ml_per_spray, bottle.remaining_ml)\n  const after = Math.max(bottle.remaining_ml - ml, 0)\n  if (ml > 0) {\n    db.prepare('INSERT INTO wear_deductions (wear_id, bottle_id, ml) VALUES (?, ?, ?) ON CONFLICT DO UPDATE SET ml = ml + excluded.ml').run(wearId, bottle.id, ml)\n  }\n  db.prepare(`UPDATE bottles SET remaining_ml = ?, status = CASE WHEN ? <= 0.0001 THEN 'empty' ELSE status END WHERE id = ?`).run(after, after, bottle.id)\n  return { before: bottle.remaining_ml, after, ml }\n}",
  },
  escapeStack: {
    path: "ScentWardrobe/src/renderer/src/lib/dialog.ts",
    lines: "7-18",
    code: "const stack: { id: number; handler: () => void }[] = []\nlet nextId = 1\nlet listening = false\n\nfunction onKey(e: KeyboardEvent): void {\n  if (e.key !== 'Escape' || e.defaultPrevented) return\n  const top = stack[stack.length - 1]\n  if (top) {\n    e.preventDefault()\n    top.handler()\n  }\n}",
  },
  bottleHeight: {
    path: "ScentWardrobe/src/renderer/src/lib/shelf.ts",
    lines: "25-29",
    code: "/** 2 ml sample -> short, 200 ml -> tall, on a log scale so mid sizes stay distinguishable. */\nexport function bottleHeightPx(sizeMl: number, min = 84, max = 176): number {\n  const t = (Math.log(Math.min(Math.max(sizeMl, 2), 200)) - Math.log(2)) / (Math.log(200) - Math.log(2))\n  return Math.round(min + (max - min) * t)\n}",
  },
  migrationChainTest: {
    path: "ScentWardrobe/src/main/db/migrationChain.test.ts",
    lines: "27-36",
    code: "describe.each(migrations.map((m) => m.version))('a database created at schema version %i', (start) => {\n  it('upgrades to the current version without losing anything', () => {\n    const db = new Database(':memory:')\n    db.pragma('foreign_keys = ON')\n    runMigrations(db, migrations.filter((m) => m.version <= start))\n    expect(db.pragma('user_version', { simple: true })).toBe(start)\n    seed(db)\n\n    expect(runMigrations(db)).toBe(latest)\n    expect(db.pragma('user_version', { simple: true })).toBe(latest)",
  },
  ciWorkflow: {
    path: "ScentWardrobe/.github/workflows/ci.yml",
    lines: "11-30",
    code: "jobs:\n  test:\n    name: Typecheck and tests (${{ matrix.os }})\n    runs-on: ${{ matrix.os }}\n    strategy:\n      fail-fast: false\n      matrix:\n        os: [windows-latest, macos-14]\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: 22\n          cache: npm\n      # postinstall rebuilds better-sqlite3 for Electron (the tests run under Electron's Node)\n      - run: npm ci\n      - run: npm run typecheck\n      - run: npm test\n      - name: Production build\n        run: npx electron-vite build",
  },
  testRunner: {
    path: "ScentWardrobe/scripts/test.mjs",
    lines: "1-14",
    code: "// better-sqlite3 is compiled for Electron's ABI, so run Vitest under Electron's Node runtime.\nimport { spawnSync } from 'node:child_process'\nimport { createRequire } from 'node:module'\nimport { dirname, join } from 'node:path'\n\nconst require = createRequire(import.meta.url)\nconst electron = require('electron')\nconst vitest = join(dirname(require.resolve('vitest/package.json')), 'vitest.mjs')\nconst args = process.argv.slice(2)\nconst r = spawnSync(electron, [vitest, ...(args.length ? args : ['run'])], {\n  stdio: 'inherit',\n  env: { ...process.env, ELECTRON_RUN_AS_NODE: '1' }\n})\nprocess.exit(r.status ?? 1)",
  },
  mutedFloor: {
    path: "ScentWardrobe/src/renderer/src/index.css",
    lines: "37-46",
    code: "/*\n * Muted text. Components dim text with text-cream/NN; anything fainter than the floor would fail WCAG AA contrast (4.5:1),\n * so it is raised to the floor of the current theme (checked against the panel colours of both themes).\n */\n:root {\n  --muted-floor: 60%;\n}\n:root[data-theme='light'] {\n  --muted-floor: 72%;\n}",
  },
} as const;
