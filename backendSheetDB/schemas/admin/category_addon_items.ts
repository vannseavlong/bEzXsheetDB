import { defineTable, string, number, boolean } from 'longcelot-sheet-db';

export default defineTable({
  name: 'category_addon_items',
  actor: 'admin',
  timestamps: true,
  softDelete: true,
  columns: {
    addon_id: string().required().ref('category_addons._id'),
    name_en: string().required(),
    name_km: string().required(),
    type: string().required(),
    img_url: string(),
    amount: number().min(0).default(0),
    duration: number().min(0).default(0),
    status: boolean().default(true),
    sort: number().default(0),
  },
});
