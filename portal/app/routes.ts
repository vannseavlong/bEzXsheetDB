import { type RouteConfig, index, layout, route } from '@react-router/dev/routes';

export default [
  layout('./protected-layout.tsx', [
    layout('routes/dashboard-layout.tsx', [
      index('routes/dashboard.tsx'),

      // finance
      route('top-up', 'routes/finance/top-up.tsx'),
      route('top-up/new', 'routes/finance/new-top-up.tsx'),
      route('finance-orders', 'routes/finance/finance-orders.tsx'),
      route('b-combos', 'routes/finance/b-combos.tsx'),
      route('direct-sales', 'routes/finance/direct-sales.tsx'),
      route('all-user', 'routes/finance/all-user.tsx'),
      route('coupons', 'routes/finance/coupon.tsx'),

      // setup
      route('item', 'routes/item/item.tsx'),
      route('item/:id', 'routes/item/new-item.tsx'),

      route('blocked-schedule', 'routes/blocked-schedule/blocked-schedule.tsx'),
      route('blocked-schedule/:id', 'routes/blocked-schedule/new-blocked-schedule.tsx'),

      route('activity-log', 'routes/activityLog/activityLog.tsx'),

      // ## Marketing Group ##
      route('push-notification', 'routes/push-notification/push-notification.tsx'),
      route('push-notification/:id', 'routes/push-notification/new-push-notification.tsx'),
      route(
        'push-notification/:id/detail',
        'routes/push-notification/push-notification-detail.tsx'
      ),
      route('overview', 'routes/marketing/overview.tsx'),

      // ## Cleaner Group ##
      route('cleaner', 'routes/cleaner/cleaner.tsx'),
      route('cleaner/new', 'routes/cleaner/create-cleaner.tsx'),
      route('cleaner/:id', 'routes/cleaner/edit-cleaner.tsx'),

      // ## Counpon Group ##
      route('coupon', 'routes/coupon/coupon.tsx'),
      route('coupon/:id', 'routes/coupon/new-coupon.tsx'),

      // ## Counpon Group ##
      route('payment-link', 'routes/payment-link/payment-link.tsx'),
      route('payment-link/:id', 'routes/payment-link/new-payment-link.tsx'),

      // // services group
      route('category', 'routes/category/category.tsx'),
      route('category/:id', 'routes/category/new-category.tsx'),
      route('category-addon', 'routes/category-addon/category-addon.tsx'),
      route('category-addon/:id', 'routes/category-addon/new-category-addon.tsx'),
      route('product', 'routes/product/product.tsx'),
      route('product/:id', 'routes/product/new-product.tsx'),
      route('product-option', 'routes/product-option/product-option.tsx'),
      route('product-option/:id', 'routes/product-option/new-product-option.tsx'),

      route('customer-overview', 'routes/customer-services/overview.tsx'),
      route('direct-sale-customer', 'routes/customer-services/direct-sale-customer.tsx'),
      route('customer', 'routes/customer-services/customer.tsx'),
      route('registered-customer', 'routes/customer-services/registered-customer.tsx'),

      // // ## Marketing Group ##
      // route('promotions', 'routes/promotion/promotions.tsx'),
      // route('promotions/:id', 'routes/promotion/new-promotion.tsx'),
      route('otp', 'routes/otp.tsx'),
      // route('service-bundle', 'routes/service-bundle/service-bundle.tsx'),
      // route('service-bundle/:id', 'routes/service-bundle/new-service-bundle.tsx'),

      // // Voucher routes
      // route('voucher', 'routes/voucher/voucher.tsx'),
      // route('voucher/new-voucher', 'routes/voucher/new-voucher.tsx'),
      // route('voucher/:voucherId', 'routes/voucher/edit-voucher.tsx'),

      // route('referral-program', 'routes/referral-program.tsx'),
      route('banner', 'routes/banner/banner.tsx'),
      route('banner/new-banner', 'routes/banner/new-banner.tsx')
      // route('push-notification', 'routes/push-notification.tsx'),
      // route('/push-notification/new-push-notification', 'routes/new-push-notification.tsx'),
      // route('finance', 'routes/finance.tsx'),

      // // setup
      // route('users', 'routes/users.tsx'),
      // route('roles', 'routes/roles.tsx'),
      // route('roles/new-roles', 'routes/new-role.tsx'),
      // route('users/new-user', 'routes/new-user.tsx')
    ]),
    layout('routes/order/layout.tsx', [route('order', 'routes/order/order.tsx')]),
    layout('routes/calendar/layout.tsx', [route('calendar', 'routes/calendar/calendar.tsx')])
  ]),
  route('login', 'routes/auth/login.tsx')
] satisfies RouteConfig;
