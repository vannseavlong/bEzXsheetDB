import { z } from 'zod';
import { multiLangNameSchema } from './multi-lang-schema';
import { fileSchema } from '../utils';
import { AnnouncementType, ScheduleType } from '@/constants/constants';

export const topicSchema = z.object({
  id: z.string().optional(),
  userType: z.string(),
  gender: z.string().optional(),
  age: z.string().optional()
});

const dynamicObjectSchema = z.record(z.string(), z.any());

export const customDataSchema = z.object({
  type: z.string(),
  value: z
    .union([
      dynamicObjectSchema, // e.g., { categoryId: '123', addressId: 0 }
      z.string() // e.g., 'ORDER-RATING' value
    ])
    .optional()
});

const notificationCoupon = z.object({
  id: z.string().min(1, 'Required'),
  qty: z.coerce.number().int().min(1),
  price: z.coerce.number().nonnegative()
});

// Base schema for shared fields
export const pushNotificationSchema = z
  .object({
    title: multiLangNameSchema,
    description: multiLangNameSchema,
    detail: multiLangNameSchema,
    name: z.string().min(1, 'Required'),
    bannerEn: fileSchema.optional(),
    bannerKm: fileSchema.optional(),
    bannerVi: fileSchema.optional(),
    bannerCn: fileSchema.optional(),
    bannerTw: fileSchema.optional(),
    topics: topicSchema,
    // topics: z.array(z.string()).min(1, 'Required'),
    selectedCategories: z.array(z.string()),
    selectedProducts: z.array(z.string()),
    selectedOptions: z.array(z.string()),
    dateRange: z.object({ from: z.date().optional(), to: z.date().optional() }),
    customData: customDataSchema,
    type: z.enum([AnnouncementType.general, AnnouncementType.packageDeal]),
    scheduleType: z.enum([
      ScheduleType.now,
      ScheduleType.schedule,
      ScheduleType.recurring,
      ScheduleType.event
    ]),
    triggerBase: z.enum(['REGISTRATION', 'LAST_BOOKING']).optional(),
    timeOffset: z.coerce.number().nonnegative().optional(),
    sentAt: z.date().optional(),
    startAt: z.date().optional(),
    endAt: z.date().optional(),
    coupons: z.array(notificationCoupon).optional()
    // pageUrl: z.string().optional(),
    // preferredService: z.string().min(1, 'Required'),
    // schedulerType: z.string().min(1, 'Required'),
    // startDate: z.string().min(1, 'Required'),
    // startTime: z.string().min(1, 'Required'),
    // endDate: z.string().min(1, 'Required'),
    // endTime: z.string().min(1, 'Required')
  })
  .superRefine((data, ctx) => {
    // 1. Check for scheduleType = recurring
    switch (data.scheduleType) {
      case ScheduleType.recurring:
        // 2. Check if timeOffset is missing (undefined or null)
        if (data.timeOffset === undefined || data.timeOffset === null) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Time offset is required for recurring schedule type.',
            path: ['timeOffset'] // Point the error to the timeOffset field
          });
        }
        break;

      case ScheduleType.schedule:
        // 2. Check if timeOffset is missing (undefined or null)
        if (data.sentAt === undefined) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Start date is required for schedule type.',
            path: ['sentAt'] // Point the error to the timeOffset field
          });
        }
        break;

      default:
        break;
    }

    if (data.type === AnnouncementType.packageDeal) {
      if (!data.coupons || (data.coupons && data.coupons.length == 0)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Coupons is required for Package Deal type.',
          path: ['coupons'] // Point the error to the timeOffset field
        });
      }
    }
  });

export type CustomDataSchemaProps = z.infer<typeof customDataSchema>;
// export type TopicSchemaProps = z.infer<typeof topicSchema>;
export type PushNotificationSchemaProps = z.infer<typeof pushNotificationSchema>;
export type NotificationCouponSchemaProps = z.infer<typeof notificationCoupon>;
