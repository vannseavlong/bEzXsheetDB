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

### 1. `sync` does not add new columns to existing tables

**Documented promise (CLI skill):**
> "Calls `syncSchema()` for every schema — creates missing tabs and **adds missing headers**"

**Actual behaviour:**
`syncSchema()` only adds headers when creating a **brand-new tab**. For tables that already exist, it does nothing — even when columns are added to the schema. Tested with both `onSchemaMismatch: 'warn'` and `'auto-sync'`; neither resolved it. The sync output reports "✅ synced" regardless, giving a false impression the sheet is current.

**Reproduction:**
1. Run `sync` on a fresh project — columns created correctly ✓
2. Add a new column to any existing schema
3. Run `sync` again — output says "✅ synced" but the new column header is **not** in the sheet ✗

**Impact:**
Developers have no package-provided path to push new columns onto existing sheets. The only current workaround is manually typing column headers in Google Sheets — which defeats the point of a schema-first tool.

**Suggested fix:**
When `syncSchema()` runs on an existing tab, read the current row-1 headers, diff against the schema column list, and append any that are missing. Purely additive — consistent with the existing "never deletes data" guarantee.
