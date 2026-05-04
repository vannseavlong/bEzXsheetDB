import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CustomHeader from '@/components/headers/custom-header';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import CustomSelect from '@/components/common/custom-select';
import { voucherSchema, type VoucherSchemaProps } from '@/lib/schema/voucher-schema';
import ContentWrapper from '@/components/common/content-wrapper';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import DatePicker from '@/components/common/date-picker';

export default function NewVoucher() {
  const { t } = useTranslation();

  const form = useForm<VoucherSchemaProps>({
    resolver: zodResolver(voucherSchema),
    defaultValues: {
      name: '',
      code: '',
      discountType: 'Amount',
      discountValue: 0,
      usageLimit: 1,
      perUserLimit: 1,
      status: 'Active',
      validFrom: new Date(),
      validTo: new Date(Date.now() + 24 * 60 * 60 * 1000),
      eligibleServices: '',
      eligibleUsers: ''
    }
  });

  const eligibleServicesOptions = [
    { label: 'All Services', value: 'All Services' },
    { label: 'Service A', value: 'Service A' },
    { label: 'Service B', value: 'Service B' }
  ];

  const eligibleUsersOptions = [
    { label: 'All Users', value: 'All Users' },
    { label: 'User Group 1', value: 'User Group 1' },
    { label: 'User Group 2', value: 'User Group 2' }
  ];

  const onSubmit = (values: VoucherSchemaProps) => {
    console.log('Submitted voucher:', values);
    // Your API call or logic here
  };

  return (
    <div>
      <CustomHeader onSave={form.handleSubmit(onSubmit)} />
      <ContentWrapper>
        <div className="p-6 flex flex-row gap-6 items-baseline">
          <Card className="flex flex-1">
            <CardHeader className="gap-4">
              <CardTitle>{t('Details')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-3"
                >
                  {/* Name */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('Name')}</FormLabel>
                        <Input {...field} placeholder="Name" />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Code */}
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('ode')}</FormLabel>
                        <Input {...field} placeholder="Code" />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Discount Type */}
                  <FormField
                    control={form.control}
                    name="discountType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('Discount Type')}</FormLabel>
                        <CustomSelect
                          data={[
                            { label: 'Amount', value: 'Amount' },
                            { label: 'Percentage', value: 'Percentage' }
                          ]}
                          value={field.value}
                          onValueChange={field.onChange}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Discount Value */}
                  <FormField
                    control={form.control}
                    name="discountValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('Discount Value')}</FormLabel>
                        <Input {...field} type="number" min={0.01} step={0.01} placeholder="0.00" />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Usage Limit */}
                  <FormField
                    control={form.control}
                    name="usageLimit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('Usage Limit')}</FormLabel>
                        <Input {...field} type="number" min={1} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Per User Limit */}
                  <FormField
                    control={form.control}
                    name="perUserLimit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('Per User Limit')}</FormLabel>
                        <Input {...field} type="number" min={1} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Status */}
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('Status')}</FormLabel>
                        <CustomSelect
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

                  {/* Valid From */}
                  <FormField
                    control={form.control}
                    name="validFrom"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('Valid From')}</FormLabel>
                        <DatePicker date={field.value} onDateTimeChange={field.onChange} />

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Valid To */}
                  <FormField
                    control={form.control}
                    name="validTo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('Valid To')}</FormLabel>
                        <DatePicker date={field.value} onDateTimeChange={field.onChange} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Eligible Services */}
                  <FormField
                    control={form.control}
                    name="eligibleServices"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('Eligible Services')}</FormLabel>
                        <CustomSelect
                          data={eligibleServicesOptions}
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder="Select eligible services"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="eligibleUsers"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('Eligible Users')}</FormLabel>
                        <CustomSelect
                          data={eligibleUsersOptions}
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder="Select eligible users"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </ContentWrapper>
    </div>
  );
}
