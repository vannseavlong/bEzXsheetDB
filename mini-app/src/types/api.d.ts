// DTOs mirror backendSheetDB's routes/user/* responses 1:1 — see that repo's
// routes/user/catalog.ts, address.ts, order.ts, coupon.ts for the source of truth.
// en/km only for v1; string ids throughout (no more legacy numeric ids).

// Kept only because lib/language-helper.ts's MultiLanguageTaskInfo type references it.
export type TaskInfoAttributes = {
  key: string;
  value: string[];
};

// ── Categories & Products ────────────────────────────────────────────────

export type Category = {
  id: string;
  nameEn: string;
  nameKm: string;
  thumbnailUrl: string | null;
  sort: number;
};

// A bookable priced variant (product x product_option) shown as a selectable card.
export type CategoryProduct = {
  id: string; // category_product_option id — the bookable SKU
  categoryProductId: string;
  productId: string;
  productOptionId: string | null;
  nameEn: string;
  nameKm: string;
  thumbnailUrl: string | null;
  amount: number;
  duration: number; // minutes
  sort: number;
  status: boolean;
};

export type CategoryAddon = {
  id: string;
  nameEn: string;
  nameKm: string;
  badgeEn: string | null;
  badgeKm: string | null;
  selectionType: 'SINGLE' | 'MULTIPLE';
  isRequired: boolean;
  status: boolean;
};

export type CategoryAddonItem = {
  id: string;
  addonId: string;
  nameEn: string;
  nameKm: string;
  type: string;
  imgUrl: string | null;
  amount: number;
  duration: number;
  status: boolean;
  sort: number;
};

export type TaskInfo = {
  id: string;
  titleEn: string;
  titleKm: string;
  descriptionEn: string[];
  descriptionKm: string[];
  sort: number;
};

export type EquipmentItem = {
  id: string;
  nameEn: string;
  nameKm: string;
};

// ── Banners & Homepage ───────────────────────────────────────────────────

export type Banner = {
  id: string;
  name: string;
  titleEn: string;
  type: 'HOME_BANNER' | 'PRODUCT_BUNDLE' | 'COUPON_BANNER';
  imgUrlEn: string | null;
  hasDetail: boolean;
  hasTopup: boolean;
  credit: number | null;
  amount: number | null;
  startDate: string;
  expiredDate: string;
  sort: number;
};

export type PopularServiceItem = {
  type: 'CATEGORY' | 'PRODUCT';
  categoryId: string | null;
  productId: string | null;
  nameEn: string | null;
  nameKm: string | null;
  iconUrl: string | null;
};

export type PopularService = {
  id: string;
  nameEn: string;
  nameKm: string;
  imageUrl: string | null;
  items: PopularServiceItem[];
};

// ── Addresses ─────────────────────────────────────────────────────────────

export type AddressAttributes = {
  id: string;
  isPrimary: boolean;
  name: string | null;
  address: string;
  addressDetail: string | null;
  floorNum: string | null;
  roomNum: string | null;
  note: string | null;
  latitude: number;
  longitude: number;
  sort: number;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isSelected?: boolean;
};

export type NewAddressPayload = {
  name?: string;
  address: string;
  addressDetail?: string;
  floorNum?: string;
  roomNum?: string;
  note?: string;
  latitude: number;
  longitude: number;
};

export type DistanceCheckPayload = {
  latitude: number;
  longitude: number;
};

export type DistanceCheckData = {
  distanceKm?: number;
  maxDistanceKm?: number;
  isExceeded: boolean;
};

// ── Booking / Order ───────────────────────────────────────────────────────

export type BookingLineInput = {
  categoryProductOptionId: string;
  qty: number;
  addonItems?: { id: string; qty: number }[];
};

export type OrderPreviewRequest = {
  line: BookingLineInput;
  pairLines?: { categoryProductOptionId: string; qty: number }[];
  addressId: string;
  scheduleStartDate: string;
  note?: string;
  couponCode?: string;
  paymentMethod?: string;
};

export type OrderCreateRequest = OrderPreviewRequest;

export type OrderCreateResponse = {
  bulkOrderId: string;
  orderId: string;
};

export type BookingLine = {
  categoryProductOptionId: string;
  categoryId: string;
  productId: string;
  productOptionId: string | null;
  nameEn: string;
  nameKm: string;
  optionNameEn: string | null;
  optionNameKm: string | null;
  thumbnailUrl: string | null;
  amount: number;
  duration: number;
  qty: number;
  subTotal: number;
};

export type PairProductOption = {
  id: string; // category_product_option id
  productOptionId: string | null;
  nameEn: string | null;
  nameKm: string | null;
  amount: number;
  duration: number;
};

export type PairProduct = {
  categoryProductId: string;
  productId: string;
  nameEn: string;
  nameKm: string;
  thumbnailUrl: string | null;
  options: PairProductOption[];
};

export type OrderPreviewAddOn = {
  id: string;
  nameEn: string;
  nameKm: string;
  amount: number;
  qty: number;
  subTotal: number;
};

export type OrderPreviewResponse = {
  line: BookingLine;
  addOns: OrderPreviewAddOn[];
  pairLines: BookingLine[];
  pairProducts: PairProduct[];
  scheduleStartDate: string;
  note: string;
  couponCode: string | null;
  amount: number;
  addOnAmount: number;
  discount: number;
  serviceFee: number;
  transportFee: number;
  vatFee: number;
  totalAmount: number;
  totalPayableAmount: number;
};

export type ScheduleDay = {
  date: string;
  available: boolean;
};

export type OrderStatus = 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export type OrderListItem = {
  id: string;
  bulkOrderId: string;
  thumbnailUrl: string | null;
  amount: number;
  status: OrderStatus;
  itemCount: number;
  createdAt: string;
  totalPayableAmount: number;
};

export type OrderListResponse = Partial<Record<OrderStatus, OrderListItem[]>>;

export type OrderDetailAddOn = {
  id: string;
  nameEn: string;
  nameKm: string;
  amount: number;
  qty: number;
  subTotal: number;
};

export type OrderDetailItem = {
  nameEn: string;
  optionEn: string | null;
  thumbnailUrl: string | null;
  qty: number;
  amount: number;
  subTotal: number;
  isPrimary: boolean;
  addOns: OrderDetailAddOn[];
};

export type OrderDetail = {
  bulkOrderId: string;
  fullname: string;
  phone: string;
  note: string;
  address: string;
  scheduleDate: string;
  couponCode: string | null;
  amount: number;
  discount: number;
  serviceFee: number;
  transportFee: number;
  vatFee: number;
  totalPayableAmount: number;
  paymentMethod: string;
  paymentStatus: 'PAID' | 'UNPAID';
  status: OrderStatus;
  items: OrderDetailItem[];
};

export type EditSchedulePayload = {
  bulkOrderId: string;
  scheduleStartDate: string;
};

export type CouponResponse = {
  code: string;
  isValid: boolean;
  message?: string;
  id?: string;
  discount?: number;
  discountType?: 'percentage' | 'fixed';
};
