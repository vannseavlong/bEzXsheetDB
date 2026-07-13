import { defineTable, string, boolean, number } from 'longcelot-sheet-db';

export default defineTable({
  name: 'popular_services',
  actor: 'admin',
  timestamps: true,
  softDelete: true,
  columns: {
    name_en: string().required(),
    name_km: string(), // optional — translations lag behind name_en for new content (2026-07-13)
    image_url: string(),
    status: boolean().default(true),
    display_order: number().default(0),
  },
});
