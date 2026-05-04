import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CustomHeader from '@/components/headers/custom-header';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import ContentWrapper from '@/components/common/content-wrapper';
import { useParams } from 'react-router';
import {
  blockedScheduleSchema,
  type BlockedScheduleSchemaProps
} from '@/lib/schema/block-schedule-schema';
import FormInputMultipleLanguages from '@/components/common/form-input-multiple-languages';
import DatePicker from '@/components/common/date-picker';
import useCategoryNamesQuery from '@/hooks/query/use-category-name-query';
import { Checkbox } from '@/components/ui/checkbox';
import { convertBackToMultiLang } from '@/lib/schema/multi-lang-schema';
import { useAddBlockScheduleMutation } from '@/hooks/mutations/use-add-blocked-schedule-mutation';
import useBlockedScheduleDetailQuery from '@/hooks/query/use-blocked-schedule-detail-query';
import { useEffect } from 'react';
import { ACTIONS, MODULES } from '@/lib/permission';

export const handle = {
  module: MODULES.SETUP_SCHEDULE,
  action: ACTIONS.VIEW
};

export default function NewBlockedSchedule() {
  const { id } = useParams();
  const { data } = useBlockedScheduleDetailQuery(id);
  const { data: categoryData, isPending: isCategoryPending } = useCategoryNamesQuery();
  const { mutate, isPending } = useAddBlockScheduleMutation(id);

  const form = useForm<BlockedScheduleSchemaProps>({
    mode: 'onSubmit',
    resolver: zodResolver(blockedScheduleSchema),
    defaultValues: {
      date: new Date(),
      title: {
        en: '',
        km: '',
        vi: '',
        tw: '',
        cn: ''
      },
      message: {
        en: '',
        km: '',
        vi: '',
        tw: '',
        cn: ''
      },
      label: {
        en: '',
        km: '',
        vi: '',
        tw: '',
        cn: ''
      },
      categoryIds: []
    }
  });

  useEffect(() => {
    if (data) {
      form.reset({
        categoryIds: data.categoryIds.map((item) => `${item}`),
        date: new Date(data.date),
        title: {
          en: data.titleEn,
          km: data.titleKm,
          vi: data.titleVi,
          tw: data.titleTw,
          cn: data.titleCn
        },
        message: {
          en: data.messageEn,
          km: data.messageKm,
          vi: data.messageVi,
          tw: data.messageTw,
          cn: data.messageCn
        },
        label: {
          en: data.labelEn,
          km: data.labelKm,
          vi: data.labelVi,
          tw: data.labelTw,
          cn: data.labelCn
        }
      });
    }
  }, [data, form]);

  const onSubmit = (values: BlockedScheduleSchemaProps) => {
    console.log('User form submitted:', values);
    const { title, message, label, categoryIds, ...rest } = values;
    const payload: BlockedScheduleAttributes = {
      ...convertBackToMultiLang(title, 'title'),
      ...convertBackToMultiLang(message, 'message'),
      ...convertBackToMultiLang(label, 'label'),
      categoryIds: categoryIds.map((item) => parseInt(item)),
      ...rest,
      date: values.date.toISOString()
    };

    console.log({ payload });
    mutate(id !== 'new' ? { ...payload, id } : payload);
  };

  return (
    <div>
      {/* Header with Save Button */}
      <CustomHeader
        isLoading={isPending}
        onSave={form.handleSubmit(onSubmit, (error) => console.log(error))}
      />

      <ContentWrapper>
        <div className="p-6 flex flex-row items-baseline">
          <Card className="flex flex-1 gap-4">
            <CardHeader>
              <CardTitle className="text-base">Account Information</CardTitle>
            </CardHeader>

            <CardContent className="px-6 pb-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit, (error) => console.log(error))}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                    <div className="col-span-1 w-full">
                      <FormInputMultipleLanguages
                        form={form}
                        name="title"
                        label="Title"
                        placeholder="Title"
                      />
                    </div>
                    <div className="col-span-1 w-full">
                      <FormInputMultipleLanguages
                        form={form}
                        name="label"
                        label="Label"
                        placeholder="Label"
                      />
                    </div>
                    <div className="col-span-1 w-full">
                      <FormInputMultipleLanguages
                        form={form}
                        name="message"
                        label="Message"
                        placeholder="Message"
                      />
                    </div>
                    <div className="col-span-1 w-full">
                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date</FormLabel>
                            <DatePicker date={field.value} onDateTimeChange={field.onChange} />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <h1 className="col-span-1 md:col-span-2">Select Category</h1>
                    {isCategoryPending ? (
                      <div>Loading...</div>
                    ) : (
                      <div className="col-span-1 md:col-span-2 flex flex-wrap gap-3">
                        {categoryData?.map((item) => (
                          <div key={item.id} className="min-w-[140px]">
                            <FormField
                              control={form.control}
                              name="categoryIds"
                              render={({ field }) => (
                                <FormItem>
                                  <div className="flex gap-3 items-center">
                                    <Checkbox
                                      id={item.id}
                                      checked={field.value.includes(item.id)}
                                      onCheckedChange={() => {
                                        if (field.value.includes(item.id)) {
                                          field.onChange(
                                            field.value.filter((id) => id !== item.id)
                                          );
                                        } else {
                                          field.onChange([...field.value, item.id]);
                                        }
                                      }}
                                    />
                                    <FormLabel htmlFor={item.id}>{item.nameEn}</FormLabel>
                                  </div>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>{t('Status')}</FormLabel>
                          <CustomSelect
                            className="!h-10"
                            placeholder={t('Select status')}
                            data={[
                              { label: 'Active', value: 'Active' },
                              { label: 'Inactive', value: 'Inactive' }
                            ]}
                            value={field.value}
                            onValueChange={field.onChange}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Description</FormLabel>
                          <Textarea
                            placeholder="Description"
                            value={field.value}
                            onChange={field.onChange}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    /> */}
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </ContentWrapper>
    </div>
  );
}
