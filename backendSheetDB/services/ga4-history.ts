import { BetaAnalyticsDataClient } from '@google-analytics/data'
import type { DatabaseAdapter } from 'longcelot-sheet-db'
import { env } from '../config/env'
import { acquireSyncLock, releaseSyncLock } from './sync-lock'

/** Earliest date the GA4 Data API accepts — used for "everything". */
const GA4_EPOCH = '2015-08-14'
const PAGE = 100_000
const INSERT_CHUNK = 200

export const isGa4Configured = () => Boolean(env.GA_PROPERTY_ID)

function createClient(): BetaAnalyticsDataClient {
  if (env.BQ_CREDENTIALS_JSON) return new BetaAnalyticsDataClient({ credentials: JSON.parse(env.BQ_CREDENTIALS_JSON) })
  if (env.BQ_KEY_FILE) return new BetaAnalyticsDataClient({ keyFilename: env.BQ_KEY_FILE })
  return new BetaAnalyticsDataClient() // Application Default Credentials
}

const iso = (d: Date) => d.toISOString().slice(0, 10)
const ymd = (s: string) => `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}` // GA4 "20260930" → "2026-09-30"

/** [start, end] month-sized windows so each API call and each sheet write stays bounded. */
export function monthWindows(from: string, to: string): Array<[string, string]> {
  const out: Array<[string, string]> = []
  let cur = new Date(from + 'T00:00:00Z')
  const last = new Date(to + 'T00:00:00Z')
  while (cur <= last) {
    const end = new Date(Date.UTC(cur.getUTCFullYear(), cur.getUTCMonth() + 1, 0))
    out.push([iso(cur), iso(end < last ? end : last)])
    cur = new Date(Date.UTC(cur.getUTCFullYear(), cur.getUTCMonth() + 1, 1))
  }
  return out
}

export interface HistoryResult {
  runId: string
  status: 'SUCCESS' | 'FAILED'
  rowsFetched: number
  rowsInserted: number
  rowsUpdated: number
  error?: string
}

/**
 * Pulls day × event × platform × country counts from the GA4 Data API into
 * `analytics_daily_events`. Idempotent: existing rows are updated only when GA4 now reports
 * different numbers (late data / reprocessing), new rows are inserted.
 */
export async function runGa4History(
  adapter: DatabaseAdapter,
  opts: { from?: string; to?: string; triggeredBy?: string }
): Promise<HistoryResult> {
  if (!isGa4Configured()) throw new Error('GA4 property is not configured (set GA_PROPERTY_ID or BQ_DATASET)')
  acquireSyncLock()

  const ctx = adapter.withContext({ userId: 'system', actor: 'admin', actorSheetId: '' })
  const runs = ctx.table('analytics_sync_runs')
  const table = ctx.table('analytics_daily_events')
  const from = opts.from ?? GA4_EPOCH
  const to = opts.to ?? iso(new Date())

  let run: Record<string, unknown>
  try {
    run = (await runs.create({
      source: 'ga4_history', status: 'RUNNING', trigger: 'manual',
      triggered_by: opts.triggeredBy ?? 'unknown', started_at: new Date().toISOString(),
    })) as Record<string, unknown>
  } catch (err) {
    releaseSyncLock() // nothing is running if the run row could not even be written
    throw err
  }
  const runId = String(run._id)

  try {
    const client = createClient()
    const existing = new Map<string, Record<string, unknown>>()
    for (const r of await table.findMany({})) existing.set(String(r.row_key), r)

    let fetched = 0, inserted = 0, updated = 0
    for (const [start, end] of monthWindows(from, to)) {
      const batch = new Map<string, Record<string, unknown>>()
      for (let offset = 0; ; offset += PAGE) {
        const [res] = await client.runReport({
          property: `properties/${env.GA_PROPERTY_ID}`,
          dateRanges: [{ startDate: start, endDate: end }],
          dimensions: [{ name: 'date' }, { name: 'eventName' }, { name: 'platform' }, { name: 'country' }],
          metrics: [{ name: 'eventCount' }, { name: 'totalUsers' }],
          limit: PAGE,
          offset,
        })
        for (const row of res.rows ?? []) {
          const [d, name, platform, country] = (row.dimensionValues ?? []).map((v) => v.value ?? '')
          const date = ymd(d)
          const key = [date, name, platform, country].join('|')
          batch.set(key, {
            row_key: key, event_date: date, event_name: name, platform, country,
            event_count: Number(row.metricValues?.[0]?.value ?? 0),
            total_users: Number(row.metricValues?.[1]?.value ?? 0),
          })
        }
        if ((res.rows?.length ?? 0) < PAGE) break
      }
      fetched += batch.size

      const fresh: Record<string, unknown>[] = []
      for (const [key, rec] of batch) {
        const old = existing.get(key)
        if (!old) { fresh.push(rec); existing.set(key, rec); continue }
        if (Number(old.event_count) !== rec.event_count || Number(old.total_users) !== rec.total_users) {
          await table.update({ where: { _id: old._id }, data: { event_count: rec.event_count, total_users: rec.total_users } })
          updated++
        }
      }
      for (let i = 0; i < fresh.length; i += INSERT_CHUNK) await table.createMany(fresh.slice(i, i + INSERT_CHUNK))
      inserted += fresh.length
      // Progress visible in the portal while a long backfill is running.
      await runs.update({ where: { _id: runId }, data: { rows_fetched: fetched, rows_inserted: inserted, rows_skipped: fetched - inserted - updated } })
    }

    await runs.update({
      where: { _id: runId },
      data: { status: 'SUCCESS', finished_at: new Date().toISOString(), rows_fetched: fetched, rows_inserted: inserted, rows_skipped: fetched - inserted - updated },
    })
    return { runId, status: 'SUCCESS', rowsFetched: fetched, rowsInserted: inserted, rowsUpdated: updated }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    await runs.update({ where: { _id: runId }, data: { status: 'FAILED', finished_at: new Date().toISOString(), error: message.slice(0, 1000) } }).catch(() => {})
    return { runId, status: 'FAILED', rowsFetched: 0, rowsInserted: 0, rowsUpdated: 0, error: message }
  } finally {
    releaseSyncLock()
  }
}
