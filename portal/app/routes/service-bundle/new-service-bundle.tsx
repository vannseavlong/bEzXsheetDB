import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CustomHeader from '@/components/headers/custom-header';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import CustomSelect from '@/components/common/custom-select';
import DragDropFileUpload from '@/components/common/drag-drop-file-upload';
import DraggableInputPanel from '@/components/common/draggable/draggable-input-panel';
import { useState } from 'react';
import DraggableComboboxPanel from '@/components/common/draggable/draggable-combobox-panel';
import ContentWrapper from '@/components/common/content-wrapper';
import { useTranslation } from 'react-i18next';
import FormInput from '@/components/common/form-input';
import {
  serviceBundleSchema,
  type ServiceBundleSchemaProps
} from '@/lib/schema/service-bundle-schema';
import ContentWrapper from '@/components/common/content-wrapper';
import { useTranslation } from 'react-i18next';
import FormInput from '@/components/common/form-input';
import {
  serviceBundleSchema,
  type ServiceBundleSchemaProps
} from '@/lib/schema/service-bundle-schema';
import ContentWrapper from '@/components/common/content-wrapper';
import { useTranslation } from 'react-i18next';
import FormInput from '@/components/common/form-input';
import {
  serviceBundleSchema,
  type ServiceBundleSchemaProps
} from '@/lib/schema/service-bundle-schema';

export default function NewServiceBundle() {
  const { t } = useTranslation();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [serviceBundles, setServiceBundles] = useState<DraggableComboBoxProps[]>([]);

  const form = useForm<ServiceBundleSchemaProps>({
    mode: 'onSubmit',
    resolver: zodResolver(serviceBundleSchema),
    defaultValues: {
      name: '',
      status: 'Active',
      bundleType: 'Basic'
    }
  });

  const onSubmit = async (values: ServiceBundleSchemaProps) => {
    console.log('Form submitted with values:', values);
  };

  return (
    <div>
      <CustomHeader onSave={form.handleSubmit(onSubmit)} />
      <ContentWrapper>
        <div className="p-6 flex flex-row gap-6 items-baseline">
          <Card className="flex flex-1">
            <CardHeader className="gap-4">
              <CardTitle>{t('serviceBundlePage.details')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                    <FormInput control={form.control} name="name" label="Name" placeholder="Name" />
                    <FormInput
                      control={form.control}
                      name="price"
                      label={t('Price')}
                      placeholder={t('Price')}
                    />

                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Status</FormLabel>
                          <CustomSelect
                            className="!h-10"
                            placeholder="Status"
                            data={[
                              { label: 'Active', value: 'Active' },
                              { label: 'Resigned', value: 'Resigned' }
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
                      name="bundleType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('Bundle Type')}</FormLabel>
                          <CustomSelect
                            className="!h-10"
                            placeholder="Basic"
                            data={[
                              { label: 'Basic', value: 'Basic' },
                              { label: 'Standard', value: 'Standard' },
                              { label: 'Premuim', value: 'Premium' },
                              { label: 'Exclusive', value: 'Exclusive' }
                            ]}
                            value={field.value}
                            onValueChange={field.onChange}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="mt-4">
                    <DragDropFileUpload placeholder="What's Included" />
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
          <div className="w-[368px] flex flex-col gap-4 h-full">
            <DraggableInputPanel
              title={t('serviceBundlePage.description')}
              data={tasks}
              onChange={setTasks}
            />
            <DraggableComboboxPanel
              title={t('serviceBundlePage.service')}
              buttonText={t('serviceBundlePage.service')}
              data={serviceBundles}
              onChange={setServiceBundles}
            />
          </div>
        </div>
      </ContentWrapper>
    </div>
  );
}
