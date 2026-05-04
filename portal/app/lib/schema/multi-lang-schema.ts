import z from 'zod';

export const multiLangNameSchema = z.object({
  en: z.string().min(1, 'English name is required'),
  km: z.string().min(1, 'Khmer name is required'),
  vi: z.string().min(1, 'Vietnamese name is required'),
  tw: z.string().min(1, 'Chinese (Traditional) name is required'),
  cn: z.string().min(1, 'Chinese (Simplified) name is required')
});

export type MultiLangNameSchemaProps = z.infer<typeof multiLangNameSchema>;

export const convertBackToMultiLang = <T extends string>(
  values: MultiLangNameSchemaProps,
  key: T
): Record<`${T}En` | `${T}Km` | `${T}Vi` | `${T}Tw` | `${T}Cn`, string> => {
  return {
    [`${key}En`]: values.en,
    [`${key}Km`]: values.km,
    [`${key}Vi`]: values.vi,
    [`${key}Tw`]: values.tw,
    [`${key}Cn`]: values.cn
  } as Record<`${T}En` | `${T}Km` | `${T}Vi` | `${T}Tw` | `${T}Cn`, string>;
};
