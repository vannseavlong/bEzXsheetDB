import { z } from 'zod';
import { multiLangNameSchema } from './multi-lang-schema';

export const blockedScheduleSchema = z.object({
  date: z.date({ required_error: 'Date is required' }),
  title: multiLangNameSchema,
  message: multiLangNameSchema,
  label: multiLangNameSchema,
  categoryIds: z.array(z.string())
});

export type BlockedScheduleSchemaProps = z.infer<typeof blockedScheduleSchema>;
