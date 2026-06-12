import { defineTable, string, number, json } from 'longcelot-sheet-db';

export default defineTable({
  name: 'task_info',
  actor: 'admin',
  timestamps: true,
  softDelete: true,
  columns: {
    category_id: string().ref('categories._id'),
    product_id: string().ref('products._id'),
    sort: number().default(0),
    title_en: string().required(),
    title_km: string().required(),
    description_en: json(),
    description_km: json(),
  },
});
