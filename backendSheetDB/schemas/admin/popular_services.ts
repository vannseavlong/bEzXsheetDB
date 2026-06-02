import { defineTable, string, boolean, number } from 'longcelot-sheet-db';

export default defineTable({
  name: 'popular_services',
  actor: 'admin',
  timestamps: true,
  softDelete: true,
  columns: {
    name_en: string().required(),
    name_km: string().required(),
    category_id: string().required().ref('categories._id'),
    image_url: string(),
    status: boolean().default(true),
    display_order: number().default(0),
  },
});
