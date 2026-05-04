import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CustomHeader from '@/components/headers/custom-header';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import DraggableInputPanel from '@/components/common/draggable/draggable-input-panel';
import { useState } from 'react';
import ContentWrapper from '@/components/common/content-wrapper';
import { useTranslation } from 'react-i18next';
import {
  productOptionSchema,
  type ProductOptionSchemaProps
} from '@/lib/schema/product-option-schema';
import FormInputMultipleLanguages from '@/components/common/form-input-multiple-languages';
import FormInput from '@/components/common/form-input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import clsx from 'clsx';

export default function NewProductOption() {
  const { t } = useTranslation();
  const [tasks, setTasks] = useState<Task[]>([]);

  const form = useForm<ProductOptionSchemaProps>({
    mode: 'onSubmit',
    resolver: zodResolver(productOptionSchema),
    defaultValues: {
      title: {
        en: '',
        km: '',
        vi: '',
        tw: '',
        cn: ''
      },
      cleaners: '',
      hours: '',
      bedroom: '',
      floor: '',
      isPestControl: false
    }
  });

  const isPestControl = useWatch({ control: form.control, name: 'isPestControl' });

  const onSubmit = async (values: ProductOptionSchemaProps) => {
    console.log('Form submitted with values:', values);
    // Here you would typically handle the form submission, e.g., calling an API
  };

  return (
    <div>
      <CustomHeader onSave={form.handleSubmit(onSubmit)} />
      <ContentWrapper>
        <div className="p-6 flex flex-row gap-6 items-baseline">
          <Card className="flex flex-1">
            <CardHeader className="gap-4">
              <CardTitle>{t('productPage.details')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div
                    className={clsx('grid grid-cols-1 gap-x-6 gap-y-3', {
                      'md:grid-cols-2': isPestControl,
                      'md:grid-cols-3': !isPestControl
                    })}
                  >
                    <FormInputMultipleLanguages
                      form={form}
                      name="title"
                      label="Title"
                      placeholder="Title"
                    />
                    {isPestControl && (
                      <>
                        <FormInput
                          control={form.control}
                          name="technician"
                          label={t('technician')}
                          placeholder={t('technician')}
                        />
                        <FormInput
                          control={form.control}
                          name="hours"
                          label={t('hours')}
                          placeholder={t('hours')}
                        />
                      </>
                    )}
                    {!isPestControl && (
                      <>
                        <FormInput
                          control={form.control}
                          name="cleaners"
                          label={t('cleaners')}
                          placeholder={t('cleaners')}
                        />
                        <FormInput
                          control={form.control}
                          name="hours"
                          label={t('hours')}
                          placeholder={t('hours')}
                        />
                        <FormInput
                          control={form.control}
                          name="bedroom"
                          label={t('bedroom')}
                          placeholder={t('bedroom')}
                        />
                        <FormInput
                          control={form.control}
                          name="floor"
                          label={t('floor')}
                          placeholder={t('floor')}
                        />
                      </>
                    )}
                  </div>
                  <FormField
                    control={form.control}
                    name="isPestControl"
                    render={({ field }) => {
                      return (
                        <FormItem className="flex flex-row items-center gap-2">
                          <FormControl>
                            <div className="flex items-center gap-3 mt-4">
                              <Checkbox
                                id="pestControl"
                                checked={field.value}
                                onCheckedChange={() => field.onChange(!field.value)}
                              />
                              <Label htmlFor="pestControl">{t('pestControl')}</Label>
                            </div>
                          </FormControl>
                        </FormItem>
                      );
                    }}
                  />
                </form>
              </Form>
            </CardContent>
          </Card>
          {isPestControl && (
            <div className="w-[368px] flex flex-col gap-4 h-full">
              <DraggableInputPanel
                title={t('productPage.taskInformation')}
                data={tasks}
                onChange={setTasks}
              />
            </div>
          )}
        </div>
      </ContentWrapper>
    </div>
  );
}
