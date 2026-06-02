import { defineTable, string, boolean, number } from 'longcelot-sheet-db';

export default defineTable({
  name: 'items',
  actor: 'admin',
  timestamps: true,
  softDelete: true,
  columns: {
    name_en: string().required(),
    name_km: string().required(),
    category: string().required(),
    status: boolean().default(true),
    sort_order: number().default(0),
  },
});
