export const API_ENDPOINT = {
  LOGIN: 'auth/account/login',
  PROFILE: 'profile/info',
  LOGOUT: 'logout',
  CHANGE_PASSWORD: 'profile/password/update',
  UPDATE_PROFILE: 'profile/info/update',

  ORDERS: 'order/list',
  CALENDAR_ORDERS: 'order/calendar/list',
  ORDER_DETAIL: 'order',
  UPDATE_ORDER_STATUS: 'order/update',
  ADD_ORDER_ADDON: 'order/add-extra-addon',
  EXPEND_SHORT_LINK: 'order/expend-short-link',

  CATEGORIES: 'category/list',
  CATEGORY_CREATE: 'category/create',
  CATEGORY_UPDATE: 'category/update/{id}',
  CATEGORY_DELETE: 'category/delete/{id}',
  CATEGORY_DETAIL: 'category/{id}',
  CATEGORIES_NAME: 'category/list-names',
  PRODUCT_DETAIL_BY_CATEGORY_ID: 'category/{id}/product/list',
  PRODUCT_ADD_ON_BY_CATEGORY_ID: 'category/{categoryId}/product-add-on',
  CATEGORY_REARRANGE: 'category/rearrange',
  EXPORT_EXCEL: 'fileExport',
  PRINT: 'fileExport/cleaner-client-tasks',
  TOPUP: 'topup/list',

  ANNOUNCEMENTS: 'announcement/list',
  ANNOUNCEMENT_PAGE_URLS: 'announcement/page-urls',
  CREATE_ANNOUNCEMENT: 'announcement/create',
  RESEND_ANNOUNCEMENT: 'announcement/{id}/resend',
  DETAIL_ANNOUNCEMENT: 'announcement/{id}',
  ANNOUNCEMENT_USERS: 'announcement/{id}/users',
  ANNOUNCEMENT_COUPONS: 'announcement/users',

  BANNERS: 'banner/list',
  BANNER_REARRANGE: 'banner/rearrange',
  BANNER_DETAIL: 'banner/detail/{id}',
  CREATE_BANNER: 'banner/create',
  DELETE_BANNER: 'banner/delete/{id}',
  UPDATE_BANNER: 'banner/update',

  CLEANER_DETAIL: 'cleaner/{id}',
  CLEANERS: 'cleaner/list',
  CRAETE_CLEANER: 'cleaner/create',
  UPDATE_CLEANER: 'cleaner/update/{id}',
  UPDATE_CLEANER_EXPERTISE: 'cleaner/update/expertise/{id}',

  ADD_CLEANER_DETAIL: 'cleaner/add-cleaner-detail',
  ASSIGN_CLEANER: 'cleaner/assign',

  UPDATE_SERVICE_ITEM: 'service-item/update/{id}',
  SERVICE_ITEM_DETAIL: 'service-item/item/{id}',
  SERVICE_ITEMS: 'service-item/list/item',
  CREATE_SERVICE_ITEM: 'service-item/create/item',
  ADD_SERVICE_DETAILS: 'service-item/add-service-details',

  CUSTOMERS: 'customer/list',
  CUSTOMER_TYPE_DIRECT_SALE: 'customer/direct-sale-users',
  RESOUCE_REFERRAL: 'customer/resource-referral',
  OTP: 'customer/otp',

  UPDATE_CUSTOMER_SERVICE: 'customer-service/create',
  RESCHEDULE: 'order/reschedule/{id}',
  CANCEL_ORDER: 'order/cancel/{id}',

  CREATE_COUPON: 'coupon/create',
  UPDATE_COUPON: 'coupon/update',
  COUPONS: 'coupon/list',
  COUPON_DETAIL: 'coupon/detail/{id}',
  ADD_USER_TO_COUPON: 'coupon/add-user',
  REMOVE_USER_FROM_COUPON: 'coupon/remove-user',
  GET_SELECTED_PRODUCT_DETAIL: 'coupon/{id}/selected-product/list',

  ACTIVITY_LOGS: 'activity-log/list',

  BLOCKED_SCHEDULE: 'order-schedule/list',
  CREATE_BLOCKED_SCHEDULE: 'order-schedule/create',
  UPDATE_BLOCKED_SCHEDULE: 'order-schedule/update',
  BLOCKED_SCHEDULE_DETAIL: 'order-schedule/{id}',

  CREATE_TOPUP: 'topup/add',
  CHECK_TOPUP_PAYMENT_STATUS: 'topup/check-payment-status',

  // ASSIGN COUPON
  PAYMENT_LINK: 'payment-link/list',
  ADD_PAYMENT_LINK: 'payment-link/add',
  CHECK_PAYMENT_STATUS: 'payment-link/check-payment-status',

  COUPON_LIST_SUMMARY: 'coupon/list/summary',
  PRODUCT_OPTION_BY_PRODUCT_ID: 'product/{id}/product-option',

  DIRECT_SALE_PREVIEW: 'direct-sale/preview',
  DIRECT_SALE_USERS: 'direct-sale/users',
  DIRECT_SALE_USERS_ADDRESS: 'direct-sale/users-address',
  ADD_DIRECT_SALE_USERS_ADDRESS: 'direct-sale/add-users-address',
  GET_DATA_DIRECT_SALE: 'direct-sale/get-data',
  CREATE_DIRECT_ORDER: 'direct-sale/create-order',
  UPDATE_DIRECT_SALE: 'direct-sale/edit-directsale/{id}',

  PRINT_VAT_INVOICE: 'fileExport/vat-invoice',
  ABA_PAYMENT_STATUS: 'order/aba-payment-status',
  PRODUCT_DIRECT_SALE: 'direct-sale/list-product',
  EDIT_NOTE: 'direct-sale/edit-note/{id}',
  LIST_DIRECT_SALE: 'direct-sale/list',

  MARK_AS_PAID: 'order/update/payment-status/{id}',
  DELETE_RECEIPT: 'order/delete-receipt/{id}',

  MARKETING_OVERVIEW: 'marketing/overview',
  MARKETING_OVERVIEW_ALL: 'marketing/overview/all',
  REGISTER_CUSTOMER: 'customer/register-customer',
  CUSRTOMER_RATING_DETAILS: 'customer/rating/{id}',
  EXISTED_CUSTOMER: 'customer/existed',
  OVERVIEW_CUSTOMER: 'customer/overview',
  CREATE_DIRECT_SALE_CUSTOMER: 'customer/create-direct-sale-customer',
  CUSTOMER_LAST_CONTACT_DATE: 'customer/last-contact/{id}',
  CUSTOMER_DIRECT_SALE_USERS: 'customer/direct-sale-order-users',

  // dashboard
  DASHBOARD_OVERVIEW: 'dashboard/overview',
  DASHBOARD_TOTAL_DOWNLOAD: 'dashboard/total-download',
  DASHBOARD_NEW_USER: 'dashboard/new-users',
  DAILY_EVENT_MATRIC: 'dashboard/daily-metrics',
  UPCOMING_ORDER: 'order/upcoming',
  EXCHANGE_RATE_LIST: 'exchange-rate/list',
  UPDATE_EXCHANGE_RATE: 'order/exchange-rate/{id}',
  SALE_TARGET: 'dashboard/sale-target',
  ADS_DATA: 'dashboard/ads-data',

  BLOCKED_TIME_LIST: 'block-time/list',
  BLOCKED_TIME_CREATE: 'block-time/create',
  BLOCKED_TIME_UPDATE: 'block-time/update/{id}',
  BLOCKED_TIME_DELETE: 'block-time/delete/{id}',

  PRODUCT_LIST: 'product/list',
  PRODUCT_OPTION_LIST: 'product/option/list',
  PRODUCT_CREATE: 'product/create',
  PRODUCT_DETAIL: 'product/{id}',
  PRODUCT_UPDATE: 'product/update/{id}',
  PRODUCT_ADDON_LIST: 'category/product-add-on/list',
  PRODUCT_ADDON_GROUP_LIST: 'category/product-add-on/group/list',
  PRODUCT_ADDON_GROUP_DETAIL: 'category/product-add-on/group/{id}',
  PRODUCT_ADDON_GROUP_CREATE: 'category/product-add-on/group/create',
  PRODUCT_ADDON_GROUP_UPDATE: 'category/product-add-on/group/update/{id}',
  PRODUCT_ADDON_GROUP_DELETE: 'category/product-add-on/group/delete/{id}'
};

export type ApiEndpointProps = (typeof API_ENDPOINT)[keyof typeof API_ENDPOINT];
