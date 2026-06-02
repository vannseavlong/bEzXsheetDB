# bEasy Admin Portal — Build TODO

## Status Legend
- [ ] Not started
- [~] In progress
- [x] Complete

---

## Phase 1: Project Setup ✅
- [x] Vite + React 18, Tailwind CSS, shadcn/ui, lucide-react, recharts
- [x] Dependencies installed (including @tanstack/react-table, @dnd-kit, date-fns)
- [x] TypeScript configured (tsconfig.json, tsconfig.node.json)
- [x] index.html, vite.config.ts, postcss.config.js, tailwind.config.js

## Phase 2: Foundation ✅
- [x] src/main.tsx
- [x] src/App.tsx (all routes wired — 40+ routes)
- [x] src/index.css (CSS variables)
- [x] src/lib/utils.ts (cn helper)
- [x] src/types/index.ts (all data model interfaces)

## Phase 3: Layout Shell ✅
- [x] src/components/layout/Layout.jsx
- [x] src/components/layout/Sidebar.jsx (collapsible nav, active route highlight)
- [x] src/components/layout/Topbar.jsx (notifications, user menu)

## Phase 4: Mock Data ✅ (20 files in src/data/)
- [x] orders, cleaners, partners, coupons, customers, banners
- [x] notifications, tickets, categories, products, finance
- [x] activityLog, blockedSchedule, dashboard, otp, paymentLinks
- [x] popularServices, productOptions, items, categoryAddons

## Phase 5: Shared Components ✅ (src/components/shared/)
- [x] StatusBadge, OverviewCard, SearchBar, TablePagination, CustomHeader
- [x] WarningDialog, ColumnUserInfo, StarRating, DateRangePicker
- [x] EmptyState, LoadingSkeleton, ProfilePicker, MultiLanguageInput
- [x] Uploader, NotificationDrawer

## Phase TS: TanStack Table Infrastructure ✅ (UI mirrored from bEasy-portal)
- [x] src/hooks/use-table-state.ts
- [x] src/hooks/use-data-table-config.ts
- [x] src/components/data-table/DataTableHeader.tsx  — pl-4 first col, meta sticky/width support
- [x] src/components/data-table/TableRows.tsx         — no double-wrap, pl-4 first cell, h-12 rows
- [x] src/components/data-table/SortableRows.tsx
- [x] src/components/data-table/DraggableContext.tsx
- [x] src/components/data-table/DataTablePagination.tsx — bEasy py-1 right-aligned pagination
- [x] src/components/data-table/TableRowSkeleton.tsx  — no TableBody wrapper
- [x] src/components/ui/pagination.tsx
- [x] src/components/shared/SearchBar.tsx             — onChange(string) pattern
- [x] src/components/shared/CustomHeader.tsx          — h-88px, ChevronLeft, bEasy form header

## Phase 10: Setup / Services Pages ✅ COMPLETE (HIGHEST PRIORITY)

### Column definitions (src/components/data-table/columns/)
- [x] CategoryColumns.tsx
- [x] ProductColumns.tsx
- [x] CategoryAddonColumns.tsx
- [x] PopularServiceColumns.tsx
- [x] ItemColumns.tsx
- [x] ProductOptionColumns.tsx
- [x] BlockedScheduleColumns.tsx
- [x] ActivityLogColumns.tsx

### Header components (src/components/headers/) — bEasy flex layout, SearchBar, no border-b
- [x] CategoryTableHeader.tsx
- [x] ProductHeader.tsx
- [x] CategoryAddonHeader.tsx
- [x] PopularServiceHeader.tsx
- [x] ProductOptionHeader.tsx
- [x] ItemHeader.tsx (+ category filter)
- [x] BlockedScheduleHeader.tsx
- [x] ActivityLogHeader.tsx (global search filter)

### List pages — TanStack Table pattern ✅
- [x] src/pages/category/CategoryList.tsx       (draggable + status filter)
- [x] src/pages/category-addon/CategoryAddonList.tsx
- [x] src/pages/popular-service/PopularServiceList.tsx
- [x] src/pages/product/ProductList.tsx
- [x] src/pages/product-option/ProductOptionList.tsx
- [x] src/pages/item/ItemList.tsx               (+ category filter)
- [x] src/pages/blocked-schedule/BlockedScheduleList.tsx
- [x] src/pages/ActivityLog.tsx                 (global search, read-only)

### Form pages ✅
- [x] src/pages/category/CategoryForm.tsx       (two-panel, task info, products, addons)
- [x] src/pages/category-addon/CategoryAddonForm.tsx
- [x] src/pages/popular-service/PopularServiceForm.tsx
- [x] src/pages/product/ProductForm.tsx
- [x] src/pages/product-option/ProductOptionForm.tsx
- [x] src/pages/item/ItemForm.tsx
- [x] src/pages/blocked-schedule/BlockedScheduleForm.tsx

---

## Phase 6: Core Pages (stubs — need full implementation)
- [ ] src/pages/Dashboard.jsx → needs charts (recharts)
- [ ] src/pages/OrderPage.jsx → needs split-pane
- [ ] src/pages/CalendarPage.jsx → needs calendar grid
- [ ] src/pages/ChatPage.jsx → needs 3-panel chat

## Phase 7: Operations Pages (stubs)
- [ ] CleanerList.jsx / CleanerForm.jsx → convert to TSX + TanStack
- [ ] PartnerList/Detail/Onboarding/Tracking/Payout → full implementation

## Phase 8: Marketing Pages (stubs)
- [ ] MarketingOverview, CouponList/Form, PaymentLinkList/Form
- [ ] BannerList/Form, OtpPage
- [ ] PushNotificationList/Form/Detail

## Phase 9: Finance Pages (stubs)
- [ ] FinanceOrders, TopUp, BCombos, DirectSales, AllUser

## Phase 11: Customer Service Pages (stubs)
- [ ] CustomerOverview, CustomerList, DirectSaleCustomer
- [ ] RegisteredCustomer, Tickets

---

## Phase 12: Cleanup
- [ ] Convert remaining .jsx files to .tsx (layout, shared components, stub pages)
- [ ] README.md
- [ ] Code-split with dynamic import() to reduce bundle size (currently 570KB)

---

## Architecture Notes
- TanStack Table: useTableState + useDataTableConfig + column definition files
- Pattern: thin page → hook → column file → shared DataTable components
- Status filter: useEffect syncs string state → TanStack column filter (boolean)
- CategoryList: draggable rows via DraggableContext + SortableRows + @dnd-kit
- Other lists: static TableRows (no drag)
- Dev server: http://localhost:5174/
- Build: ✅ zero errors, 2560 modules
