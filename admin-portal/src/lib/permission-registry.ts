// Single source of truth for "what modules the frontend uses and what actions
// each one has". Nav visibility, route guards, action-button gating, and the
// RBAC catalog-sync UI all read from MODULE_REGISTRY instead of each hand-rolling
// their own module/action strings — so a module can't drift between what the
// sidebar shows, what a route enforces, and what the RBAC matrix offers to grant.

export const ACTIONS = {
  VIEW: 'VIEW',
  ADD: 'ADD',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  EXPORT: 'EXPORT',
  ASSIGN: 'ASSIGN',
  CONFIRM: 'MARK_AS_PAID',
} as const

export type ActionKey = (typeof ACTIONS)[keyof typeof ACTIONS]

export const ACTION_LABELS: Record<string, string> = {
  [ACTIONS.VIEW]: 'View',
  [ACTIONS.ADD]: 'Add',
  [ACTIONS.UPDATE]: 'Edit',
  [ACTIONS.DELETE]: 'Delete',
  [ACTIONS.EXPORT]: 'Export',
  [ACTIONS.ASSIGN]: 'Assign',
  [ACTIONS.CONFIRM]: 'Mark Paid',
}

export const MODULES = {
  DASHBOARD: 'DASHBOARD',
  CHAT: 'CHAT',
  ORDER: 'ORDER',
  CLEANER: 'CLEANER',
  PARTNER: 'PARTNER',
  PARTNER_ONBOARDING: 'PARTNER-ONBOARDING',
  PARTNER_TRACKING: 'PARTNER-TRACKING',
  PARTNER_PAYOUT: 'PARTNER-PAYOUT',
  MARKETING_OVERVIEW: 'MARKETING-OVERVIEW',
  MARKETING_COUPON: 'MARKETING-COUPON',
  MARKETING_PAYMENT_LINK: 'MARKETING-PAYMENT_LINK',
  MARKETING_OTP: 'MARKETING-OTP',
  MARKETING_BANNER: 'MARKETING-BANNER',
  MARKETING_NOTIFICATION: 'MARKETING-NOTIFICATION',
  FINANCE_ORDER: 'FINANCE-ORDER',
  FINANCE_TOPUP: 'FINANCE-TOPUP',
  FINANCE_BCOMBO: 'FINANCE-BCOMBO',
  FINANCE_DIRECT_SALES: 'FINANCE-DIRECT_SALES',
  MARKETING_ALL_USER: 'MARKETING_ALL_USER',
  CUSTOMER_OVERVIEW: 'CUSTOMER_OVERVIEW',
  CUSTOMER_REGISTERED: 'CUSTOMER_REGISTERED',
  CUSTOMER_DIRECT_SALE: 'CUSTOMER_DIRECT_SALE',
  CUSTOMER_TICKETS: 'CUSTOMER_TICKETS',
  CATEGORY: 'CATEGORY',
  CATEGORY_ADDON: 'CATEGORY-ADDON',
  POPULAR_SERVICE: 'POPULAR-SERVICE',
  PRODUCT: 'PRODUCT',
  PRODUCT_OPTION: 'PRODUCT-OPTION',
  SETUP_ITEM: 'SETUP-ITEM',
  SETUP_SCHEDULE: 'SETUP-SCHEDULE',
  ACTIVITY_LOG: 'ACTIVITY_LOG',
  RBAC: 'RBAC',
  ADMIN_USERS: 'ADMIN_USERS',
} as const

export type ModuleKey = (typeof MODULES)[keyof typeof MODULES]

export type ModuleDefinition = {
  key: string
  label: string
  section: string
  /** Actions this module actually exposes in the UI (drives N/A cells + button gating). */
  actions: ActionKey[]
}

const CUSTOMER_ACTIONS: ActionKey[] = [ACTIONS.VIEW, ACTIONS.ADD, ACTIONS.UPDATE, ACTIONS.DELETE, ACTIONS.EXPORT]
const CRUD_ACTIONS: ActionKey[] = [ACTIONS.VIEW, ACTIONS.ADD, ACTIONS.UPDATE, ACTIONS.DELETE]

export const MODULE_REGISTRY: ModuleDefinition[] = [
  { key: MODULES.DASHBOARD, label: 'Dashboard', section: 'Overview', actions: [ACTIONS.VIEW] },
  { key: MODULES.CHAT, label: 'Chat', section: 'Overview', actions: [ACTIONS.VIEW, ACTIONS.ADD, ACTIONS.UPDATE, ACTIONS.DELETE] },

  { key: MODULES.ORDER, label: 'Order', section: 'Operations', actions: [ACTIONS.VIEW, ACTIONS.ADD, ACTIONS.UPDATE, ACTIONS.DELETE, ACTIONS.ASSIGN] },
  { key: MODULES.CLEANER, label: 'Cleaners', section: 'Operations', actions: CRUD_ACTIONS },

  { key: MODULES.PARTNER, label: 'Partners', section: 'Partner Management', actions: [ACTIONS.VIEW, ACTIONS.ADD, ACTIONS.UPDATE, ACTIONS.DELETE, ACTIONS.ASSIGN] },
  { key: MODULES.PARTNER_ONBOARDING, label: 'Partner Onboarding', section: 'Partner Management', actions: [ACTIONS.VIEW, ACTIONS.UPDATE] },
  { key: MODULES.PARTNER_TRACKING, label: 'Partner Tracking', section: 'Partner Management', actions: [ACTIONS.VIEW, ACTIONS.ASSIGN] },
  { key: MODULES.PARTNER_PAYOUT, label: 'Partner Payout', section: 'Partner Management', actions: [ACTIONS.VIEW, ACTIONS.UPDATE, ACTIONS.EXPORT, ACTIONS.CONFIRM] },

  { key: MODULES.MARKETING_OVERVIEW, label: 'Marketing Overview', section: 'Business Growth', actions: [ACTIONS.VIEW] },
  { key: MODULES.MARKETING_COUPON, label: 'Coupon', section: 'Business Growth', actions: CRUD_ACTIONS },
  { key: MODULES.MARKETING_PAYMENT_LINK, label: 'Payment Link', section: 'Business Growth', actions: [ACTIONS.VIEW, ACTIONS.ADD, ACTIONS.UPDATE, ACTIONS.EXPORT, ACTIONS.CONFIRM] },
  { key: MODULES.MARKETING_OTP, label: 'OTP', section: 'Business Growth', actions: [ACTIONS.VIEW] },
  { key: MODULES.MARKETING_BANNER, label: 'Banner', section: 'Business Growth', actions: CRUD_ACTIONS },
  { key: MODULES.MARKETING_NOTIFICATION, label: 'Push Notification', section: 'Business Growth', actions: CRUD_ACTIONS },
  { key: MODULES.FINANCE_ORDER, label: 'Finance › Orders', section: 'Business Growth', actions: [ACTIONS.VIEW, ACTIONS.EXPORT] },
  { key: MODULES.FINANCE_TOPUP, label: 'Finance › Top-up', section: 'Business Growth', actions: [ACTIONS.VIEW, ACTIONS.ADD, ACTIONS.EXPORT] },
  { key: MODULES.FINANCE_BCOMBO, label: 'Finance › BCombo', section: 'Business Growth', actions: [ACTIONS.VIEW, ACTIONS.EXPORT] },
  { key: MODULES.FINANCE_DIRECT_SALES, label: 'Finance › Direct Sales', section: 'Business Growth', actions: [ACTIONS.VIEW, ACTIONS.EXPORT] },
  { key: MODULES.MARKETING_ALL_USER, label: 'All Users', section: 'Business Growth', actions: CUSTOMER_ACTIONS },

  { key: MODULES.CUSTOMER_OVERVIEW, label: 'Customer Overview', section: 'Support & Config', actions: CUSTOMER_ACTIONS },
  { key: MODULES.CUSTOMER_REGISTERED, label: 'Registered Customers', section: 'Support & Config', actions: CUSTOMER_ACTIONS },
  { key: MODULES.CUSTOMER_DIRECT_SALE, label: 'Direct Sale Customers', section: 'Support & Config', actions: CUSTOMER_ACTIONS },
  { key: MODULES.CUSTOMER_TICKETS, label: 'Tickets', section: 'Support & Config', actions: CUSTOMER_ACTIONS },

  { key: MODULES.CATEGORY, label: 'Category', section: 'Setup', actions: CRUD_ACTIONS },
  { key: MODULES.CATEGORY_ADDON, label: 'Category Add-on', section: 'Setup', actions: CRUD_ACTIONS },
  { key: MODULES.POPULAR_SERVICE, label: 'Popular Service', section: 'Setup', actions: CRUD_ACTIONS },
  { key: MODULES.PRODUCT, label: 'Product', section: 'Setup', actions: CRUD_ACTIONS },
  { key: MODULES.PRODUCT_OPTION, label: 'Product Option', section: 'Setup', actions: CRUD_ACTIONS },
  { key: MODULES.SETUP_ITEM, label: 'Items', section: 'Setup', actions: CRUD_ACTIONS },
  { key: MODULES.SETUP_SCHEDULE, label: 'Blocked Schedule', section: 'Setup', actions: CRUD_ACTIONS },
  { key: MODULES.RBAC, label: 'Roles & Permissions', section: 'Setup', actions: CRUD_ACTIONS },
  { key: MODULES.ADMIN_USERS, label: 'Users', section: 'Setup', actions: [ACTIONS.VIEW, ACTIONS.ADD, ACTIONS.UPDATE] },
  { key: MODULES.ACTIVITY_LOG, label: 'Activity Log', section: 'Setup', actions: [ACTIONS.VIEW] },
]

export const MODULE_REGISTRY_BY_KEY = new Map(MODULE_REGISTRY.map((m) => [m.key, m]))

export const ACTION_CATALOG: { key: ActionKey; label: string }[] = Array.from(
  new Set(MODULE_REGISTRY.flatMap((m) => m.actions))
).map((key) => ({ key, label: ACTION_LABELS[key] ?? key }))
