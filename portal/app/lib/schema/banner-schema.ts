import { z } from 'zod';
import { isDigitsOnly } from '../utils';

const multiLangNameSchema = z.object({
  en: z.string().min(1, 'English title is required'),
  km: z.string().min(1, 'Khmer title is required'),
  vi: z.string().min(1, 'Vietnamese title is required'),
  tw: z.string().min(1, 'Chinese (Traditional) title is required'),
  cn: z.string().min(1, 'Chinese (Simplified) title is required')
});

export const bannerSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    title: multiLangNameSchema,
    status: z.enum(['true', 'false'], { required_error: 'Status is required' }),
    bannerType: z.enum(['HOME-BANNER', 'PRODUCT-BUNDLE', 'COUPON-BANNER'], {
      required_error: 'Banner Type is required'
    }),
    hasDetail: z.boolean().default(false),
    hasTopup: z.boolean().default(false),
    content: z.object({
      en: z.string(),
      km: z.string(),
      vi: z.string(),
      tw: z.string(),
      cn: z.string()
    }),
    credit: z.string().optional(),
    amount: z.string().optional(),
    startDate: z.date().optional(),
    expiredDate: z.date().optional(),
    imgUrlEn: z.union([z.string(), z.instanceof(File)]),
    imgUrlKm: z.union([z.string(), z.instanceof(File)]),
    imgUrlVi: z.union([z.string(), z.instanceof(File)]),
    imgUrlTw: z.union([z.string(), z.instanceof(File)]),
    imgUrlCn: z.union([z.string(), z.instanceof(File)]),
    imgDetailUrlEn: z.union([z.string(), z.instanceof(File)]).optional(),
    imgDetailUrlKm: z.union([z.string(), z.instanceof(File)]).optional(),
    imgDetailUrlVi: z.union([z.string(), z.instanceof(File)]).optional(),
    imgDetailUrlTw: z.union([z.string(), z.instanceof(File)]).optional(),
    imgDetailUrlCn: z.union([z.string(), z.instanceof(File)]).optional()
  })
  .superRefine((data, ctx) => {
    if (data.hasDetail) {
      // First, strip HTML tags to check if the content is actually empty
      const stripTagsExceptRe = /<(?!img|iframe)[^>]+>/g;

      const enContent = data.content?.en
        ? data.content.en.replace(stripTagsExceptRe, '').trim()
        : '';
      if (!enContent) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'English content is required when detail is enabled',
          path: ['content', 'en']
        });
      }

      const kmContent = data.content?.km
        ? data.content.km.replace(stripTagsExceptRe, '').trim()
        : '';
      if (!kmContent) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Khmer content is required when detail is enabled',
          path: ['content', 'km']
        });
      }

      const viContent = data.content?.vi
        ? data.content.vi.replace(stripTagsExceptRe, '').trim()
        : '';
      if (!viContent) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Vietnamese content is required when detail is enabled',
          path: ['content', 'vi']
        });
      }

      const twContent = data.content?.tw
        ? data.content.tw.replace(stripTagsExceptRe, '').trim()
        : '';
      if (!twContent) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Chinese (Traditional) content is required when detail is enabled',
          path: ['content', 'tw']
        });
      }

      const cnContent = data.content?.cn
        ? data.content.cn.replace(stripTagsExceptRe, '').trim()
        : '';
      if (!cnContent) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Chinese (Simplified) content is required when detail is enabled',
          path: ['content', 'cn']
        });
      }
    }

    if (data.hasTopup) {
      if (!data.credit || data.credit.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Credit is required when Top Up is enabled',
          path: ['credit']
        });
      } else if (!isDigitsOnly(data.credit.trim())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Credit must contain digits only',
          path: ['credit']
        });
      }
      if (!data.amount || data.amount.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Amount is required when Top Up is enabled',
          path: ['amount']
        });
      } else if (!isDigitsOnly(data.amount.trim())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Amount must contain digits only',
          path: ['amount']
        });
      }
    }

    const imgFields = ['imgUrlEn', 'imgUrlKm', 'imgUrlVi', 'imgUrlTw', 'imgUrlCn'];
    const imgLabels: Record<string, string> = {
      imgUrlEn: 'English image',
      imgUrlKm: 'Khmer image',
      imgUrlVi: 'Vietnamese image',
      imgUrlTw: 'Chinese (Traditional) image',
      imgUrlCn: 'Chinese (Simplified) image'
    };

    imgFields.forEach((field) => {
      const value = data[field as keyof typeof data];
      if (!value) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${imgLabels[field]} is required`,
          path: [field]
        });
      }
    });

    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const today = now.getTime();

    if (data.startDate) {
      const startDateTime = new Date(data.startDate).setHours(0, 0, 0, 0);
      if (startDateTime < today) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Start date must be today or in the future',
          path: ['startDate']
        });
      }
    }

    if (data.expiredDate) {
      const expiredDateTime = new Date(data.expiredDate).setHours(0, 0, 0, 0);
      if (expiredDateTime < today) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Expired date must be today or in the future',
          path: ['expiredDate']
        });
      }
    }

    if (data.startDate && data.expiredDate) {
      const startDateTime = new Date(data.startDate).getTime();
      const expiredDateTime = new Date(data.expiredDate).getTime();
      if (expiredDateTime <= startDateTime) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Expired date must be after start date',
          path: ['expiredDate']
        });
      }
    }
  });

export type BannerSchemaProps = z.infer<typeof bannerSchema>;

export type BannerApiPayload = Omit<BannerSchemaProps, 'title' | 'bannerType'> & {
  titleEn: string;
  titleKm: string;
  titleVi: string;
  titleTw: string;
  titleCn: string;
  type: string;
};
