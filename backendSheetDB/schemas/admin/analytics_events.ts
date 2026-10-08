import { defineTable, string, number } from 'longcelot-sheet-db';

/**
 * Flattened copy of Firebase Analytics events exported to BigQuery
 * (`analytics_<property>.events_*`). Hot params are promoted to columns so the portal can
 * filter/aggregate without parsing JSON; everything else stays in `params_json`.
 * Rows are append-only and deduped on `event_id` (the app's own UUID when present, otherwise a
 * deterministic key built from the BigQuery row) — see services/bigquery-sync.ts.
 */
export default defineTable({
  name: 'analytics_events',
  actor: 'admin',
  timestamps: true,
  columns: {
    event_id: string().required().unique(),
    event_name: string().required(),
    // Device clock, microseconds since epoch (BigQuery event_timestamp) — also the sync watermark.
    occurred_micros: number().required(),
    occurred_at: string().required(), // ISO-8601 UTC
    event_date: string().required(), // YYYY-MM-DD (UTC) for day bucketing
    source_stream: string().enum(['daily', 'intraday']).default('daily'),

    user_pseudo_id: string(), // Firebase app-instance id (guest id)
    user_id: string(), // set after setUserId(customerId)
    ga_session_id: string(),
    platform: string(),
    app_version: string(),
    country: string(),

    // Customer-journey contract params (see Docs/tracking/bEasy-tracking-architecture-guide.md §4.3)
    journey_id: string(),
    reg_flow_id: string(),
    service_id: number(),
    entry_point: string(),
    value: number(),
    currency: string(),

    // Acquisition
    campaign: string(),
    source: string(),
    medium: string(),

    params_json: string(), // every event param, JSON-encoded
  },
});
