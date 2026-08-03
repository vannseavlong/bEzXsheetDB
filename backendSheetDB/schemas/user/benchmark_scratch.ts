import { defineTable, string, number, boolean, json } from 'longcelot-sheet-db';

// Disposable table for the bulk-payload and concurrency benchmarks (/benchmark).
// Same 12-declared-column shape as benchmark_records but with no unique() column,
// so create()/createMany() never pay a checkUniqueness() read — isolates pure
// write-quota/payload-size behavior from the uniqueness-check cost measured
// separately via benchmark_records. Safe to `lsdb drop-table benchmark_scratch`
// and recreate between runs.
export default defineTable({
  name: 'benchmark_scratch',
  actor: 'user',
  timestamps: true,
  columns: {
    run_id: string().required(),
    title: string().required(),
    description: string(),
    price: number().required(),
    stock: number().required(),
    active: boolean().required(),
    category: string().required().enum(['electronics', 'apparel', 'grocery', 'home', 'toys']),
    rating: number(),
    featured: boolean(),
    tags: json(),
    notes: string(),
    created_by: string(),
  },
});
