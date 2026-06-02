import { defineTable, string, number, date } from 'longcelot-sheet-db';

export default defineTable({
  name: 'topup_transactions',
  actor: 'finance',
  timestamps: true,
  columns: {
    transaction_id: string().required().unique(),
    customer_name: string().required(),
    customer_phone: string(),
    amount: number().min(0).required(),
    payment_method: string().required(),
    status: string().required().enum(['PENDING', 'COMPLETED', 'FAILED']).default('PENDING'),
    completed_at: date(),
  },
});
