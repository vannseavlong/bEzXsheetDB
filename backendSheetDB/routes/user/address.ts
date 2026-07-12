import { Router } from 'express'
import type { DatabaseAdapter } from 'longcelot-sheet-db'
import type { AuthRequest } from '../../middleware/auth'
import { userCtx } from './context'
import { haversineKm } from '../../utils/geo'
import { env } from '../../config/env'

function toAddressDto(r: Record<string, unknown>) {
  return {
    id: r._id,
    isPrimary: r.is_primary,
    name: r.label ?? null,
    address: r.address,
    addressDetail: r.address_detail ?? null,
    floorNum: r.floor_num ?? null,
    roomNum: r.room_num ?? null,
    note: r.note ?? null,
    latitude: r.latitude,
    longitude: r.longitude,
    sort: r.sort,
  }
}

export function createAddressRouter(adapter: DatabaseAdapter) {
  const router = Router()
  const ctx = (req: AuthRequest) => userCtx(adapter, req.user!.id as string)

  // GET /address/list
  router.get('/list', async (req: AuthRequest, res, next) => {
    try {
      const rows = await ctx(req).table('addresses').findMany({
        where: { user_id: req.user!.id },
      }) as Record<string, unknown>[]
      rows.sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0) || (a.sort as number) - (b.sort as number))
      res.json({ data: rows.map(toAddressDto) })
    } catch (err) { next(err) }
  })

  // POST /address/create
  router.post('/create', async (req: AuthRequest, res, next) => {
    try {
      const { name, address, addressDetail, floorNum, roomNum, note, latitude, longitude } = req.body as {
        name?: string; address?: string; addressDetail?: string; floorNum?: string
        roomNum?: string; note?: string; latitude?: number; longitude?: number
      }
      if (!address || latitude === undefined || longitude === undefined) {
        return res.status(400).json({ message: 'address, latitude and longitude are required' })
      }

      const existing = await ctx(req).table('addresses').findMany({ where: { user_id: req.user!.id } })
      const row = await ctx(req).table('addresses').create({
        user_id: req.user!.id,
        label: name ?? null,
        address,
        address_detail: addressDetail ?? null,
        floor_num: floorNum ?? null,
        room_num: roomNum ?? null,
        note: note ?? null,
        latitude,
        longitude,
        is_primary: existing.length === 0,
        sort: existing.length,
      }) as Record<string, unknown>
      res.status(201).json({ data: toAddressDto(row) })
    } catch (err) { next(err) }
  })

  // PATCH /address/:id
  router.patch('/:id', async (req: AuthRequest, res, next) => {
    try {
      const owned = await ctx(req).table('addresses').findOne({ where: { _id: req.params.id, user_id: req.user!.id } })
      if (!owned) return res.status(404).json({ message: 'Not found' })

      const { name, address, addressDetail, floorNum, roomNum, note, latitude, longitude } = req.body as {
        name?: string; address?: string; addressDetail?: string; floorNum?: string
        roomNum?: string; note?: string; latitude?: number; longitude?: number
      }
      await ctx(req).table('addresses').update({
        where: { _id: req.params.id },
        data: {
          ...(name !== undefined && { label: name }),
          ...(address !== undefined && { address }),
          ...(addressDetail !== undefined && { address_detail: addressDetail }),
          ...(floorNum !== undefined && { floor_num: floorNum }),
          ...(roomNum !== undefined && { room_num: roomNum }),
          ...(note !== undefined && { note }),
          ...(latitude !== undefined && { latitude }),
          ...(longitude !== undefined && { longitude }),
        },
      })
      const row = await ctx(req).table('addresses').findOne({ where: { _id: req.params.id } }) as Record<string, unknown>
      res.json({ data: toAddressDto(row) })
    } catch (err) { next(err) }
  })

  // DELETE /address/:id
  router.delete('/:id', async (req: AuthRequest, res, next) => {
    try {
      const count = await ctx(req).table('addresses').delete({ where: { _id: req.params.id, user_id: req.user!.id } })
      if (count === 0) return res.status(404).json({ message: 'Not found' })
      res.status(204).end()
    } catch (err) { next(err) }
  })

  // POST /address/check/distance
  router.post('/check/distance', async (req: AuthRequest, res, next) => {
    try {
      const { latitude, longitude } = req.body as { latitude?: number; longitude?: number }
      if (latitude === undefined || longitude === undefined) {
        return res.status(400).json({ message: 'latitude and longitude are required' })
      }
      const distanceKm = haversineKm(env.SERVICE_ORIGIN_LAT, env.SERVICE_ORIGIN_LNG, latitude, longitude)
      const maxDistanceKm = env.MAX_SERVICE_DISTANCE_KM
      res.json({ data: { distanceKm, maxDistanceKm, isExceeded: distanceKm > maxDistanceKm } })
    } catch (err) { next(err) }
  })

  return router
}
