import { z } from 'zod';
import { multiLangNameSchema } from './multi-lang-schema';

export const rolesSchema = z.object({
  name: multiLangNameSchema,
  status: z.enum(['Active', 'Inactive', 'Pending'], { required_error: 'Status is required' })
});

export type RolesSchemaProps = z.infer<typeof rolesSchema>;
