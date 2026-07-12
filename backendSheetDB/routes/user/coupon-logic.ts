import type { DatabaseAdapter } from 'longcelot-sheet-db'
import { adminCtx } from './context'

export interface CouponCheckResult {
  valid: boolean
  message?: string
  coupon?: Record<string, unknown>
}

/** Shared by POST /coupon/validate and the order preview/create pricing pipeline. */
export async function checkCoupon(adapter: DatabaseAdapter, code: string, userId: string): Promise<CouponCheckResult> {
  const ctx = adminCtx(adapter)
  const coupon = await ctx.table('coupons').findOne({ where: { code } }) as Record<string, unknown> | null
  if (!coupon || !coupon.status) return { valid: false, message: 'Coupon not found' }

  const now = new Date()
  if (coupon.effective_date && new Date(coupon.effective_date as string) > now) {
    return { valid: false, message: 'Coupon is not active yet' }
  }
  if (coupon.expired_date && new Date(coupon.expired_date as string) < now) {
    return { valid: false, message: 'Coupon has expired' }
  }

  if (coupon.is_new_user_only) {
    const priorOrders = await ctx.table('orders').findMany({ where: { customer_user_id: userId, is_primary: true } })
    if (priorOrders.length > 0) return { valid: false, message: 'Coupon is only valid for new customers' }
  }

  if (coupon.total_usage_limit) {
    // Approximate: counts every non-cancelled redemption. Doesn't currently exclude
    // CANCELLED orders — acceptable v1 limitation, tighten if abuse shows up.
    const redemptions = await ctx.table('orders').findMany({ where: { coupon_id: coupon._id, is_primary: true } })
    if (redemptions.length >= (coupon.total_usage_limit as number)) {
      return { valid: false, message: 'Coupon usage limit reached' }
    }
  }

  return { valid: true, coupon }
}
