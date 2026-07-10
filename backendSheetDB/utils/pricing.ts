// Flat placeholder fees until a real fee-config table (or admin setting) exists.
export const PRICING = {
  SERVICE_FEE: 0,
  TRANSPORT_FEE: 1.5,
  VAT_RATE: 0.1,
}

export type CouponRule = { type: 'FIXED' | 'PERCENTAGE'; value: number } | null | undefined

export interface OrderTotals {
  amount: number
  addOnAmount: number
  discount: number
  serviceFee: number
  transportFee: number
  vatFee: number
  totalAmount: number
  totalPayableAmount: number
}

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

export function computeDiscount(subtotal: number, coupon: CouponRule): number {
  if (!coupon) return 0
  const raw = coupon.type === 'PERCENTAGE' ? subtotal * (coupon.value / 100) : coupon.value
  return round2(Math.min(subtotal, Math.max(0, raw)))
}

export function computeOrderTotals(params: {
  productAmount: number
  pairAmount: number
  addOnAmount: number
  coupon?: CouponRule
}): OrderTotals {
  const amount = round2(params.productAmount + params.pairAmount)
  const addOnAmount = round2(params.addOnAmount)
  const subtotal = amount + addOnAmount
  const discount = computeDiscount(subtotal, params.coupon)
  const totalAmount = round2(subtotal - discount)
  const serviceFee = PRICING.SERVICE_FEE
  const transportFee = PRICING.TRANSPORT_FEE
  const vatFee = round2(totalAmount * PRICING.VAT_RATE)
  const totalPayableAmount = round2(totalAmount + serviceFee + transportFee + vatFee)
  return { amount, addOnAmount, discount, serviceFee, transportFee, vatFee, totalAmount, totalPayableAmount }
}
