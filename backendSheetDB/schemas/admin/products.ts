import { defineTable, string, boolean, number } from 'longcelot-sheet-db';

export default defineTable({
  name: 'products',
  actor: 'admin',
  timestamps: true,
  softDelete: true,
  columns: {
    name_en: string().required(),
    name_km: string().required(),
    category_id: string().required().ref('categories._id'),
    base_price: number().min(0).required(),
    duration: number().min(0).required(),
    status: boolean().default(true),
    sort: number().default(0),
  },
});
