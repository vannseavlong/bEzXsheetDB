import { createHash } from 'crypto'

/** Shape of one `events_*` row as selected by services/bigquery-sync.ts (event_params left as the raw repeated record). */
export interface BqEventRow {
  event_timestamp: number | string
  event_name: string
  event_bundle_sequence_id?: number | string | null
  user_pseudo_id?: string | null
  user_id?: string | null
  platform?: string | null
  app_version?: string | null
  country?: string | null
  traffic_source?: string | null
  traffic_medium?: string | null
  traffic_name?: string | null
  event_params?: Array<{
    key: string
    value?: {
      string_value?: string | null
      int_value?: number | string | null
      float_value?: number | null
      double_value?: number | null
    } | null
  }> | null
}

type Scalar = string | number

/** Firebase stores each param in a typed slot; collapse to the one that is set. */
function paramValue(p: NonNullable<BqEventRow['event_params']>[number]): Scalar | null {
  const v = p.value
  if (!v) return null
  if (v.string_value != null) return v.string_value
  if (v.int_value != null) return Number(v.int_value)
  if (v.double_value != null) return v.double_value
  if (v.float_value != null) return v.float_value
  return null
}

export function flattenParams(row: BqEventRow): Record<string, Scalar> {
  const out: Record<string, Scalar> = {}
  for (const p of row.event_params ?? []) {
    const val = paramValue(p)
    if (val !== null) out[p.key] = val
  }
  return out
}

const str = (v: unknown) => (v === undefined || v === null || v === '' ? undefined : String(v))
const num = (v: unknown) => {
  if (v === undefined || v === null || v === '') return undefined
  const n = Number(v)
  return Number.isFinite(n) ? n : undefined
}

/**
 * Dedupe key. The app stamps every contract event with a UUID `event_id`; legacy / Firebase
 * auto events don't have one, so fall back to a hash of the fields that make a BigQuery row
 * unique. Daily and intraday exports of the same event produce the same key, so the daily
 * table replacing the intraday one never double-inserts.
 */
export function eventKey(row: BqEventRow, params: Record<string, Scalar>): string {
  if (typeof params.event_id === 'string' && params.event_id) return params.event_id
  const raw = [
    row.user_pseudo_id ?? '',
    row.event_timestamp,
    row.event_name,
    row.event_bundle_sequence_id ?? '',
    params.ga_session_id ?? '',
  ].join('|')
  return 'bq_' + createHash('sha1').update(raw).digest('hex').slice(0, 24)
}

export interface AnalyticsEventRecord extends Record<string, unknown> {
  event_id: string
  event_name: string
  occurred_micros: number
  occurred_at: string
  event_date: string
}

export function mapRow(row: BqEventRow, stream: 'daily' | 'intraday'): AnalyticsEventRecord {
  const params = flattenParams(row)
  const micros = Number(row.event_timestamp)
  const iso = new Date(Math.floor(micros / 1000)).toISOString()
  return {
    event_id: eventKey(row, params),
    event_name: row.event_name,
    occurred_micros: micros,
    occurred_at: iso,
    event_date: iso.slice(0, 10),
    source_stream: stream,
    user_pseudo_id: str(row.user_pseudo_id),
    user_id: str(row.user_id),
    ga_session_id: str(params.ga_session_id),
    platform: str(row.platform),
    app_version: str(row.app_version),
    country: str(row.country),
    journey_id: str(params.journey_id),
    reg_flow_id: str(params.reg_flow_id),
    service_id: num(params.service_id),
    entry_point: str(params.entry_point ?? params.entry_type ?? params.entry),
    value: num(params.value),
    currency: str(params.currency),
    campaign: str(params.campaign_code ?? row.traffic_name),
    source: str(params.utm_source ?? row.traffic_source),
    medium: str(params.utm_medium ?? row.traffic_medium),
    params_json: JSON.stringify(params),
  }
}
