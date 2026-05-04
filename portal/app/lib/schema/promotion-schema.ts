import { z } from 'zod';
import { multiLangNameSchema } from './multi-lang-schema';

const baseSchema = z.object({
  name: multiLangNameSchema,
  appliesTo: z.enum(['Products', 'Services', 'Both']),
  discountType: z.enum(['Amount', 'Percentage']), // Capitalized ✅
  discountValue: z.string().min(1, 'Discount value is required'),
  usageLimit: z.string().optional(),
  perUserLimit: z.string().optional(),
  status: z.enum(['Active', 'Inactive']),
  validFrom: z.string().min(1, 'Valid from date is required'),
  validTo: z.string().min(1, 'Valid to date is required'),
  eligibleServices: z.enum(['All', 'Cleaning', 'PestControl']),
  eligibleUsers: z.enum(['All', 'New', 'Existing', 'Premium'])
});

// Schema for amount-based discounts
const amountDiscountSchema = baseSchema.extend({
  discountType: z.literal('Amount'), // ✅ Capitalized
  discountValue: z
    .string()
    .min(1, 'Amount is required')
    .refine((val) => {
      const num = parseFloat(val.replace('$', ''));
      return !isNaN(num) && num > 0;
    }, 'Must be a valid amount greater than 0')
});

// Schema for percentage-based discounts
const percentageDiscountSchema = baseSchema.extend({
  discountType: z.literal('Percentage'), // ✅ Capitalized
  discountValue: z
    .string()
    .min(1, 'Percentage is required')
    .refine((val) => {
      const num = parseFloat(val.replace('%', ''));
      return !isNaN(num) && num > 0 && num <= 100;
    }, 'Must be a valid percentage between 1 and 100')
});

export const discountPromotionSchema = z
  .discriminatedUnion('discountType', [amountDiscountSchema, percentageDiscountSchema])
  .refine(
    (data) => {
      // Valid To must be after Valid From
      const fromDate = new Date(data.validFrom);
      const toDate = new Date(data.validTo);
      return toDate > fromDate;
    },
    {
      message: 'Valid To date must be after Valid From date',
      path: ['validTo']
    }
  )
  .refine(
    (data) => {
      // Usage limit must be positive number if provided
      if (data.usageLimit && data.usageLimit.trim() !== '') {
        const num = parseInt(data.usageLimit, 10);
        return !isNaN(num) && num > 0;
      }
      return true;
    },
    {
      message: 'Usage limit must be a positive number',
      path: ['usageLimit']
    }
  )
  .refine(
    (data) => {
      // Per user limit must be positive number if provided
      if (data.perUserLimit && data.perUserLimit.trim() !== '') {
        const num = parseInt(data.perUserLimit, 10);
        return !isNaN(num) && num > 0;
      }
      return true;
    },
    {
      message: 'Per user limit must be a positive number',
      path: ['perUserLimit']
    }
  );

export type DiscountPromotionSchemaProps = z.infer<typeof discountPromotionSchema>;
