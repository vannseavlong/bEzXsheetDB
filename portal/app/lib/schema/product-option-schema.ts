import { z } from 'zod';
import { multiLangNameSchema } from './multi-lang-schema';

const baseSchema = z.object({
  title: multiLangNameSchema
});

const nonePestControlSchema = baseSchema.extend({
  cleaners: z.string().min(1, 'Cleaners is required'),
  hours: z.string().min(1, 'Hours is required'),
  bedroom: z.string().min(1, 'Bedroom is required'),
  floor: z.string().min(1, 'Floor is required'),
  isPestControl: z.literal(false)
});

const pestControlSchema = baseSchema.extend({
  technician: z.string().min(1, 'Technician is required'),
  hours: z.string().min(1, 'Hours is required'),
  isPestControl: z.literal(true)
});

export const productOptionSchema = z.discriminatedUnion('isPestControl', [
  nonePestControlSchema,
  pestControlSchema
]);

export type ProductOptionSchemaProps = z.infer<typeof productOptionSchema>;
