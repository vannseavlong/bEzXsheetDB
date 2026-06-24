# longcelot-sheet-db — Improvement Tracking

Discovered while building the bEasy admin portal (used as the integration test bed for this package).

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

## ✅ Fixed in v0.1.20

All 5 items from the "Drive Architecture & File Upload" feature request were implemented.

| # | Item |
|---|---|
| 1 | Actor-owned sheets — `createUserSheet` accepts `{ actorTokens }` to create the sheet in the actor's own Drive, then shares with admin |
| 2 | Drive folder organisation — `driveFolder: { root, subfolders }` in `SheetAdapterConfig`; folder created on first use per role, cached |
| 3 | Pluggable file upload — `StorageAdapter` interface + built-in `DriveStorageAdapter`; `adapter.upload(buffer, options)` and `adapter.deleteFile(url)` |
| 4 | Per-actor `TokenStore` — `tokenStore` option on `createSheetAdapter`; adapter calls `tokenStore.get(userId)` in `createUserSheet` when `actorTokens` not passed directly |
| 5 | Shared Drive support — `sharedDriveId` option passes `supportsAllDrives: true` to all Drive calls |

**Breaking change:** `createUserSheet` 4th positional param changed from `extraFields` to `options?: CreateUserSheetOptions`. Migrate: `createUserSheet(id, role, email, { full_name })` → `createUserSheet(id, role, email, { extraFields: { full_name } })`

---

## ✅ Fixed in v0.1.21

All 6 items from the "CLI, Migration & RBAC Architecture" feedback (submitted 2026-06-21) were addressed.

| # | Item |
|---|---|
| 1 | `migrate` CLI renamed — `sheet-db export-data` now ships; `sheet-db migrate` is deprecated with an explanatory note |
| 2 | README and API.md aligned — README now documents `export --prisma` and `export --sql` as real, available commands |
| 3 | Schema-only vs schema+data export paths — "Which export command do I need?" decision table added to Migration Path section |
| 4 | `export-data --all-users` shipped — iterates all registered user sheets; `--dry-run` flag included |
| 5 | Actor vs Role conceptual explanation — "Actors vs Application Roles" table added to Core Concepts |
| 6 | Dev/prod parity gap documented — "Dev vs Production data model" section added with tip to use `mock-users` |

---

## 🗺️ Owner Roadmap (not yet shipped)

| Item | Priority |
|---|---|
| NestJS guard / middleware variant of `createAuthRouter` | Medium |
| Service account alternative for CI (no tokens file needed) | Medium |
| `invite-only` registration policy (user must exist with `status: 'invited'`) | Future |
| CLI `--env` flag to pass individual env vars to dynamic seed files | Future |
| `adapter.join()` — query across multiple actor sheets in memory | Medium |
| `createSQLAdapter` — production DB adapter (mentioned in README, no details yet) | High |
| `export --prisma` / `export --sql` — schema export to production formats | High |
| `migrate --all-users` — data migration across all registered user sheets | High |

---

## 🐛 Open Bugs

_(none currently)_

---

## 📬 Feature Request / Feedback — CLI, Migration & RBAC Architecture (submitted 2026-06-21)

Discovered while wiring the bEasy RBAC system end-to-end and evaluating the migration story for going to production.

---

### 1. `migrate` CLI is misnamed — industry standard says "migrate" means schema only

**Current behaviour:**
`sheet-db migrate` generates a script that **reads data out of Google Sheets** and calls a stub `insertRow()` function the caller fills in. It moves actual row data, not just table structure.

**Problem:**
In the industry, "database migration" universally means **schema changes only** — `CREATE TABLE`, `ALTER TABLE`, `ADD COLUMN`. This is what Prisma Migrate, Rails migrations, Flyway, and Liquibase all do. A developer coming from any of those tools will expect `sheet-db migrate` to output DDL, not a data copy script.

Moving actual row data from one DB to another is called a **data migration**, **ETL** (Extract, Transform, Load), or **data export/import** — never just "migrate".

**Requested change:**
Rename the command to something that reflects what it actually does:

| Current | Suggested | What it does |
|---|---|---|
| `sheet-db migrate` | `sheet-db export-data` or `sheet-db etl` | Generates a script that reads row data from Sheets and stubs an insert for the target DB |
| `sheet-db export --prisma/--sql` | Keep as-is | Exports table structure (DDL / Prisma schema) — the real "migration" |

Both capabilities are valuable and should exist. The naming just needs to reflect the distinction.

---

### 2. README and API.md contradict each other on `export --prisma/--sql`

**Current behaviour:**
- `README.md` (Migration Path section) marks `export --prisma` and `export --sql` as **"coming soon"**
- `API.md` documents them as real, available commands with full usage examples

**Problem:**
A developer reading the README thinks this feature doesn't exist yet and looks for a workaround. A developer reading the API docs thinks it's fully shipped. One of these is wrong.

**Requested fix:**
Align the two documents. If the commands are implemented, remove "coming soon" from the README. If they're not fully implemented, remove them from API.md or mark them clearly as `[planned]`.

---

### 3. Package should clearly support both "schema only" and "schema + data" export paths

**Context:**
Projects use this package in two different ways when going to production:

- **Internal tools / apps with real staging data** — want to copy everything: schema + all staging data → production. The data they accumulated in Sheets IS the production data.
- **Products starting fresh in production** — only need schema structure. Production will have real user-generated data from day one; staging data is test data and should be left behind.

**Current gap:**
The docs don't distinguish these two paths or tell the developer which command covers which scenario. The "Migration Path" section in the README mixes both under one heading.

**Requested change:**
Add a clear table or decision tree in the README:

| Goal | Command |
|---|---|
| Copy table structure only (schema) | `sheet-db export --prisma` or `--sql` |
| Copy structure + all staging data | `sheet-db export-data` (or `etl`) |
| Copy structure + data for all user sheets | `sheet-db export-data --all-users` ← missing, see item 4 |

---

### 4. `export-data --all-users` is missing — blocks full data migration for multi-user deployments

**Current behaviour:**
`sheet-db migrate` (the data export script generator) only covers the **admin sheet**. There is no `--all-users` equivalent for data migration, only for schema sync (`sync --all-users`).

**Problem:**
In the per-user-sheet model (each registered user has their own `actor_sheet_id`), staging data is spread across potentially hundreds of individual sheets. To fully migrate to a production SQL DB you would need to:

1. Query the `users` table to get all `actor_sheet_id` values
2. For each user, read their sheet's tables
3. Insert rows into SQL with the correct user FK

None of this is automated. The caller has to write this loop manually, defeating the purpose of a migration CLI.

**Requested change:**
Add `--all-users` to the data export command (whatever it gets renamed to):

```bash
# Migrate admin sheet only
sheet-db export-data

# Migrate admin sheet + all registered user sheets
sheet-db export-data --all-users

# Preview without running
sheet-db export-data --all-users --dry-run
```

The generated script should aggregate all user data under their respective `user_id` foreign key so the target DB rows can be properly associated.

---

### 5. Actor vs Role conflation — the docs need a clear conceptual separation

**Observation:**
While building the RBAC system for bEasy, it became apparent that the package's `actor` concept and an application-level `role` (RBAC) are two fundamentally different things, but the docs use `role:` as the actor identifier, which creates confusion:

```ts
adapter.withContext({ role: 'operation', ... })  // "role" here = actor/data-domain, not RBAC role
```

**The distinction:**

| Concept | What it controls | Dynamic? |
|---|---|---|
| **Actor** | WHERE data is stored (which Google Sheet, which table schemas) | No — defined in `sheet-db.config.ts` at deploy time |
| **Application RBAC Role** | WHAT a user is allowed to do (read orders, edit products, etc.) | Yes — managed in `roles` + `role_permissions` tables at runtime |

Because the package uses `role:` for the actor concept, developers naturally reach for the package's `role` field when building RBAC and expect it to be dynamic — but it isn't, which is only discovered after building around it.

**Requested change:**
- Consider renaming the `withContext({ role })` field to `withContext({ actor })` to match the package's own "Actors" terminology in the README
- Add a "Actors vs Application Roles" section to the docs that explains:
  - Actor = static data domain, defined in config, maps to a Sheet
  - Application RBAC = dynamic, build it yourself on top using `roles` + `role_permissions` tables in the admin sheet
  - The package intentionally doesn't build RBAC — that belongs in the caller's app layer

---

### 6. Dev/prod parity gap — one shared dev sheet vs one sheet per user in production

**Observation:**
In `sheet-db.config.ts`, each actor type maps to a single env var (`DEV_OPERATION_SHEET_ID`). This means all operation users in dev share one sheet. But `createUserSheet()` creates individual sheets per user — in production, each registered user gets their own isolated sheet.

**Problem:**
You test with shared-sheet behaviour in dev, but run with per-user-sheet behaviour in production. Bugs that only appear with isolated sheets (e.g., one user's data leaking into another's, schema version per user) won't be caught in dev.

**Requested change:**
Add a `mock-users` (already exists) enhancement or a `--multi-sheet` dev mode flag to `sync` that creates N separate actor sheets (like production) instead of reusing one. This closes the dev/prod parity gap.

Alternatively, document this gap explicitly with a "Dev vs Production data model" section so developers know what they're testing.

---

### Summary table

| # | Issue | Type | Impact |
|---|---|---|---|
| 1 | `migrate` is misnamed — should be `export-data` or `etl` | Naming / UX | High — developer confusion on first use |
| 2 | README and API.md contradict on `export --prisma/--sql` availability | Docs bug | Medium — wastes developer time |
| 3 | No clear distinction between schema-only vs schema+data export paths | Docs / UX | High — every project hitting production needs this |
| 4 | `export-data --all-users` missing — can't migrate multi-user deployments | Missing feature | High — blocks production migration for per-user-sheet projects |
| 5 | Actor vs Role conceptual conflation in docs and API | Docs / API naming | High — causes wrong architecture decisions |
| 6 | Dev/prod parity gap: one shared dev sheet vs per-user prod sheets | Architecture / DX | Medium — hides production-only bugs in dev |
