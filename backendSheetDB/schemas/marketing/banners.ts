import { defineTable, string, boolean, number, date } from 'longcelot-sheet-db';

export default defineTable({
  name: 'banners',
  actor: 'marketing',
  timestamps: true,
  softDelete: true,
  columns: {
    name: string().required(),
    title_en: string().required(),
    type: string().required().enum(['HOME_BANNER', 'PRODUCT_BUNDLE', 'COUPON_BANNER']),
    status: boolean().default(true),
    start_date: date().required(),
    expired_date: date().required(),
    sort: number().default(0),
    img_url_en: string(),
    has_detail: boolean().default(false),
    has_topup: boolean().default(false),
    credit: number(),
    amount: number(),
  },
});
