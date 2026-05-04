import { z } from 'zod';
import { multiLangNameSchema } from './multi-lang-schema';

export const productAddOnItemSchema = z.object({
  imgUrl: z.union([z.string(), z.instanceof(File)]).optional(),
  name: multiLangNameSchema,
  amount: z.string().min(1, 'Amount is required.'),
  duration: z.string().min(1, 'Duration is required.'),
  status: z.boolean(),
  type: z.enum(['SINGLE', 'MULTIPLE'])
});

export const productAddOnGroupFormSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  name: multiLangNameSchema,
  badge: multiLangNameSchema,
  selectionType: z.enum(['SINGLE', 'MULTIPLE']),
  isRequired: z.boolean(),
  addOns: z.array(productAddOnItemSchema)
});

export type ProductAddOnItemSchemaProps = z.infer<typeof productAddOnItemSchema>;
export type ProductAddOnGroupFormSchemaProps = z.infer<typeof productAddOnGroupFormSchema>;
