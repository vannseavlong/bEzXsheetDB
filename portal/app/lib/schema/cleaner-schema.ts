import { z } from 'zod';
import { fileSchema } from '../utils';

export const cleanerSchema = z.object({
  cleanerName: z.string().min(1, 'Required'),
  image: z.object({ file: fileSchema.optional(), url: z.string().optional() }).optional(),
  joinedDate: z.date(),
  gender: z.enum(['MALE', 'FEMALE']),
  status: z.enum(['Active', 'Inactive']),
  autoAssign: z.boolean(),
  cleanerExpertiseIds: z.array(z.string()).optional(),
  role: z.enum(['LEADER', 'MEMBER']),
  dayOffs: z.array(z.number()).optional()
});

export type CleanerSchemaProps = z.infer<typeof cleanerSchema>;
