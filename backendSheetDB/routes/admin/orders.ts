import { Router } from 'express'
import type { DatabaseAdapter } from 'longcelot-sheet-db'
import { groupBy } from '../../utils/group-by'
import { requirePermission } from '../../middleware/auth'

const STATUS_VALUES = ['PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] as const
type OrderStatus = (typeof STATUS_VALUES)[number]

// Status moves an admin can apply from the order detail panel. CANCELLED is reachable
// from either open state; every other move must follow the pipeline in order.
const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ['ACCEPTED', 'CANCELLED'],
  ACCEPTED: ['IN_PROGRESS', 'CANCELLED'],
  IN_PROGRESS: ['COMPLETED', 'CANCELLED'],
  COMPLETED: [],
  CANCELLED: [],
}

// Rows written before the schedule_date fix (routes/user/order.ts) carry the sheet
// adapter's raw JSON.stringify() of a Date object — literal quote characters embedded
// in the cell text (e.g. `"2026-07-14T03:00:00.000Z"` as an 26-char string, quotes and
// all). Strip them so already-corrupted rows still render instead of producing an
// unparseable date on the frontend.
function cleanDate(value: unknown): string | null {
  if (value === null || value === undefined || value === '') return null
  let str = String(value)
  if (str.startsWith('"') && str.endsWith('"')) str = str.slice(1, -1)
  const date = new Date(str)
  return isNaN(date.getTime()) ? null : date.toISOString()
}

function payableAmount(row: Record<string, unknown>, amount: number) {
  return (
    amount +
    (row.service_fee as number) +
    (row.transport_fee as number) +
    (row.vat_fee as number) -
    (row.discount as number)
  )
}

function toOrderSummaryDto(primary: Record<string, unknown>, lines: Record<string, unknown>[]) {
  const amount = lines.reduce((sum, l) => sum + (l.amount as number), 0)
  return {
    id: primary._id,
    bulkOrderId: primary.bulk_order_id,
    customerName: `${primary.customer_first_name} ${primary.customer_last_name}`,
    customerPhone: primary.customer_phone,
    profileUrl: primary.profile_url ?? null,
    category: primary.category,
    serviceType: primary.service_type,
    itemCount: lines.length,
    scheduleDate: cleanDate(primary.schedule_date),
    address: primary.address,
    status: primary.status,
    paymentStatus: primary.payment_status,
    paymentMethod: primary.payment_method,
    totalPayableAmount: payableAmount(primary, amount),
    note: primary.note,
    type: primary.type,
    createdAt: cleanDate(primary._created_at),
  }
}

/**
 * Orders are stored one row per booked line, with every line of the same purchase
 * sharing `bulk_order_id` (see routes/user/order.ts). The admin list/detail views
 * operate on the whole bulk order, so every handler here groups by that id.
 */
export function createOrdersRouter(adapter: DatabaseAdapter) {
  const router = Router()
  const ctx = () => adapter.withContext({ userId: 'system', actor: 'admin', actorSheetId: '' })

  // GET /api/admin/orders — one row per bulk order (its primary line), newest first
  router.get('/', async (req, res, next) => {
    try {
      const rows = (await ctx().table('orders').findMany({
        orderBy: '_created_at',
        order: 'desc',
      })) as Record<string, unknown>[]

      const rowsByBulkId = groupBy(rows, 'bulk_order_id', (r) => r)
      // Direct Sale orders are walk-in bookings entered by the sales team and are managed
      // from the Finance/Direct Sale pages, not here — this page is for orders that came
      // from customers via the mini-app.
      let primaries = rows.filter((r) => r.is_primary && r.type !== 'DIRECT_SALE')

      const status = typeof req.query.status === 'string' ? req.query.status : ''
      if (status) primaries = primaries.filter((r) => r.status === status)

      const dateFrom = typeof req.query.dateFrom === 'string' && req.query.dateFrom ? new Date(req.query.dateFrom) : null
      const dateTo = typeof req.query.dateTo === 'string' && req.query.dateTo ? new Date(req.query.dateTo) : null
      if (dateFrom) primaries = primaries.filter((r) => { const d = cleanDate(r.schedule_date); return d !== null && new Date(d) >= dateFrom })
      if (dateTo) primaries = primaries.filter((r) => { const d = cleanDate(r.schedule_date); return d !== null && new Date(d) <= dateTo })

      const search = typeof req.query.search === 'string' ? req.query.search.trim().toLowerCase() : ''
      if (search) {
        primaries = primaries.filter((r) => {
          const name = `${r.customer_first_name} ${r.customer_last_name}`.toLowerCase()
          const phone = String(r.customer_phone ?? '').toLowerCase()
          const bulkId = String(r.bulk_order_id ?? '').toLowerCase()
          return name.includes(search) || phone.includes(search) || bulkId.includes(search)
        })
      }

      const total = primaries.length
      const page = Math.max(1, parseInt(String(req.query.page ?? '1'), 10) || 1)
      const limit = Math.min(100, Math.max(1, parseInt(String(req.query.limit ?? '20'), 10) || 20))
      const totalPages = Math.max(1, Math.ceil(total / limit))
      const offset = (page - 1) * limit
      const pageRows = primaries.slice(offset, offset + limit)

      res.json({
        data: pageRows.map((r) => toOrderSummaryDto(r, rowsByBulkId[r.bulk_order_id as string] ?? [r])),
        meta: { page, limit, total, totalPages },
      })
    } catch (err) { next(err) }
  })

  // GET /api/admin/orders/:bulkOrderId — primary + every line sharing the bulk order, with addons
  router.get('/:bulkOrderId', async (req, res, next) => {
    try {
      const rows = (await ctx().table('orders').findMany({
        where: { bulk_order_id: req.params.bulkOrderId },
      })) as Record<string, unknown>[]
      if (rows.length === 0) return res.status(404).json({ message: 'Not found' })
      const primary = rows.find((r) => r.is_primary) ?? rows[0]
      if (primary.type === 'DIRECT_SALE') return res.status(404).json({ message: 'Not found' })

      const allAddons = (await ctx().table('order_addons').findMany({})) as Record<string, unknown>[]
      const addonsByOrder = groupBy(allAddons, 'order_id', (a) => a)

      const items = rows.map((r) => ({
        id: r._id,
        category: r.category,
        serviceType: r.service_type,
        qty: r.qty,
        duration: r.duration,
        amount: r.amount,
        isPrimary: r.is_primary,
        addOns: (addonsByOrder[r._id as string] ?? []).map((a) => ({
          id: a._id,
          nameEn: a.name_en,
          nameKm: a.name_km,
          amount: a.amount,
          qty: a.qty,
        })),
      }))

      const amount = rows.reduce((sum, r) => sum + (r.amount as number), 0)

      res.json({
        data: {
          id: primary._id,
          bulkOrderId: primary.bulk_order_id,
          customerName: `${primary.customer_first_name} ${primary.customer_last_name}`,
          customerPhone: primary.customer_phone,
          profileUrl: primary.profile_url ?? null,
          address: primary.address,
          latitude: primary.latitude ?? null,
          longitude: primary.longitude ?? null,
          floorNum: primary.floor_num ?? null,
          roomNum: primary.room_num ?? null,
          scheduleDate: cleanDate(primary.schedule_date),
          duration: rows.reduce((sum, r) => sum + (r.duration as number), 0),
          note: primary.note,
          couponCode: primary.coupon_code,
          amount,
          discount: primary.discount,
          serviceFee: primary.service_fee,
          transportFee: primary.transport_fee,
          vatFee: primary.vat_fee,
          totalPayableAmount: payableAmount(primary, amount),
          paymentMethod: primary.payment_method,
          paymentStatus: primary.payment_status,
          status: primary.status,
          type: primary.type,
          assignedCleanerId: primary.assigned_cleaner_id ?? null,
          createdAt: cleanDate(primary._created_at),
          items,
        },
      })
    } catch (err) { next(err) }
  })

  // PATCH /api/admin/orders/:bulkOrderId/status — moves every line sharing the bulk order together
  router.patch('/:bulkOrderId/status', async (req, res, next) => {
    try {
      const { status } = req.body as { status?: OrderStatus }
      if (!status || !STATUS_VALUES.includes(status)) {
        return res.status(400).json({ message: 'Invalid status' })
      }

      const rows = (await ctx().table('orders').findMany({
        where: { bulk_order_id: req.params.bulkOrderId },
      })) as Record<string, unknown>[]
      if (rows.length === 0) return res.status(404).json({ message: 'Not found' })

      const primary = rows.find((r) => r.is_primary) ?? rows[0]
      if (primary.type === 'DIRECT_SALE') return res.status(404).json({ message: 'Not found' })
      const currentStatus = primary.status as OrderStatus
      if (!ALLOWED_TRANSITIONS[currentStatus]?.includes(status)) {
        return res.status(400).json({ message: `Cannot move order from ${currentStatus} to ${status}` })
      }

      await Promise.all(
        rows.map((r) => ctx().table('orders').update({ where: { _id: r._id }, data: { status } }))
      )
      res.json({ data: { bulkOrderId: req.params.bulkOrderId, status } })
    } catch (err) { next(err) }
  })

  // PATCH /api/admin/orders/:bulkOrderId/assign-cleaner — assigns (or unassigns, cleanerId: null)
  // every line sharing the bulk order together. Manual assignment only — no availability logic.
  router.patch('/:bulkOrderId/assign-cleaner', requirePermission('ORDER', 'ASSIGN'), async (req, res, next) => {
    try {
      const { cleanerId } = req.body as { cleanerId?: string | null }

      if (cleanerId) {
        const cleaner = await ctx().table('cleaners').findOne({ where: { _id: cleanerId } })
        if (!cleaner || cleaner.status !== true) {
          return res.status(400).json({ message: 'Cleaner not found or inactive' })
        }
      }

      const rows = (await ctx().table('orders').findMany({
        where: { bulk_order_id: req.params.bulkOrderId },
      })) as Record<string, unknown>[]
      if (rows.length === 0) return res.status(404).json({ message: 'Not found' })

      const primary = rows.find((r) => r.is_primary) ?? rows[0]
      if (primary.type === 'DIRECT_SALE') return res.status(404).json({ message: 'Not found' })

      await Promise.all(
        rows.map((r) => ctx().table('orders').update({ where: { _id: r._id }, data: { assigned_cleaner_id: cleanerId ?? null } }))
      )
      res.json({ data: { bulkOrderId: req.params.bulkOrderId, assignedCleanerId: cleanerId ?? null } })
    } catch (err) { next(err) }
  })

  return router
}
