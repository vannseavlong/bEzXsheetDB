import { string, z } from 'zod';
import { fileSchema } from '../utils';

export const changePWSchema = z.object({
  oldPassword: string({ required_error: 'Old password is required' }).min(
    1,
    'Old password is required'
  ),
  newPassword: string({ required_error: 'New password is required' })
    .min(1, 'New Password is required')
    .min(8, 'New Password must be more than 8 characters')
    .max(32, 'New Password must be less than 32 characters')
});

export type ChangePWProps = z.infer<typeof changePWSchema>;

export const updateProfileSchema = z.object({
  profileFile: z.object({ file: fileSchema.optional(), url: z.string().optional() }).optional()
  // firstName: z.string().min(1, 'Required'),
  // lastName: z.string().min(1, 'Required'),
  // email: z.string().email('Invalid email address').min(1, 'Email is required')
});

export type updateProfileSchemaProps = z.infer<typeof updateProfileSchema>;
