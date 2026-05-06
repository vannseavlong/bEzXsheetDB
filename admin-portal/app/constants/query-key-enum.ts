export enum QUERY_KEY_ENUM {
  // Orders
  ORDERS = 'list-order',
  ORDER_DETAIL = 'order-detail',
  CANCEL_ORDER = 'cancel-order',
  UPDATE_ORDER = 'update-order',
  UPDATE_ORDER_STATUS = 'update-order-status',
  ADD_ORDER_ADDON = 'add-order-addon',
  ABA_PAYMENT_STATUS = 'aba-payment-status',
  EXCHANGE_RATE_LIST = 'exchange-rate-list',

  // Banners
  BANNERS = 'banners',
  BANNER_DETAIL = 'banner-detail',
  BANNER_REARRANGE = 'banner-rearrange',
  CREATE_BANNER = 'create-banner',
  UPDATE_BANNER = 'update-banner',
  DELETE_BANNER = 'delete-banner',

  // Categories
  CATEGORIES = 'list-category',
  CATEGORIES_NAME = 'list-category-name',
  CATEGORY_DETAIL = 'category-detail',
  CATEGORY_CREATE = 'create-category',
  CATEGORY_UPDATE = 'update-category',
  DELETE_CATEGORY = 'delete-category',
  CATEGORY_REARRANGE = 'category-rearrange',
  PRODUCT_DETAIL_BY_CATEGORY_ID = 'product-detail-by-category-id',
  PRODUCT_ADD_ON_BY_CATEGORY_ID = 'product-add-on-by-category-id',

  // Category Add-ons
  PRODUCT_ADDON_LIST = 'product-addon-list',
  PRODUCT_ADDON_GROUP_LIST = 'product-addon-group-list',
  PRODUCT_ADDON_GROUP_DETAIL = 'product-addon-group-detail',
  PRODUCT_ADDON_GROUP_CREATE = 'product-addon-group-create',
  PRODUCT_ADDON_GROUP_UPDATE = 'product-addon-group-update',
  PRODUCT_ADDON_GROUP_DELETE = 'product-addon-group-delete',
  PRODUCT_ADDON_ITEM_LIST = 'product-addon-item-list',

  // Products
  PRODUCT_LIST = 'product-list',
  PRODUCT_DETAIL = 'product-detail',
  PRODUCT_CREATE = 'product-create',
  PRODUCT_UPDATE = 'product-update',

  // Product Options
  PRODUCT_OPTION_LIST = 'product-option-list',
  PRODUCT_OPTION_BY_PRODUCT_ID = 'product-option-by-product-id',
  GET_SELECTED_PRODUCT_DETAIL = 'get-selected-product-detail'
}
