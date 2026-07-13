import { defineTable, string, boolean } from 'longcelot-sheet-db';

export default defineTable({
  name: 'category_addons',
  actor: 'admin',
  timestamps: true,
  softDelete: true,
  columns: {
    name_en: string().required(),
    name_km: string(), // optional — translations lag behind name_en for new content (2026-07-13)
    badge_en: string(),
    badge_km: string(),
    selection_type: string().enum(['SINGLE', 'MULTIPLE']).default('SINGLE'),
    is_required: boolean().default(false),
    status: boolean().default(true),
  },
});
