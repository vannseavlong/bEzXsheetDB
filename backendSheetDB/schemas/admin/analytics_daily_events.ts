import { defineTable, string, number } from 'longcelot-sheet-db';

/**
 * Aggregated history from the GA4 Data API: one row per day × event × platform × country.
 * BigQuery export only starts at link time (not retroactive), so everything before that —
 * and anything after, as a cross-check — lives here. Counts only: no users, journeys or params.
 * `row_key` makes backfills idempotent (re-running a range updates changed rows, never duplicates).
 */
export default defineTable({
  name: 'analytics_daily_events',
  actor: 'admin',
  timestamps: true,
  columns: {
    row_key: string().required().unique(), // event_date|event_name|platform|country
    event_date: string().required(), // YYYY-MM-DD in the property's reporting time zone
    event_name: string().required(),
    platform: string(),
    country: string(),
    event_count: number().required(),
    total_users: number().required(),
  },
});
