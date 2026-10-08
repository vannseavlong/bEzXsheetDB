import fs from 'fs'
import { BigQuery } from '@google-cloud/bigquery'
import type { DatabaseAdapter } from 'longcelot-sheet-db'
import { env } from '../config/env'
import { acquireSyncLock, isSyncRunning, releaseSyncLock } from './sync-lock'
import { mapRow, type AnalyticsEventRecord, type BqEventRow } from './bigquery-mapper'

/** Re-read this much before the watermark so late-arriving events (offline devices, intraday → daily) are still caught; dedupe makes it free. */
const OVERLAP_MICROS = 60 * 60 * 1000 * 1000
const INSERT_CHUNK = 200

export interface SyncResult {
  runId: string
  status: 'SUCCESS' | 'FAILED'
  rowsFetched: number
  rowsInserted: number
  rowsSkipped: number
  bytesProcessed: number
  watermarkMicros: number | null
  error?: string
}

export function isBigQueryConfigured(): boolean {
  return Boolean(env.BQ_PROJECT_ID && env.BQ_DATASET)
}

function createClient(): BigQuery {
  const base = { projectId: env.BQ_PROJECT_ID, location: env.BQ_LOCATION }
  if (env.BQ_CREDENTIALS_JSON) return new BigQuery({ ...base, credentials: JSON.parse(env.BQ_CREDENTIALS_JSON) })
  if (env.BQ_KEY_FILE) return new BigQuery({ ...base, keyFilename: env.BQ_KEY_FILE })
  return new BigQuery(base) // Application Default Credentials
}

// YYYYMMDD in UTC — Firebase names its daily tables by the property's reporting timezone, so the
// range is widened by a day on each side and the exact cut is made on event_timestamp.
function suffix(micros: number, shiftDays = 0): string {
  const d = new Date(Math.floor(micros / 1000) + shiftDays * 86_400_000)
  return d.toISOString().slice(0, 10).replace(/-/g, '')
}

function buildQuery(table: 'events' | 'events_intraday') {
  const ref = `\`${env.BQ_PROJECT_ID}.${env.BQ_DATASET}.${table}_*\``
  return `
    SELECT
      event_timestamp, event_name, event_bundle_sequence_id,
      user_pseudo_id, user_id, platform,
      app_info.version AS app_version, geo.country AS country,
      traffic_source.source AS traffic_source, traffic_source.medium AS traffic_medium,
      traffic_source.name AS traffic_name,
      event_params
    FROM ${ref}
    WHERE _TABLE_SUFFIX BETWEEN @startSuffix AND @endSuffix
      AND event_timestamp > @since
    ORDER BY event_timestamp ASC
    LIMIT @maxRows`
}

export { isSyncRunning }

/**
 * Pulls new events from the Firebase BigQuery export into `analytics_events`.
 * Incremental: starts at the last successful run's watermark (minus a 1 h overlap), or
 * `BQ_LOOKBACK_DAYS` back on the first run. Capped at BQ_MAX_ROWS_PER_SYNC per run, oldest first,
 * so the watermark only ever advances past rows that were actually stored — a big backlog just
 * takes several runs.
 */
export async function runBigQuerySync(
  adapter: DatabaseAdapter,
  opts: { trigger: 'manual' | 'schedule'; triggeredBy?: string; lookbackDays?: number }
): Promise<SyncResult> {
  if (!isBigQueryConfigured()) throw new Error('BigQuery is not configured (set BQ_PROJECT_ID and BQ_DATASET)')
  acquireSyncLock()

  const ctx = adapter.withContext({ userId: 'system', actor: 'admin', actorSheetId: '' })
  const runs = ctx.table('analytics_sync_runs')
  const events = ctx.table('analytics_events')
  const started = new Date().toISOString()

  let runRow: Record<string, unknown>
  try {
    runRow = (await runs.create({
      source: 'bigquery',
      status: 'RUNNING',
      trigger: opts.trigger,
      triggered_by: opts.triggeredBy ?? (opts.trigger === 'schedule' ? 'scheduler' : 'unknown'),
      started_at: started,
    })) as Record<string, unknown>
  } catch (err) {
    releaseSyncLock() // nothing is running if the run row could not even be written
    throw err
  }
  const runId = String(runRow._id)

  try {
    const previous = (await runs.findMany({ where: { status: 'SUCCESS' } }))
      .map((r) => Number(r.watermark_micros))
      .filter((n) => Number.isFinite(n) && n > 0)
    const lastWatermark = previous.length ? Math.max(...previous) : 0
    const lookbackDays = opts.lookbackDays ?? env.BQ_LOOKBACK_DAYS
    const lookbackFloor = (Date.now() - lookbackDays * 86_400_000) * 1000
    // An explicit lookback (manual "re-sync last N days") overrides the watermark.
    const since = opts.lookbackDays ? lookbackFloor : lastWatermark ? lastWatermark - OVERLAP_MICROS : lookbackFloor

    const bq = createClient()
    const params = {
      startSuffix: suffix(since, -1),
      endSuffix: suffix(Date.now() * 1000, 1),
      since,
      maxRows: env.BQ_MAX_ROWS_PER_SYNC,
    }
    const streams: Array<['daily' | 'intraday', string]> = [['daily', buildQuery('events')]]
    if (env.BQ_INCLUDE_INTRADAY) streams.push(['intraday', buildQuery('events_intraday')])

    const fetched = new Map<string, AnalyticsEventRecord>() // dedupes daily vs intraday overlap
    let bytesProcessed = 0
    for (const [stream, query] of streams) {
      let job
      try {
        ;[job] = await bq.createQueryJob({ query, params })
      } catch (err) {
        // The intraday table only exists when streaming export is on; absence is not a failure.
        if (stream === 'intraday' && /Not found|does not match any table/i.test(String(err))) continue
        throw err
      }
      const [rows] = await job.getQueryResults()
      const [meta] = await job.getMetadata()
      bytesProcessed += Number(meta?.statistics?.totalBytesProcessed ?? 0)
      for (const row of rows as BqEventRow[]) {
        const rec = mapRow(row, stream)
        const existing = fetched.get(rec.event_id)
        if (!existing || stream === 'daily') fetched.set(rec.event_id, rec) // daily is canonical
      }
    }

    const ordered = [...fetched.values()].sort((a, b) => a.occurred_micros - b.occurred_micros).slice(0, env.BQ_MAX_ROWS_PER_SYNC)
    const known = new Set((await events.findMany({})).map((r) => String(r.event_id)))
    const fresh = ordered.filter((r) => !known.has(r.event_id))
    for (let i = 0; i < fresh.length; i += INSERT_CHUNK) {
      await events.createMany(fresh.slice(i, i + INSERT_CHUNK))
    }

    const watermark = ordered.length ? ordered[ordered.length - 1].occurred_micros : lastWatermark || null
    await runs.update({
      where: { _id: runId },
      data: {
        status: 'SUCCESS',
        finished_at: new Date().toISOString(),
        from_micros: since,
        watermark_micros: watermark ?? undefined,
        rows_fetched: ordered.length,
        rows_inserted: fresh.length,
        rows_skipped: ordered.length - fresh.length,
        bytes_processed: bytesProcessed,
      },
    })
    return {
      runId, status: 'SUCCESS', rowsFetched: ordered.length, rowsInserted: fresh.length,
      rowsSkipped: ordered.length - fresh.length, bytesProcessed, watermarkMicros: watermark,
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    await runs
      .update({ where: { _id: runId }, data: { status: 'FAILED', finished_at: new Date().toISOString(), error: message.slice(0, 1000) } })
      .catch(() => {})
    return { runId, status: 'FAILED', rowsFetched: 0, rowsInserted: 0, rowsSkipped: 0, bytesProcessed: 0, watermarkMicros: null, error: message }
  } finally {
    releaseSyncLock()
  }
}

/** Starts the optional background sync (ANALYTICS_SYNC_INTERVAL_MIN > 0). */
export function startAnalyticsScheduler(adapter: DatabaseAdapter) {
  const minutes = env.ANALYTICS_SYNC_INTERVAL_MIN
  if (!minutes || minutes <= 0 || !isBigQueryConfigured()) return
  const tick = () =>
    runBigQuerySync(adapter, { trigger: 'schedule' })
      .then((r) => console.log(`[analytics] scheduled sync ${r.status}: +${r.rowsInserted} events${r.error ? ` (${r.error})` : ''}`))
      .catch((err) => console.error('[analytics] scheduled sync skipped:', err.message))
  setInterval(tick, minutes * 60_000).unref()
  console.log(`[analytics] BigQuery sync every ${minutes} min`)
}

// Surfaced by GET /analytics/status so a bad key path is obvious before the first sync.
export function keyFileProblem(): string | null {
  return env.BQ_KEY_FILE && !fs.existsSync(env.BQ_KEY_FILE) ? `BQ_KEY_FILE not found: ${env.BQ_KEY_FILE}` : null
}
