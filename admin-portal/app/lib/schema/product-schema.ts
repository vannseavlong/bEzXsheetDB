import { z } from 'zod';
import { multiLangNameSchema } from './multi-lang-schema';
import { taskInformationSchema, type TaskInformationSchemaProps } from './category-schema';

export { type TaskInformationSchemaProps };

const taskInformationItemSchema = z.object({
  id: z.string(),
  value: taskInformationSchema
});

const equipmentItemSchema = z.object({
  name: z.string(),
  status: z.boolean().default(true),
  sort: z.number().int()
});

const selectedProductOptionSchema = z.object({
  id: z.number().int(),
  amount: z.string().min(1, 'Amount is required')
});

export const productSchema = z.object({
  name: multiLangNameSchema,
  iconUrl: z.union([z.instanceof(File), z.string().min(1)], {
    errorMap: () => ({ message: 'Icon is required' })
  }),
  status: z.enum(['true', 'false']),
  categoryIds: z.array(z.string()).optional().default([]),
  taskInformation: z.array(taskInformationItemSchema).optional().default([]),
  selectedProductOptions: z.array(selectedProductOptionSchema).optional().default([]),
  equipments: z.array(equipmentItemSchema).optional().default([]),
  equipment_images: z
    .array(z.union([z.instanceof(File), z.string()]))
    .optional()
    .default([])
});

export type ProductSchemaProps = z.infer<typeof productSchema>;
export type ProductInputProps = z.input<typeof productSchema>;
export type SelectedProductOptionProps = z.infer<typeof selectedProductOptionSchema>;
