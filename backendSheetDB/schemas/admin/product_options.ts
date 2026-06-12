import { defineTable, string, number, boolean } from 'longcelot-sheet-db';

export default defineTable({
  name: 'product_options',
  actor: 'admin',
  timestamps: true,
  softDelete: true,
  columns: {
    product_id: string().required().ref('products._id'),
    name_en: string().required(),
    name_km: string().required(),
    type: string().required(),
    amount: number().min(0).default(0),
    status: boolean().default(true),
    sort: number().default(0),
  },
});
