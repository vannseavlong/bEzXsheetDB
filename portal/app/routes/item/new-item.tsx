import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CustomHeader from '@/components/headers/custom-header';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import CustomSelect from '@/components/common/custom-select';
import ContentWrapper from '@/components/common/content-wrapper';
import { useTranslation } from 'react-i18next';
import FormInput from '@/components/common/form-input';
import { Textarea } from '@/components/ui/textarea';
import { serviceItemSchema, type ServiceItemSchemaProps } from '@/lib/schema/service-item-schema';
import { useAddServiceItemMutation } from '@/hooks/mutations/use-add-service-item-mutation';
import { useParams } from 'react-router';
import useServiceItemDetailQuery from '@/hooks/query/use-service-item-detail-query';
import { useEffect } from 'react';
import { ACTIONS, MODULES } from '@/lib/permission';

export const handle = {
  module: MODULES.SETUP_ITEM,
  action: ACTIONS.VIEW
};

export default function NewItem() {
  const { id } = useParams();
  const { data } = useServiceItemDetailQuery(id);
  const { mutate, isPending } = useAddServiceItemMutation(id);

  const { t } = useTranslation();
  const form = useForm<ServiceItemSchemaProps>({
    mode: 'onSubmit',
    resolver: zodResolver(serviceItemSchema),
    defaultValues: {
      name: '',
      status: 'Active',
      description: ''
    }
  });

  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name,
        status: data.status ? 'Active' : 'Inactive',
        description: data.description
      });
    }
  }, [data, form]);

  const onSubmit = (values: ServiceItemSchemaProps) => {
    console.log('User form submitted:', values);
    mutate(values);
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
                    <FormInput
                      control={form.control}
                      name="name"
                      label="Name (Khmer)"
                      placeholder="Name"
                    />

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
                    />
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
