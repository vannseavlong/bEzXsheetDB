import { z } from 'zod';

export const paymentLinkSchema = z.object({
  title: z.string().min(1, 'Required'),
  amount: z
    .string()
    .min(1, 'Required')
    .regex(/^\d+(\.\d+)?$/, 'Must be a valid number'),

  isGeneral: z.boolean(),
  note: z.string().optional(),
  coupon: z
    .array(
      z.object({
        id: z.string().min(1, 'Required'),
        qty: z.coerce.number().int().min(1)
      })
    )
    .optional(),
  customer: z
    .object({
      id: z.string(),
      firstName: z.string(),
      lastName: z.string(),
      username: z.string()
    })
    .optional()
});

export type PaymentLinkSchemaProps = z.infer<typeof paymentLinkSchema>;
