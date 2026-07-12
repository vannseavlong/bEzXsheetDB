import { Router } from 'express'
import type { DatabaseAdapter } from 'longcelot-sheet-db'
import type { AuthRequest } from '../../middleware/auth'
import { checkCoupon } from './coupon-logic'

export function createCouponRouter(adapter: DatabaseAdapter) {
  const router = Router()

  // POST /coupon/validate
  router.post('/validate', async (req: AuthRequest, res, next) => {
    try {
      const { code } = req.body as { code?: string }
      if (!code) return res.status(400).json({ message: 'code is required' })

      const result = await checkCoupon(adapter, code, req.user!.id as string)
      if (!result.valid || !result.coupon) {
        return res.json({ data: { code, isValid: false, message: result.message } })
      }

      const coupon = result.coupon
      res.json({
        data: {
          id: coupon._id,
          code: coupon.code,
          discount: coupon.value,
          discountType: coupon.type === 'PERCENTAGE' ? 'percentage' : 'fixed',
          isValid: true,
          message: coupon.promo_text_en ?? undefined,
        },
      })
    } catch (err) { next(err) }
  })

  return router
}
