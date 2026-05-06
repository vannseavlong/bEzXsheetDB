export const API_ENDPOINT = {
  // Orders
  ORDERS: 'order/list',
  ORDER_DETAIL: 'order',
  UPDATE_ORDER_STATUS: 'order/update',
  CANCEL_ORDER: 'order/cancel/{id}',
  ADD_ORDER_ADDON: 'order/add-extra-addon',
  ABA_PAYMENT_STATUS: 'order/aba-payment-status',
  EXCHANGE_RATE_LIST: 'exchange-rate/list',

  // Banners
  BANNERS: 'banner/list',
  BANNER_DETAIL: 'banner/detail/{id}',
  CREATE_BANNER: 'banner/create',
  UPDATE_BANNER: 'banner/update',
  DELETE_BANNER: 'banner/delete/{id}',
  BANNER_REARRANGE: 'banner/rearrange',

  // Categories
  CATEGORIES: 'category/list',
  CATEGORY_CREATE: 'category/create',
  CATEGORY_UPDATE: 'category/update/{id}',
  CATEGORY_DELETE: 'category/delete/{id}',
  CATEGORY_DETAIL: 'category/{id}',
  CATEGORIES_NAME: 'category/list-names',
  CATEGORY_REARRANGE: 'category/rearrange',
  PRODUCT_DETAIL_BY_CATEGORY_ID: 'category/{id}/product/list',
  PRODUCT_ADD_ON_BY_CATEGORY_ID: 'category/{categoryId}/product-add-on',

  // Category Add-ons
  PRODUCT_ADDON_LIST: 'category/product-add-on/list',
  PRODUCT_ADDON_GROUP_LIST: 'category/product-add-on/group/list',
  PRODUCT_ADDON_GROUP_DETAIL: 'category/product-add-on/group/{id}',
  PRODUCT_ADDON_GROUP_CREATE: 'category/product-add-on/group/create',
  PRODUCT_ADDON_GROUP_UPDATE: 'category/product-add-on/group/update/{id}',
  PRODUCT_ADDON_GROUP_DELETE: 'category/product-add-on/group/delete/{id}',

  // Products
  PRODUCT_LIST: 'product/list',
  PRODUCT_CREATE: 'product/create',
  PRODUCT_DETAIL: 'product/{id}',
  PRODUCT_UPDATE: 'product/update/{id}',

  // Product Options
  PRODUCT_OPTION_LIST: 'product/option/list',
  PRODUCT_OPTION_BY_PRODUCT_ID: 'product/{id}/product-option',
  GET_SELECTED_PRODUCT_DETAIL: 'coupon/{id}/selected-product/list'
};

export type ApiEndpointProps = (typeof API_ENDPOINT)[keyof typeof API_ENDPOINT];
