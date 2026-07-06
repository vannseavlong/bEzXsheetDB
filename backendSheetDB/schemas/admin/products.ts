import { defineTable, string, boolean, number } from 'longcelot-sheet-db';

export default defineTable({
  name: 'products',
  actor: 'admin',
  timestamps: true,
  softDelete: true,
  columns: {
    name_en: string().required(),
    name_km: string().required(),
    thumbnail_url: string(),
    status: boolean().default(true),
    sort: number().default(0),
  },
});
