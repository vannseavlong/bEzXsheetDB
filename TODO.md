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
- [ ] Action buttons (Edit, Delete, Create): wrap with `hasPermission` — hide or disable if not granted (deferred — backend enforces it; frontend refinement in next pass)

---

## Phase C — Admin Portal: Order Management

> Start this phase **after reviewing the mini-app checkout flow** (Phase D) so the order data model and statuses are confirmed before building the admin view.

### C1 — Understand the order model from mini-app
- [ ] Review mini-app checkout flow screens and confirm fields that reach the backend
- [ ] Confirm order statuses: `PENDING → ACCEPTED → IN_PROGRESS → COMPLETED / CANCELLED`
- [ ] Confirm what data the operation team needs to see vs what finance team sees

### C2 — Backend: order routes
- [ ] `GET /admin/orders` — list orders (support filters: status, date range, category)
- [ ] `GET /admin/orders/:id` — order detail
- [ ] `PATCH /admin/orders/:id/status` — update status
- [ ] `GET /admin/orders/:id/cleaners` — list assigned cleaners
- [ ] `POST /admin/orders/:id/assign` — assign cleaner to order

### C3 — Admin Portal: Order list page (fresh UI)
- [ ] Column definitions: `OrderColumns.tsx` (order ID, customer, service, date, status, cleaner, actions)
- [ ] Header: date range filter + status filter + search
- [ ] `OrderList.tsx` — fetch from backend, TanStack Table pattern (same as UserList)
- [ ] Status badge: PENDING (yellow) / ACCEPTED (blue) / IN_PROGRESS (orange) / COMPLETED (green) / CANCELLED (red)

### C4 — Admin Portal: Order detail / side panel
- [ ] Order detail view — customer info, service details, schedule, address, assigned cleaner
- [ ] Status update action (dropdown or buttons)
- [ ] Cleaner assignment panel

---

## Phase D — Mini App: Backend Integration

The mini-app currently uses `useFakeAuth` with a hardcoded JWT and points to the old bEasy backend.
This phase replaces all of that with the `backendSheetDB` API.

### D1 — Auth: replace fake auth with real login
- [ ] Remove `useFakeAuth` — currently sets a hardcoded token and user in the cookie/store
- [ ] Wire `use-login-mutation.ts` to `backendSheetDB` `POST /auth/login` (email + password)
- [ ] Wire ABA bridge auth (`callHandler('getProfile')`) if still needed — confirm with client
- [ ] Store JWT from response in cookie; attach to all API calls via Axios interceptor (already exists, just point to new base URL)
- [ ] Wire `meApi` to `GET /api/user/profile` on backendSheetDB (or confirm existing profile endpoint)

### D2 — Update API base URL
- [ ] Update `.env.dev` / `.env.uat` `VITE_BASE_URL` to point to `backendSheetDB` server
- [ ] Confirm all existing `API_ENDPOINT` keys still map to valid backendSheetDB routes; update any that don't
- [ ] **Backend: implement `/api/user/*` app-facing routes** — `routes/user/index.ts` currently only
  mounts `/auth`; everything else (`category`, `product`, `order`, `address`, `banner`, `homepage`,
  `profile`) is an unimplemented placeholder comment. Confirmed via 404 on
  `GET /api/user/category/list/detail` after sign-up. Mirror the read-only shape of
  `routes/admin/categories.ts` for the user-facing category endpoints.

### D3 — Wire each screen to real backend
- [ ] **Home screen** (`home.tsx` + `home-content.tsx`):
  - `use-banner-query.ts` → `GET /banner/list`
  - `use-category-query.ts` → `GET /category/list`
  - `use-homepage.ts` → `GET /homepage` (note/announcement)
- [ ] **Service screen** (`service.tsx`):
  - `use-service-query.ts` → `GET /product/v2`
  - `use-product-detail-query.ts` → `GET /product/:id`
  - `use-equipment-query.ts` → `GET /category/:id` (equipment/addons)
- [ ] **Checkout flow** (`checkout.tsx` + `checkout-content.tsx`):
  - `use-checkout-services.ts` / `use-checkout-state.ts` — confirm state shape matches new API
  - `use-order-preview-mutation.ts` → `POST /order/mini-app/preview`
  - `use-order-summary-mutation.ts` / `use-bulk-order-price-mutation.ts` — wire to correct endpoints
  - `use-schedule-query.ts` → `GET /order/available-schedule`
  - Review and adjust checkout flow — confirm steps match what backend expects
- [ ] **Location screens** (`location.tsx` + `add-location.tsx`):
  - `use-address-query.ts` → `GET /address/list`
  - `use-new-address-mutation.ts` → `POST /address/create`
  - `use-location-distance-guard.ts` → `GET /address/check/distance`
- [ ] **Order creation**:
  - `use-order-create-mutation.ts` → `POST /order/mini-app/create`
  - `use-order-recommended-mutation.ts` — confirm endpoint
- [ ] **Order list + detail** (`booking-content.tsx`, `order-detail.tsx`):
  - `use-order-query.ts` → `GET /order/mini-app/list`
  - `use-order-detail-query.ts` → `GET /order/mini-app/detail`
  - `use-order-check-status-query.ts` → `GET /order/:bulkOrderId/:tranId/payment-status`
  - `use-edit-schedule-mutation.ts` → `PUT /order/bulk/edit-schedule`
- [ ] **Purchase success screen** (`purchase-success-screen.tsx`) — currently commented out in router; confirm if needed

### D4 — Checkout flow adjustment
- [ ] Walk through the full checkout flow on device/emulator end-to-end
- [ ] Identify any steps that don't match the new backend's expected payload shape
- [ ] Fix field mapping mismatches (field names, date formats, address structure, etc.)
- [ ] Confirm payment flow — is ABA payment still involved, or replaced?
- [ ] Confirm post-order redirect behaviour (success screen vs order list)

### D5 — User registration / profile
- [ ] Confirm if the mini-app supports self-registration or users are created by admin only
- [ ] If admin-created: ensure login works with credentials set by admin portal Users page
- [ ] Wire profile page / user info display if it exists

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

B + C + D all done
    └── E end-to-end smoke test
```

---

## Notes

- **Order management (Phase C) intentionally comes after mini-app checkout review (Phase D)** — the admin order UI should reflect exactly what the client sends, so client-side flow must be confirmed first
- **RBAC modules** — current `SYSTEM_MODULE_ACTIONS` on the backend is a hand-maintained copy of the frontend's `MODULE_ACTIONS`; these must stay in sync until the package provides a shared mechanism (filed as future feedback)
- **Mini-app auth** — `useFakeAuth` is the only thing keeping the mini-app runnable right now; don't remove it until the real login endpoint is confirmed working end-to-end
