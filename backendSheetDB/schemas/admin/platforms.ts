import { defineTable, string, boolean } from 'longcelot-sheet-db';

export default defineTable({
  name: 'platforms',
  actor: 'admin',
  timestamps: true,
  softDelete: true,
  columns: {
    name_en: string().required().unique(),
    name_km: string().required(),
    description: string(),
    status: boolean().default(true),
    visibility: string().enum(['public', 'beta', 'internal']).default('public'),
  },
});
