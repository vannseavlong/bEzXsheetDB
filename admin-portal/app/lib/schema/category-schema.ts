import { z } from 'zod';

const taskInfoItemSchema = z.object({
  key: z.string(),
  value: z.array(z.string())
});

const equipmentItemSchema = z.object({
  name: z.string(),
  status: z.boolean().default(true),
  sort: z.number().int()
});

const multiLangStringSchema = z.object({
  en: z.string().min(1, 'English is required'),
  km: z.string().min(1, 'Khmer is required'),
  vi: z.string().min(1, 'Vietnamese is required'),
  cn: z.string().min(1, 'Chinese (Simplified) is required'),
  tw: z.string().min(1, 'Chinese (Traditional) is required')
});

const multiLangOptionalStringSchema = z.object({
  en: z.string().optional().default(''),
  km: z.string().optional().default(''),
  vi: z.string().optional().default(''),
  cn: z.string().optional().default(''),
  tw: z.string().optional().default('')
});

// Each description row as stored by RHF useFieldArray (must be an object)
const descriptionItemSchema = z.object({
  value: z.string().default('')
});

// Task information schema per language entry.
// Input: description is an array of objects { value: string } (required by RHF useFieldArray).
// Output: description is transformed to string[] for API consumption.
const taskLangItemSchema = z.object({
  title: z.string().optional().default(''),
  description: z
    .array(descriptionItemSchema)
    .optional()
    .default([])
    .transform((items) => items.map((item) => item.value))
});

export const taskInformationSchema = z.object({
  en: taskLangItemSchema,
  km: taskLangItemSchema,
  vi: taskLangItemSchema,
  tw: taskLangItemSchema,
  cn: taskLangItemSchema
});

// A single task information entry in the form array
const taskInformationItemSchema = z.object({
  id: z.string(),
  value: taskInformationSchema
});

const productAddOnGroupItemSchema = z.object({
  groupId: z.number().int(),
  addOns: z.array(z.number().int()).default([])
});

export const categorySchema = z.object({
  // Name fields (nested by language)
  name: multiLangStringSchema,

  // Icon
  iconUrl: z.union([z.instanceof(File), z.string().min(1)], {
    errorMap: () => ({ message: 'Icon is required' })
  }),

  // Status & flags
  status: z.enum(['true', 'false']),
  isComingSoon: z.boolean().default(false),
  isRecommended: z.boolean().default(false),
  hasQty: z.boolean().default(false),

  // Note fields (nested by language)
  note: multiLangOptionalStringSchema.optional(),

  // Task information for UI (per-item, multi-language)
  taskInformation: z
    .array(taskInformationItemSchema)
    .min(1, 'At least one task information is required'),

  // Task info per language (array of {key, value[]}) - kept for API compatibility
  taskInfoEn: z.array(taskInfoItemSchema).optional(),
  taskInfoKm: z.array(taskInfoItemSchema).optional(),
  taskInfoVi: z.array(taskInfoItemSchema).optional(),
  taskInfoCn: z.array(taskInfoItemSchema).optional(),
  taskInfoTw: z.array(taskInfoItemSchema).optional(),

  // Related IDs
  productIds: z.array(z.string()).optional().default([]),
  productAddOnGroups: z.array(productAddOnGroupItemSchema).optional().default([]),

  // Equipment
  equipments: z.array(equipmentItemSchema).optional().default([]),
  equipment_images: z
    .array(z.union([z.instanceof(File), z.string()]))
    .optional()
    .default([])
});

export type CategorySchemaProps = z.infer<typeof categorySchema>;
export type CategoryInputProps = z.input<typeof categorySchema>;
export type TaskInfoItemProps = z.infer<typeof taskInfoItemSchema>;
export type EquipmentItemProps = z.infer<typeof equipmentItemSchema>;
export type EquipmentImageProps = File | string;
export type TaskInformationSchemaProps = z.infer<typeof taskInformationSchema>;
export type TaskInformationInputProps = z.input<typeof taskInformationSchema>;
export type ProductAddOnGroupSchemaProps = z.infer<typeof productAddOnGroupItemSchema>;
