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

**Note on item 5 — docs-only fix, problem resurfaced in practice:** the explanation was added to
the docs, but the API itself still calls the field `role` (`ActorConfig.role`, `UserContext.role`
in `withContext()`). While auditing our own `backendSheetDB` schemas (2026-06-25) we found we'd
built exactly the anti-pattern the docs now warn against — three RBAC sub-roles (`operation`,
`finance`, `marketing`) had been modeled as three separate actors/Sheets, discovered only because
`sheet-db.config.ts` and `withContext()` both read `role: 'operation'`, which reads identically to
an RBAC role. The docs fix didn't prevent this. See the new feedback below.

---

## ✅ Fixed in v0.1.22

All 4 items from both 2026-06-25 feedback submissions (Actor Config Field Naming, items 7-10) were
addressed.

| # | Item |
|---|---|
| 7 | `ActorConfig.name` shipped — replaces `role` in `sheet-db.config.ts` entries. `UserContext.actor` (Phase 9) extended with `UserContext.targetActor`, replacing `targetRole`. Old fields still accepted with a `console.warn` deprecation notice. |
| 8 | Auto-fit column width — `syncSchema()`/`createUserSheet()` now call `autoResizeDimensions` whenever headers are written |
| 9 | Header fill color + frozen header row — new `sheetStyle: { headerColor, freezeHeader, freezeFirstColumn }` option on `createSheetAdapter()`; built-in default `#E8F0FE`, `freezeHeader: true` |
| 10 | `boolean()`/`enum()` columns now get native Sheets data-validation dropdowns automatically — `BOOLEAN`/`ONE_OF_LIST` rules applied via `setDataValidation` |

**Caveat found during our own upgrade (2026-06-25):** formatting/dropdowns are only applied when a
tab is created fresh or gets new columns appended (`rows.length === 0` or `missingHeaders.length >
0` in `syncSchema()`). Tables that were already fully synced before upgrading do **not** get
reformatted retroactively by a plain `sync` — confirmed against our own `backendSheetDB` (24
tables, all pre-existing, zero formatting calls on re-sync after upgrading to v0.1.22). Worth a
docs note and/or a `sync --reformat` flag that forces `_applySheetFormatting()` regardless of
header diff, for projects upgrading an already-synced project rather than starting fresh.

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

---

## 📬 Feature Request / Feedback — Actor Config Field Naming (submitted 2026-06-25)

Follow-up to item 5 above. The v0.1.21 docs fix explained the Actor vs RBAC Role distinction, but
didn't change the field name that causes the confusion in the first place — and we just proved the
docs alone aren't enough.

### Current behaviour

```ts
// sheet-db.config.ts
actors: [
  { role: 'admin', sheetIdEnv: 'ADMIN_SHEET_ID' },
  { role: 'user',  sheetIdEnv: 'DEV_USER_SHEET_ID' },
],

// at call sites
adapter.withContext({ userId, role: 'admin', actorSheetId })
```

`ActorConfig.role` and `UserContext.role` are both still named `role`, identical to the
application-level RBAC role a developer is also juggling in the same file.

### What happened to us

Building bEasy's admin portal, we modeled three RBAC sub-roles (`operation`, `finance`,
`marketing`) as three separate actors — each got its own `DEV_*_SHEET_ID` and its own
`sheet-db.config.ts` entry — instead of as rows in our own `roles`/`role_permissions` tables inside
the single `admin` actor. The reason: every actor-config entry and every `withContext()` call
*reads* `role: 'operation'`, so it looks exactly like an RBAC role assignment. We had read the new
"Actors vs Application Roles" docs section before writing this code and made the mistake anyway —
the field name overrides what the prose says, because that's what autocomplete and type hints show
at the moment of writing the code.

### Requested change

Rename the field so it can't be mistaken for an RBAC role:

| Location | Current | Suggested |
|---|---|---|
| `ActorConfig` (`sheet-db.config.ts` entries) | `role: string` | `name: string` — reads naturally nested under `actors: [...]`, e.g. `{ name: 'admin', sheetIdEnv: ... }` |
| `UserContext` / `withContext()` | `role: string` | `actor: string` — no surrounding `actors:` key to disambiguate at the call site, so the bare noun is clearer than `name` here |
| `UserContext` / `withContext()` cross-actor fields | `targetRole?: string` | `targetActor?: string` — for consistency with the above |

This closes out item 5's original ask (renaming `withContext({ role })` → `withContext({ actor })`)
that the v0.1.21 docs-only fix didn't cover, plus extends the same fix to `ActorConfig`. We're happy
to be a test bed for this change if it ships behind a deprecation-warning alias for `role` first.

### Summary

| # | Issue | Type | Impact |
|---|---|---|---|
| 7 | `ActorConfig.role` / `UserContext.role` still named `role` — confused with RBAC role in practice, even after docs fix | API naming | High — caused a real architecture bug in our own codebase |

---

## 📬 Feature Request / Feedback — Sheet Formatting & UX (submitted 2026-06-25)

`writeHeader()` (`dist/adapter/sheetClient.js`) currently does a plain `values.update` write of the
header row — no column sizing, no cell formatting, no data validation. For tables with 15-28
columns (we have several — `orders` has 28, `finance_orders` has 24), the raw sheet is hard to use
for manual inspection/debugging without a round of manual cleanup every time a tab is created.

### 8. Auto-fit column width to content

**Current behaviour:** New columns are created at Google Sheets' default width. Long values
(emails, JSON-array columns like `expertises`/`weekly_offs`, long enum strings) get visually
truncated — you have to manually drag every column border to see the data, every time `sync`
creates a new tab or appends a new column.

**Requested change:** After writing headers (and ideally after each `sync`/`seed` write), call the
Sheets API's `autoResizeDimensions` batch request for the written column range so columns fit their
content automatically. No new config needed — this should just be default behaviour.

### 9. Header row: fill color + frozen row/column (default, dev-configurable)

**Current behaviour:** The header row is plain text, not visually distinct from data rows, and
nothing is frozen — scrolling a large table loses the header and the row immediately scrolls out of
view, making it hard to tell which column is which while reviewing data.

**Requested change:**
- Apply a background fill (`repeatCell` + `userEnteredFormat.backgroundColor`) to row 1 on
  `syncSchema`/tab creation, with a sensible built-in default (e.g. a light gray/blue).
- Freeze the header row (`updateSheetProperties` → `gridProperties.frozenRowCount: 1`) and the
  primary-key column if one exists.
- Let both be overridden per-project, e.g.:
  ```ts
  createSheetAdapter({
    ...,
    sheetStyle: {
      headerColor: '#E8F0FE',   // optional, falls back to package default
      freezeHeader: true,       // default: true
      freezeFirstColumn: true,  // default: false
    },
  })
  ```

### 10. Boolean and Enum columns: automatic dropdown in the cell

**Current behaviour:** `boolean()` and `string().enum([...])` columns are validated on
`create()`/`update()` calls through the SDK, but the raw Sheet cell accepts any free-text value. If
anyone (or any other tool) edits a cell directly in Sheets, there's no in-cell guard — and there's
no visual cue in the spreadsheet itself that a column is restricted to `true/false` or a fixed set
of values.

**Requested change:** When `syncSchema` creates/updates a column backed by a `boolean()` or
`enum()` column definition, apply a Sheets data validation rule to that column's range:
- `boolean()` → `setDataValidation` with condition type `BOOLEAN` (renders the native Sheets
  checkbox/dropdown)
- `string().enum([...])` → `setDataValidation` with condition type `ONE_OF_LIST` using the enum
  values (renders the native Sheets dropdown arrow)

This turns every enum/boolean column into a guided dropdown automatically, with zero schema changes
required on our side — the enum values are already declared in `defineTable()`.

### Summary

| # | Issue | Type | Impact |
|---|---|---|---|
| 8 | No auto-fit column width — long values get visually truncated until manually resized | UX | Medium — manual cleanup needed on every new tab/column |
| 9 | No header fill color / frozen header row — hard to track columns while scrolling | UX | Medium — affects anyone manually reviewing data in Sheets |
| 10 | No data validation dropdown for `boolean()`/`enum()` columns | UX / data integrity | Medium — raw sheet accepts invalid values with no visual guard |
