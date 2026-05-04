import { z } from 'zod';

export const serviceBundleSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  price: z.string().min(1, 'Price is required'),
  status: z.enum(['Active', 'Inactive']),
  bundleType: z.enum(['Basic', 'Standard', 'Premium', 'Exclusive'])
});

export type ServiceBundleSchemaProps = z.infer<typeof serviceBundleSchema>;
