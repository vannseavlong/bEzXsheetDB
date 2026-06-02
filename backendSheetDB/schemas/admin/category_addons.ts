import { defineTable, string, boolean } from 'longcelot-sheet-db';

export default defineTable({
  name: 'category_addons',
  actor: 'admin',
  timestamps: true,
  softDelete: true,
  columns: {
    name_en: string().required(),
    name_km: string().required(),
    category_ids: string(), // JSON-serialized array of category _ids
    status: boolean().default(true),
  },
});
