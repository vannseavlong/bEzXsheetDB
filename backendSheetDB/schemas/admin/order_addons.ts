import { defineTable, string, number } from 'longcelot-sheet-db'

// Addon items selected on a booked order line. name/amount are snapshotted at
// booking time so later edits to category_addon_items don't rewrite past orders.
export default defineTable({
  name: 'order_addons',
  actor: 'admin',
  timestamps: true,
  columns: {
    order_id: string().required().ref('orders._id'),
    addon_item_id: string().required().ref('category_addon_items._id'),
    name_en: string().required(),
    name_km: string().required(),
    amount: number().min(0).required(),
    qty: number().min(1).default(1),
  },
})
