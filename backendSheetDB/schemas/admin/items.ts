import { defineTable, string, boolean, number } from 'longcelot-sheet-db';

export default defineTable({
  name: 'items',
  actor: 'admin',
  timestamps: true,
  softDelete: true,
  columns: {
    name_en: string().required(),
    name_km: string(), // optional — translations lag behind name_en for new content (2026-07-13)
    category: string().required(),
    status: boolean().default(true),
    sort_order: number().default(0),
  },
});
