// Paths are relative to VITE_BASE_URL, which should point at backendSheetDB's /api/user.
export const API_ENDPOINT = {
  REGISTER: 'auth/register',
  LOGIN: 'auth/login',
  PROFILE: 'auth/me',
  PROFILE_UPDATE: 'auth/me',
  LOGOUT: 'logout',

  CATEGORY_LIST: 'category/list',
  CATEGORY_PRODUCTS: (categoryId: string) => `category/${categoryId}/products`,
  CATEGORY_ADDONS: (categoryId: string) => `category/${categoryId}/addons`,
  CATEGORY_ADDON_ITEMS: (addonId: string) => `category-addon/${addonId}/items`,
  CATEGORY_TASK_INFO: (categoryId: string) => `category/${categoryId}/task-info`,
  CATEGORY_ITEMS: (categoryId: string) => `category/${categoryId}/items`,

  BANNER_LIST: 'banner/list',
  BANNER_DETAIL: (id: string) => `banner/${id}`,
  HOMEPAGE: 'homepage',

  ADDRESS_LIST: 'address/list',
  ADDRESS_CREATE: 'address/create',
  ADDRESS_UPDATE: (id: string) => `address/${id}`,
  ADDRESS_DELETE: (id: string) => `address/${id}`,
  ADDRESS_DISTANCE: 'address/check/distance',

  ORDER_SCHEDULE: 'order/available-schedule',
  ORDER_PREVIEW: 'order/preview',
  ORDER_CREATE: 'order/create',
  ORDER_LIST: 'order/list',
  ORDER_DETAIL: (bulkOrderId: string) => `order/${bulkOrderId}`,
  ORDER_EDIT_SCHEDULE: (bulkOrderId: string) => `order/${bulkOrderId}/schedule`,
  ORDER_PAYMENT_STATUS: (bulkOrderId: string) => `order/${bulkOrderId}/payment-status`,

  COUPON_VALIDATE: 'coupon/validate'
};
