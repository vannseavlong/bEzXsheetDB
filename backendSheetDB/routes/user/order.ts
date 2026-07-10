import crypto from 'crypto'
import { Router } from 'express'
import type { SheetAdapter } from 'longcelot-sheet-db'
import type { AuthRequest } from '../../middleware/auth'
import { adminCtx, userCtx } from './context'
import { HttpError } from '../../utils/http-error'
import { computeOrderTotals, type CouponRule } from '../../utils/pricing'
import { nextDays, isDateBlocked } from '../../utils/schedule'
import { checkCoupon } from './coupon-logic'
import { groupBy } from '../../utils/group-by'

type AdminCtx = ReturnType<typeof adminCtx>

interface BookingLineInput {
  categoryProductOptionId: string
  qty: number
  addonItems?: { id: string; qty: number }[]
}

interface OrderPayload {
  line: BookingLineInput
  pairLines?: BookingLineInput[]
  addressId: string
  scheduleStartDate: string
  note?: string
  couponCode?: string
  paymentMethod?: string
}

interface ResolvedLine {
  categoryProductOptionId: string
  categoryProductId: string
  categoryId: string
  categoryNameEn: string
  productId: string
  productNameEn: string
  productNameKm: string
  thumbnailUrl: string | null
  productOptionId: string | null
  optionNameEn: string | null
  optionNameKm: string | null
  unitAmount: number
  duration: number
  qty: number
  lineTotal: number
}

interface ResolvedAddonItem {
  addonItemId: string
  nameEn: string
  nameKm: string
  unitAmount: number
  qty: number
  lineTotal: number
}

async function resolveLine(ctx: AdminCtx, categoryProductOptionId: string, qty: number): Promise<ResolvedLine> {
  const cpo = await ctx.table('category_product_options').findOne({ where: { _id: categoryProductOptionId } }) as Record<string, unknown> | null
  if (!cpo) throw new HttpError(400, `Unknown product option: ${categoryProductOptionId}`)

  const categoryProduct = await ctx.table('category_products').findOne({ where: { _id: cpo.category_product_id } }) as Record<string, unknown> | null
  if (!categoryProduct) throw new HttpError(400, 'Product is no longer linked to this category')

  const [category, product, productOption] = await Promise.all([
    ctx.table('categories').findOne({ where: { _id: categoryProduct.category_id } }) as Promise<Record<string, unknown> | null>,
    ctx.table('products').findOne({ where: { _id: categoryProduct.product_id } }) as Promise<Record<string, unknown> | null>,
    cpo.product_option_id
      ? (ctx.table('product_options').findOne({ where: { _id: cpo.product_option_id } }) as Promise<Record<string, unknown> | null>)
      : Promise.resolve(null),
  ])
  if (!category || !product) throw new HttpError(400, 'Category or product no longer exists')

  return {
    categoryProductOptionId: cpo._id as string,
    categoryProductId: categoryProduct._id as string,
    categoryId: category._id as string,
    categoryNameEn: category.name_en as string,
    productId: product._id as string,
    productNameEn: product.name_en as string,
    productNameKm: product.name_km as string,
    thumbnailUrl: (product.thumbnail_url as string | undefined) ?? null,
    productOptionId: (productOption?._id as string | undefined) ?? null,
    optionNameEn: (productOption?.name_en as string | undefined) ?? null,
    optionNameKm: (productOption?.name_km as string | undefined) ?? null,
    unitAmount: cpo.price as number,
    duration: cpo.duration as number,
    qty,
    lineTotal: (cpo.price as number) * qty,
  }
}

async function resolveAddonItem(ctx: AdminCtx, id: string, qty: number): Promise<ResolvedAddonItem> {
  const item = await ctx.table('category_addon_items').findOne({ where: { _id: id } }) as Record<string, unknown> | null
  if (!item) throw new HttpError(400, `Unknown addon item: ${id}`)
  return {
    addonItemId: item._id as string,
    nameEn: item.name_en as string,
    nameKm: item.name_km as string,
    unitAmount: item.amount as number,
    qty,
    lineTotal: (item.amount as number) * qty,
  }
}

async function loadPairProductCatalog(ctx: AdminCtx, categoryProductId: string) {
  const pairings = await ctx.table('product_pairings').findMany({
    where: { category_product_id: categoryProductId },
    orderBy: 'sort',
    order: 'asc',
  }) as Record<string, unknown>[]
  if (pairings.length === 0) return []

  const productOptions = await ctx.table('product_options').findMany({}) as Record<string, unknown>[]
  const optionById = Object.fromEntries(productOptions.map((o) => [o._id, o]))

  const catalog = []
  for (const pairing of pairings) {
    const cp = await ctx.table('category_products').findOne({ where: { _id: pairing.paired_category_product_id } }) as Record<string, unknown> | null
    if (!cp) continue
    const [product, options] = await Promise.all([
      ctx.table('products').findOne({ where: { _id: cp.product_id } }) as Promise<Record<string, unknown> | null>,
      ctx.table('category_product_options').findMany({
        where: { category_product_id: cp._id },
        orderBy: 'sort',
        order: 'asc',
      }) as Promise<Record<string, unknown>[]>,
    ])
    if (!product) continue
    catalog.push({
      categoryProductId: cp._id,
      productId: product._id,
      nameEn: product.name_en,
      nameKm: product.name_km,
      thumbnailUrl: product.thumbnail_url ?? null,
      options: options.map((o) => ({
        id: o._id,
        productOptionId: o.product_option_id,
        nameEn: optionById[o.product_option_id as string]?.name_en ?? null,
        nameKm: optionById[o.product_option_id as string]?.name_km ?? null,
        amount: o.price,
        duration: o.duration,
      })),
    })
  }
  return catalog
}

function lineDto(line: ResolvedLine) {
  return {
    categoryProductOptionId: line.categoryProductOptionId,
    categoryId: line.categoryId,
    productId: line.productId,
    productOptionId: line.productOptionId,
    nameEn: line.productNameEn,
    nameKm: line.productNameKm,
    optionNameEn: line.optionNameEn,
    optionNameKm: line.optionNameKm,
    thumbnailUrl: line.thumbnailUrl,
    amount: line.unitAmount,
    duration: line.duration,
    qty: line.qty,
    subTotal: line.lineTotal,
  }
}

interface BuiltPreview {
  line: ResolvedLine
  addonItems: ResolvedAddonItem[]
  pairLines: ResolvedLine[]
  pairProductCatalog: Awaited<ReturnType<typeof loadPairProductCatalog>>
  couponRow: Record<string, unknown> | null
  totals: ReturnType<typeof computeOrderTotals>
}

async function buildPreview(adapter: SheetAdapter, userId: string, payload: OrderPayload): Promise<BuiltPreview> {
  if (!payload.line?.categoryProductOptionId || !payload.line?.qty) {
    throw new HttpError(400, 'line.categoryProductOptionId and line.qty are required')
  }
  const ctx = adminCtx(adapter)

  const line = await resolveLine(ctx, payload.line.categoryProductOptionId, payload.line.qty)
  const [addonItems, pairLines, pairProductCatalog] = await Promise.all([
    Promise.all((payload.line.addonItems ?? []).map((a) => resolveAddonItem(ctx, a.id, a.qty))),
    Promise.all((payload.pairLines ?? []).map((p) => resolveLine(ctx, p.categoryProductOptionId, p.qty))),
    loadPairProductCatalog(ctx, line.categoryProductId),
  ])

  let couponRow: Record<string, unknown> | null = null
  let coupon: CouponRule = null
  if (payload.couponCode) {
    const result = await checkCoupon(adapter, payload.couponCode, userId)
    if (!result.valid || !result.coupon) throw new HttpError(400, result.message ?? 'Invalid coupon')
    couponRow = result.coupon
    coupon = { type: couponRow.type as 'FIXED' | 'PERCENTAGE', value: couponRow.value as number }
  }

  const addOnAmount = addonItems.reduce((sum, a) => sum + a.lineTotal, 0)
  const pairAmount = pairLines.reduce((sum, p) => sum + p.lineTotal, 0)
  const totals = computeOrderTotals({ productAmount: line.lineTotal, pairAmount, addOnAmount, coupon })

  return { line, addonItems, pairLines, pairProductCatalog, couponRow, totals }
}

function previewDto(built: BuiltPreview, scheduleStartDate: string, note: string | undefined) {
  return {
    line: lineDto(built.line),
    addOns: built.addonItems.map((a) => ({ id: a.addonItemId, nameEn: a.nameEn, nameKm: a.nameKm, amount: a.unitAmount, qty: a.qty, subTotal: a.lineTotal })),
    pairLines: built.pairLines.map(lineDto),
    pairProducts: built.pairProductCatalog,
    scheduleStartDate,
    note: note ?? '',
    couponCode: built.couponRow?.code ?? null,
    ...built.totals,
  }
}

export function createOrderRouter(adapter: SheetAdapter) {
  const router = Router()
  const ctx = () => adminCtx(adapter)

  // GET /order/available-schedule
  router.get('/available-schedule', async (_req, res, next) => {
    try {
      const blocks = await ctx().table('blocked_schedules').findMany({}) as Record<string, unknown>[]
      const days = nextDays(14).map((date) => ({
        date,
        available: !isDateBlocked(date, blocks),
      }))
      res.json({ data: days })
    } catch (err) { next(err) }
  })

  // POST /order/preview — computes pricing/pairings without persisting
  router.post('/preview', async (req: AuthRequest, res, next) => {
    try {
      const payload = req.body as OrderPayload
      const built = await buildPreview(adapter, req.user!.id as string, payload)
      res.json({ data: previewDto(built, payload.scheduleStartDate, payload.note) })
    } catch (err) {
      if (err instanceof HttpError) return res.status(err.status).json({ message: err.message })
      next(err)
    }
  })

  // POST /order/create — persists one `orders` row per line, sharing one bulk_order_id
  router.post('/create', async (req: AuthRequest, res, next) => {
    try {
      const payload = req.body as OrderPayload
      if (!payload.addressId) throw new HttpError(400, 'addressId is required')
      if (!payload.scheduleStartDate) throw new HttpError(400, 'scheduleStartDate is required')

      const user = req.user!
      const address = await userCtx(adapter, user.id as string).table('addresses').findOne({
        where: { _id: payload.addressId, user_id: user.id },
      }) as Record<string, unknown> | null
      if (!address) throw new HttpError(400, 'Address not found')

      const built = await buildPreview(adapter, user.id as string, payload)
      const bulkOrderId = crypto.randomUUID()
      const scheduleDate = new Date(payload.scheduleStartDate)

      const baseRow = {
        bulk_order_id: bulkOrderId,
        customer_user_id: user.id,
        customer_first_name: user.firstName,
        customer_last_name: user.lastName,
        customer_phone: user.phone,
        profile_url: user.profileUrl ?? null,
        schedule_date: scheduleDate,
        address: address.address,
        address_id: address._id,
        latitude: address.latitude,
        longitude: address.longitude,
        floor_num: address.floor_num ?? null,
        room_num: address.room_num ?? null,
        status: 'PENDING',
        payment_status: 'UNPAID',
        payment_method: payload.paymentMethod ?? 'CASH',
        coupon_id: built.couponRow?._id ?? null,
        coupon_code: built.couponRow?.code ?? null,
        note: payload.note ?? '',
        type: 'ORDER',
      }

      const primary = await ctx().table('orders').create({
        ...baseRow,
        category: built.line.categoryNameEn,
        service_type: built.line.optionNameEn ?? built.line.productNameEn,
        category_id: built.line.categoryId,
        product_id: built.line.productId,
        category_product_id: built.line.categoryProductId,
        product_option_id: built.line.productOptionId,
        category_product_option_id: built.line.categoryProductOptionId,
        qty: built.line.qty,
        duration: built.line.duration,
        amount: built.totals.amount - built.pairLines.reduce((s, p) => s + p.lineTotal, 0),
        service_fee: built.totals.serviceFee,
        transport_fee: built.totals.transportFee,
        vat_fee: built.totals.vatFee,
        discount: built.totals.discount,
        net_revenue: built.totals.totalAmount,
        is_primary: true,
      }) as Record<string, unknown>

      if (built.addonItems.length > 0) {
        await Promise.all(built.addonItems.map((a) =>
          ctx().table('order_addons').create({
            order_id: primary._id,
            addon_item_id: a.addonItemId,
            name_en: a.nameEn,
            name_km: a.nameKm,
            amount: a.unitAmount,
            qty: a.qty,
          })
        ))
      }

      await Promise.all(built.pairLines.map((line) =>
        ctx().table('orders').create({
          ...baseRow,
          category: line.categoryNameEn,
          service_type: line.optionNameEn ?? line.productNameEn,
          category_id: line.categoryId,
          product_id: line.productId,
          category_product_id: line.categoryProductId,
          product_option_id: line.productOptionId,
          category_product_option_id: line.categoryProductOptionId,
          qty: line.qty,
          duration: line.duration,
          amount: line.lineTotal,
          service_fee: 0,
          transport_fee: 0,
          vat_fee: 0,
          discount: 0,
          net_revenue: line.lineTotal,
          is_primary: false,
        })
      ))

      res.status(201).json({ data: { bulkOrderId, orderId: primary._id } })
    } catch (err) {
      if (err instanceof HttpError) return res.status(err.status).json({ message: err.message })
      next(err)
    }
  })

  // GET /order/list — grouped by status, one card per bulk order
  router.get('/list', async (req: AuthRequest, res, next) => {
    try {
      const rows = await ctx().table('orders').findMany({
        where: { customer_user_id: req.user!.id },
        orderBy: '_created_at',
        order: 'desc',
      }) as Record<string, unknown>[]

      const byBulkId = groupBy(rows, 'bulk_order_id', (r) => r)
      const primaries = rows.filter((r) => r.is_primary)

      const items = primaries.map((primary) => {
        const lines = byBulkId[primary.bulk_order_id as string] ?? [primary]
        const totalPayableAmount = lines.reduce((sum, l) => sum + (l.amount as number), 0)
          + (primary.service_fee as number) + (primary.transport_fee as number) + (primary.vat_fee as number)
          - (primary.discount as number)
        return {
          id: primary._id,
          bulkOrderId: primary.bulk_order_id,
          thumbnailUrl: null,
          amount: primary.amount,
          status: primary.status,
          itemCount: lines.length,
          createdAt: primary._created_at,
          totalPayableAmount,
        }
      })

      const grouped: Record<string, typeof items> = {}
      for (const item of items) {
        (grouped[item.status as string] ??= []).push(item)
      }
      res.json({ data: grouped })
    } catch (err) { next(err) }
  })

  // GET /order/:bulkOrderId — full detail: primary + pair lines + their addons
  router.get('/:bulkOrderId', async (req: AuthRequest, res, next) => {
    try {
      const rows = await ctx().table('orders').findMany({
        where: { bulk_order_id: req.params.bulkOrderId, customer_user_id: req.user!.id },
      }) as Record<string, unknown>[]
      if (rows.length === 0) return res.status(404).json({ message: 'Not found' })

      const primary = rows.find((r) => r.is_primary) ?? rows[0]
      const allAddons = await ctx().table('order_addons').findMany({}) as Record<string, unknown>[]
      const addonsByOrder = groupBy(allAddons, 'order_id', (a) => a)

      const items = rows.map((r) => ({
        nameEn: r.category,
        optionEn: r.service_type,
        thumbnailUrl: null,
        qty: r.qty,
        amount: (r.amount as number) / ((r.qty as number) || 1),
        subTotal: r.amount,
        isPrimary: r.is_primary,
        addOns: (addonsByOrder[r._id as string] ?? []).map((a) => ({
          id: a._id, nameEn: a.name_en, nameKm: a.name_km, amount: a.amount, qty: a.qty, subTotal: (a.amount as number) * (a.qty as number),
        })),
      }))

      const amount = rows.reduce((sum, r) => sum + (r.amount as number), 0)
      const totalPayableAmount = amount + (primary.service_fee as number) + (primary.transport_fee as number)
        + (primary.vat_fee as number) - (primary.discount as number)

      res.json({
        data: {
          bulkOrderId: primary.bulk_order_id,
          fullname: `${primary.customer_first_name} ${primary.customer_last_name}`,
          phone: primary.customer_phone,
          note: primary.note,
          address: primary.address,
          scheduleDate: primary.schedule_date,
          couponCode: primary.coupon_code,
          amount,
          discount: primary.discount,
          serviceFee: primary.service_fee,
          transportFee: primary.transport_fee,
          vatFee: primary.vat_fee,
          totalPayableAmount,
          paymentMethod: primary.payment_method,
          paymentStatus: primary.payment_status,
          status: primary.status,
          items,
        },
      })
    } catch (err) { next(err) }
  })

  // PATCH /order/:bulkOrderId/schedule — only while still PENDING
  router.patch('/:bulkOrderId/schedule', async (req: AuthRequest, res, next) => {
    try {
      const { scheduleStartDate } = req.body as { scheduleStartDate?: string }
      if (!scheduleStartDate) return res.status(400).json({ message: 'scheduleStartDate is required' })

      const rows = await ctx().table('orders').findMany({
        where: { bulk_order_id: req.params.bulkOrderId, customer_user_id: req.user!.id },
      }) as Record<string, unknown>[]
      if (rows.length === 0) return res.status(404).json({ message: 'Not found' })
      if (rows.some((r) => r.status !== 'PENDING')) {
        return res.status(400).json({ message: 'Only pending orders can be rescheduled' })
      }

      const scheduleDate = new Date(scheduleStartDate)
      await Promise.all(rows.map((r) =>
        ctx().table('orders').update({ where: { _id: r._id }, data: { schedule_date: scheduleDate } })
      ))
      res.json({ data: { bulkOrderId: req.params.bulkOrderId, scheduleStartDate } })
    } catch (err) { next(err) }
  })

  // GET /order/:bulkOrderId/payment-status
  router.get('/:bulkOrderId/payment-status', async (req: AuthRequest, res, next) => {
    try {
      const primary = await ctx().table('orders').findOne({
        where: { bulk_order_id: req.params.bulkOrderId, customer_user_id: req.user!.id, is_primary: true },
      }) as Record<string, unknown> | null
      if (!primary) return res.status(404).json({ message: 'Not found' })
      res.json({ data: { bulkOrderId: primary.bulk_order_id, paymentStatus: primary.payment_status } })
    } catch (err) { next(err) }
  })

  return router
}
