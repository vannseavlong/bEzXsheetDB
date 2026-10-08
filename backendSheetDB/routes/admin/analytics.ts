import { Router } from 'express'
import type { DatabaseAdapter } from 'longcelot-sheet-db'
import { requirePermission, type AuthRequest } from '../../middleware/auth'
import { listResource } from '../../utils/list-query'
import { env } from '../../config/env'
import { isBigQueryConfigured, keyFileProblem, runBigQuerySync } from '../../services/bigquery-sync'
import { isGa4Configured, runGa4History } from '../../services/ga4-history'
import { isSyncRunning } from '../../services/sync-lock'

// Ordered funnel steps, from the contract in Docs/tracking/bEasy-tracking-architecture-guide.md §4.4.
const BOOKING_FUNNEL = [
  'app_opened', 'service_viewed', 'booking_started', 'booking_details_completed',
  'slot_selected', 'checkout_started', 'payment_started',
]
const REGISTRATION_FUNNEL = ['registration_started', 'otp_viewed', 'otp_verified', 'registration_completed']

function toEventDto(r: Record<string, unknown>) {
  return {
    id: String(r._id),
    eventId: r.event_id,
    name: r.event_name,
    occurredAt: r.occurred_at,
    userPseudoId: r.user_pseudo_id ?? null,
    userId: r.user_id ?? null,
    platform: r.platform ?? null,
    appVersion: r.app_version ?? null,
    journeyId: r.journey_id ?? null,
    serviceId: r.service_id ?? null,
    value: r.value ?? null,
    currency: r.currency ?? null,
    campaign: r.campaign ?? null,
    source: r.source ?? null,
    params: r.params_json ? JSON.parse(String(r.params_json)) : {},
  }
}

function toRunDto(r: Record<string, unknown>) {
  return {
    id: String(r._id),
    source: r.source ?? 'bigquery',
    status: r.status,
    trigger: r.trigger,
    triggeredBy: r.triggered_by ?? null,
    startedAt: r.started_at,
    finishedAt: r.finished_at ?? null,
    rowsFetched: Number(r.rows_fetched ?? 0),
    rowsInserted: Number(r.rows_inserted ?? 0),
    rowsSkipped: Number(r.rows_skipped ?? 0),
    bytesProcessed: Number(r.bytes_processed ?? 0),
    error: r.error ?? null,
  }
}

const userKey = (r: Record<string, unknown>) => String(r.user_id || r.user_pseudo_id || '')

function funnel(rows: Record<string, unknown>[], steps: string[]) {
  const byStep = new Map<string, Set<string>>(steps.map((s) => [s, new Set()]))
  for (const r of rows) byStep.get(String(r.event_name))?.add(userKey(r))
  const first = byStep.get(steps[0])?.size || 0
  let prev = first
  return steps.map((step, i) => {
    const users = byStep.get(step)!.size
    const out = { step, users, pctOfFirst: first ? users / first : 0, pctOfPrevious: i === 0 ? 1 : prev ? users / prev : 0 }
    prev = users
    return out
  })
}

const bump = (m: Map<string, number>, k: string) => m.set(k, (m.get(k) ?? 0) + 1)
const top = (m: Map<string, number>, n = 10) =>
  [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, n).map(([key, count]) => ({ key, count }))

export function createAnalyticsRouter(adapter: DatabaseAdapter) {
  const router = Router()
  const ctx = () => adapter.withContext({ userId: 'system', actor: 'admin', actorSheetId: '' })

  // GET /api/admin/analytics/status
  router.get('/status', async (_req, res, next) => {
    try {
      const [runs, total, historyRows] = await Promise.all([
        ctx().table('analytics_sync_runs').findMany({ orderBy: '_created_at', order: 'desc' }),
        ctx().table('analytics_events').count({}),
        ctx().table('analytics_daily_events').count({}),
      ])
      const bq = runs.filter((r) => (r.source ?? 'bigquery') === 'bigquery')
      const success = bq.find((r) => r.status === 'SUCCESS')
      const lastHistory = runs.find((r) => r.source === 'ga4_history')
      res.json({
        data: {
          configured: isBigQueryConfigured(),
          project: env.BQ_PROJECT_ID ?? null,
          dataset: env.BQ_DATASET ?? null,
          intraday: env.BQ_INCLUDE_INTRADAY,
          autoSyncMinutes: env.ANALYTICS_SYNC_INTERVAL_MIN,
          maxRowsPerSync: env.BQ_MAX_ROWS_PER_SYNC,
          running: isSyncRunning(),
          configProblem: keyFileProblem(),
          totalEvents: total,
          ga4Configured: isGa4Configured(),
          ga4PropertyId: env.GA_PROPERTY_ID ?? null,
          historyRows,
          lastHistoryRun: lastHistory ? toRunDto(lastHistory) : null,
          lastRun: bq[0] ? toRunDto(bq[0]) : null,
          lastSuccess: success ? toRunDto(success) : null,
        },
      })
    } catch (err) { next(err) }
  })

  // POST /api/admin/analytics/sync   body: { days?: number } — days forces a re-pull of the last N days
  router.post('/sync', requirePermission('ANALYTICS', 'UPDATE'), async (req: AuthRequest, res, next) => {
    try {
      if (!isBigQueryConfigured()) return res.status(400).json({ message: 'BigQuery is not configured on the server (BQ_PROJECT_ID / BQ_DATASET)' })
      if (isSyncRunning()) return res.status(409).json({ message: 'A sync is already running' })
      const days = Number(req.body?.days)
      const result = await runBigQuerySync(adapter, {
        trigger: 'manual',
        triggeredBy: String(req.user?.email ?? 'unknown'),
        lookbackDays: Number.isFinite(days) && days > 0 ? Math.min(days, 90) : undefined,
      })
      res.status(result.status === 'SUCCESS' ? 200 : 502).json({ data: result, message: result.error })
    } catch (err) { next(err) }
  })

  // POST /api/admin/analytics/backfill   body: { from?: 'YYYY-MM-DD', to?: 'YYYY-MM-DD' }
  // Omit `from` to pull everything GA4 has. Runs in the background (can take minutes for a long
  // history); progress and the result appear in sync-runs.
  router.post('/backfill', requirePermission('ANALYTICS', 'UPDATE'), async (req: AuthRequest, res, next) => {
    try {
      if (!isGa4Configured()) return res.status(400).json({ message: 'GA4 property is not configured (GA_PROPERTY_ID or BQ_DATASET)' })
      if (isSyncRunning()) return res.status(409).json({ message: 'A sync is already running' })
      const date = /^\d{4}-\d{2}-\d{2}$/
      const { from, to } = req.body ?? {}
      if ((from && !date.test(from)) || (to && !date.test(to))) return res.status(400).json({ message: 'from/to must be YYYY-MM-DD' })
      runGa4History(adapter, { from, to, triggeredBy: String(req.user?.email ?? 'unknown') })
        .then((r) => console.log(`[analytics] GA4 backfill ${r.status}: +${r.rowsInserted} ~${r.rowsUpdated}${r.error ? ` (${r.error})` : ''}`))
        .catch((err) => console.error('[analytics] GA4 backfill failed to start:', err.message))
      res.status(202).json({ message: 'Backfill started' })
    } catch (err) { next(err) }
  })

  // GET /api/admin/analytics/history?from=&to=  — daily totals + per-event totals from analytics_daily_events
  router.get('/history', async (req, res, next) => {
    try {
      const all = await ctx().table('analytics_daily_events').findMany({})
      const dates = all.map((r) => String(r.event_date)).sort()
      const min = dates[0] ?? null
      const max = dates[dates.length - 1] ?? null
      const to = typeof req.query.to === 'string' ? req.query.to : max
      const from = typeof req.query.from === 'string' ? req.query.from : min
      const rows = from && to ? all.filter((r) => String(r.event_date) >= from && String(r.event_date) <= to) : []

      const daily = new Map<string, number>()
      const byEvent = new Map<string, { events: number; days: Set<string> }>()
      const byPlatform = new Map<string, number>()
      const byCountry = new Map<string, number>()
      for (const r of rows) {
        const n = Number(r.event_count)
        const d = String(r.event_date)
        daily.set(d, (daily.get(d) ?? 0) + n)
        const e = byEvent.get(String(r.event_name)) ?? { events: 0, days: new Set() }
        e.events += n; e.days.add(d); byEvent.set(String(r.event_name), e)
        byPlatform.set(String(r.platform || 'unknown'), (byPlatform.get(String(r.platform || 'unknown')) ?? 0) + n)
        byCountry.set(String(r.country || 'unknown'), (byCountry.get(String(r.country || 'unknown')) ?? 0) + n)
      }
      const ranked = (m: Map<string, number>, n = 8) => [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, n).map(([key, count]) => ({ key, count }))
      res.json({
        data: {
          available: { from: min, to: max },
          range: { from, to },
          totalEvents: rows.reduce((a, r) => a + Number(r.event_count), 0),
          daily: [...daily.entries()].sort(([a], [b]) => (a < b ? -1 : 1)).map(([date, events]) => ({ date, events })),
          topEvents: [...byEvent.entries()].sort((a, b) => b[1].events - a[1].events).slice(0, 25)
            .map(([key, v]) => ({ key, count: v.events, activeDays: v.days.size })),
          platforms: ranked(byPlatform),
          countries: ranked(byCountry),
        },
      })
    } catch (err) { next(err) }
  })

  // GET /api/admin/analytics/sync-runs
  router.get('/sync-runs', async (req, res, next) => {
    try {
      const result = await listResource(ctx().table('analytics_sync_runs'), req.query, {
        defaultOrderBy: '_created_at', defaultOrder: 'desc', defaultLimit: 10,
      })
      res.json({ ...result, data: result.data.map(toRunDto) })
    } catch (err) { next(err) }
  })

  // GET /api/admin/analytics/events?search=&event=&platform=&page=&limit=
  router.get('/events', async (req, res, next) => {
    try {
      const query = { ...req.query, event_name: req.query.event }
      const result = await listResource(ctx().table('analytics_events'), query, {
        searchFields: ['event_name', 'user_id', 'user_pseudo_id', 'journey_id', 'campaign'],
        filterFields: ['event_name', 'platform'],
        defaultOrderBy: 'occurred_micros', defaultOrder: 'desc',
      })
      res.json({ ...result, data: result.data.map(toEventDto) })
    } catch (err) { next(err) }
  })

  // GET /api/admin/analytics/summary?from=YYYY-MM-DD&to=YYYY-MM-DD  (default: last 7 days)
  // Aggregated in memory from analytics_events — fine for staging volumes; once the dataset
  // outgrows Sheets, move this to SQL on the Postgres driver (or query BigQuery directly).
  router.get('/summary', async (req, res, next) => {
    try {
      const to = typeof req.query.to === 'string' ? req.query.to : new Date().toISOString().slice(0, 10)
      const from = typeof req.query.from === 'string'
        ? req.query.from
        : new Date(Date.parse(to) - 6 * 86_400_000).toISOString().slice(0, 10)

      const rows = (await ctx().table('analytics_events').findMany({})).filter((r) => {
        const d = String(r.event_date)
        return d >= from && d <= to
      })

      const users = new Set<string>()
      const sessions = new Set<string>()
      const journeys = new Set<string>()
      const byDay = new Map<string, { events: number; users: Set<string> }>()
      const byEvent = new Map<string, number>()
      const byPlatform = new Map<string, number>()
      const byService = new Map<string, number>()
      const byCampaign = new Map<string, number>()
      let checkoutValue = 0

      // Seed every day in range so the chart has no gaps.
      for (let t = Date.parse(from); t <= Date.parse(to); t += 86_400_000) {
        byDay.set(new Date(t).toISOString().slice(0, 10), { events: 0, users: new Set() })
      }
      for (const r of rows) {
        const u = userKey(r)
        if (u) users.add(u)
        if (r.ga_session_id) sessions.add(`${r.user_pseudo_id}:${r.ga_session_id}`)
        if (r.journey_id) journeys.add(String(r.journey_id))
        const day = byDay.get(String(r.event_date))
        if (day) { day.events++; if (u) day.users.add(u) }
        const name = String(r.event_name)
        bump(byEvent, name)
        bump(byPlatform, String(r.platform || 'unknown'))
        if (name === 'service_viewed' && r.service_id != null) bump(byService, String(r.service_id))
        if (r.campaign) bump(byCampaign, String(r.campaign))
        if (name === 'checkout_started' && Number(r.value)) checkoutValue += Number(r.value)
      }

      res.json({
        data: {
          range: { from, to },
          totals: { events: rows.length, users: users.size, sessions: sessions.size, journeys: journeys.size, checkoutValue },
          daily: [...byDay.entries()].map(([date, d]) => ({ date, events: d.events, users: d.users.size })),
          topEvents: top(byEvent, 15),
          platforms: top(byPlatform),
          topServices: top(byService, 8),
          campaigns: top(byCampaign, 8),
          bookingFunnel: funnel(rows, BOOKING_FUNNEL),
          registrationFunnel: funnel(rows, REGISTRATION_FUNNEL),
        },
      })
    } catch (err) { next(err) }
  })

  return router
}
