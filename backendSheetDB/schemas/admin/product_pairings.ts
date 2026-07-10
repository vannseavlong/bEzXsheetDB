import { defineTable, string, number } from 'longcelot-sheet-db'

// Admin-configurable "frequently booked together" pairing: which category-scoped
// product to recommend as a bundle add-on when a customer picks the anchor product.
export default defineTable({
  name: 'product_pairings',
  actor: 'admin',
  timestamps: true,
  columns: {
    category_product_id: string().required().ref('category_products._id'),
    paired_category_product_id: string().required().ref('category_products._id'),
    sort: number().default(0),
  },
})
