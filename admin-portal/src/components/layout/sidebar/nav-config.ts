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
};

export type NavItem = {
  title: string;
  url?: string;
  icon: ElementType;
  badge?: number;
  disabled?: boolean;
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
      { title: 'Dashboard', url: '/', icon: DashboardSquare01Icon },
      { title: 'Calendar', url: '/calendar', icon: Calendar03Icon },
      { title: 'Chat', url: '/chat', icon: BubbleChatIcon },
    ],
  },
  {
    label: 'Operations',
    items: [
      { title: 'Order', url: '/order', icon: ShoppingCart01Icon },
      { title: 'Cleaners', url: '/cleaner', icon: UserMultipleIcon },
    ],
  },
  {
    label: 'Partner Management',
    items: [
      {
        title: 'Partners',
        icon: UserGroupIcon,
        items: [
          { title: 'Partners', url: '/partner' },
          { title: 'Onboarding', url: '/partner/onboarding' },
          { title: 'Tracking', url: '/partner/tracking' },
          { title: 'Payout', url: '/partner/payout' },
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
          { title: 'Overview', url: '/overview' },
          { title: 'Coupon', url: '/coupon' },
          { title: 'Payment Link', url: '/payment-link' },
          { title: 'OTP', url: '/otp' },
          { title: 'Banner', url: '/banner' },
          { title: 'Push Notification', url: '/push-notification' },
        ],
      },
      {
        title: 'Finance',
        icon: SaveMoneyDollarIcon,
        items: [
          { title: 'Orders', url: '/finance-orders' },
          { title: 'Top Up', url: '/top-up' },
          { title: 'B-Combos', url: '/b-combos' },
          { title: 'Direct Sales', url: '/direct-sales' },
          { title: 'All User', url: '/all-user' },
          { title: 'Coupons', url: '/coupons' },
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
          { title: 'Overview', url: '/customer-overview' },
          { title: 'Customer', url: '/customer' },
          { title: 'Direct Sales', url: '/direct-sale-customer' },
          { title: 'Registered Customers', url: '/registered-customer' },
          { title: 'Tickets', url: '/tickets' },
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
          { title: 'Category', url: '/category' },
          { title: 'Category Addon', url: '/category-addon' },
          { title: 'Popular Service', url: '/popular-service' },
          { title: 'Product', url: '/product' },
          { title: 'Product Option', url: '/product-option' },
          { title: 'Items', url: '/item' },
          { title: 'Blocked Schedule', url: '/blocked-schedule' },
          { title: 'Activity Log', url: '/activity-log' },
        ],
      },
    ],
  },
];
