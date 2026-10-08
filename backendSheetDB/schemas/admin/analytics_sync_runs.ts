import { defineTable, string, number } from 'longcelot-sheet-db';

/** One row per BigQuery → bEasy sync attempt; the newest successful row's `watermark_micros` is the next run's starting point. */
export default defineTable({
  name: 'analytics_sync_runs',
  actor: 'admin',
  timestamps: true,
  columns: {
    // Which pipeline produced the run; rows written before this column existed are BigQuery runs.
    source: string().enum(['bigquery', 'ga4_history']).default('bigquery'),
    status: string().required().enum(['RUNNING', 'SUCCESS', 'FAILED']),
    trigger: string().enum(['manual', 'schedule']).default('manual'),
    triggered_by: string(),
    started_at: string().required(),
    finished_at: string(),
    from_micros: number(),
    watermark_micros: number(),
    rows_fetched: number().default(0),
    rows_inserted: number().default(0),
    rows_skipped: number().default(0),
    bytes_processed: number().default(0),
    error: string(),
  },
});
