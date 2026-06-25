import { defineTable, string, boolean, number, date } from 'longcelot-sheet-db';

export default defineTable({
  name: 'coupons',
  actor: 'admin',
  timestamps: true,
  softDelete: true,
  columns: {
    name: string().required(),
    code: string().required().unique(),
    type: string().required().enum(['FIXED', 'PERCENTAGE']),
    value: number().min(0).required(),
    status: boolean().default(true),
    target_user: string().enum(['ALL', 'SELECTED']).default('ALL'),
    promo_text_en: string(),
    remark: string(),
    effective_date: date(),
    expired_date: date(),
    is_new_user_only: boolean().default(false),
    total_usage_limit: number(),
  },
});
