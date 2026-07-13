import { defineTable, string, boolean } from 'longcelot-sheet-db';

export default defineTable({
  name: 'product_options',
  actor: 'admin',
  timestamps: true,
  softDelete: true,
  columns: {
    name_en: string().required(),
    name_km: string(), // optional — translations lag behind name_en for new content (2026-07-13)
    type: string().required(),
    status: boolean().default(true),
  },
});
