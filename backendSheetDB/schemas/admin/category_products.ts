import { defineTable, string, number } from 'longcelot-sheet-db';

export default defineTable({
  name: 'category_products',
  actor: 'admin',
  timestamps: true,
  columns: {
    category_id: string().required().ref('categories._id'),
    product_id: string().required().ref('products._id'),
    sort: number().default(0),
  },
});
