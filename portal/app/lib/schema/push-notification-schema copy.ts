// import { z } from 'zod';
// import { multiLangNameSchema } from './multi-lang-schema';

// // Base schema for shared fields
// export const pushNotificationSchema = z.object({
//   name: multiLangNameSchema,
//   description: multiLangNameSchema,
//   pageUrl: z.string().optional(),
//   imageUrl: z.string().optional(),
//   schedulerType: z.string().min(1, 'Required'),
//   startDate: z.string().min(1, 'Required'),
//   startTime: z.string().min(1, 'Required'),
//   endDate: z.string().min(1, 'Required'),
//   endTime: z.string().min(1, 'Required'),
//   recurrings: z.array(
//     z.object({
//       day: z.string().min(1, 'Required'),
//       time: z.string().min(1, 'Required'),
//       enabled: z.boolean()
//     })
//   )
// });

// export type PushNotificationSchemaProps = z.infer<typeof pushNotificationSchema>;
