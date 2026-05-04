import { z } from 'zod';
import { multiLangNameSchema } from './multi-lang-schema';
const userSchema = z
  .object({
    id: z.string(),
    userId: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    username: z.string(),
    qty: z.string(),
    usageCount: z.string().optional(),
    buyMore: z.string().optional()
  })
  .superRefine((data, ctx) => {
    const qty = Number(data.qty || 0);
    const usage = Number(data.usageCount || 0);

    if (qty < usage) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Qty cannot be lower than usageCount',
        path: ['qty']
      });
    }
  });

// export const customerSchema = z.object({
//   users: z.array(userSchema),
//   couponId: z.string()
// });

export const couponSchema = z
  .object({
    isEditCoupon: z.boolean(),
    isNewUserOnly: z.boolean(),
    name: z.string().min(1, 'Required'),
    code: z.string().min(1, 'Required'),
    promoText: multiLangNameSchema,
    value: z.coerce.number().nonnegative(),
    type: z.string().min(1, 'Required'),
    users: z.array(z.any()).optional(), // optional placeholder
    targetUser: z.string().min(1, 'Required'),
    selectedProducts: z.array(z.string()).optional(),
    selectedOptions: z.array(z.string()).optional(),
    minSpentAmount: z.coerce.number().nonnegative().optional(),
    maxRedeemAmount: z.coerce.number().nonnegative().optional(),
    maxRedeemPerPax: z.string().optional(),
    maxRedeemCount: z.string().optional(),
    maxRedeemCountPax: z.string().optional(),
    remark: z.string().optional(),
    effectiveDate: z.date().optional(),
    expiredDate: z.date().optional(),
    transportFee: z.coerce.number().nonnegative(),
    serviceFee: z.coerce.number().nonnegative()

    // "name": "XHS50",
    // "code": "XHS50",
    // "promoText": "50% off",
    // "remark": "",
    // "value": 0.50,
    // "type": "PERCENTAGE",
    // "effectiveDate": "2025-01-01T00:00:00Z",
    // "expiredDate": "2025-12-31T23:59:59Z",
    // "maxRedeemAmount": 100.00,
    // "maxRedeemPerPax": 1,
    // "maxRedeemTotal": 1000,
    // "isNewUserOnly": false
  })
  .superRefine((data, ctx) => {
    if (data.type === 'PERCENTAGE' && data.value > 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Percentage discount cannot exceed 100%',
        path: ['value'] // points error to `value` field
      });
    } // **Validate users only if type === 'new'**

    // Conditional users validation
    if (!data.isEditCoupon && data.users) {
      data.users.forEach((user, index) => {
        try {
          userSchema.parse(user);
        } catch (err) {
          if (err instanceof z.ZodError) {
            err.issues.forEach((issue) => {
              ctx.addIssue({
                ...issue,
                path: ['users', index, ...(issue.path || [])]
              });
            });
          }
        }
      });
    }
  });

export type CouponSchemaProps = z.infer<typeof couponSchema>;
export type CustomerSchemaProps = z.infer<typeof userSchema>;
