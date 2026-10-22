// Verbatim excerpts from the private GOAT'eez repository at commit 85e8075.
// Generated from git by line range; do not edit by hand.
// Each excerpt carries its file path and line range so it can be checked against the source.
export const goateezCommit = "85e8075";

export const excerpts = {
  webhookOrder: {
    path: "goateez-angular/backend/src/app.js",
    lines: "58-69",
    code: "// --- Stripe webhook: RAW body, BEFORE express.json(). ---\n// No CSRF/auth — it's Stripe calling, authenticated by signature.\napp.post(\n  '/api/checkout/webhook',\n  express.raw({ type: 'application/json' }),\n  asyncHandler(handleStripeWebhook)\n);\n\n// NOTE: 25mb retained to preserve current behavior (designs currently\n// ride as base64 in JSON). Shrinks in Phase 6 once images move to\n// Supabase Storage.\napp.use(express.json({ limit: '25mb' }));",
  },
  refreshRotation: {
    path: "goateez-angular/backend/src/modules/auth/auth.service.js",
    lines: "78-95",
    code: "// Reuse detection: a revoked token being presented again means either\n// a stolen token replay or a double-submit. Burn the whole family.\nif (stored.revoked_at !== null) {\n  await refreshTokens.revokeFamily(stored.family_id);\n  throw new ApiError(401, 'Refresh token reuse detected. Please log in again.');\n}\n\nif (new Date(stored.expires_at) <= new Date()) {\n  throw new ApiError(401, 'Refresh token expired. Please log in again.');\n}\n\nconst user = await users.findById(stored.user_id);\nif (!user) {\n  throw new ApiError(401, 'User no longer exists.');\n}\n\n// Rotate: revoke the old token, mint a new one in the SAME family.\nawait refreshTokens.revokeById(stored.id);",
  },
  csrf: {
    path: "goateez-angular/backend/src/middleware/csrf.js",
    lines: "21-33",
    code: "const SAFE = new Set(['GET', 'HEAD', 'OPTIONS']);\n\nexport function csrfProtection(req, res, next) {\n  if (SAFE.has(req.method)) return next();\n\n  const cookieToken = req.cookies?.[cookieNames.csrf];\n  const headerToken = req.get('X-CSRF-Token');\n\n  if (!cookieToken || !headerToken || cookieToken !== headerToken) {\n    return next(new ApiError(403, 'CSRF validation failed.'));\n  }\n  next();\n}",
  },
  unitPrice: {
    path: "goateez-angular/backend/src/modules/checkout/pricing.js",
    lines: "25-30",
    code: "/** Per-shirt unit price for a given total quantity in one design. */\nexport function unitPriceFor(qty) {\n  if (qty >= 10) return PRICING.TIER_10_PRICE;\n  if (qty >= 3) return PRICING.TIER_3_PRICE;\n  return PRICING.FULL_PRICE;\n}",
  },
  markPaid: {
    path: "goateez-angular/backend/src/repositories/orders.repository.js",
    lines: "88-98",
    code: "export async function markPaid(id) {\n  const [order] = await sql`\n    UPDATE orders\n    SET status = 'payment_received',\n        ordered_at = NOW(),\n        updated_at = NOW()\n    WHERE id = ${id} AND status = 'pending_payment'\n    RETURNING *\n  `;\n  return order;\n}",
  },
  recordPayment: {
    path: "goateez-angular/backend/src/repositories/payments.repository.js",
    lines: "30-41",
    code: "const [row] = await sql`\n  INSERT INTO payments (\n    order_id, payment_gateway, gateway_txn_id, gateway_intent_id,\n    amount, currency, status, payment_method_type, paid_at\n  ) VALUES (\n    ${orderId}, 'stripe', ${gatewayTxnId}, ${gatewayIntentId ?? null},\n    ${amount}, ${currency}, 'succeeded', ${paymentMethodType ?? null}, NOW()\n  )\n  ON CONFLICT (gateway_txn_id) DO NOTHING\n  RETURNING *\n`;\nreturn row; // undefined if it already existed",
  },
  serializeZone: {
    path: "goateez-angular/src/assets/js/designer.js",
    lines: "73-88",
    code: "const DESIGN_PROPS = ['selectable', 'evented', '_isUserObject', '_userImage', '_fileName', '_storageKey'];\n\nfunction serializeZone(zone) {\n  const canvas = canvases[zone];\n  if (!canvas) return null;\n  const bg = canvas._bgCount || 0;\n  const userObjects = canvas.getObjects().slice(bg);\n  if (userObjects.length === 0) return null;\n  return {\n    objects: userObjects.map(o => {\n      const obj = o.toObject(DESIGN_PROPS);\n      if (obj.type === 'image' && obj._storageKey) obj.src = '';\n      return obj;\n    }),\n  };\n}",
  },
  refreshToken: {
    path: "goateez-angular/backend/src/utils/tokens.js",
    lines: "46-61",
    code: "export function generateRefreshToken() {\n  const raw = crypto.randomBytes(48).toString('hex');\n  const hash = hashRefreshToken(raw);\n  const expiresAt = new Date(\n    Date.now() + env.auth.refreshTtlDays * 24 * 60 * 60 * 1000\n  );\n  return { raw, hash, expiresAt };\n}\n\n/**\n * Hash a raw refresh token for storage/lookup (SHA-256).\n * Deterministic so we can look a token up by its hash.\n */\nexport function hashRefreshToken(raw) {\n  return crypto.createHash('sha256').update(raw).digest('hex');\n}",
  },
  signWebhook: {
    path: "goateez-angular/backend/scripts/testPhase3.js",
    lines: "62-70",
    code: "function signStripePayload(payload, secret) {\n  // Mirrors Stripe's scheme: signed_payload = \"{t}.{body}\", HMAC-SHA256.\n  const t = Math.floor(Date.now() / 1000);\n  const body = JSON.stringify(payload);\n  const sig = crypto\n    .createHmac('sha256', secret)\n    .update(`${t}.${body}`)\n    .digest('hex');\n  return { header: `t=${t},v1=${sig}`, body };",
  },
  idempotencyTest: {
    path: "goateez-angular/backend/scripts/testPhase3.js",
    lines: "146-155",
    code: "// 4. Idempotency: deliver the SAME event again.\nconst dup = signStripePayload(event, env.stripeWebhookSecret);\nconst wh2 = await fetch(`${base}/api/checkout/webhook`, {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json', 'Stripe-Signature': dup.header },\n  body: dup.body,\n});\nassert(wh2.status === 200, 'duplicate webhook still returns 200');\nconst pays2 = await sql`SELECT * FROM payments WHERE order_id = ${orderId}`;\nassert(pays2.length === 1, 'no duplicate payment row (idempotent)');",
  },
  rlsCheck: {
    path: "goateez-angular/backend/scripts/test-sec-rls-lockdown.js",
    lines: "81-87",
    code: "// Checks ALL public tables, including ones added after this script was written.\nconst unprotected = await sql`\n  select tablename from pg_tables\n  where schemaname = 'public' and rowsecurity = false\n  order by tablename`;\nif (unprotected.length === 0) ok('all public tables have RLS enabled');\nelse bad(`RLS still OFF on: ${unprotected.map((r) => r.tablename).join(', ')}`);",
  },
  roleGuard: {
    path: "goateez-angular/backend/src/modules/admin/admin.controller.js",
    lines: "378-385",
    code: "export async function updateUserRole(req, res) {\n  const target = await users.findById(req.params.id);\n  if (!target) throw new ApiError(404, 'User not found.');\n\n  // Guard: a superadmin cannot demote themselves (avoid lockout).\n  if (req.params.id === req.user.id && req.body.role !== 'superadmin') {\n    throw new ApiError(400, 'You cannot change your own superadmin role.');\n  }",
  },
  cacheRules: {
    path: "goateez-angular/src/server.ts",
    lines: "37-52",
    code: "const HASHED_FILE = /-[A-Z0-9]{8}\\.(?:js|mjs|css)$/;\n\napp.use(\n  express.static(browserDistFolder, {\n    index: false,\n    redirect: false,\n    setHeaders(res, filePath) {\n      const normalized = filePath.replace(/\\\\/g, '/');\n      if (HASHED_FILE.test(normalized) || normalized.includes('/media/')) {\n        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');\n      } else {\n        res.setHeader('Cache-Control', 'no-cache');\n      }\n    },\n  }),\n);",
  },
  resetPassword: {
    path: "goateez-angular/backend/src/modules/account-security/accountSecurity.service.js",
    lines: "94-106",
    code: "export async function resetPassword(rawToken, newPassword) {\n  const row = await userTokens.findValid(sha256(rawToken), 'password_reset');\n  if (!row) throw new ApiError(400, 'This reset link is invalid or has expired.');\n\n  const hash = await bcrypt.hash(newPassword, BCRYPT_COST);\n  await sql.begin(async (tx) => {\n    await tx`UPDATE users SET password_hash = ${hash}, updated_at = NOW() WHERE id = ${row.user_id}`;\n    // Revoke every session — anyone holding the old credentials is out.\n    await tx`UPDATE refresh_tokens SET revoked_at = NOW() WHERE user_id = ${row.user_id} AND revoked_at IS NULL`;\n    await tx`UPDATE user_tokens SET used_at = NOW() WHERE id = ${row.id}`;\n  });\n  return row.user_id;\n}",
  },
} as const;
