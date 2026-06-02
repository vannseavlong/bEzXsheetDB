import { ACTIONS, MODULES } from '@/lib/permission'

export const PERMISSION_COLUMNS = [
  { key: ACTIONS.VIEW, label: 'View' },
  { key: ACTIONS.ADD, label: 'Add' },
  { key: ACTIONS.UPDATE, label: 'Edit' },
  { key: ACTIONS.DELETE, label: 'Delete' },
  { key: ACTIONS.EXPORT, label: 'Export' },
  { key: ACTIONS.ASSIGN, label: 'Assign' },
  { key: ACTIONS.CONFIRM, label: 'Mark Paid' },
] as const

export type ModuleRow = {
  key: string
  label: string
  applicableActions: string[]
}

export type ModuleSection = {
  sectionLabel: string
  modules: ModuleRow[]
}

export const MODULE_SECTIONS: ModuleSection[] = [
  {
    sectionLabel: 'Core',
    modules: [
      { key: MODULES.DASHBOARD, label: 'Dashboard', applicableActions: [ACTIONS.VIEW] },
      {
        key: MODULES.ORDER,
        label: 'Order',
        applicableActions: [ACTIONS.VIEW, ACTIONS.ADD, ACTIONS.UPDATE, ACTIONS.DELETE, ACTIONS.ASSIGN],
      },
      { key: MODULES.ACTIVITY_LOG, label: 'Activity log', applicableActions: [ACTIONS.VIEW] },
      { key: MODULES.EXCHANGE_RATE, label: 'Exchange rate', applicableActions: [ACTIONS.VIEW, ACTIONS.ADD] },
    ],
  },
  {
    sectionLabel: 'Finance',
    modules: [
      { key: MODULES.FINANCE_ORDER, label: 'Finance › Orders', applicableActions: [ACTIONS.VIEW, ACTIONS.EXPORT] },
      { key: MODULES.FINANCE_TOPUP, label: 'Finance › Top-up', applicableActions: [ACTIONS.VIEW, ACTIONS.ADD, ACTIONS.EXPORT] },
      { key: MODULES.FINANCE_BCOMBO, label: 'Finance › BCombo', applicableActions: [ACTIONS.VIEW, ACTIONS.EXPORT] },
      { key: MODULES.FINANCE_DIRECT_SALES, label: 'Finance › Direct sales', applicableActions: [ACTIONS.VIEW, ACTIONS.EXPORT] },
    ],
  },
  {
    sectionLabel: 'Partner',
    modules: [
      {
        key: MODULES.PARTNER,
        label: 'Partners',
        applicableActions: [ACTIONS.VIEW, ACTIONS.ADD, ACTIONS.UPDATE, ACTIONS.DELETE],
      },
    ],
  },
  {
    sectionLabel: 'Cleaner',
    modules: [
      {
        key: MODULES.CLEANER,
        label: 'Cleaners',
        applicableActions: [ACTIONS.VIEW, ACTIONS.ADD, ACTIONS.UPDATE, ACTIONS.DELETE],
      },
    ],
  },
  {
    sectionLabel: 'Marketing',
    modules: [
      {
        key: MODULES.MARKETING_COUPON,
        label: 'Coupon',
        applicableActions: [ACTIONS.VIEW, ACTIONS.ADD, ACTIONS.UPDATE, ACTIONS.DELETE, ACTIONS.EXPORT],
      },
      {
        key: MODULES.MARKETING_PAYMENT_LINK,
        label: 'Payment Link',
        applicableActions: [ACTIONS.VIEW, ACTIONS.ADD, ACTIONS.UPDATE, ACTIONS.DELETE, ACTIONS.EXPORT],
      },
      { key: MODULES.MARKETING_OTP, label: 'OTP', applicableActions: [ACTIONS.VIEW] },
      {
        key: MODULES.MARKETING_BANNER,
        label: 'Banner',
        applicableActions: [ACTIONS.VIEW, ACTIONS.ADD, ACTIONS.UPDATE, ACTIONS.DELETE],
      },
      {
        key: MODULES.MARKETING_NOTIFICATION,
        label: 'Push Notification',
        applicableActions: [ACTIONS.VIEW, ACTIONS.ADD, ACTIONS.UPDATE, ACTIONS.DELETE],
      },
    ],
  },
  {
    sectionLabel: 'Setup',
    modules: [
      {
        key: MODULES.SETUP_ITEM,
        label: 'Items',
        applicableActions: [ACTIONS.VIEW, ACTIONS.ADD, ACTIONS.UPDATE, ACTIONS.DELETE],
      },
      {
        key: MODULES.SETUP_SCHEDULE,
        label: 'Blocked Schedule',
        applicableActions: [ACTIONS.VIEW, ACTIONS.ADD, ACTIONS.UPDATE, ACTIONS.DELETE],
      },
      {
        key: MODULES.RBAC,
        label: 'Roles & Permissions',
        applicableActions: [ACTIONS.VIEW, ACTIONS.ADD, ACTIONS.UPDATE, ACTIONS.DELETE],
      },
    ],
  },
]

function buildFullPermissions(): Record<string, string[]> {
  const perms: Record<string, string[]> = {}
  for (const section of MODULE_SECTIONS) {
    for (const mod of section.modules) {
      perms[mod.key] = [...mod.applicableActions]
    }
  }
  return perms
}

export type RbacRole = {
  id: string
  initials: string
  name: string
  description: string
  color: string
  isLocked?: boolean
  defaultPermissions: Record<string, string[]>
}

export const RBAC_ROLES: RbacRole[] = [
  {
    id: 'super-admin',
    initials: 'SA',
    name: 'Super Admin',
    description: 'Full access to every module and setting',
    color: '#EF4444',
    isLocked: true,
    defaultPermissions: buildFullPermissions(),
  },
  {
    id: 'ops-manager',
    initials: 'OM',
    name: 'Ops Manager',
    description: 'Access to operations: orders, cleaners, and scheduling',
    color: '#3B82F6',
    defaultPermissions: {
      [MODULES.DASHBOARD]: [ACTIONS.VIEW],
      [MODULES.ORDER]: [ACTIONS.VIEW, ACTIONS.ADD, ACTIONS.UPDATE, ACTIONS.ASSIGN],
      [MODULES.CLEANER]: [ACTIONS.VIEW, ACTIONS.ADD, ACTIONS.UPDATE],
      [MODULES.SETUP_SCHEDULE]: [ACTIONS.VIEW, ACTIONS.ADD, ACTIONS.UPDATE, ACTIONS.DELETE],
      [MODULES.ACTIVITY_LOG]: [ACTIONS.VIEW],
    },
  },
  {
    id: 'finance',
    initials: 'FN',
    name: 'Finance',
    description: 'Access to financial reports and transactions',
    color: '#10B981',
    defaultPermissions: {
      [MODULES.DASHBOARD]: [ACTIONS.VIEW],
      [MODULES.FINANCE_ORDER]: [ACTIONS.VIEW, ACTIONS.EXPORT],
      [MODULES.FINANCE_TOPUP]: [ACTIONS.VIEW, ACTIONS.ADD, ACTIONS.EXPORT],
      [MODULES.FINANCE_BCOMBO]: [ACTIONS.VIEW, ACTIONS.EXPORT],
      [MODULES.FINANCE_DIRECT_SALES]: [ACTIONS.VIEW, ACTIONS.EXPORT],
    },
  },
  {
    id: 'marketing',
    initials: 'MK',
    name: 'Marketing',
    description: 'Access to marketing tools: coupons, banners, and campaigns',
    color: '#F59E0B',
    defaultPermissions: {
      [MODULES.DASHBOARD]: [ACTIONS.VIEW],
      [MODULES.MARKETING_COUPON]: [ACTIONS.VIEW, ACTIONS.ADD, ACTIONS.UPDATE, ACTIONS.DELETE],
      [MODULES.MARKETING_PAYMENT_LINK]: [ACTIONS.VIEW, ACTIONS.ADD, ACTIONS.UPDATE, ACTIONS.DELETE],
      [MODULES.MARKETING_OTP]: [ACTIONS.VIEW],
      [MODULES.MARKETING_BANNER]: [ACTIONS.VIEW, ACTIONS.ADD, ACTIONS.UPDATE, ACTIONS.DELETE],
      [MODULES.MARKETING_NOTIFICATION]: [ACTIONS.VIEW, ACTIONS.ADD, ACTIONS.UPDATE, ACTIONS.DELETE],
    },
  },
  {
    id: 'partner-manager',
    initials: 'PM',
    name: 'Partner Manager',
    description: 'Access to partner management, onboarding, and payouts',
    color: '#8B5CF6',
    defaultPermissions: {
      [MODULES.DASHBOARD]: [ACTIONS.VIEW],
      [MODULES.PARTNER]: [ACTIONS.VIEW, ACTIONS.ADD, ACTIONS.UPDATE, ACTIONS.DELETE],
    },
  },
  {
    id: 'auditor',
    initials: 'AU',
    name: 'Read-only Auditor',
    description: 'View-only access to all modules for auditing purposes',
    color: '#9CA3AF',
    defaultPermissions: Object.fromEntries(
      MODULE_SECTIONS.flatMap((s) => s.modules).map((m) => [m.key, [ACTIONS.VIEW]])
    ),
  },
]
