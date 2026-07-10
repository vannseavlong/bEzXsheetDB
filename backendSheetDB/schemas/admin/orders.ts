import { defineTable, string, number, date, boolean } from 'longcelot-sheet-db';

export default defineTable({
  name: 'orders',
  actor: 'admin',
  timestamps: true,
  columns: {
    bulk_order_id: string(),
    // Cross-actor pointer into the `user` sheet's users._id — can't use .ref() since
    // the package can only validate foreign keys within the same actor's spreadsheet.
    customer_user_id: string(),
    customer_first_name: string().required(),
    customer_last_name: string().required(),
    customer_phone: string().required(),
    profile_url: string(),
    category: string().required(),
    service_type: string().required(),
    category_id: string().ref('categories._id'),
    product_id: string().ref('products._id'),
    category_product_id: string().ref('category_products._id'),
    product_option_id: string().ref('product_options._id'),
    // The actual priced SKU that was booked (category_product_id x product_option_id
    // with its own price/duration) — category_id/product_id/product_option_id above are
    // kept alongside it purely as denormalized filters for admin queries/reporting.
    category_product_option_id: string().ref('category_product_options._id'),
    qty: number().min(1).default(1),
    schedule_date: date().required(),
    duration: number().required(),
    address: string().required(),
    // Cross-actor pointer into the `user` sheet's addresses._id — see customer_user_id.
    address_id: string(),
    latitude: number(),
    longitude: number(),
    floor_num: string(),
    room_num: string(),
    status: string().required().enum(['PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).default('PENDING'),
    payment_status: string().enum(['PAID', 'UNPAID']).default('UNPAID'),
    payment_method: string(),
    coupon_id: string().ref('coupons._id'),
    coupon_code: string(),
    amount: number().min(0).required(),
    service_fee: number().min(0).default(0),
    transport_fee: number().min(0).default(0),
    vat_fee: number().min(0).default(0),
    discount: number().min(0).default(0),
    net_revenue: number().min(0).default(0),
    note: string(),
    type: string().enum(['ORDER', 'DIRECT_SALE']).default('ORDER'),
    exchange_rate: number(),
    assigned_cleaner_id: string().ref('cleaners._id'),
    // Distinguishes the main booked line from bundled pair-product lines sharing the
    // same bulk_order_id (see product_pairings / order/preview,create).
    is_primary: boolean().default(true),
    newsletter_subscription:string().enum(['SUBSCRIBED', 'UNSUBSCRIBED']).default('UNSUBSCRIBED'),
  },
});
