# Project TODO — bEasy Staging Integration

Tracks everything across the three codebases: `backendSheetDB/`, `admin-portal/`, and `mini-app/`.
Work is sequential — each phase unblocks the next. Package readiness gates everything downstream.

---

## Status Legend
- [ ] Not started
- [~] In progress
- [x] Complete
- [!] Blocked — waiting on package owner

---

## Phase A — Package Readiness (blocking all downstream work)

The package must be stable and migration-ready before we commit to patterns that depend on it.
All open issues are filed in `PACKAGE_IMPROVEMENT.md` (submitted 2026-06-21).

### A1 — Wait for package owner response ✅ All resolved in v0.1.21
- [x] Rename `migrate` CLI to `export-data` / `etl` (naming issue #1)
- [x] Align README and API.md on `export --prisma/--sql` availability (docs contradiction #2)
- [x] Clarify schema-only vs schema+data export paths in docs (#3)
- [x] Ship `export-data --all-users` for full multi-user data migration (#4)
- [x] Add Actor vs Role conceptual explanation to docs (#5)
- [x] Document dev/prod sheet parity gap (#6)

### A2 — Verify migration CLI end-to-end (after owner ships fixes)
- [x] Run `export --prisma` → `schema.prisma` generated, all 27 tables, relations correct
- [x] Run `export --sql` → `schema.sql` generated, proper `CREATE TABLE` + `FOREIGN KEY` DDL
- [x] Run `export-data` → `export-data.js` generated, all 27 schemas embedded, `insertRow()` stub ready
- [ ] Run `export-data --all-users` — skip for now (no multi-user data in staging yet)
- [x] Migration runbook (staging → production):
  1. `sheet-db export --prisma --output ./prisma` — create DB schema
  2. `sheet-db export --sql --output ./migrations` — alternative raw DDL
  3. `sheet-db export-data` — generate data script; fill in `insertRow()` with Prisma/Sequelize client
  4. `node export-data.js` — run once to seed production DB

  **Note:** one issue in generated Prisma schema — `schema_versions` model emits both `schema_version_id @id` and `_id @unique` (duplicate key). Remove `_id` from that model before running `prisma migrate`. This is a known package-side quirk.

### A3 — Confirm package version is stable for production handoff
- [x] Upgrade to the latest version once A1 fixes are shipped (upgraded to v0.1.21)
- [x] `sheet-db doctor` — all 11 checks passed
- [x] `sheet-db validate` — all 27 schemas valid
- [x] `sheet-db sync` — 20 tables synced (admin + operation); finance/marketing skipped (env vars not set, expected)

### A4 — Collapse to 2 actors (admin, user) + upgrade to v0.1.22 (2026-06-25)
- [x] Diagnosed actor/RBAC-role conflation in our own schemas — `operation`/`finance`/`marketing` had
  been modeled as 3 separate actors (separate Sheets) instead of RBAC roles inside `admin`, exactly
  the anti-pattern documented in `PACKAGE_IMPROVEMENT.md` item 5
- [x] Collapsed `sheet-db.config.ts` to 2 actors (`admin`, `user`); moved all 10 operation/finance/marketing
  schema files into `schemas/admin/` with `actor: 'admin'`
- [x] Closed `requirePermission` gaps on `/categories`, `/products`, `/category-addons`,
  `/product-options`, `/popular-services`, `/task-info`, `/category-addon-items`, `/items`,
  `/blocked-schedules` — previously only `/users` and `/rbac` were gated
- [x] Filed follow-up feedback (`ActorConfig.role` → `name`, sheet auto-formatting) — owner shipped
  both in v0.1.22 same day
- [x] Upgraded `longcelot-sheet-db` 0.1.20 → 0.1.22; adopted `ActorConfig.name` and `UserContext.actor`
  everywhere, replacing deprecated `role`
- [x] `sheet-db validate`/`status`/`sync` — 24 tables, 2 actors (`admin`/`user`), no deprecation warnings
- [ ] New auto-formatting (header color/freeze/dropdowns) only applies on new tabs or new columns —
  our 24 pre-existing tables won't get it until a real schema change forces a header rewrite, or we
  deliberately recreate the tabs (see `PACKAGE_IMPROVEMENT.md` v0.1.22 caveat) — not done yet, needs
  a decision on whether to force it

---

## Phase B — Admin Portal: RBAC Enforcement

The RBAC UI (roles + permissions matrix) is built and wired to the backend.
But permissions are not enforced anywhere — every user can do everything right now.
This must be completed before the admin portal is considered production-ready.

### B1 — Backend: embed permissions in login response
- [x] On login (both email+password and Google OAuth), after finding the user:
  - Look up `users.role` → find matching row in `roles` table by `code`
  - Query `role_permissions` for that role's `role_id`
  - Build `permissions: string[]` array as `"MODULE:ACTION"` pairs (e.g. `"ORDER:VIEW"`)
  - Include `permissions` in the JWT payload and in the JSON response body
- [x] `super_admin` role bypasses RBAC — always gets full permissions without DB lookup
- [x] `AdminUser` type in `auth-context.tsx` already had `permissions: string[]` — populated correctly

### B2 — Backend: permission middleware
- [x] Created `requirePermission(module, action)` in `backendSheetDB/middleware/auth.ts`
  - Reads `req.user.permissions: string[]` from the decoded JWT
  - Checks for `"MODULE:ACTION"` in the array
  - Returns `403` if missing
- [x] Applied to `/admin/users` (`ADMIN_USERS:VIEW`) and `/admin/rbac` (`RBAC:VIEW`) routes
- [x] `super_admin` check: skips permission check entirely

### B3 — Frontend: fix `usePermission` hook
- [x] Rewrote `admin-portal/src/hooks/use-permission.ts`:
  - Reads `auth.user.permissions: string[]` from `useAuth()`
  - `hasPermission(module, action)` checks `permissions.includes('MODULE:ACTION')`
- [x] `super_admin` shortcut: if `user.role === 'super_admin'`, always returns `true`

### B4 — Frontend: apply permission gates
- [x] Sidebar: added `module` to all nav items in `nav-config.ts`; `app-sidebar.tsx` filters by `hasPermission(module, 'VIEW')` — empty dropdowns hidden too
- [x] `ProtectedRoute`: accepts optional `requiredRole` prop; redirects to `/not-authorised` if role mismatch
- [x] Created `NotAuthorised.tsx` page (403 with dashboard link)
- [x] RBAC and Users routes wrapped with `<ProtectedRoute requiredRole="super_admin" />`
- [x] Action buttons (Edit, Delete, Create): wrapped with `hasPermission`/`canUpdate`/`canDelete` in column defs across `ProductList.tsx`, `CategoryList.tsx`, `ItemList.tsx`, `RoleList.tsx`, `UserList.tsx`, `BlockedScheduleList.tsx`, `CategoryAddonList.tsx`, `ProductOptionList.tsx`, `PopularServiceList.tsx`, `CleanerList.tsx`

---

## Phase C — Admin Portal: Order Management

> Start this phase **after reviewing the mini-app checkout flow** (Phase D) so the order data model and statuses are confirmed before building the admin view.
>
> **2026-07-10 scope call:** built directly against `routes/user/order.ts` (the actual source of
> truth for what reaches the backend) instead of walking the mini-app screens — same result, less
> drift risk. Direct Sale orders are explicitly excluded from this page (`type !== 'DIRECT_SALE'`
> filtered server-side) — those stay in the Finance / Direct Sale Customer pages. Cleaner assignment
> deferred: `cleaners` has a schema but no admin backend route yet (`CleanerList.tsx` still runs on
> mock data), so there's nothing real to assign against.

### C1 — Understand the order model from mini-app
- [x] Confirmed fields that reach the backend by reading `routes/user/order.ts` directly (one `orders`
  row per booked line, grouped by `bulk_order_id`, `is_primary` marks the line holding shared fields)
- [x] Confirmed order statuses: `PENDING → ACCEPTED → IN_PROGRESS → COMPLETED / CANCELLED` — enforced
  server-side now via an explicit transition map (`CANCELLED` reachable from any open state)
- [ ] Confirm what data the operation team needs to see vs what finance team sees — not needed yet,
  this page only covers ops; Finance › Orders is still its own unbuilt page

### C2 — Backend: order routes
- [x] `GET /admin/orders` — list, one row per bulk order, filters: `status`, `dateFrom`/`dateTo`
  (against `schedule_date`), `search` (customer name/phone/bulk order id), paginated
- [x] `GET /admin/orders/:bulkOrderId` — full detail: primary fields + every line + its addons
- [x] `PATCH /admin/orders/:bulkOrderId/status` — validates the transition, updates every line
  sharing the bulk order together
- [ ] `GET /admin/orders/:id/cleaners` — deferred, no cleaners backend yet
- [ ] `POST /admin/orders/:id/assign` — deferred, no cleaners backend yet

### C3 — Admin Portal: Order list page (fresh UI)
- [x] `pages/order/OrderList.tsx` + `OrderCard.tsx` — **not** a TanStack Table; per updated
  instructions this is a scrollable card list in a left sidebar (search bar + status `Select` +
  `DateRangePicker`), matching bEasy's split-panel order screen rather than the table pattern used
  by Users/Category/etc.
- [x] Status badge: PENDING (yellow) / ACCEPTED (blue, new) / IN_PROGRESS (purple, recolored from
  yellow so it's visually distinct from PENDING) / COMPLETED (green) / CANCELLED (red) — added the
  missing `ACCEPTED` entry to the shared `StatusBadge` map, which had no PENDING/ACCEPTED distinction
  before

### C4 — Admin Portal: Order detail / side panel
- [x] `pages/order/OrderDetail.tsx` — customer info, address, schedule/duration, services + addons,
  full payment breakdown, remark
- [x] Status update action — single forward-action button per status (Accept → Start → Complete) plus
  a separate destructive Cancel button behind a confirm dialog; both gated on `ORDER:UPDATE`
- [x] Cleaner assignment panel — built, see C5 below

### C5 — Cleaner Management (CRUD, assignment, activity log) ✅ done 2026-07-11
> Closes the two items deferred earlier in this phase (`GET/POST .../cleaners`, assignment panel) plus
> two new asks (2026-07-11): cleaners are admin/operation-managed data only, not real user accounts —
> no login, no RBAC actor for them. Assignment logic kept deliberately simple (manual pick only, no
> availability/auto-assign optimizer — the `auto_assign` flag on each cleaner stays informational).
- [x] Backend: `cleaners` CRUD routes (`backendSheetDB/routes/admin/cleaners.ts`, mounted at
  `/admin/cleaners`, gated `CLEANER:VIEW`) against the existing `schemas/admin/cleaners.ts` schema —
  mirrors the `blocked-schedules.ts` route pattern exactly (DTO-mapped list, raw-row detail/create/update)
- [x] Admin Portal: `pages/cleaner/CleanerList.tsx` + `CleanerForm.tsx` — `mockCleaners` removed
  (`data/cleaners.ts` deleted), wired to real `api/cleaners.ts` hooks (server-side search/pagination/status
  filter, create/edit/delete all persist); added a `phone` field to the form since the schema already had
  the column but the old mock UI never surfaced it
- [x] Backend: `PATCH /admin/orders/:bulkOrderId/assign-cleaner` (`{ cleanerId: string | null }`) —
  mirrors the existing `/status` handler, updates every line sharing the bulk order, validates the
  cleaner exists and is active, gated on the (pre-existing, previously unused) `ORDER:ASSIGN` permission.
  No availability-slot logic — manual assignment only, per scope.
- [x] Admin Portal: "Assigned Cleaner" panel on `OrderDetail.tsx` — dropdown of active cleaners,
  gated on `ORDER:ASSIGN`, shows "Unassigned" or the current assignee otherwise
- [x] Activity log: new `activity_logs` schema + a generic `logActivity` middleware
  (`backendSheetDB/middleware/activity-log.ts`) mounted once on the whole `/admin/*` router — auto-logs
  every successful mutating (POST/PATCH/PUT/DELETE) request with an auto-generated `detail` summary, no
  per-route instrumentation needed. GETs intentionally not logged (read cache + write-quota cost).
  `pages/ActivityLog.tsx` wired to the new `GET /admin/activity-log` (mock data file deleted).
- [x] Verified end-to-end: backend routes exercised directly (CRUD round-trip, assignment + invalid/
  inactive-cleaner rejection, permission-gate 403s, activity-log entries with correct module/detail) and
  the actual admin-portal UI driven with Playwright (create/edit/delete a cleaner, assign a cleaner from
  the order detail panel, confirm the row appears in Activity Log) — all working, no console errors

---

## Phase D — Mini App: Backend Integration

The mini-app currently uses `useFakeAuth` with a hardcoded JWT and points to the old bEasy backend.
This phase replaces all of that with the `backendSheetDB` API.

### D1 — Auth: replace fake auth with real login ✅ done 2026-07-10
- [x] Removed `useFakeAuth` entirely — zero references left in `mini-app/src`
- [x] `use-login-mutation.ts` → `loginApi` (`api.ts`) → `POST auth/login`, matches
  `backendSheetDB/routes/user/auth.ts` `POST /login`
- [x] ABA bridge auth dropped for login — no `callHandler('getProfile')` calls remain; real login fully
  replaces it (remaining `callHandler` uses are unrelated: `confirmOnClose`, `requestCurrentLocation`, `setBarTitle`)
- [x] JWT stored via `Cookies` in `api.ts`; Axios interceptor attaches `Authorization: Bearer` on every call
- [x] `meApi` wired to `GET auth/me` (not `/api/user/profile` as originally guessed — path differs but is
  real and functional) → `backendSheetDB/routes/user/auth.ts` `GET /me`

### D2 — Update API base URL
- [ ] `.env.dev` / `.env.uat` still don't exist in the repo — only `.env.example` is set up
  (`VITE_BASE_URL=http://localhost:3000/api/user`); need real dev/uat env files before those builds work
- [x] Existing `API_ENDPOINT` keys confirmed mapped to valid backendSheetDB routes (see D3)
- [x] **Backend: `/api/user/*` app-facing routes are implemented** — `routes/user/index.ts` mounts `auth`,
  `catalog` (category/product/addon/banner/homepage/task-info), `address`, `order`, `coupon`. No longer
  placeholder stubs.

### D3 — Wire each screen to real backend ✅ done 2026-07-10 (hooks renamed/split differently than originally planned, but functionally complete)
- [x] **Home screen**: `use-banner-query.ts` → `GET banner/list`, `use-category-query.ts` → `GET category/list`,
  `use-homepage.ts` → `GET homepage`
- [x] **Service screen** — actual hooks differ from the names guessed below but cover the same surface:
  `use-category-products-query.ts` → `GET category/:id/products`, `use-category-addons-query.ts`,
  `use-category-addon-items-query.ts`, `use-task-info-query.ts`, `use-equipment-query.ts` → `GET category/:id/items`
- [x] **Checkout flow**: `use-checkout-state.ts` holds real state; `use-order-preview-mutation.tsx` →
  `POST order/preview` (pricing/summary now computed server-side in the preview response, so the separately
  planned `use-order-summary-mutation.ts` / `use-bulk-order-price-mutation.ts` were never needed);
  `use-schedule-query.ts` → `GET order/available-schedule`
- [x] **Location screens**: `use-address-query.ts` → `GET address/list`, `use-new-address-mutation.ts`
  (handles create + edit) → `POST address/create`, `use-location-distance-guard.ts` → `POST address/check/distance`
  (backend ended up POST, not GET as originally noted), plus an untracked `use-delete-address-mutation.ts`
- [x] **Order creation**: `use-order-create-mutation.ts` → `POST order/create`
- [ ] `use-order-recommended-mutation.ts` — never built, no "recommended" feature exists anywhere; drop
  from scope unless product asks for it
- [x] **Order list + detail**: `use-order-query.ts` → `GET order/list`, `use-order-detail-query.ts` →
  `GET order/:bulkOrderId`, `use-edit-schedule-mutation.ts` → `PATCH order/:bulkOrderId/schedule`
- [ ] `use-order-check-status-query.ts` — backend endpoint exists (`GET order/:bulkOrderId/payment-status`,
  no `tranId` segment as originally assumed) but no frontend hook calls it yet
- [ ] **Purchase success screen** — `purchase-success-screen.tsx` doesn't exist at all (not even commented
  out); post-order flow currently redirects straight to order list/detail. Needs an explicit decision on
  whether a dedicated success screen is still wanted.

### D4 — Checkout flow adjustment
- [ ] Walk through the full checkout flow on device/emulator end-to-end — no record of this QA pass yet
- [ ] Identify any steps that don't match the new backend's expected payload shape
- [ ] Fix field mapping mismatches (field names, date formats, address structure, etc.)
- [ ] Confirm payment flow — is ABA payment still involved, or replaced?
- [ ] Confirm post-order redirect behaviour (success screen vs order list) — see D3 purchase-success note

### D5 — User registration / profile
- [x] Self-registration is supported — `POST /register` in `backendSheetDB/routes/user/auth.ts` (password
  strength + duplicate email/phone checks) wired to `use-register-mutation.ts` + `page/register.tsx` in
  the mini-app. Admin-created-only login still works too (same `/auth/login` path either way).
- [~] Profile: no dedicated profile page yet, but editing works — `personal-info.tsx` uses
  `useUpdateProfileMutation` (`PATCH auth/me`) inline inside the checkout flow. Standalone profile
  page/display still not built.

---

## Phase E — End-to-End Smoke Test

Once all phases are complete, verify the full flow works together:

- [ ] Admin creates a user in admin-portal Users page → user can log into mini-app
- [ ] Admin sets role permissions in RBAC page → those permissions are enforced in admin-portal
- [ ] Customer places an order in mini-app → order appears in admin-portal Order list
- [ ] Admin updates order status → status reflects correctly in mini-app order detail
- [ ] Run `export --prisma` → confirm generated schema covers all tables used by all three apps
- [ ] Run `export-data` (or renamed migrate) → confirm all data can be read out cleanly

---

## Phase F — Production Hardening & Handoff

Starts only once B, C (incl. C5 cleaner flow), D, and E above are all done — i.e. once every integrated
feature is confirmed working end-to-end on the Sheets backend. This phase is about making the stack
production-safe and completing the real migration off Sheets, not adding more product features.

### F1 — Observability: Sentry error logging
- [ ] `backendSheetDB`: install Sentry, capture unhandled errors + failed requests (wire into the existing
  Express error middleware rather than adding a parallel one)
- [ ] `admin-portal`: install Sentry (React), capture render errors + failed API calls
- [ ] `mini-app`: install Sentry (React/mobile webview context), capture render errors + failed API calls
- [ ] Confirm all three send to the same Sentry project (or clearly separated projects) with environment
  tags (`dev`/`uat`/`prod`) so errors are attributable

### F2 — CI/CD: staging Sheets → production Postgres on Render
> Purpose: prove the `longcelot-sheet-db` adapter swap and data migration actually work end-to-end
> against a real database, not just via manual `export`/`export-data` runs (Phase A2).
> **2026-07-12:** unblocked by package v0.1.32 (Phase 16 — pluggable SQL adapters, `createDatabaseAdapter`,
> `lsdb migrate --apply`, `lsdb migrate-data --run`).
- [x] Swap `SheetAdapter` for a config-driven adapter (staging/local stays on Sheets, production points at
  Postgres) — `config/adapter.ts` now calls `createDatabaseAdapter({ driver: env.DB_DRIVER })`;
  `env.DB_DRIVER` (`config/env.ts`) defaults to `'sheets'` everywhere except `NODE_ENV=production`, where
  it defaults to `'postgres'` (`$DATABASE_URL`), overridable via `$DB_DRIVER`. All ~30 route/middleware
  files were retyped from the concrete `SheetAdapter` class to the shared `DatabaseAdapter` interface so
  the same code works against either engine.
  File uploads (`routes/admin/upload.ts`) are a deliberate exception: they always ride on Google Drive via
  a dedicated always-on Sheets-backed client (`storage` in `config/adapter.ts`), independent of
  `DB_DRIVER` — the SQL adapters have no upload/storage concept of their own.
- [x] Build the CI/CD pipeline: `.github/workflows/deploy.yml` — on push to `main`, runs
  `lsdb migrate --sql --apply` against `$DATABASE_URL` (idempotent), then optionally pings a
  Render deploy hook; on a `v*` tag (or manual `workflow_dispatch`), also runs
  `lsdb migrate-data --run --all-users --driver postgres` for the one-time (or dual-write-window-repeated)
  Sheets → Postgres data cutover. Modeled on the package's own reference pipeline (README.md).
- [x] Provision a Postgres instance on Render for production; `DATABASE_URL` and `SHEET_DB_TOKENS` repo
  secrets are set and the pipeline is live (`RENDER_DEPLOY_HOOK_URL` still optional/unset).
  (Earlier note in this file said to name the secret `PRODUCTION_DATABASE_URL` — that was a typo against
  what the workflow and `config/env.ts` actually read; corrected here to `DATABASE_URL`.)
- [x] **2026-07-13 incident:** first real `schema-migrate` run against Render Postgres failed a few
  seconds into applying DDL with `Error: Connection terminated unexpectedly` (pg-pool) — Render requires
  SSL on external connections, and neither `lsdb migrate --sql --apply` nor the runtime
  `createPostgresAdapter()` passed any `ssl` option to `pg.Pool`. Fixed package-side in
  `longcelot-sheet-db` (`resolvePostgresSSL()`, auto-enables `ssl: { rejectUnauthorized: false }` for any
  non-localhost connection string) — see the package's `CHANGELOG.md` [0.1.33] and `FAQ.md` §13 for the
  full write-up. **Follow-up needed here:** bump `longcelot-sheet-db` to `0.1.33`+ in
  `backendSheetDB/package.json` and re-run the `schema-migrate` job to confirm the fix against the real
  Render instance.
- [ ] Migrate current staging Sheet data into the new Postgres DB once, verify row counts/relations match
  — blocked on the SSL fix landing (item above); `schema.sql`/`schema.prisma` (repo root, generated via
  `lsdb migrate --sql` / `--prisma`) are ready to review/apply in the meantime.
- [ ] Document the cutover steps end-to-end (this repo's specific secrets/env, not just the package's
  generic docs) once a real cutover has actually been run once

### F3 — OWASP Top 10 security review
- [ ] Run through the OWASP Top 10 against `backendSheetDB`, `admin-portal`, `mini-app` (injection, auth,
  data exposure, access control, misconfig, etc.) — use the `/security-review` skill/command as a starting
  pass, then manually verify anything it flags
- [ ] File and fix (or explicitly accept/defer with reasoning) each finding

### F4 — Limitations & challenges summary
- [ ] Write a markdown doc summarizing known limitations and challenges hit across the project — package
  quirks (see `PACKAGE_IMPROVEMENT.md`), Sheets-as-DB constraints, anything deferred or simplified for
  time (e.g. cleaner auto-assign kept simple, activity log scope), and open risks going into production

---

## Dependency Map

```
Package A1 fixes
    └── A2 migration verification
            └── A3 stable version

Package A3 stable
    └── B1-B4 RBAC enforcement (admin-portal)
    └── D1-D5 mini-app integration

D3-D4 checkout flow confirmed
    └── C1 order model understood
            └── C2-C4 order management (admin-portal)
                    └── C5 cleaner management (CRUD, assign, activity log)

B + C (incl. C5) + D all done
    └── E end-to-end smoke test
            └── F production hardening (Sentry, Render CI/CD, OWASP review, limitations doc)
```

---

## Notes

- **Order management (Phase C) intentionally comes after mini-app checkout review (Phase D)** — the admin order UI should reflect exactly what the client sends, so client-side flow must be confirmed first
- **RBAC modules** — current `SYSTEM_MODULE_ACTIONS` on the backend is a hand-maintained copy of the frontend's `MODULE_ACTIONS`; these must stay in sync until the package provides a shared mechanism (filed as future feedback)
- **Mini-app auth** — `useFakeAuth` has been removed (2026-07-10); real login/register against `backendSheetDB` is live end-to-end
- **Cleaner flow (C5)** — cleaners are admin/operation-managed records, not user accounts; no login or
  RBAC actor needed for them. Keep auto-assign simple (basic availability filter or the existing
  `auto_assign` flag) rather than building a scheduling optimizer.
- **Phase F is deliberately last** — Sentry, the Render Postgres CI/CD cutover, the OWASP pass, and the
  limitations write-up only make sense once the product surface (B, C, D, E) has stopped moving
- **Untracked features shipped alongside Phase D** (not previously listed as TODO items, verified 2026-07-11):
  coupon system (`backendSheetDB/routes/user/coupon.ts` + `coupon-logic.ts`, `use-coupon-mutation.ts`,
  `POST coupon/validate`); Google OAuth login for mini-app users (`createUserGoogleAuthHandler` in
  `routes/user/auth.ts`); product pairing / "often paired with" (`product_pairings` table,
  `loadPairProductCatalog` in `order.ts`); address delete flow (`use-delete-address-mutation.ts`)
