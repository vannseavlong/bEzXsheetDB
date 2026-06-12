import { defineTable, string, number } from 'longcelot-sheet-db';

export default defineTable({
  name: 'popular_service_items',
  actor: 'admin',
  timestamps: true,
  columns: {
    popular_service_id: string().required().ref('popular_services._id'),
    type: string().required().enum(['CATEGORY', 'PRODUCT']),
    category_id: string().ref('categories._id'),
    product_id: string().ref('products._id'),
    priority: number().default(0),
  },
});
