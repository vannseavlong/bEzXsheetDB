import { defineTable, string, number, date } from 'longcelot-sheet-db';

export default defineTable({
  name: 'payment_links',
  actor: 'marketing',
  timestamps: true,
  columns: {
    customer_id: string().required(),
    customer_name: string().required(),
    amount: number().min(0).required(),
    status: string().enum(['PENDING', 'PAID', 'EXPIRED']).default('PENDING'),
    expiry_date: date().required(),
    paid_at: date(),
    remark: string(),
  },
});
