import { z } from 'zod';

export const serviceItemSchema = z.object({
  name: z.string().min(1, 'Required'),
  description: z.string().min(1, 'Required'),
  status: z.enum(['Active', 'Inactive'])
});

export type ServiceItemSchemaProps = z.infer<typeof serviceItemSchema>;
