# longcelot-sheet-db — Improvement Tracking

Discovered while building the bEasy admin portal.

---

## ✅ Fixed in v0.1.16

| # | Item |
|---|---|
| 1 | OAuth scopes — shipped `createLoginOAuthManager` with `openid email profile` |
| 2 | Built-in auth routes — shipped `createAuthRouter` with `registrationPolicy` |
| 3 | Seed duplicates — shipped `--skip-existing` and `--upsert` flags |
| 4 | No `upsert()` in CRUD — shipped `ctx.table().upsert()` |
| 5 | CLI sync blocks CI — shipped `sync --token-file <path>` |
| 6 | No `createMany()` — shipped `ctx.table().createMany([...])` |
| 7 | Seed file not dynamic-friendly — seed files now accept `async function(env)` |
| 8 | No `count()` aggregate — shipped `ctx.table().count({ where })` |

---

## ✅ Fixed in v0.1.17

| # | Item |
|---|---|
| 1 | `sync` now appends missing column headers to existing tabs — reads row-1 headers, diffs against schema, appends any missing (purely additive, existing data untouched) |

---

## 🗺️ Owner Roadmap (not yet shipped)

| Item | Priority |
|---|---|
| NestJS guard / middleware variant of `createAuthRouter` | Medium |
| Service account alternative for CI (no tokens file needed) | Medium |
| `invite-only` registration policy (user must exist with `status: 'invited'`) | Future |
| CLI `--env` flag to pass individual env vars to dynamic seed files | Future |
| `adapter.join()` — query across multiple actor sheets in memory | Medium |

---

## 🐛 Open Bugs (discovered during testing)

_No open bugs._
