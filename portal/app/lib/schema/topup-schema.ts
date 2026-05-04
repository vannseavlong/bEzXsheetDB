import { z } from 'zod';

export const topupSchema = z.object({
  customer: z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    username: z.string()
  }),
  bWallet: z.coerce.number().min(0.1),
  remark: z.string().min(1, 'Required')
});

export type TopupSchemaProps = z.infer<typeof topupSchema>;
