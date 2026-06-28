// ─── Status Enums ────────────────────────────────────────────────────────────

export type OrderStatus = 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
export type PaymentStatus = 'PAID' | 'UNPAID'
export type OrderType = 'ORDER' | 'DIRECT_SALE'
export type PartnerStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'BANNED'
export type KycStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED'
export type TicketStatus = 'OPEN' | 'UNDER_REVIEW' | 'DEDUCTION_PENDING' | 'RESOLVED'
export type NotificationStatus = 'SENT' | 'SCHEDULED' | 'FAILED' | 'DRAFT'
export type NotificationType = 'GENERAL' | 'PACKAGE_DEAL'
export type NotificationScheduleType = 'now' | 'schedule' | 'event'
export type CouponType = 'FIXED' | 'PERCENTAGE'
export type BannerType = 'HOME_BANNER' | 'PRODUCT_BUNDLE' | 'COUPON_BANNER'
export type LoginType = 'ABA_MINI_APP' | 'bEasy_APP'
export type Gender = 'Male' | 'Female'
export type CleanerRole = 'LEADER' | 'MEMBER'
export type OtpStatus = 'USED' | 'EXPIRED' | 'ACTIVE'
export type PaymentLinkStatus = 'PENDING' | 'PAID' | 'EXPIRED'
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
export type TargetUser = 'ALL' | 'SELECTED'
export type ComplaintType = 'Damaged Property' | 'Missing Item' | 'Late Service'
export type TrendDirection = 'up' | 'down' | null

// ─── Multi-Language Value ─────────────────────────────────────────────────────

export interface MultiLangValue {
  en: string
  km: string
  vi: string
  tw: string
  cn: string
}

// ─── Order ───────────────────────────────────────────────────────────────────

export interface SaleAgent {
  firstName: string
  lastName: string
  username: string
}

export interface Order {
  id: string
  bulkOrderId: string | null
  customerFirstName: string
  customerLastName: string
  customerPhone: string
  profileUrl: string | null
  category: string
  serviceType: string
  scheduleStartDate: string
  scheduleDate: string
  duration: number
  address: string
  status: OrderStatus
  paymentStatus: PaymentStatus
  paymentMethod: string
  paymentMethodDisplay: string
  couponCode: string | null
  amount: number
  serviceFee: number
  transportFee: number
  vatFee: number
  discount: number
  netRevenue: number
  totalAmountDisplay: string
  note: string | null
  type: OrderType
  latestCreatedAt: string
  paymentDate: string | null
  paymentCompletedDate: string | null
  exchangeRate: number
  sale?: SaleAgent
  reseller?: SaleAgent
}

// ─── RBAC / Roles ────────────────────────────────────────────────────────────

// ─── Cleaner ─────────────────────────────────────────────────────────────────

export interface Cleaner {
  id: string
  name: string
  image: string | null
  gender: Gender
  role: CleanerRole
  status: boolean
  expertises: string[]
  cleanerWeeklyOffs: string[]
  joinedDate: string
  autoAssign: boolean
}

// ─── Partner ─────────────────────────────────────────────────────────────────

export interface Partner {
  id: string
  firstName: string
  lastName: string
  phoneNumber: string
  status: PartnerStatus
  kycStatus: KycStatus
  services: string[]
  earnings: number
  joinedDate: string
  rating: number
}

// ─── Coupon ───────────────────────────────────────────────────────────────────

export interface Coupon {
  id: string
  name: string
  code: string
  value: number
  type: CouponType
  status: boolean
  targetUser: TargetUser
  promoTextEn: string
  remark: string
  effectiveDate: string | null
  expiredDate: string | null
  userCount: number
  totalUsage: number
  totalSale: number
  newUserCount: number
  returningCustomerCount: number
  isNewUserOnly: boolean
}

// ─── Customer ─────────────────────────────────────────────────────────────────

export interface Customer {
  id: string
  firstName: string
  lastName: string
  username: string
  loginType: LoginType
  gender: Gender
  dob: string
  lastContactDate: string
  preferredService: string[]
  remark: string
  rating: number
  profileUrl: string | null
}

// ─── Banner ───────────────────────────────────────────────────────────────────

export interface Banner {
  id: string
  name: string
  titleEn: string
  type: BannerType
  status: boolean
  startDate: string
  expiredDate: string
  sort: number
  imgUrlEn: string | null
  hasDetail: boolean
  hasTopup: boolean
  credit: number | null
  amount: number | null
}

// ─── Push Notification ────────────────────────────────────────────────────────

export interface PushNotification {
  id: string
  name: string
  titleEn: string
  type: NotificationType
  scheduleType: NotificationScheduleType
  sentAt: string | null
  status: NotificationStatus
  audience: string
}

// ─── Ticket ───────────────────────────────────────────────────────────────────

export interface Ticket {
  id: string
  ticketId: string
  complaintType: ComplaintType
  customerName: string
  customerAvatar: string | null
  orderId: string
  serviceType: string
  serviceDate: string
  location: string
  status: TicketStatus
  investigationNote: string
  deductionAmount: number
  evidencePhotos: string[]
  assignedCleaners: string[]
  createdAt: string
}

// ─── Category ─────────────────────────────────────────────────────────────────

export interface Category {
  id: string
  nameEn: string
  nameKm: string
  thumbnailUrl: string | null
  status: boolean
  sort: number
  platform: string[]
  products: string[]
  categoryAddOns: string[]
}

// ─── Product ──────────────────────────────────────────────────────────────────

export interface Product {
  id: string
  nameEn: string
  nameKm: string
  categories: string[]
  basePrice: number
  duration: number
  status: boolean
  sort: number
}

// ─── Product Option ───────────────────────────────────────────────────────────

export interface ProductOption {
  id: string
  nameEn: string
  type: string
  productNameEn: string
  status: boolean
}

// ─── Category Addon ───────────────────────────────────────────────────────────

export interface CategoryAddon {
  id: string
  nameEn: string
  categories: string[]
  selection_type: string
  status: boolean
  isRequired: boolean
  itemCount: number
  badge_en: string
}

// ─── Popular Service ──────────────────────────────────────────────────────────

export interface PopularService {
  id: string
  nameEn: string
  status: boolean
  displayOrder: number
  imageUrl: string | null
  itemCount: number
}

// ─── Item ─────────────────────────────────────────────────────────────────────

export interface Item {
  id: string
  nameEn: string
  category: string
  status: boolean
  sortOrder: number
}

// ─── Blocked Schedule ─────────────────────────────────────────────────────────

export interface BlockedSchedule {
  id: string
  name: string
  blockedDate: string
  startTime: string
  endTime: string
  cleanerDetails: string[]
  associatedAddress: string
}

// ─── Finance ──────────────────────────────────────────────────────────────────

export interface FinanceOrder {
  id: string
  createdDate: string
  orderId: string
  customerName: string
  customerPhone: string
  serviceCategory: string
  specificService: string
  scheduleDate: string
  time: string
  address: string
  status: OrderStatus
  paymentInitDate: string
  paymentCompletedDate: string
  paymentMethod: string
  promoCode: string | null
  originalPrice: number
  discount: number
  serviceFee: number
  transportFee: number
  netRevenue: number
  vat: number
  totalFee: number
  remark: string | null
}

export interface TopUpTransaction {
  id: string
  transactionId: string
  customerName: string
  amount: number
  date: string
  status: string
  paymentMethod: string
}

export interface BComboTransaction {
  id: string
  transactionId: string
  customerName: string
  bundleName: string
  amount: number
  date: string
  status: string
  paymentMethod: string
}

export interface DirectSaleRecord {
  id: string
  orderId: string
  customerName: string
  salesAgent: string
  amount: number
  status: OrderStatus
  paymentMethod: string
  date: string
}

// ─── Activity Log ─────────────────────────────────────────────────────────────

export interface ActivityLog {
  id: string
  createdAt: string
  user: { username: string }
  reqMethod: HttpMethod
  reqUrl: string
  module: string
  detail: string
}

// ─── OTP ─────────────────────────────────────────────────────────────────────

export interface OtpLog {
  id: string
  phoneNumber: string
  otpCode: string
  createdAt: string
  expiredAt: string
  status: OtpStatus
}

// ─── Payment Link ─────────────────────────────────────────────────────────────

export interface PaymentLink {
  id: string
  customerId: string
  customerName: string
  amount: number
  status: PaymentLinkStatus
  createdDate: string
  expiryDate: string
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

export interface DashboardKpi {
  label: string
  value: number
  trend: TrendDirection
  changePercent: number
}

export interface UserGrowthPoint {
  date: string
  users: number
  orders: number
}

export interface UpcomingOrder {
  time: string
  customerName: string
  service: string
}

// ─── Table & Pagination ───────────────────────────────────────────────────────

export interface PaginationState {
  page: number
  pageSize: number
}

export interface SelectOption {
  label: string
  value: string
}
