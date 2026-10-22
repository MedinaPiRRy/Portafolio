// Verbatim excerpts from Admin-Dashboard at commit 82a5a20.
// Generated from git by line range; do not edit by hand.
// Each excerpt carries its file path and line range so it can be checked against the source.
export const adminDashboardCommit = "82a5a20";

export const adminDashboardExcerpts = {
  authSplit: {
    path: "Admin-Dashboard/app/authconfig.js",
    lines: "1-20",
    code: "export const authConfig = {\n    providers:[],\n    pages: {\n      signIn: \"/login\",\n    },\n    callbacks: {\n      authorized({ auth, request }) {\n        const isLoggedIn = auth?.user;\n        const isOnDashboard = request.nextUrl.pathname.startsWith(\"/dashboard\");\n        const isHome = request.nextUrl.pathname === \"/\";\n        if (isOnDashboard || isHome) {\n          if (isLoggedIn) return true;\n          return false;\n        } else if (isLoggedIn) {\n          return Response.redirect(new URL(\"/dashboard\", request.nextUrl));\n        }\n        return true;\n      },\n    },\n  };",
  },
  authorize: {
    path: "Admin-Dashboard/auth.js",
    lines: "15-26",
    code: "async authorize(credentials) {\n    const { username, password } = credentials ?? {};\n    if (typeof username !== \"string\" || typeof password !== \"string\" || !username || !password) {\n        return null;\n    }\n\n    await connectToDB();\n    const user = await User.findOne({ username }).lean();\n    if (!user || user.isActive === false) return null;\n\n    const isPasswordCorrect = await bcrypt.compare(password, user.password);\n    if (!isPasswordCorrect) return null;",
  },
  deleteGuards: {
    path: "Admin-Dashboard/app/lib/actions.js",
    lines: "123-139",
    code: "let error = null;\ntry {\n    await connectToDB();\n    const user = await User.findById(id).select('username');\n    if (!user) {\n        error = 'notFound';\n    } else if (user.username === PROTECTED_USERNAME) {\n        error = 'protectedUser';\n    } else if (user.username === session.user.username) {\n        error = 'selfDelete';\n    } else {\n        await user.deleteOne();\n    }\n} catch (err) {\n    error = errorCode(err);\n}\nif (error) fail(listPath, error);",
  },
  errorCode: {
    path: "Admin-Dashboard/app/lib/actions.js",
    lines: "26-34",
    code: "// Maps a database error to one of the codes in ERROR_MESSAGES\nconst errorCode = (error, duplicateCode) => {\n    if (error?.code === 11000) return duplicateCode;\n    if (error?.name === 'ValidationError' || error?.name === 'CastError') return 'invalid';\n    console.error(error);\n    return 'failed';\n};\n\nconst fail = (path, code) => redirect(`${path}?error=${code}`);",
  },
  dailyOrders: {
    path: "Admin-Dashboard/app/lib/data.js",
    lines: "154-164",
    code: "const byDay = new Map(rows.map((r) => [r._id, r]));\n\nreturn Array.from({ length: days }, (_, i) => {\n    const date = new Date(start.getTime() + i * DAY);\n    const row = byDay.get(date.toISOString().slice(0, 10));\n    return {\n        name: date.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' }),\n        orders: row?.orders ?? 0,\n        revenue: Math.round(row?.revenue ?? 0),\n    };\n});",
  },
  weeklyAggregate: {
    path: "Admin-Dashboard/app/lib/data.js",
    lines: "109-120",
    code: "Order.aggregate([\n    { $match: { status: 'done' } },\n    {\n        $group: {\n            _id: null,\n            total: { $sum: '$amount' },\n            orders: { $sum: 1 },\n            thisWeek: { $sum: { $cond: [{ $gte: ['$createdAt', weekStart] }, '$amount', 0] } },\n            prevWeek: { $sum: { $cond: [{ $and: [{ $gte: ['$createdAt', prevWeekStart] }, { $lt: ['$createdAt', weekStart] }] }, '$amount', 0] } },\n        },\n    },\n]),",
  },
  usersQuery: {
    path: "Admin-Dashboard/app/lib/data.js",
    lines: "27-37",
    code: "export const getUsers = async (q = '', page = 1) => {\n    await connectToDB();\n    const regex = new RegExp(escapeRegex(q), 'i');\n    const filter = { $or: [{ username: regex }, { email: regex }] };\n\n    const [count, users] = await Promise.all([\n        User.countDocuments(filter),\n        User.find(filter, '-password').sort({ createdAt: -1, _id: 1 }).skip(paginate(page)).limit(ITEMS_PER_PAGE).lean(),\n    ]);\n    return { users: users.map(toPlain), count };\n};",
  },
  usersPage: {
    path: "Admin-Dashboard/app/dashboard/users/page.jsx",
    lines: "68-86",
    code: "const UsersPage = async (props) => {\n\n   const searchParams = await props.searchParams;\n   const q = searchParams?.q || \"\";\n   const page = searchParams?.page || \"1\";\n\n   return (\n      <div className={Styles.container}>\n         <Notice error={searchParams?.error} />\n         <div className={Styles.top}>\n            <Search placeholder=\"Search by username or email\" />\n            <Link href=\"/dashboard/users/add\">\n               <button className={Styles.addButton}>Add New</button>\n            </Link>\n         </div>\n         <Suspense key={`${q}|${page}`} fallback={<p className={Common.loading} role=\"status\">Loading...</p>}>\n            <UsersTable q={q} page={page} />\n         </Suspense>\n      </div>",
  },
  search: {
    path: "Admin-Dashboard/app/(ui)/dashboard/search/search.jsx",
    lines: "13-26",
    code: "const handleSearch = useDebouncedCallback((e) => {\n   const params = new URLSearchParams(searchParams);\n   params.set('page', '1');\n   params.delete('error');\n   params.delete('success');\n\n   const value = e.target.value.trim();\n   if (value) {\n      params.set('q', value);\n   } else {\n      params.delete('q');\n   }\n   replace(`${pathName}?${params.toString()}`);\n},300);",
  },
  notice: {
    path: "Admin-Dashboard/app/(ui)/dashboard/common/notice.jsx",
    lines: "5-14",
    code: "const Notice = ({ error, success }) => {\n   const message = error ? ERROR_MESSAGES[error] || ERROR_MESSAGES.failed : SUCCESS_MESSAGES[success];\n   if (!message) return null;\n\n   return (\n      <div role={error ? 'alert' : 'status'} className={`${Styles.notice} ${error ? Styles.error : Styles.success}`}>\n         {message}\n      </div>\n   );\n};",
  },
  seedRandom: {
    path: "Admin-Dashboard/scripts/sample-data.mjs",
    lines: "99-106",
    code: "// Deterministic pseudo-random numbers, so every seed run produces the same orders.\nexport const makeRandom = (seed = 2026) => {\n  let state = seed;\n  return () => {\n    state = (state * 1664525 + 1013904223) % 4294967296;\n    return state / 4294967296;\n  };\n};",
  },
  connectCache: {
    path: "Admin-Dashboard/app/lib/utils.js",
    lines: "3-20",
    code: "// Cache the connection across hot reloads / serverless invocations\nconst cached = globalThis._mongoose || (globalThis._mongoose = { conn: null, promise: null });\n\nexport const connectToDB = async () => {\n    if (!process.env.DB_URL) {\n        throw new Error(\"DB_URL environment variable is not set\");\n    }\n    if (cached.conn) return cached.conn;\n\n    try {\n        cached.promise = cached.promise || mongoose.connect(process.env.DB_URL);\n        cached.conn = await cached.promise;\n        return cached.conn;\n    } catch (error) {\n        cached.promise = null;\n        throw error;\n    }\n};",
  },
} as const;
