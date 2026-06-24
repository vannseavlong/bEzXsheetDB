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
      { title: 'Dashboard', url: '/', icon: DashboardSquare01Icon, module: 'DASHBOARD' },
      { title: 'Calendar', url: '/calendar', icon: Calendar03Icon },
      { title: 'Chat', url: '/chat', icon: BubbleChatIcon, module: 'CHAT' },
    ],
  },
  {
    label: 'Operations',
    items: [
      { title: 'Order', url: '/order', icon: ShoppingCart01Icon, module: 'ORDER' },
      { title: 'Cleaners', url: '/cleaner', icon: UserMultipleIcon, module: 'CLEANER' },
    ],
  },
  {
    label: 'Partner Management',
    items: [
      {
        title: 'Partners',
        icon: UserGroupIcon,
        items: [
          { title: 'Partners', url: '/partner', module: 'PARTNER' },
          { title: 'Onboarding', url: '/partner/onboarding', module: 'PARTNER-ONBOARDING' },
          { title: 'Tracking', url: '/partner/tracking', module: 'PARTNER-TRACKING' },
          { title: 'Payout', url: '/partner/payout', module: 'PARTNER-PAYOUT' },
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
          { title: 'Overview', url: '/overview', module: 'MARKETING-OVERVIEW' },
          { title: 'Coupon', url: '/coupon', module: 'MARKETING-COUPON' },
          { title: 'Payment Link', url: '/payment-link', module: 'MARKETING-PAYMENT_LINK' },
          { title: 'OTP', url: '/otp', module: 'MARKETING-OTP' },
          { title: 'Banner', url: '/banner', module: 'MARKETING-BANNER' },
          { title: 'Push Notification', url: '/push-notification', module: 'MARKETING-NOTIFICATION' },
        ],
      },
      {
        title: 'Finance',
        icon: SaveMoneyDollarIcon,
        items: [
          { title: 'Orders', url: '/finance-orders', module: 'FINANCE-ORDER' },
          { title: 'Top Up', url: '/top-up', module: 'FINANCE-TOPUP' },
          { title: 'B-Combos', url: '/b-combos', module: 'FINANCE-BCOMBO' },
          { title: 'Direct Sales', url: '/direct-sales', module: 'FINANCE-DIRECT_SALES' },
          { title: 'All User', url: '/all-user', module: 'MARKETING_ALL_USER' },
          { title: 'Coupons', url: '/coupons', module: 'MARKETING-COUPON' },
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
          { title: 'Overview', url: '/customer-overview', module: 'CUSTOMER_OVERVIEW' },
          { title: 'Customer', url: '/customer', module: 'CUSTOMER_REGISTERED' },
          { title: 'Direct Sales', url: '/direct-sale-customer', module: 'CUSTOMER_DIRECT_SALE' },
          { title: 'Registered Customers', url: '/registered-customer', module: 'CUSTOMER_REGISTERED' },
          { title: 'Tickets', url: '/tickets', module: 'CUSTOMER_TICKETS' },
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
          { title: 'Category', url: '/category', module: 'SETUP-ITEM' },
          { title: 'Category Addon', url: '/category-addon', module: 'SETUP-ITEM' },
          { title: 'Popular Service', url: '/popular-service', module: 'SETUP-ITEM' },
          { title: 'Product', url: '/product', module: 'SETUP-ITEM' },
          { title: 'Product Option', url: '/product-option', module: 'SETUP-ITEM' },
          { title: 'Items', url: '/item', module: 'SETUP-ITEM' },
          { title: 'Blocked Schedule', url: '/blocked-schedule', module: 'SETUP-SCHEDULE' },
          { title: 'Roles & Permissions', url: '/roles', module: 'RBAC' },
          { title: 'Users', url: '/admin-users', module: 'ADMIN_USERS' },
          { title: 'Activity Log', url: '/activity-log', module: 'ACTIVITY_LOG' },
        ],
      },
    ],
  },
];
