import { defineTable, string, number } from 'longcelot-sheet-db';

export default defineTable({
  name: 'product_product_options',
  actor: 'admin',
  timestamps: true,
  columns: {
    product_id: string().required().ref('products._id'),
    product_option_id: string().required().ref('product_options._id'),
    price: number().min(0).default(0),
    duration: number().min(0).default(0),
    sort: number().default(0),
  },
});
