export const API_ENDPOINT = {
  AUTO_LOGIN: 'auth/account/auto-login',
  LOGIN: 'auth/login',
  PROFILE: 'user/info',
  LOGOUT: 'logout',

  CATEGORY: 'category/list',
  CATEGORY_LIST: 'category',

  PRODUCT: 'product/v2',
  PRODUCT_DETAIL: 'product',
  PRODUCT_ADDON: 'category',
  PRODUCT_ADDON_DETAIL: 'product/option',

  ADDRESS_LIST: 'address/list',
  ADDRESS_CREATE: 'address/create',
  ADDRESS_UPDATE: 'address/update',
  ADDRESS_DELETE: 'address/:id/delete',
  ADDRESS_DISTANCE: 'address/check/distance',

  ORDER: 'order',
  ORDER_LIST: 'order/mini-app/list',
  ORDER_DETAIL: 'order/mini-app/detail',
  ORDER_PREVIEW: 'order/mini-app/preview',
  ORDER_CREATE: 'order/mini-app/create',
  ORDER_STATUS: 'order/:bulkOrderId/:tranId/payment-status',

  EQUIPMENT: 'category',
  BANNER: 'banner/list',
  BANNER_DETAIL: 'banner',

  NOTE: 'homepage',
  SCHEDULE: 'order/available-schedule',
  EDIT_SCHEDULE: 'order/bulk/edit-schedule'
};

export type ApiEndpointProps = (typeof API_ENDPOINT)[keyof typeof API_ENDPOINT];
