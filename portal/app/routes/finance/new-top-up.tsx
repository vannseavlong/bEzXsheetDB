import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CustomHeader from '@/components/headers/custom-header';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import ContentWrapper from '@/components/common/content-wrapper';
import FormInput from '@/components/common/form-input';
import { Textarea } from '@/components/ui/textarea';
import CustomerDialog from '@/components/common/customer-dialog';
import { Button } from '@/components/ui/button';
import { topupSchema, type TopupSchemaProps } from '@/lib/schema/topup-schema';
import clsx from 'clsx';
import { useAddTopupMutation } from '@/hooks/mutations/use-add-topup-mutation';
import { ACTIONS, MODULES } from '@/lib/permission';

export const handle = {
  module: MODULES.FINANCE_TOPUP,
  action: ACTIONS.VIEW
};

export default function NewTopUp() {
  const { mutate, isPending } = useAddTopupMutation();

  const form = useForm<TopupSchemaProps>({
    mode: 'onSubmit',
    resolver: zodResolver(topupSchema),
    defaultValues: {
      customer: {
        id: '',
        firstName: '',
        lastName: '',
        username: ''
      },
      bWallet: 0,
      remark: ''
    }
  });

  const onSubmit = (values: TopupSchemaProps) => {
    // console.log('User form submitted:', values);
    mutate({
      userId: parseInt(values.customer.id, 10),
      amount: values.bWallet,
      remark: values.remark
    });
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
                  <div className="grid grid-cols-2 md:grid-cols-2 max-[480px]:grid-cols-1 gap-x-6 gap-y-6">
                    <div className="col-span-1 max-[480px]:col-span-2">
                      <FormField
                        control={form.control}
                        name="customer"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Select Customer</FormLabel>

                            <CustomerDialog
                              onSelect={(user) => {
                                field.onChange(user);
                              }}
                            >
                              <Button
                                variant="outline"
                                className={clsx('flex justify-start', {
                                  'text-gray-500': !field.value.firstName
                                })}
                              >
                                {field.value.firstName
                                  ? `${field.value.firstName} ${field.value.lastName} (${field.value.username})`
                                  : 'Select Customer'}
                              </Button>
                            </CustomerDialog>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="col-span-1 max-[480px]:col-span-2">
                      <FormInput
                        control={form.control}
                        name="bWallet"
                        label="bWallet"
                        placeholder="bWallet Point"
                        type="decimal"
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="remark"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Remark</FormLabel>
                          <Textarea
                            placeholder="Remark"
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
