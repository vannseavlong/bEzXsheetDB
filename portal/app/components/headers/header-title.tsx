import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';

const getPageTitle = (path: string): string => {
  if (DASHBOARD_TITLE[path]) return DASHBOARD_TITLE[path];
  // Dynamic match (e.g., /employees/resignation/123)
  for (const key of Object.keys(DASHBOARD_TITLE)) {
    if (key.includes(':')) {
      // Convert '/employees/resignation/:id' to a regex like ^/employees/resignation/[^/]+$
      const regex = new RegExp('^' + key.replace(/:[^/]+/g, '[^/]+') + '$');
      if (regex.test(path)) return DASHBOARD_TITLE[key];
    }
  }
  return path;
};

const DASHBOARD_TITLE: DashboardTitleProps = {
  '/': 'header.dashboard',
  '/users': 'header.users',
  '/users/new-user': 'header.newUser',

  '/category': 'header.category',
  '/category/new': 'header.newCategory',
  '/category/:id': 'header.editCategory',

  '/category-addon': 'header.categoryAddon',
  '/category-addon/new': 'header.newCategoryAddon',
  '/category-addon/:id': 'header.editCategoryAddon',

  '/product': 'header.product',
  '/product/new': 'header.newProduct',
  '/product/:id': 'header.editProduct',

  '/product-option': 'header.productOption',
  '/product-option/new': 'header.newProductOption',

  '/customer-overview': 'Customer Overview',
  '/customer': 'header.customer',

  '/voucher': 'header.voucher',
  '/voucher/new-voucher': 'header.newVoucher',
  '/voucher/:id': 'header.editVoucher',

  '/promotions': 'header.promotions',
  '/promotions/new': 'header.newPromotion',

  '/push-notification': 'header.pushNotification',
  '/push-notification/new': 'header.newPushNotification',
  '/push-notification/:id/detail': 'header.detailPushNotification',
  '/push-notification/:id': 'header.resendPushNotification',

  '/finance': 'header.finance',
  '/roles': 'header.roles',
  '/roles/new-roles': 'header.newRoles',

  '/banner': 'header.banner',
  '/banner/new': 'header.newBanner',
  '/banner/new-banner': 'header.newBanner',
  '/service-bundle': 'header.serviceBundle',
  '/service-bundle/new': 'header.newServiceBundle',

  '/referral-program': 'header.referralProgram',
  '/notifications': 'header.notifications',
  '/setup': 'header.setup',

  '/top-up': 'header.topUp',
  '/finance-orders': 'header.financeOrders',
  '/b-combos': 'header.bCombos',
  '/direct-sales': 'header.directSales',
  '/all-user': 'All User',
  '/coupons': 'Coupons',

  '/item': 'header.items',
  '/item/new': 'header.newItem',
  '/item/:id': 'header.editItem',

  '/activity-log': 'Activity Log',

  '/cleaner': 'header.cleaners',
  '/cleaner/new': 'header.newCleaner',
  '/cleaner/:id': 'header.editCleaner',

  '/coupon': 'header.coupon',
  '/coupon/new': 'header.newCoupon',
  '/coupon/:id': 'header.editCoupon',

  '/payment-link': 'Payment Link',
  '/payment-link/new': 'New Payment Link',
  '/payment-link/:id': 'Edit Payment Link',

  '/otp': 'header.otp',
  '/blocked-schedule': 'header.blockedSchedule',
  '/blocked-schedule/new': 'header.newBlockedSchedule',
  '/blocked-schedule/:id': 'header.editBlockedSchedule',

  '/top-up/new': 'header.newTopUp',
  '/overview': 'Overview',
  '/registered-customer': 'Registered Customers',
  '/direct-sale-customer': 'Direct Sale Customers'
};

const EDIT_OVERRIDES: Record<string, string> = {
  '/banner/new-banner': 'header.updateBanner',
  '/category/new': 'header.editCategory',
  '/product/new': 'header.editProduct'
};

export default function HeaderTitle() {
  const location = useLocation();
  const { t } = useTranslation();
  const searchParams = new URLSearchParams(location.search);
  const hasId = !!searchParams.get('id');
  const editOverride = hasId ? EDIT_OVERRIDES[location.pathname] : undefined;
  const titleKey = editOverride ?? getPageTitle(location.pathname);

  useEffect(() => {}, []);
  return <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold">{t(titleKey)}</p>;
}
