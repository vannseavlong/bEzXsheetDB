import { z } from 'zod';
import { multiLangNameSchema } from './multi-lang-schema';

export const userSchema = z.object({
  name: multiLangNameSchema,
  status: z.enum(['Active', 'Inactive', 'Pending'], { required_error: 'Status is required' }),
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  role: z.enum(['User', 'Admin', 'Super Admin'], { required_error: 'Role is required' }),
  attachments: z.array(z.any({ required_error: 'Attachment is required' }))
});

export type UserSchemaProps = z.infer<typeof userSchema>;
