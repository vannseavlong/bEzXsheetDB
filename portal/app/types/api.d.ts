type PaymentStatusProps =
  | 'PENDING'
  | 'IN-REVIEW'
  | 'FAILED'
  | 'PAID'
  | 'REFUNDED'
  | 'PARTIALLY_PAID'
  | 'UNPAID';

type OrderTypeProps = 'ORDER' | 'DIRECT_SALE' | 'all';

type OrderStatusProps = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'ACCEPTED' | 'CANCELLED';

type UserStatusProps = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'DELETED';

type NotificationStatusProps = 'DELIVERING' | 'DELIVERED' | 'FAILED' | 'CANCELED';

type UserManagementProps = {
  id: string; // Corresponds to NO.
  name: string; // User's name
  role: string;
  phoneNumber: string;
  status: 'Active' | 'Deactivated' | '';
  date: string; // Date string (e.g., "01 Jan, 2025")
};

type CategoryProps = {
  id: string;
  image: string;
  name: string;
  status: 'Active' | 'Inactive';
  date: Date;
};

type DraggableProps = {
  id: string;
  isNew: boolean;
};

type Task = {
  title: string;
  isExpanded: boolean;
  description: string;
} & DraggableProps;

type DraggableComboBoxProps = {
  data: { label: string; value: string }[];
  value: string;
  amount?: string;
} & DraggableProps;

type VariantProps = {
  id: string;
  image: string;
  name: string;
  price: string;
};

type CategoryAddOnProps = {
  id: string;
  image: string;
  name: string;
  status: string;
  variants: VariantProps[];
  date: Date;
};

type ProductProps = {
  id: string;
  name: string;
  category: CategoryProps[];
  status: string;
  date: Date;
};

type ServiceBundleProps = {
  id: string;
  name: string;
  status: 'Active' | 'In Active';
  bundleType: string;
  date: Date;
};

type ProductOptionProps = {
  id: string;
  amount: string;
  duration: string;
  qty: string;
  floorCount: string;
  bedroomCount: string;
  cleanerCount: string;
  hourCount: string;
  count: string;
  type: 'CLEANER' | 'TECHNICIAN';
  status: string;
  date: Date;
  product: {
    id: string;
    nameEn: string;
  };
} & MultiLangName;

type ReferralProgramProps = {
  id: string;
  name: string;
  email: string;
  referralCode: number;
  totalReferralUser: number;
  pointEarnd: number;
  date: Date;
};

type VoucherProps = {
  id: string;
  name: string;
  code: string;
  discountType: string;
  discountValue: string;
  usageLimit: string;
  peruserLimit: string;
  status: 'Active' | 'In Active';
  validFrom: Date;
  validTo: Date;
  eligibleServices: string;
  eligibleUsers: string;
};

type OrderComponentProps = {
  id: string;
  services: number;
  date: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  imageSrc: string; // Image source URL
};

type ServiceDetailsProps = {
  id: string;
  serviceName: string;
  category: string;
  addOns: number;
  price: number;
  items: { id: string; name: string; checked: boolean }[];
  imageSrc: string;
};
type ServiceItem = {
  id: string;
  name: string;
  checked: boolean;
};
type PaginationDemoProps = {
  currentPage: number;
  totalPages: number;
};
type popupOptionProps = {
  id: string;
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
  inputPlaceholder: boolean;
  variant: 'default' | 'destructive' | 'success';
};

// real api

type MultiLangName = {
  nameEn: string;
  nameKm: string;
  nameVi: string;
  nameCn: string;
  nameTw: string;
};

type CategoryAttributes = {
  iconUrl: string | null;
  id: string | number;
  nameEn: string | null;
  sort: number;
  status: boolean;
  updatedAt: string | null;
  products?: { id: string; nameEn: string; productOptionV2s?: { id: string; nameEn: string }[] }[];
};

type CategoryDetailProps = {
  id: string | number;
  nameEn: string;
  nameKm: string;
  nameVi: string;
  nameCn: string;
  nameTw: string;
  iconUrl: string | null;
  status: boolean;
  sort?: number;
  isComingSoon: boolean;
  isRecommended: boolean;
  hasQty: boolean;
  noteEn: string | null;
  noteKm: string | null;
  noteVi: string | null;
  noteCn: string | null;
  noteTw: string | null;
  taskInfoEn?: Array<{ key: string; value: string[] }>;
  taskInfoKm?: Array<{ key: string; value: string[] }>;
  taskInfoVi?: Array<{ key: string; value: string[] }>;
  taskInfoCn?: Array<{ key: string; value: string[] }>;
  taskInfoTw?: Array<{ key: string; value: string[] }>;
  products?: Array<{
    id: number;
    nameEn: string;
    nameKm: string | null;
    nameVi: string | null;
    nameCn: string | null;
    nameTw: string | null;
    iconUrl: string | null;
    amount: number;
    status: boolean;
    sort: number;
  }>;
  productAddOnGroups?: Array<{
    id: number;
    nameEn: string;
    nameKm: string | null;
    nameVi: string | null;
    nameCn: string | null;
    nameTw: string | null;
    badgeEn: string | null;
    badgeKm: string | null;
    badgeVi: string | null;
    badgeCn: string | null;
    badgeTw: string | null;
    selectionType: string;
    isRequired: boolean;
    sort: number;
    addOns?: Array<{
      id: number;
      nameEn: string;
      imgUrl: string | null;
      amount: number;
      status: boolean;
      sort: number;
    }>;
  }>;
  productEquipments?: Array<{
    id: number;
    imgUrl: string;
    name: string;
    status: boolean;
    sort: number;
  }>;
  pairProducts?: unknown;
  createdAt?: string;
  updatedAt?: string;
};

type ServiceAddOn = {
  id: string;
  product: string;
  variant: string;
  quantity: string;
};
type PaymentInformation = {
  id: string;
  paymentStatus: string;
  paymentMethod: string;
  note: string;
};

//api of order list

// type OrderItem = {
//   thumbnailUrl?: string;
//   hourCount?: number | null;
//   cleanerCount?: number | null;
//   floorCount?: number | null;
//   bedroomCount?: number | null;
//   amount?: number;
//   amountDisplay?: string;
// };

type PaginationProps = {
  pageSize: number;
  currentPage: number;
  totalItems: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
};

type UserAddressProps = {
  id: number;
  address?: string;
  addressDetail?: string;
  latitude?: string;
  longitude?: string;
  isPrimary?: boolean;
};

type ServiceItemDetailProps = {
  id: string;
  bulkOrderId: string;
  serviceItemId: string;
  serviceItemRemarks: string[];
};

type OrderListAttributes = {
  rescheduledBy?: string;
  platform: 'MOBILE' | 'WEB';
  rescheduledBy?: string;
  isExistedCustomer?: boolean;
  exchangeRate?: string;
  vatNo?: string;
  id?: string;
  tranId?: string;
  bulkOrderId: string;
  status?: OrderStatusProps;
  thumbnailUrl?: string;
  totalCount?: number;
  latestCreatedAt?: string;
  type: 'ORDER' | 'DIRECT_SALE';
  duration: number;

  customerLastName?: string;
  customerFirstName?: string;
  customerPhone?: string;
  phone?: string;
  email?: string;
  note?: string;
  userAddress?: UserAddressProps[];
  profileUrl?: string;
  fullname?: string;
  userId?: string;
  addressId?: number;
  address?: string;
  latitude?: string;
  longitude?: string;
  scheduleDate: string;
  scheduleStartDate: string;
  couponCode?: string;
  amount?: string;
  amountDisplay?: string;
  discount?: string;
  discountDisplay?: string;
  serviceFee: number;
  serviceFeeDisplay?: string;
  transportFee: number;
  transportFeeDisplay?: string;
  subTotal?: string;
  subTotalDisplay?: string;
  vatFee?: string;
  vatFeeDisplay?: string;
  totalPayableAmount?: string;
  totalPayableAmountDisplay?: string;
  paymentMethod?: string;
  paymentStatus?: PaymentStatusProps;
  amountAfterDiscountDisplay?: string;
  paymentMethodDisplay?: string;
  items?: ServicesProps[];

  // // ===============
  // finance
  category?: string;
  service?: string;
  serviceType?: string;
  address?: string;
  paymentDate?: string;
  paymentCompletedDate?: string;
  customerRevaluation?: string;
  totalAmountDisplay?: string;
  netRevenue?: string;
  serviceItemDetails?: ServiceItemDetailProps[];
  cleaners?: CleanerAttributes[];

  // DIRECT SALE

  deposit: number;
  depositDisplay?: string;
  remainingDisplay?: string;
  additionalFee: number;
  directSaleProduct?: string;
  directSaleProductOptionV2?: string;
  isPrivate?: boolean;
  reseller?: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
  };
  sale?: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
  };
  directSaleNextPaymentDate?: string;
  roomNum?: string;
  floorNum?: string;
  categoryId: string;
  receipts: {
    receiptUrl: string;
    id: string;
    status: string;
    bulkOrderId: string;
  }[];
  productNameEn?: string;
  productOptionNameEn?: string;
  categoryNameEn?: string;
};

type ServicesProps = {
  id?: string;
  categoryId: string;
  categoryNameEn: string;
  categoryNameKm: string;
  productId: string;
  productEn: string;
  productKm: string;
  thumbnailUrl: string;
  productOptionId: string;
  productOptionEn: string;
  productOptionKm: string;
  hourCount: string;
  cleanerCount: string;
  floorCount: string;
  bedroomCount: string;
  amount: string;
  amountDisplay: string;
  qty: string;
  addOns: AddOnsProps[];
  discount: string;
  discountDisplay: string;
  isCrossSell: boolean;
};

type AddOnsProps = {
  id: string;
  nameEn: string;
  nameKm: string;
  nameVi: string;
  nameCn: string;
  nameTw: string;
  amount: string;
  qty: string;
  imgUrl: string;
  groupNameEn: string;
  isRequired: boolean;
  productAddOnId: string;
  amountDisplay: string;
};

type OrderCompleteServiceProps = {
  id: string;
  service_name: string;
  category: string;
  price: number;
  addOn: number;
  imageSrc: string;
  CompleteserviceDetails: ServiceDetailComplete[];
};
type InprogressServiceDetail = {
  description: string;
  quantity: number;
};

type ServiceDetailsInProgressProps = {
  id: string;
  serviceName: string;
  category: string;
  addOns: number;
  price: number;
  imageSrc: string;
  Serviceitems: InprogressServiceDetail[];
};

type FormData = {
  serviceDetails: InprogressServiceDetail[][];
};
type InprogressServiceDetail = {
  description: string;
  quantity: number;
};

type ServiceDetailsInProgressProps = {
  id: string;
  serviceName: string;
  category: string;
  addOns: number;
  price: number;
  imageSrc: string;
  Serviceitems: InprogressServiceDetail[];
};

type FormData = {
  serviceDetails: InprogressServiceDetail[][];
};

type TopupProps = {
  transactionId: string;
  topupAmount: number;
  paymentMethod: string;
  status: string;
  date: string;
  remark?: string;
};

type TopupProps = {
  transactionId: string;
  topupAmount: number;
  paymentMethod: string;
  status: string;
  date: string;
  remark?: string;
};

type BannerProps = {
  id: number;
  name: string;
  type: string;
  status: boolean;
  sort: number;
  titleEn: string | null;
  titleKm: string | null;
  titleTw: string | null;
  titleCn: string | null;
  titleVi: string | null;
  imgUrlEn: string | null;
  imgUrlKm: string | null;
  imgUrlVi: string | null;
  imgUrlCn: string | null;
  imgUrlTw: string | null;
  imgDetailUrlEn: string | null;
  imgDetailUrlKm: string | null;
  imgDetailUrlVi: string | null;
  imgDetailUrlCn: string | null;
  imgDetailUrlTw: string | null;
  hasDetail: boolean;
  hasTopup: boolean;
  hasBooking: boolean;
  contentEn: string | null;
  contentKm: string | null;
  contentVi: string | null;
  contentTw: string | null;
  contentCn: string | null;
  deeplink: string | null;
  deeplinkType: string;
  amount: number;
  credit: number;
  startDate: string | null;
  expiredDate: string | null;
  createdAt: string;
  updatedAt: string;
  unsupportedCoupons?: unknown[];
};
type PromotionProps = {
  id: string;
  name: string;
  applies_to: string;
  promotion_type: string;
  value: string;
  usage_limit: number;
  per_user_unit: number;
  status: string;
  created_by: string;
  valid_from: string;
  valid_to: string;
  eligible_service: string;
  eligible_users: string;
};
type FinanceProps = {
  id: string;
  orderId: string;
  customerName: string;
  profileUrl?: string;
  amount: string;
  discount: string;
  serviceFee: string;
  transportFee: string;
  vat: string;
  totalFee: string;
  status: string;
  date: string;
  remark?: string;
};
type RolesProps = {
  id: string;
  role: string;
  status: string;
  createdAt: Date;
  createdBy: string;
};
type TopupAttributes = {
  paymentMethod: string;
  customerId: string;
  topUpID: string;
  customerName: string;
  transactionDate: string;
  paidAmount: number;
  customerPhone: string;
  credit: number;
  totalCredit: number;
  balanceDisplay: string;
  currentBalanceDisplay: string;
  paymentStatus: PaymentStatusProps;
  tranId?: string;
};

type TopicProps = {
  id: string;
  name: string;
  topicName: string;
  createdAt: Date;
  updatedAt: Date;
};

type PageUrl = {
  key: string;
  label: string;
  values: Value[];
};

interface Banner {
  imgUrlEn: string;
  imgUrlKm: string;
  imgUrlVi: string;
  imgUrlCn: string;
  imgUrlTw: string;
  imgDetailUrlEn: string;
  imgDetailUrlKm: string;
  imgDetailUrlVi: string;
  imgDetailUrlCn: string;
  imgDetailUrlTw: string;
  id: number;
  name: string;
  hasDetail: boolean;
  hasTopup: boolean;
  hasBooking: boolean;
  unsupportedCoupons: unknown[];
  amount: number;
  credit: number;
  type: string;
  status: boolean;
  titleEn: string;
  titleKm: string;
  titleTw: string;
  titleCn: string;
  titleVi: string;
  contentEn: string;
  contentKm: string;
  contentCn: string;
  contentTw: string;
  contentVi: string;
  deeplink: string;
  deeplinkType: string;
  sort: number;
  createdAt: string;
  updatedAt: string;
}

interface Value {
  label: string;
  key: string;
  required: boolean;
}

type PushNotificationAttributes = {
  id: string;
  name: string;
  announcementTopics: TopicProps[];
  titleEn: string;
  titleKm: string;
  titleVi: string;
  titleCn: string;
  titleTw: string;
  contentEn: string;
  contentKm: string;
  contentVi: string;
  contentCn: string;
  contentTw: string;
  detailEn: string;
  detailKm: string;
  detailVi: string;
  detailCn: string;
  detailTw: string;
  bannerEn: string;
  bannerKm: string;
  bannerVi: string;
  bannerCn: string;
  bannerTw: string;
  type: string;
  scheduleType: string;
  timeOffset?: number;
  announcementType: string;
  status: NotificationStatusProps;
  startAt: string;
  sentAt: string;
  endAt: string;
  createdAt: string;
  updatedAt: string;
  topics?: Topic[];
  customData: CustomDataSchemaProps;
};

type CustomDataSchemaProps = {
  type: string;
  value?: string | Record<string, unknown> | undefined;
};
interface Topic {
  id: number;
  name: string;
  topic: string;
  groupId: string;
  announcementTopics?: AnnouncementTopics;
}

interface AnnouncementTopics {
  categoryIds?: string[];
  productIds?: string[];
  optionIds?: string[];
  startDate?: string;
  endDate?: string;
  coupons?: Coupon[];
}

interface Coupon {
  id: string;
  qty: string;
  price: string;
}

type CleanerAttributes = {
  id: string;
  name: string;
  image?: string;
  gender?: string;
  status?: 1 | 0;
  autoAssign?: boolean;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
  expertiseIds?: string[];
  expertises?: string[];
  joinedDate?: string;
  cleanerWeeklyOffs?: number[];
};

type ServiceItemAttributes = {
  id: string;
  name: string;
  description: string;
  status: boolean;
  createdAt: string;
  createdBy: string;
};

type CustomerServicesAttributes = {
  categoryId: string;
  nameEn: string;
  contactDate: string;
  customerServiceId: string;
  remark: string;
  status: string;
};

type CustomerAttributes = {
  id: string;
  name: string;
  createdAt: string;
  firstName: string;
  lastName: string;
  status: UserStatusProps;
  username: string;
  gender: string;
  dob: string;
  email: string;
  gender: string;
  balance: number;
  language: string;
  resourceReferral: string;
  totalOrders: string;
  totalOrderAmount: string;
  lastOrderDate: string;
  averageRatingRounded?: string;
  spenderCategory: string;
  lastContactDate?: string;
  remark?: string;
  customerServices: CustomerServicesAttributes;
  announcementReads?: AnnouncementRead[];
  announcementUsers?: AnnouncementUser[];
};

type AnnouncementCouponAttributes = {
  isFree: boolean;
  isClaimed: boolean;
  userId: number;
  announcementId: number;
  couponId: number;
  qty: number;
  price: string;
  claimedAt: null;
  tranId: null;
  tranInitDate: null;
  paymentMethod: null;
  status: PaymentStatusProps;
  sentAt: null;
  createdAt: string;
  updatedAt: string;
  user: User;
  announcement: Announcement;
  coupon: Coupon;
};

interface Coupon {
  name: string;
  code: string;
}

interface Announcement {
  name: string;
  titleEn: string;
  type: string;
  sentAt: string;
}

interface User {
  username: string;
  firstName: string;
  lastName: string;
  gender: string;
  createdAt: string;
}

interface AnnouncementUser {
  isFree: boolean;
  isClaimed: boolean;
  userId: number;
  announcementId: number;
  couponId?: number;
  qty: number;
  price: string;
  claimedAt: null;
  tranId: null;
  tranInitDate: null;
  paymentMethod: null;
  status: PaymentStatusProps;
  createdAt: string;
  updatedAt: string;
  coupon?: AuCoupon;
}

interface AuCoupon {
  name: string;
  code: string;
}

interface AnnouncementRead {
  userId: number;
  announcementId: number;
  readAt: string;
  deletedAt: null;
}

type CouponAttributes = {
  id: string;
  name: string;
  code: string;
  promoTextEn: string;
  promoTextKm: string;
  promoTextVi: string;
  promoTextCn: string;
  promoTextTw: string;
  remark: string;
  status: boolean;
  value: number;
  type: string;
  effectiveDate: string;
  expiredDate: string;
  minSpentAmount: number;
  maxRedeemAmount: number;
  maxRedeemCount: string;
  maxRedeemAmountPax: string;
  maxRedeemCountPax: string;
  isNewUserOnly: string;
  isPreview: string;
  selectedProducts: string[];
  selectedOptions: string[];
  createdAt: string;
  updatedAt: string;
  transportFee: number;
  serviceFee: number;
  targetUser: string;
  userCount: string;
  totalUsage: number;
  totalSale: number;
  newUserCount: number;
  returningCustomerCount: number;
  users: {
    id: string;
    usageCount: string;
    firstName: string;
    lastName: string;
    username: string;
    qty: number;
  }[];
};

type ActivityLogAttributes = {
  id: number;
  username: string;
  role: string;
  reqMethod: string;
  reqUrl: string;
  reqHeader: ReqHeader;
  reqBody: unknown;
  deviceId: string;
  clientIp: string;
  createdAt: string;
  updatedAt: string;
};

interface ReqHeader {
  host: string;
  connection: string;
  'content-length': string;
  pragma: string;
  'cache-control': string;
  'sec-ch-ua-platform': string;
  authorization: string;
  'user-agent': string;
  accept: string;
  'sec-ch-ua': string;
  'content-type': string;
  'sec-ch-ua-mobile': string;
  origin: string;
  'sec-fetch-site': string;
  'sec-fetch-mode': string;
  'sec-fetch-dest': string;
  referer: string;
  'accept-encoding': string;
  'accept-language': string;
}

type BlockedScheduleAttributes = {
  iconUrl?: string;
  id?: string;

  date: string;
  labelEn: string;
  labelKm: string;
  labelCn: string;
  labelTw: string;
  labelVi: string;

  titleEn: string;
  titleKm: string;
  titleVi: string;
  titleCn: string;
  titleTw: string;

  messageEn: string;
  messageKm: string;
  messageVi: string;
  messageCn: string;
  messageTw: string;

  categoryIds: number[];
  createdAt?: string;
  updatedAt?: string;
};

type OtpAttributes = {
  clientIp: string;
  createdAt: string;
  deviceId: string;
  expDate: string;
  id: string;
  isVerified: string;
  otp: string;
  status: string;
  updatedAt: string;
  username: string;
};
type PaymentLinkAttributes = {
  id: string;
  bulkOrderId: string;
  title: string;
  effectiveDate: string;
  expireDate: string;
  type: string;
  tranId: string;
  tranInitDate: string;
  amount: string;
  vat: string;
  status: PaymentStatusProps;
  customData: {
    qty: number;
    couponId: number;
  }[];
  createdAt: string;
  updatedAt: string;
  userId: number;
  user: {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    balance: string;
    createdAt: string;
  };
};

type ProductAttributes = {
  id: number;
  iconUrl: string | null;
  nameEn: string;
  nameKm: string | null;
  nameVi: string | null;
  nameCn: string | null;
  nameTw: string | null;
  status: boolean;
  amount: number;
  sort: number;
  hasExtra?: boolean;
  taskInfoEn: Array<{ key: string; value: string[] }> | null;
  taskInfoKm: Array<{ key: string; value: string[] }> | null;
  taskInfoCn: Array<{ key: string; value: string[] }> | null;
  taskInfoTw: Array<{ key: string; value: string[] }> | null;
  taskInfoVi: Array<{ key: string; value: string[] }> | null;
  isSelected?: boolean;
  hasQty?: boolean;
  createdAt?: string;
  updatedAt?: string;
  categoryId?: number;
  category?: {
    id: number;
    nameEn: string;
  };
};

type ProductAddOnAttributes = {
  id: string;
  nameEn: string;
  nameKm: string;
  nameVi: string;
  nameCn: string;
  nameTw: string;
  amount?: string;
  amountDisplay?: string;
};

type ProductAddOnGroupAttributes = {
  id: string;
  nameEn: string;
  nameKm: string;
  nameVi: string;
  nameCn: string;
  nameTw: string;
};

type ProductAddOnItemAttributes = {
  id: number;
  groupId: number;
  nameEn: string;
  nameKm: string | null;
  nameVi: string | null;
  nameCn: string | null;
  nameTw: string | null;
  imgUrl: string | null;
  amount: number;
  duration: number;
  status: boolean;
  type: string;
  parentId: number | null;
  categoryId: number;
};

type ProductAddOnGroupDetailAttributes = {
  id: number;
  categoryId: number;
  nameEn: string;
  nameKm: string | null;
  nameVi: string | null;
  nameCn: string | null;
  nameTw: string | null;
  badgeEn: string | null;
  badgeKm: string | null;
  badgeVi: string | null;
  badgeCn: string | null;
  badgeTw: string | null;
  selectionType: string;
  isRequired: boolean;
  sort: number;
  addOns: ProductAddOnItemAttributes[];
};

type ProductAddOnLangValue = {
  en: string;
  km: string;
  vi: string;
  tw: string;
  cn: string;
};

type ProductAddOnItemFormAttributes = {
  imgUrl?: File | string;
  name: ProductAddOnLangValue;
  amount: string;
  duration: string;
  status: boolean;
  type: 'SINGLE' | 'MULTIPLE';
};

type ProductAddOnGroupFormAttributes = {
  id?: number | string;
  name: ProductAddOnLangValue;
  badge: ProductAddOnLangValue;
  selectionType: 'SINGLE' | 'MULTIPLE';
  isRequired: boolean;
  addOns: ProductAddOnItemFormAttributes[];
};

type ProductAddOnGroupCategoryAttributes = {
  id: number;
  nameEn: string | null;
  nameKm: string | null;
  nameVi: string | null;
  nameCn: string | null;
  nameTw: string | null;
};

type ProductAddOnGroupListAttributes = ProductAddOnGroupDetailAttributes & {
  category: ProductAddOnGroupCategoryAttributes | null;
};

interface ProductOptionAttributes {
  imgUrl: null;
  duration: string;
  id: number;
  nameEn: string;
  product?: { id: number; nameEn: string } | null;
  nameKm: string;
  nameVi: string;
  nameCn: string;
  nameTw: string;
  infoEn: null;
  infoKm: null;
  infoVi: null;
  infoCn: null;
  infoTw: null;
  qty: number;
  status: boolean;
  amount: number;
  floorCount: string;
  bedroomCount: string;
  hourCount: string;
  type: string;
  cleanerCount: string;
  count: number;
  remarkEn: null;
  remarkZh: null;
  remarkCh: null;
  remarkVi: null;
  remarkKh: null;
}

type ServiceServiceTypeAttrubutes = (ProductAttributes & {
  productOptionV2s: ProductOptionAttributes[];
})[];

type UserAttributes = {
  balance: string;
  count: string;
  createdAt: string;
  description: string;
  deviceId: string;
  dob: string;
  email: string;
  fcmToken: string;
  firstName: string;
  gender: string;
  id: string;
  isBlacklist: boolean;
  isTest: boolean;
  language: string;
  lastName: string;
  loginType: string;
  password: string;
  phoneModel: string;
  phoneType: string;
  profileUrl: string;
  referralCode: string;
  referrerCode: string;
  socialId: string;
  status: string;
  type: string;
  updatedAt: string;
  username: string;
};

type AddressAttributes = {
  id: string;
  isPrimary: string;
  name: string;
  address: string;
  addressDetail: string;
  floorNum: string;
  roomNum: string;
  note: string;
  latitude: string;
  longitude: string;
  sort: string;
  bookingDate: string;
};

type ProductOptionsAttributes = {
  amount: string;
  amountAddOn: string;
  bedroomCount: string;
  cleanerCount: string;
  discount: string;
  floorCount: string;
  hourCount: string;
  iconUrl: string;
  id: string;
  isPrimary: string;
  nameCn: string;
  nameEn: string;
  nameKm: string;
  nameTw: string;
  nameVi: string;
  productId: string;
  productNameCn: string;
  productNameEn: string;
  productNameKm: string;
  productNameTw: string;
  productNameVi: string;
  qty: string;
  subTotal: string;
  type: string;
};

type ABAPaymentCheckProps = {
  apv: string;
  discount_amount: string;
  original_amount: string;
  payment_amount: string;
  payment_currency: string;
  payment_status: 'PENDING' | 'IN-REVIEW' | 'FAILED' | 'PAID' | 'REFUNDED';
  payment_status_code: string;
  refund_amount: string;
  total_amount: string;
  transaction_date: string;
};
type TrendProps = {
  count: string;
  prevCount?: string;
  trend?: 'down' | 'up' | 'none';
  percentage?: string;
  description?: string;
};

type KeyValueProps = {
  [key: string]: number;
};

type OverviewChartProps = {
  // currentRows: KeyValueProps;
  // prevRows: KeyValueProps;
  chartData: {
    date: string;
    label: string;
    thisMonth: number;
    lastMonth: number;
    tooltipLabel: string;
  }[];
  currentRange: { from: Date; to: Date };
  prevRange: { from: Date; to: Date };
};

type LabelValueProps = {
  label: string;
  value: number;
};

type ServiceBreakdownProps = {
  iconUrl: string;
  category: string;
  totalWithVat: number;
  createdAt: string;
  orderCount: string;
  updatedAt: string;
};

type CouponUsageBreakdownProps = {
  label: string;
  value: string;
  totalSale: number;
  newUserCount: string;
  returningCustomerCount: string;
};

type CustomerRatingProps = {
  createdAt: string;
  feedback: string;
  star: string;
};

type DirectSaleUserProps = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
};

// type DirectSaleCustomerAttributes = {
//   id: string;
//   firstName: string;
//   lastName: string;
//   username: string;
//   createdAt: string;
//   language: string;
//   resourceReferral: string;
//   // totalOrders: string;
//   totalOrderAmount: string;
//   // remark?: string;
//   customerServices?: CustomerServicesAttributes;
// };

type DashboardChartProps = {
  date: string;
  newUsers: string;
  returningUsers: string;
};

type UpcomingOrderProps = {
  bulkOrderId: string;
  id: string;
  productOptionV2Id: string;
  productOptionV2Name: string;
  productOptionV2ProductId: string;
  scheduleStartDate: string;
  thumbnailUrl: string;
  totalAmount: string;
};

type DashboardNewUserProps = {
  id: string;
  date: string;
  iOS: string;
  android: string;
  totalInstallOpen: string;
  totalRegisteredUsers: string;
  activeUsers: string;
  totalInactiveUsers: string;
  iosInstallOpen: string;
  androidInstallOpen: string;

  // ioIos: string;
  // ioAndroid: string;
  count: string;
  revenue: string;
};

type Ga4DailyMatricProps = {
  data: {
    activeUsers: string;
    date: string;
    newUsers: string;
    returningUsers: string;
    totalInactiveUsers: string;
    totalInstallOpen: string;
    totalRegisteredUsers: string;
    iosActiveUsers: string;
    androidActiveUsers: string;
  }[];
  order: {
    date: string;
    count: string;
    revenue: number;
  }[];
  appSales: string;
  directSales: string;
  coupons: string;
  totalRevenue: string;
  adsTotalRevenue?: number;
};

// type DashboardOverviewProps = {
//   id: string;
//   date: string;
//   clicks: string;
//   platform: string;
//   conversionsInstalls: string;
//   reach: string;
//   cost: string;
//   cpc: string;
//   cac: string;
//   appInstall: string;
// };
type AdsSummaryProps = {
  reach: number;
  clicks: number;
  appInstalls: number;
  conversions: number;
  spend: number;
  cpc: number;
  cac: number;
  roas?: number;
};

type AdsDailyProps = {
  date: string;
  reach: string;
  clicks: string;
  appInstalls: string;
  platform: string;
  conversionsInstalls: string;
  spend: string;
  cpc: string;
  cac: number;
};

type AdsProp = {
  summary: AdsSummaryProps;
  daily: AdsDailyProps[];
};

type DashboardAdsProps = {
  facebook: AdsProp;
  tiktok: AdsProp;
};

type ExchangeRateListAttributes = {
  id: number;
  exchangeRate: number;
  bid: number;
  ask: number;
  createdAt: string;
  updatedAt: string;
};

type ProductDetailAttributes = Omit<ProductAttributes, 'categoryId' | 'category'> & {
  categoryId: number;
  category: {
    id: number;
    nameEn: string;
    nameKm: string;
    nameVi: string;
    nameCn: string;
    nameTw: string;
  };
  productOptionV2s?: ProductOptionAttributes[];
};

type TaskInfoItemProps = {
  key: string;
  value: string[];
};

type EquipmentItemProps = {
  name: string;
  status: boolean;
  sort: number;
};
