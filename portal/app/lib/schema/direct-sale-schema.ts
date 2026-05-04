import { z } from 'zod';

const serviceSchema = z.object({
  id: z.string().optional(),
  categoryId: z.string().optional(),
  serviceId: z.string().min(1, 'Required'),
  serviceTypeId: z.string().min(1, 'Required'),
  duration: z.string().min(1, 'Required'),
  cleanerCount: z.string().min(1, 'Required'),
  bedroomCount: z.string().optional(),
  floorCount: z.string().optional(),
  quantity: z.string().min(1, 'Required'),
  amount: z.string().min(1, 'Required')
});

const partialServiceSchema = serviceSchema.partial();

export const directSaleScheme = z
  .object({
    // serviceAddOn: z.array(serviceSchema).optional(),
    // assignCleaner: z
    //   .array(
    //     z.object({
    //       id: z.string({ required_error: 'Required' }).min(1, 'Required'),
    //       name: z.string({ required_error: 'Required' })
    //     })
    //   )
    //   .optional(),
    vatNo: z.string().optional(),
    sale: z.string({ required_error: 'Required' }).min(1, 'Required'),
    reseller: z.string().optional(),
    customerId: z.string({ required_error: 'Required' }).min(1, 'Required'),
    // customerName: z.string({ required_error: 'Required' }).min(1, 'Required'),
    // phonenumber: z.string({ required_error: 'Required' }).min(1, 'Required'),
    date: z.coerce.date({ required_error: 'Required' }),
    address: z.string().min(1, 'Required'),
    category: z.string({ required_error: 'Required' }).min(1, 'Required'),
    services: partialServiceSchema.optional(),
    pairServices: z.array(serviceSchema).optional(),
    // payment
    // deposit: z.coerce.number().nonnegative(),
    deposit: z.string().min(1, 'Required'),
    additionalFee: z.coerce.number().nonnegative(),
    transportFee: z.coerce.number({ required_error: 'Required' }).nonnegative(),
    serviceFee: z.coerce.number({ required_error: 'Required' }).nonnegative(),
    paymentMethod: z.string({ required_error: 'Required' }).min(1, 'Required'),
    paymentStatus: z.string().optional(),
    // paymentDate: z.date({ required_error: 'Required' }),
    nextPaymentDate: z.date().optional(),
    markAsPrivate: z.boolean().optional(),
    serviceDetails: z.record(z.array(z.string())).optional(),
    totalPayableAmount: z.string().optional(),
    remark: z.string().optional(),
    file: z.any().optional(),
    isEdit: z.boolean().optional(),
    exchangeRate: z.string().optional()
  })
  .superRefine((data, ctx) => {
    const hasPairServices = data.pairServices && data.pairServices.length > 0;
    const hasServices = data.services !== undefined;

    if (!hasPairServices && !hasServices) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Required when there are no pair services',
        path: ['services']
      });
      return; // stop here
    }

    // If relying on services (no pairServices), validate its required fields manually
    if (!hasPairServices && hasServices) {
      const requiredFields = [
        'serviceId',
        'serviceTypeId',
        'duration',
        'cleanerCount',
        'quantity',
        'amount'
      ] as const;
      for (const field of requiredFields) {
        if (!data.services?.[field] || data.services[field]!.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Required',
            path: ['services', field]
          });
        }
      }
    }
  });

export type DirectSaleProps = z.infer<typeof directSaleScheme>;
export type ServiceSchemaProps = z.infer<typeof serviceSchema>;
