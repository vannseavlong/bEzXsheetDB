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

## ✅ Fixed in v0.1.23

All 3 items from the "Phantom Rows, Partial-Update Defaults & Soft-Delete" feedback (submitted
2026-06-27) were addressed.

| # | Item |
|---|---|
| 11 | Boolean/enum phantom rows — `setDataValidation` now bounded to `dataRowCount + 200` instead of unbounded; `findMany()`/`update()`/`count()`/`delete()` independently filter out any row with an empty `_id` before returning, protecting already-synced sheets without needing to re-sync |
| 12 | `update()` no longer resets defaulted columns omitted from a partial patch — `validateAndApplyDefaults()` only applies `column.default` on `create()` now |
| 13 | `findMany()`/`findOne()`/`count()` now honor `softDelete` by default, matching the docs; new `includeDeleted?: boolean` opt-in on `FindOptions` for callers that need soft-deleted rows |

Also shipped: `ColumnBuilder.default()` now accepts arrays/objects (`JsonValue`), closing a
`json()`-column DX gap found alongside item 11 (`json().default([])` previously failed to
type-check despite working correctly at runtime).

Verified directly against `backendSheetDB`: `GET /api/admin/platforms` went from 1001 rows (999
null) to exactly 2 real rows after upgrading; a `PATCH` that omitted `sort`/`status` left both
values untouched instead of reverting to schema defaults; a soft-deleted category stopped
appearing in list results. All three repros confirmed fixed, local workarounds removed.

---

## ✅ Fixed in v0.1.24

Both items from the "Validation Buffer Growth & Boolean Rendering" follow-up feedback (submitted
2026-06-27, same day — found while verifying the v0.1.23 fix) were addressed.

| # | Item |
|---|---|
| 14 | Validation buffer self-heals — `create()` now extends the validated range another 200 rows every 100 inserts (`SheetClient.extendValidation()`), instead of staying frozen at whatever it was when `sync` last ran. Skipped entirely for schemas with no `boolean()`/`enum()` columns; uses the row number already returned by the Sheets append response, no extra read needed. |
| 15 | `boolean()` columns render as a configurable `ONE_OF_LIST` dropdown (`'TRUE'`/`'FALSE'` or `'1'`/`'0'`, via `SheetStyleConfig.booleanFormat` or a per-column `boolean({ format })` override) instead of a native checkbox — closes the actual root cause of item 11 for boolean columns specifically, the same way `enum()` was never susceptible to begin with |

**Caveat found during our own verification (2026-06-27):** same shape as the v0.1.22 caveat above —
reformatting (including the new boolean-dropdown rendering) only happens when `syncSchema()` has
new headers to write. Confirmed: re-running plain `sync` with no schema change left a pre-existing
`status` column as a native checkbox; adding one more column to that same table triggered a full
reformat pass that picked up the new dropdown rendering for *every* boolean/enum column in the
table, not just the new one — so the upgrade does eventually reach old columns, just only as a
side effect of the next schema change, not from `sync` alone. The `sync --reformat` flag noted
under v0.1.22 would close this gap directly; added to the roadmap below.

---

## ✅ Fixed in v0.1.25

| # | Item |
|---|---|
| 16 | `findMany({ orderBy })` numeric sort — `CRUDOperations` now has `compareOrderValues`/`toOrderNumber`, comparing numerically when both sides parse cleanly as numbers and falling back to the original string comparison otherwise |

Found while adding server-side pagination + filtering to the admin portal's list endpoints
(`backendSheetDB/utils/list-query.ts`): every `orderBy: 'sort'`-style numeric column came back as
`0, 1, 10, 11, 2, 3, ...` once a table passed 10 rows, because `findMany`'s sort coerced both sides
to strings before comparing. This got more severe than "just looks wrong" once pagination landed on
top of it — page boundaries (`offset = pageIndex * pageSize`) and the category list's drag-and-drop
reorder (which now writes `sort = offset + i` for just the dragged page) both assume `findMany`
returns true numeric rank order. With the lexicographic bug, a page's boundaries didn't line up with
real rank ranges, and reordering one page could write `sort` values that collided with or skipped
rows that weren't even on that page.

Verified directly against the installed `dist/adapter/crud.js`: pulled `compareOrderValues`/
`toOrderNumber` out and ran them against the original 12-row repro (`0,1,2,...,11` instead of
`0,1,10,11,2,...`), negative/decimal numbers, and confirmed text/date columns (`name_en`,
`blocked_date`) still compare identically to before (lexicographic, since neither side parses as a
number). All passed. Local workaround in `list-query.ts` (a duplicate numeric-aware comparator that
sorted in JS before delegating to `findMany`) removed — `listResource` now passes `orderBy`/`order`
straight through to `findMany` again.

---

## ✅ Fixed in v0.1.33

| # | Item |
|---|---|
| 18 | `lsdb migrate --sql --apply` / `createPostgresAdapter()` — no SSL support against managed Postgres (Render/Heroku/Supabase) — shipped `resolvePostgresSSL()`, auto-enables `ssl: { rejectUnauthorized: false }` for any non-localhost connection string |

Discovered running the real F2 Render Postgres cutover (2026-07-13): the `schema-migrate` CI job
connected fine, wrote `schema.sql`, then died a few seconds into applying DDL with
`Error: Connection terminated unexpectedly` (`pg-pool`) — a generic error that reads like a network
or credentials problem but isn't. Render (like Heroku, Supabase, and most managed Postgres) requires
SSL on external connections and presents a cert outside Node's default trust store; neither
`connectForApply()` (the CLI's `--apply` path) nor the runtime `createPostgresAdapter()` passed any
`ssl` option to `pg.Pool`, so both the CI migration step and the actual production adapter would have
hit the identical wall. Fixed in both places with a shared `resolvePostgresSSL()` helper — automatic
for any non-localhost connection string, no config change needed on our side; `PostgresAdapterConfig`
also gained an optional `ssl` override for providers that need one. See the package's `CHANGELOG.md`
[0.1.33] and `FAQ.md` §13 for the full incident write-up.

---

## ✅ Fixed in v0.1.34

| # | Item |
|---|---|
| 19 | `lsdb migrate --sql --apply` — table creation order ignores `ref()` foreign-key dependencies, so a referencing table can be created before the table it references — shipped `sortSchemasByDependency()`, a topological sort on `ref()` edges run right after schema loading |

Found immediately after verifying the v0.1.33 SSL fix, same F2 Render cutover (2026-07-13): with SSL
now negotiating correctly, `--apply` got further — created several tables — then failed with a real
Postgres error, `relation "category_addons" does not exist` (`42P01`), while creating
`category_addon_items` (which has `addon_id: string().required().ref('category_addons._id')`).
Root cause: `loadSchemas()` reads schema files via plain `fs.readdirSync()` with no regard for
`ref()` dependencies, and `generateSQLTable()` emits foreign keys **inline** inside `CREATE TABLE`
rather than as a deferred `ALTER TABLE` — since `category_addon_items.ts` sorts alphabetically
before `category_addons.ts` (`_` < `s`), its `CREATE TABLE ... FOREIGN KEY REFERENCES
category_addons(...)` ran before that table existed. Affects a hand-applied `schema.sql` file
identically, not just live `--apply`. Fixed with `sortSchemasByDependency()`
(`src/cli/commands/migrate.ts`) — topologically sorts every schema by its `ref()` edges once,
right after `loadSchemas()`, so both output paths get a dependency-safe order; self-referencing
columns (e.g. `parent_id`) don't cause infinite recursion. A true circular FK between two different
tables isn't handled by this first pass (would need one side's constraint deferred to a
post-creation `ALTER TABLE`) — not needed for any schema in this repo currently. See the package's
`CHANGELOG.md` [0.1.34] and `FAQ.md` §13 for the full incident write-up.

---

## 📬 Feature Request / Feedback — Table Names Aren't Actor-Scoped (submitted 2026-07-10)

Discovered while adding the mini-app's customer-facing `user` actor schemas to `backendSheetDB`
(same integration test bed as every section above). We'd named the customer table `users` — same
name as the pre-existing admin-actor staff/RBAC table, also `users` — since each actor is a
separate Google Sheet and we assumed the name was actor-scoped, the same way two tables in
different Postgres schemas can share a name.

### 17. `validate`, `erdiagram`, and (by extension) `export --prisma`/`--sql` treat table names as globally unique across actors, with no collision warning until `validate`

**Current behaviour:**
`lsdb validate` does flag it —

```
❌ Validation errors:
   - Duplicate table name: users
```

— but only as a late, easy-to-miss check, and only in `validate`. `lsdb status`/`sync`/the runtime
`adapter.table()` calls all work correctly and actor-scope by sheet, so the duplicate is invisible
until someone happens to run `validate`. Worse: `lsdb erdiagram` doesn't catch it at all — it
silently rendered **two separate `users { ... }` entity blocks with entirely different columns**
(admin: `role_id`, `actor_sheet_id`; user: `first_name`, `phone`, `gender`, `dob`) under the same
Mermaid entity name in one generated diagram, with no warning.

**Problem:**
Per-actor Sheets make same-name tables across actors a reasonable thing to reach for (it *is* a
different spreadsheet, after all) right up until `export --prisma`/`--sql` — a single production
Prisma schema or SQL database requires globally-unique model/table names, so exporting a project in
this state would either fail outright on the duplicate or silently let one definition clobber the
other, with no error surfaced until that late migration step. We caught this by luck (a `validate`
run before ever touching `export`), not because anything guided us to it.

**Requested change:**
- Have `validate` run by default as part of `sync` (or at minimum print a highly visible warning
  right there), not only on-demand — this is exactly the kind of check someone runs once early and
  then never again.
- Have `erdiagram` detect same-named tables across actors and either namespace them in the diagram
  (`admin.users` / `user.users`) or fail loudly instead of merging them into one ambiguous block.
- Have `export --prisma`/`--sql` refuse to generate output (clear error naming the colliding actors)
  rather than silently producing a broken or clobbered schema, until the caller resolves the naming
  collision on their end (as we did — renamed our customer table to `customers`).

### Summary

| # | Issue | Type | Impact |
|---|---|---|---|
| 17 | Table names aren't actor-scoped in `validate`/`erdiagram`/`export`; collision only surfaces late (`validate`) or not at all (`erdiagram`, `export`) | Bug / Missing feature | High — silently broken or failing production migration for any project with same-named tables across actors |

---

## 🗺️ Owner Roadmap (not yet shipped)

| Item | Priority |
|---|---|
| `sync --reformat` flag — force `_applySheetFormatting()` on every table regardless of header diff, for retroactively applying formatting/dropdown changes (e.g. v0.1.22's dropdowns, v0.1.24's boolean rendering) to tables a plain `sync` leaves untouched | Medium |
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

---

## 📬 Feature Request / Feedback — Phantom Rows, Partial-Update Defaults & Soft-Delete (submitted 2026-06-27)

Discovered while wiring up a new `platforms` table + a `categories.platform` column for the bEasy
admin portal — the same integration test bed as every section above. Item 10's checkbox/dropdown
rollout (v0.1.22) turned out to have a sharp edge none of us caught at the time.

### 11. Boolean/enum columns leak ~1000 phantom rows into every read

**Current behaviour:**
`formatSheet()` applies `setDataValidation` for `boolean()`/`enum()` columns with no `endRowIndex`
in the range. Per the Sheets API, an unbounded `GridRange` extends to the sheet's current grid row
count — 1000 by default for a freshly-created tab. So every `boolean()`/`enum()` column gets
checkbox/dropdown formatting on all 1000 rows, not just the rows with real data. `getAllRows()`
then reads `Sheet!A:ZZ` — and Sheets trims a `values.get` range to the last row with *any* content,
where a cell with validation/formatting applied (even with no entered value) counts as content.

**Problem:**
`GET /api/admin/platforms` with 2 real seeded rows returned **1001 rows**, 999 of them entirely
`null` (`_id: null`, every column `null`). Same shape on an existing 5-row `categories` table → 999
phantom rows. Any caller that doesn't defensively filter null-`_id` rows renders/ships garbage, and
every list payload balloons by orders of magnitude (291 KB of response for 2 real platform rows).
Since `status: boolean()` is on nearly every table in a typical project, this affects every table,
not just freshly-added ones.

**Requested change:**
Bound the validation range to actual data instead of leaving it unbounded, and/or have
`findMany()`/`getAllRows()` filter out rows with an empty primary key before returning, so phantom
rows from this (or any other cause — manual sheet edits, etc.) never reach a caller.

### 12. `update()` silently resets defaulted columns omitted from the patch body

**Current behaviour:**
`validateAndApplyDefaults()` is shared between `create()` and `update()`. For any column with a
`.default()` that's absent from the call's `data`, it unconditionally sets the column to its
default — with no `mode === 'create'` guard, unlike the adjacent `required` check right below it,
which correctly only fires on `create()`.

**Problem:**
A `PATCH`/`update()` that only sends `{ name_en: '...' }` against a row with `status: false,
sort: 7` comes back with `status: true, sort: 0` — both silently reset to their schema defaults
despite neither field being mentioned in the request. Any normal REST "send only the changed
fields" `PATCH` stomps every other defaulted column on every call. This is silent data corruption,
not just bloat — far more severe than item 11.

**Requested change:**
Only apply `column.default` when `mode === 'create'`. A field missing from an `update()` payload
should mean "leave it alone," not "reset to default."

### 13. `findMany()`/`findOne()` don't honor soft-delete, contradicting the docs

**Current behaviour:**
`delete()` on a `softDelete: true` table correctly sets `_deleted_at`, but `findMany()` has no
`_deleted_at` filtering anywhere in its implementation — it deserializes every row, applies `where`
if given, sorts/paginates, and returns. `findOne()` is implemented as `findMany({ ...options,
limit: 1 })`, so it inherits the same gap.

**Problem:**
Directly contradicts `skills/schema/SKILL.md`: *"Use `table.findMany()` — soft-deleted rows are
automatically excluded."* A category soft-deleted a week earlier (`_deleted_at` populated) still
showed up in every `GET /api/admin/categories` call.

**Requested change:**
Filter out rows with `_deleted_at` set by default when `schema.softDelete` is true, with an
explicit `includeDeleted?: boolean` opt-in on `FindOptions` for callers that need to see them.

### Summary

| # | Issue | Type | Impact |
|---|---|---|---|
| 11 | Boolean/enum columns leak ~1000 phantom rows into every read | Bug | High — every table with a `status` column inflates list payloads, risks rendering garbage rows |
| 12 | `update()` resets any defaulted column omitted from a partial patch | Bug | High — silent data corruption on any "send only changed fields" PATCH |
| 13 | `findMany()`/`findOne()` ignore soft-delete, contradicting the docs | Bug | High — "deleted" records never actually disappear from any list view |

---

## 📬 Feature Request / Feedback — Validation Buffer Growth & Boolean Rendering (submitted 2026-06-27)

Follow-up found the same day, while verifying the fix for item 11 above by adding a new `enum()`
column to a live table and tracing why boolean columns specifically were the ones leaking phantom
rows.

### 14. Validation buffer from item 11's fix doesn't grow on its own past 200 rows

**Current behaviour:**
The bounded range fixing item 11 (`dataRowCount + 200`) is computed once, at whatever moment
`syncSchema()` last wrote new headers. `_applySheetFormatting()` has exactly three call sites — a
brand-new tab, a schema with a new column on an existing tab, and the internal `schema_versions`
bootstrap — none reachable from `create()`/`appendRow()`.

**Problem:**
A table fed purely through normal `create()` calls (no schema change) over two months goes from 5
rows to 250 rows. Rows up to ~205 keep their checkbox/dropdown UI and enforcement; rows 206–250 get
plain text cells with no dropdown and no validation, silently, with no error surfaced anywhere —
discoverable only by opening the raw sheet and noticing the formatting stops.

**Requested change:**
Make `create()`/`appendRow()`/`createMany()` self-healing: when a new row lands within a small
margin of the last-formatted boundary, extend the validated range by another fixed buffer chunk.
Chunk-based rather than per-row to keep the extra Sheets API call rare instead of constant.

### 15. `boolean()` should render as a configurable dropdown instead of a native checkbox

**Current behaviour:**
Google Sheets' native `BOOLEAN` data validation doesn't just draw a checkbox glyph over an
otherwise-empty cell — applying it sets every blank cell in its range to an actual `FALSE` value.
`ONE_OF_LIST` (what `enum()` already used) doesn't do this: an unselected dropdown cell stays
genuinely empty.

**Problem:**
That asymmetry is the actual root cause of item 11, specifically for boolean columns: a row with
nothing in it isn't "empty" to the Sheets API once `boolean()` formatting reaches it, because one
cell in that row now holds a real `FALSE`. `enum()`-only columns were never susceptible to this on
their own — item 11's bounded-range and `_id`-filter fixes treat the symptom for both column types,
but the cause is specific to `boolean()`'s checkbox choice.

**Requested change:**
Have `boolean()` use the same `ONE_OF_LIST` mechanism `enum()` already uses, with the value pair
configurable as either `['TRUE', 'FALSE']` or `['1', '0']` — project-wide via `SheetStyleConfig`,
or per-column as an override for tables that need to match an external system's convention.

### Summary

| # | Issue | Type | Impact |
|---|---|---|---|
| 14 | Validation buffer doesn't grow past 200 rows without a manual `sync` | Feature gap | Medium — silent loss of UI/enforcement past the buffer, easy to miss |
| 15 | `boolean()` uses a native checkbox instead of `enum()`'s safer `ONE_OF_LIST` | Architecture / root cause | High — directly caused item 11 for boolean columns specifically |
