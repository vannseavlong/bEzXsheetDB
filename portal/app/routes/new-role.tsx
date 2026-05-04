import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CustomHeader from '@/components/headers/custom-header';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import CustomSelect from '@/components/common/custom-select';
import ContentWrapper from '@/components/common/content-wrapper';
import { useTranslation } from 'react-i18next';
import FormInputMultipleLanguages from '@/components/common/form-input-multiple-languages';
import { rolesSchema, type RolesSchemaProps } from '@/lib/schema/role-schema';

export default function NewRoles() {
  const { t } = useTranslation();
  const form = useForm<RolesSchemaProps>({
    mode: 'onSubmit',
    resolver: zodResolver(rolesSchema),
    defaultValues: {
      name: {
        en: '',
        km: '',
        vi: '',
        tw: '',
        cn: ''
      },
      status: 'Active'
    }
  });

  const onSubmit = (values: RolesSchemaProps) => {
    console.log('Roles form submitted:', values);
    // Call your API or mutation here
  };

  return (
    <div>
      {/* Header with Save Button */}
      <CustomHeader onSave={form.handleSubmit(onSubmit)} />

      <ContentWrapper>
        <div className="p-6 flex flex-row gap-6 items-baseline">
          <Card className="flex flex-1">
            <CardHeader className="gap-4">
              <CardTitle>{t('Details')}</CardTitle>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-3">
                    {/* Name */}
                    <FormInputMultipleLanguages
                      form={form}
                      name="name"
                      label="Name"
                      placeholder="Name"
                    />

                    {/* Status */}
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
                              { label: 'Inactive', value: 'Inactive' },
                              { label: 'Pending', value: 'Pending' }
                            ]}
                            value={field.value}
                            onValueChange={field.onChange}
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
