import type { ElementType } from 'react';
import {
  BubbleChatIcon,
  Calendar03Icon,
  CustomerSupportIcon,
  DashboardSquare01Icon,
  PromotionIcon,
  SaveMoneyDollarIcon,
  Settings01Icon,
  ShoppingCart01Icon,
  UserGroupIcon,
  UserMultipleIcon,
} from 'hugeicons-react';
import { MODULES } from '@/lib/permission-registry';

// ─── Types ────────────────────────────────────────────────────────────────────

export type NavSubItem = {
  title: string;
  url: string;
  /** Permission module required for VIEW. Omit to always show. */
  module?: string;
};

export type NavItem = {
  title: string;
  url?: string;
  icon: ElementType;
  badge?: number;
  disabled?: boolean;
  /** Permission module required for VIEW. Omit to always show. */
  module?: string;
  items?: NavSubItem[];
};

export type NavSection = {
  label: string;
  items: NavItem[];
};

// ─── Configuration ────────────────────────────────────────────────────────────

export const navSections: NavSection[] = [
  {
    label: 'Overview',
    items: [
      { title: 'Dashboard', url: '/', icon: DashboardSquare01Icon, module: MODULES.DASHBOARD },
      { title: 'Calendar', url: '/calendar', icon: Calendar03Icon },
      { title: 'Chat', url: '/chat', icon: BubbleChatIcon, module: MODULES.CHAT },
    ],
  },
  {
    label: 'Operations',
    items: [
      { title: 'Order', url: '/order', icon: ShoppingCart01Icon, module: MODULES.ORDER },
      { title: 'Cleaners', url: '/cleaner', icon: UserMultipleIcon, module: MODULES.CLEANER },
    ],
  },
  {
    label: 'Partner Management',
    items: [
      {
        title: 'Partners',
        icon: UserGroupIcon,
        items: [
          { title: 'Partners', url: '/partner', module: MODULES.PARTNER },
          { title: 'Onboarding', url: '/partner/onboarding', module: MODULES.PARTNER_ONBOARDING },
          { title: 'Tracking', url: '/partner/tracking', module: MODULES.PARTNER_TRACKING },
          { title: 'Payout', url: '/partner/payout', module: MODULES.PARTNER_PAYOUT },
        ],
      },
    ],
  },
  {
    label: 'Business Growth',
    items: [
      {
        title: 'Marketing',
        icon: PromotionIcon,
        items: [
          { title: 'Overview', url: '/overview', module: MODULES.MARKETING_OVERVIEW },
          { title: 'Coupon', url: '/coupon', module: MODULES.MARKETING_COUPON },
          { title: 'Payment Link', url: '/payment-link', module: MODULES.MARKETING_PAYMENT_LINK },
          { title: 'OTP', url: '/otp', module: MODULES.MARKETING_OTP },
          { title: 'Banner', url: '/banner', module: MODULES.MARKETING_BANNER },
          { title: 'Push Notification', url: '/push-notification', module: MODULES.MARKETING_NOTIFICATION },
        ],
      },
      {
        title: 'Finance',
        icon: SaveMoneyDollarIcon,
        items: [
          { title: 'Orders', url: '/finance-orders', module: MODULES.FINANCE_ORDER },
          { title: 'Top Up', url: '/top-up', module: MODULES.FINANCE_TOPUP },
          { title: 'B-Combos', url: '/b-combos', module: MODULES.FINANCE_BCOMBO },
          { title: 'Direct Sales', url: '/direct-sales', module: MODULES.FINANCE_DIRECT_SALES },
          { title: 'All User', url: '/all-user', module: MODULES.MARKETING_ALL_USER },
          { title: 'Coupons', url: '/coupons', module: MODULES.MARKETING_COUPON },
        ],
      },
    ],
  },
  {
    label: 'Support & Config',
    items: [
      {
        title: 'Customer Service',
        icon: CustomerSupportIcon,
        items: [
          { title: 'Overview', url: '/customer-overview', module: MODULES.CUSTOMER_OVERVIEW },
          { title: 'Customer', url: '/customer', module: MODULES.CUSTOMER_REGISTERED },
          { title: 'Direct Sales', url: '/direct-sale-customer', module: MODULES.CUSTOMER_DIRECT_SALE },
          { title: 'Registered Customers', url: '/registered-customer', module: MODULES.CUSTOMER_REGISTERED },
          { title: 'Tickets', url: '/tickets', module: MODULES.CUSTOMER_TICKETS },
        ],
      },
    ],
  },
  {
    label: 'Setup',
    items: [
      {
        title: 'Setup',
        icon: Settings01Icon,
        items: [
          { title: 'Category', url: '/category', module: MODULES.CATEGORY },
          { title: 'Category Addon', url: '/category-addon', module: MODULES.CATEGORY_ADDON },
          { title: 'Popular Service', url: '/popular-service', module: MODULES.POPULAR_SERVICE },
          { title: 'Product', url: '/product', module: MODULES.PRODUCT },
          { title: 'Product Option', url: '/product-option', module: MODULES.PRODUCT_OPTION },
          { title: 'Items', url: '/item', module: MODULES.SETUP_ITEM },
          { title: 'Blocked Schedule', url: '/blocked-schedule', module: MODULES.SETUP_SCHEDULE },
          { title: 'Roles & Permissions', url: '/roles', module: MODULES.RBAC },
          { title: 'Users', url: '/admin-users', module: MODULES.ADMIN_USERS },
          { title: 'Activity Log', url: '/activity-log', module: MODULES.ACTIVITY_LOG },
        ],
      },
    ],
  },
];
