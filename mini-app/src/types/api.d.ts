type TaskInfoAttributes = {
  key: string;
  value: string[];
};

type Service = {
  servicetitle: string;
  price: number;
  duration: string;
  s;
  amountCleaner: number;
};
type BannerAttributes = {
  id?: string;
  name: string;
  type: string;

  imgUrlEn: string;
  imgUrlKm: string;
  imgUrlVi: string;
  imgUrlCn: string;
  imgUrlTw: string;

  titleEn: string;
  titleKm: string;
  titleVi: string;
  titleCn: string;
  titleTw: string;

  hasDetail: boolean;
  hasTopup: boolean;
  hasBooking: boolean;

  contentEn: string;
  contentKm: string;
  contentVi: string;
  contentCn: string;
  contentTw: string;
};

type Service = {
  servicetitle: string;
  price: number;
  duration: string;
  amountCleaner: number;
};
export type BannerAttributes = {
  id?: string;
  name: string;
  type: string;

  imgUrlEn: string;
  imgUrlKm: string;
  imgUrlVi: string;
  imgUrlCn: string;
  imgUrlTw: string;

  titleEn: string;
  titleKm: string;
  titleVi: string;
  titleCn: string;
  titleTw: string;

  hasDetail: boolean;
  hasTopup: boolean;
  hasBooking: boolean;

  contentEn: string;
  contentKm: string;
  contentVi: string;
  contentCn: string;
  contentTw: string;
};

type Service = {
  servicetitle: string;
  price: number;
  duration: string;
  amountCleaner: number;
};
export type BannerAttributes = {
  id?: string;
  name: string;
  type: string;

  imgUrlEn: string;
  imgUrlKm: string;
  imgUrlVi: string;
  imgUrlCn: string;
  imgUrlTw: string;

  titleEn: string;
  titleKm: string;
  titleVi: string;
  titleCn: string;
  titleTw: string;

  hasDetail: boolean;
  hasTopup: boolean;
  hasBooking: boolean;

  contentEn: string;
  contentKm: string;
  contentVi: string;
  contentCn: string;
  contentTw: string;
};

// type CategoryAttributes = {
//   iconUrl: string;
//   id: string;
//   nameEn: string;
//   nameKm: string;
//   nameVi: string;
//   nameCn: string;
//   nameTw: string;
//   isComingSoon: string;
//   noteEn: string;
//   noteKm: string;
//   noteVi: string;
//   noteCn: string;
//   noteTw: string;
//   taskInfoEn: TaskInfoAttributes[];
//   taskInfoKm: TaskInfoAttributes[];
//   taskInfoCn: TaskInfoAttributes[];
//   taskInfoTw: TaskInfoAttributes[];
//   taskInfoVi: TaskInfoAttributes[];
// };
type CategoryAttribute = {
  categories: Category[];
};

type Category = {
  id: number;
  sort: number;
  status: number;
  items: Item[];
  title: Title;
};

type Item = {
  featuredCategoryId: number;
  type: 'CATEGORY' | 'PRODUCT';
  categoryId: number;
  productId: number | null;
  iconUrl: string;
  name: Name;
};

type Title = {
  titleEn: string;
  titleVi: string;
  titleCn: string;
  titleTw: string;
  titleKm: string;
};

type Name = {
  nameEn: string;
  nameVi: string;
  nameCn: string;
  nameTw: string;
  nameKm: string;
};

type ProductAttributes = {
  imgUrl: string;
  id: number;
  nameEn: string;
  nameKm: string | null;
  nameVi: string | null;
  nameCn: string | null;
  nameTw: string | null;
  infoEn: string | null;
  infoKm: string | null;
  infoVi: string | null;
  infoCn: string | null;
  infoTw: string | null;
  qty: number;
  status: boolean;
  amount: number;
  floorCount: number;
  bedroomCount: number;
  hourCount: string | null;
  cleanerCount: string | null;
  status: boolean;
};
type TaskInfo = {
  key: string;
  value: string;
} | null;

type ServiceCategory = {
  isActive: boolean;
  onClick: void;
  id: number;
  nameEn: string;
  nameKm: string;
  nameVi: string;
  nameCn: string;
  nameTw: string;
  iconUrl: string;
  hasQty: boolean;

  floorCount: string;
  bedroomCount: string;
  amount: string;

  taskInfoEn: TaskInfoAttributes[];
  taskInfoKm: TaskInfoAttributes[];
  taskInfoCn: TaskInfoAttributes[];
  taskInfoTw: TaskInfoAttributes[];
  taskInfoVi: TaskInfoAttributes[];

  servicetype: string;
  productAttribute: ProductAddonAttributes[];
};

type ServiceAddonAttributes = {
  id: number;
  imgUrl: string;
  nameEn: string;
  nameKm: string;
  nameVi: string;
  nameCn: string;
  nameTw: string;
  amount: number;
  duration: number;
  status: boolean;
  type: 'SINGLE' | 'MULTIPLE' | string;
  parentId: number | null;
  categoryId: number;

  onClick?: () => void;
  active?: boolean;
};
type ProductAddonAttributes = {
  id: number;
  imgUrl: string;
  nameEn: string;
  nameKm: string;
  nameVi: string;
  nameCn: string;
  nameTw: string;
  amount: number;
  category: string;
  status: boolean;
  allowQuantity: boolean;
  duration: number;
  type: 'MULTIPLE' | 'SINGLE';
  parentId: number;
  categoryId: number;
};

type EquipmentAttributes = {
  imgUrl: string;
  id: number;
  name: string;
};

type OrderItem = {
  id: number;
  thumbnailUrl: string;
  bulkOrderId: string;
  isPrimary: number;
  paymentStatus: string;
  status: string;
  totalPayableAmount: number;
  totalPayableAmountDisplay: string;
  createdAt: string;
};

type OrderListAttributes = {
  bulkOrderId: string;
  id: number;
  thumbnailUrl: string;
  amount: number;
  amountDisplay: string;
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'ACCEPTED' | 'CANCELLED';
  items: OrderItem[];
  itemCount: number;
  createdAt: string;
  totalPayableAmount: number;
  totalPayableAmountDisplay: string;
};

type OrderDetailAddOn = {
  id: number;
  nameEn: string;
  nameKm: string;
  nameVi: string;
  nameCn: string;
  nameTw: string;
  amount: number;
  qty: number;
  productAddOnId: number;
  amountDisplay: string;
  subTotal: number;
  subTotalDisplay: string;
};

type OrderDetailItem = {
  nameEn: string;
  nameKm: string;
  nameVi: string;
  nameCn: string;
  nameTw: string;
  thumbnailUrl: string;
  productOptionEn: string;
  productOptionKm: string;
  productOptionVi: string;
  productOptionCn: string;
  productOptionTw: string;
  type: 'TECHNICIAN' | 'CLEANER';
  hourCount: string;
  cleanerCount: string;
  floorCount: string;
  bedroomCount: string;
  amount: number;
  amountDisplay: string;
  qty: number;
  subTotal: number;
  subTotalDisplay: string;
  addOns: OrderDetailAddOn[];
};

type OrderDetail = {
  bulkOrderId: string;
  fullname: string;
  phone: string;
  email: string;
  note: string;
  address: string;
  scheduleDate: string;
  couponCode: string;
  amount: number;
  amountDisplay: string;
  discount: number;
  discountDisplay: string;
  serviceFee: number;
  serviceFeeDisplay: string;
  transportFee: number;
  transportFeeDisplay: string;
  subTotal: number;
  subTotalDisplay: string;
  vatFee: number;
  vatFeeDisplay: string;
  totalPayableAmount: number;
  totalPayableAmountDisplay: string;
  paymentMethod: string;
  paymentStatus?: 'PAID' | 'UNPAID' | 'IN-REVIEW';
  status?: 'PENDING' | 'IN-PROGRESS' | 'COMPLETED' | 'ACCEPTED' | 'CANCELLED';
  items: OrderDetailItem[];
  amountAfterDiscountDisplay: string;
  paymentMethodDisplay: string;
};
type AddressAttributes = {
  id: number;
  isPrimary: boolean;
  name: string;
  address: string;
  addressDetail: string;
  floorNum: string;
  roomNum: string;
  note: string;
  latitude: string;
  longitude: string;
  sort: number;
  bookingDate: string | null;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isSelected?: boolean;
};

type OrderDetailApiResponse = OrderDetail;

export type CouponRequest = {
  code: string;
};

export type CouponResponse = {
  id: string;
  code: string;
  discount: number;
  discountType: 'percentage' | 'fixed';
  maxDiscount?: number;
  minOrderAmount?: number;
  isValid: boolean;
  message?: string;
};

export type NewAddressPayload = {
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  addressDetail: string;
  floorNum: string;
  roomNum: string;
  note: string;
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

export type RawDistanceCheckResponse = {
  data?: unknown;
  distanceKm?: number | string;
  maxDistanceKm?: number | string;
  isExceeded?: boolean;
  exceeded?: boolean;
  inRange?: boolean;
  withinRange?: boolean;
};

type AddressContextType = {
  selectedAddress: string | null;
  setSelectedAddress: (address: string) => void;
};
type CreateOrderRequest = {
  paymentMethod: string;
  couponCode?: string;
  productAddOnIds?: number[];
  addressId: number;
  address: string;
  floorNum?: string;
  roomNum?: string;
  scheduleStartDate: string;
  note?: string;
  productOptionId?: number;
  productOptionIds?: number[];
  productAddOnIdList?: { id: number; qty: number }[];
  Floor?: string;
  Room?: string;
};

type ProductAddon = {
  id: number;
  nameEn: string;
  nameKm: string;
  nameVi: string;
  nameCn: string;
  nameTw: string;
  amount: number;
  qty: number;
  subTotal: number;
};
type ProductCategory = {
  iconUrl: string;
  nameEn: string;
  nameKm: string;
  nameCn: string;
  nameVi: string;
  nameTw: string;
};
type Product = {
  id: number;
  icon_url: string;
  nameEn: string;
  nameKm: string;
  nameCn: string;
  nameTw: string;
  nameVi: string;
  category: {
    iconUrl: string;
    nameEn: string;
    nameKm: string;
    nameCn: string;
    nameTw: string;
    nameVi: string;
  };
};

type ProductOptionDetail = {
  id: number;
  iconUrl: string;
  nameEn: string;
  nameKm: string;
  nameVi: string;
  nameCn: string;
  nameTw: string;
  amount: number;
  qty: number;
  subTotal: number;
  isPriMeetinmary: boolean;
  duration: string | null;
  hourCount: string | null;
  cleanerCount: string | null;
};

type baseProduct = {
  id: number;
  nameEn: string;
  iconUrl: string;
  amount: number;
  hourCount?: string | null;
  cleanerCount?: string | null;
};

export type ProductOptionV2 = {
  id: number;
  nameEn: string;
  nameKm: string;
  nameVi: string;
  nameCn: string;
  nameTw: string;
  amount: number;
  iconUrl: string;
  qty: number;
  status: boolean;
  duration: string | null;
  hourCount: string | null;
  cleanerCount: string | null;
  type: string | null;
  imgUrl: string | null;
  count: number | null;
  sort: number | null;
  floorCount: number | null;
  bedroomCount: number | null;
  infoEn: string | null;
  infoKm: string | null;
  infoVi: string | null;
  infoCn: string | null;
  infoTw: string | null;
  remarkEn: string | null;
  remarkZh: string | null;
  remarkCh: string | null;
  remarkVi: string | null;
  remarkKh: string | null;
  createdAt: string;
  updatedAt: string;
  productId: number;
};

export type pairProduct = {
  qty: number;
  id: number;
  iconUrl: string;
  nameEn: string;
  nameKm: string;
  nameVi: string;
  nameCn: string;
  nameTw: string;
  amount: number;
  hourCount: string | null;
  cleanerCount: string | null;
  productOptionV2s: ProductOptionV2[];
};

export type OrderPreviewResponse = {
  productAddOn: ProductAddon[];
  productOptions: ProductOptionDetail[];
  pairProducts: pairProduct[];

  startDate: string;
  startTime: string;
  endTime: string;

  amount: number;
  amountDisplay: string;

  addOnAmount: number;
  addOnAmountDisplay: string;

  discount: number;
  discountDisplay: string;

  totalAmount: number;
  totalAmountDisplay: string;

  serviceFee: number;
  serviceFeeDisplay: string;

  transportFee: number;
  transportFeeDisplay: string;

  vatFee: number;
  vatFeeDisplay: string;

  totalPayableAmount: number;
  totalPayableAmountDisplay: string;
};

type OrderResponse = {
  userId: number;
  customerFirstName: string;
  customerLastName: string;
  customerPhone: string;
  customerEmail: string;
  amount: string;
  discount: string;
  totalAmount: string;
  serviceFee: string;
  transportFee: string;
  vatFee: string;
  totalPayableAmount: string;
  paymentMethod: string;
  scheduleStartDate: string;
  note: string;
  orderPreviewList: OrderPreview[];
};

type TaskInfo = {
  key: string;
  value: string[];
};

type RecommendedCategory = {
  id: number;
  nameEn: string;
  nameKm: string;
  nameVi: string;
  nameCn: string;
  nameTw: string;
  iconUrl: string;
  isComingSoon: number;
  noteEn: string | null;
  noteKm: string | null;
  noteVi: string | null;
  noteCn: string | null;
  noteTw: string | null;
  taskInfoEn: TaskInfo[];
  taskInfoKm: TaskInfo[];
  taskInfoCn: TaskInfo[];
  taskInfoTw: TaskInfo[];
  taskInfoVi: TaskInfo[];
  ['products.id']?: number;
};

type TaskInfoItem = {
  key: string;
  value: string[];
};

type ProductDetailResponse = {
  iconUrl: string;
  icon_url: string;
  id: number;
  nameEn: string;
  nameKm: string;
  nameVi: string;
  nameCn: string;
  nameTw: string;
  status: boolean;
  amount: number;
  sort: number;
  taskInfoEn: TaskInfoItem[] | null;
  taskInfoKm: TaskInfoItem[] | null;
  taskInfoCn: TaskInfoItem[] | null;
  taskInfoTw: TaskInfoItem[] | null;
  taskInfoVi: TaskInfoItem[] | null;
  hasExtra: boolean;
  category: {
    iconUrl: string;
    id: number;
    nameEn: string;
    nameVi: string;
    nameKm: string;
    nameTw: string;
    nameCn: string;
    isComingSoon: boolean;
    noteEn: string;
    noteKm: string;
    noteVi: string;
    noteCn: string;
    noteTw: string;
    taskInfoEn: TaskInfoItem[];
    taskInfoKm: TaskInfoItem[];
    taskInfoVi: TaskInfoItem[];
    taskInfoCn: TaskInfoItem[];
    taskInfoTw: TaskInfoItem[];
    pairProducts: number[];
  };
};

type EquipmentItem = {
  id: number;
  name: string;
  imgUrl: string;
};

type ProductOption = {
  id: number;
  qty: number;
};

type AddOnOption = {
  id: number;
  qty: number;
};

type OrderPreviewRequest = {
  paymentMethod: 'CASH' | 'CARD';
  productOptionId: number;
  productOptionIds: ProductOption[];
  productAddOnIdList: AddOnOption[];
  addressId: number;
  scheduleStartDate: string;
  note?: string;
};

type OrderPreviewResponse = {
  userId: number;
  customerFirstName: string;
  customerLastName: string;
  customerPhone: string;
  customerEmail: string;
  amount: string;
  discount: string;
  totalAmount: string;
  serviceFee: string;
  transportFee: string;
  vatFee: string;
  totalPayableAmount: string;
  paymentMethod: string;
  scheduleStartDate: string;
  note: string;
  recommendedCats: RecommendedCategory[];
};

type TaskInfoItem = {
  key: string;
  value: string[];
};

type ProductDetailResponse = {
  iconUrl: string;
  icon_url: string;
  id: number;
  nameEn: string;
  nameKm: string;
  nameVi: string;
  nameCn: string;
  nameTw: string;
  status: boolean;
  amount: number;
  sort: number;
  taskInfoEn: TaskInfoItem[] | null;
  taskInfoKm: TaskInfoItem[] | null;
  taskInfoCn: TaskInfoItem[] | null;
  taskInfoTw: TaskInfoItem[] | null;
  taskInfoVi: TaskInfoItem[] | null;
  hasExtra: boolean;
  category: {
    iconUrl: string;
    id: number;
    nameEn: string;
    nameVi: string;
    nameKm: string;
    nameTw: string;
    nameCn: string;
    isComingSoon: boolean;
    noteEn: string;
    noteKm: string;
    noteVi: string;
    noteCn: string;
    noteTw: string;
    taskInfoEn: TaskInfoItem[];
    taskInfoKm: TaskInfoItem[];
    taskInfoVi: TaskInfoItem[];
    taskInfoCn: TaskInfoItem[];
    taskInfoTw: TaskInfoItem[];
    pairProducts: number[];
  };
};

type EquipmentItem = {
  id: number;
  name: string;
  imgUrl: string;
};

export type CategoryItem = {
  iconUrl: string;
  id: number;
  nameEn: string;
  nameKm: string;
  nameVi: string;
  nameCn: string;
  nameTw: string;
  isComingSoon: boolean;
  noteEn: string;
  noteKm: string;
  noteVi: string;
  noteCn: string;
  noteTw: string;
};

export type CategoryListResponse = {
  categoryList: CategoryItem[];
};
type ScheduleApiResponse = {
  date: string;
  available: boolean;
  iconUrl: string | null;
  title: string | null;
  message: string | null;
};

type EditSchedulePayload = {
  bulkOrderId: string;
  scheduleStartDate: string;
  note?: string;
  isEditMode?: boolean;
};
type ScheduleApiResponse = {
  date: string;
  available: boolean;
  iconUrl: string | null;
  title: string | null;
  message: string | null;
};

type EditSchedulePayload = {
  bulkOrderId: string;
  scheduleStartDate: string;
  note?: string;
  isEditMode?: boolean;
};
