import { defineTable, string, boolean, number, json } from 'longcelot-sheet-db';

export default defineTable({
  name: 'categories',
  actor: 'admin',
  timestamps: true,
  softDelete: true,
  columns: {
    name_en: string().required(),
    name_km: string(), // optional — translations lag behind name_en for new content (2026-07-13)
    thumbnail_url: string(),
    status: boolean().default(true),
    sort: number().default(0),
    platform: json().default([]),
  },
});
