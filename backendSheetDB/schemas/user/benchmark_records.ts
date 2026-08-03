import { defineTable, string, number, boolean, json } from 'longcelot-sheet-db';

// Scale-benchmark table for thesis Ch.5 (see /benchmark). 12 declared columns +
// _id/_created_at/_updated_at = 15 total, matching a realistic mid-size app table.
// sku is unique so incremental seed steps can be re-run safely with --skip-existing.
export default defineTable({
  name: 'benchmark_records',
  actor: 'user',
  timestamps: true,
  columns: {
    sku: string().required().unique(),
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
