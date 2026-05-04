import { z } from 'zod';

// Zod schema for voucher form
export const voucherSchema = z.object({
  id: z.string().optional(), // Optional for new voucher, generated when saving
  name: z.string().min(1, 'Name is required'),
  code: z.string().min(1, 'Code is required'),
  discountType: z.enum(['Amount', 'Percentage'], {
    required_error: 'Discount type is required'
  }),
  discountValue: z
    .number({
      required_error: 'Discount value is required',
      invalid_type_error: 'Discount value must be a number'
    })
    .min(0.01, 'Discount value must be positive'),
  usageLimit: z
    .number({
      required_error: 'Usage limit is required',
      invalid_type_error: 'Usage limit must be a number'
    })
    .min(1, 'Usage limit must be at least 1'),
  perUserLimit: z
    .number({
      required_error: 'Per user limit is required',
      invalid_type_error: 'Per user limit must be a number'
    })
    .min(1, 'Per user limit must be at least 1'),
  status: z.enum(['Active', 'Inactive'], {
    required_error: 'Status is required'
  }),
  validFrom: z.date({
    required_error: 'Valid from date is required'
  }),
  validTo: z.date({
    required_error: 'Valid to date is required'
  }),
  eligibleServices: z.string().min(1, 'Eligible services is required'),
  eligibleUsers: z.string().min(1, 'Eligible users is required')
});

// Type for form data
export type VoucherSchemaProps = z.infer<typeof voucherSchema>;
