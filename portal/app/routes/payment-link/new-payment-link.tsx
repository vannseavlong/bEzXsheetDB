import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CustomHeader from '@/components/headers/custom-header';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import ContentWrapper from '@/components/common/content-wrapper';
import { useParams } from 'react-router';
import { paymentLinkSchema, type PaymentLinkSchemaProps } from '@/lib/schema/payment-link-schema';
import FormInput from '@/components/common/form-input';
import CustomerDialog from '@/components/common/customer-dialog';
import { Button } from '@/components/ui/button';
import clsx from 'clsx';
import CustomSelect from '@/components/common/custom-select';
import { Plus } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Delete02Icon } from 'hugeicons-react';
import { useAddPaymentLinkMutation } from '@/hooks/mutations/use-add-payment-link-mutation';
import { useCouponListSummaryQuery } from '@/hooks/query/use-coupon-query';
import { Checkbox } from '@/components/ui/checkbox';
import { ACTIONS, MODULES } from '@/lib/permission';

export const handle = {
  module: MODULES.MARKETING_PAYMENT_LINK,
  action: ACTIONS.VIEW
};

export default function NewPaymentLink() {
  const { id } = useParams();
  const { data } = useCouponListSummaryQuery();

  const { mutate, isPending } = useAddPaymentLinkMutation(id);

  console.log({ data });

  const form = useForm<PaymentLinkSchemaProps>({
    mode: 'onSubmit',
    resolver: zodResolver(paymentLinkSchema),
    defaultValues: {
      title: '',
      isGeneral: false,
      coupon: [
        // {
        //   id: '',
        //   qty: ''
        // }
      ],
      customer: {
        id: '',
        firstName: '',
        lastName: '',
        username: ''
      },
      amount: '',
      note: ''
    }
  });

  const isGeneralWatcher = useWatch({ control: form.control, name: 'isGeneral' });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'coupon'
  });

  // useEffect(() => {
  //   if (data) {
  //     form.reset({
  //       name: data.name,
  //       status: data.status ? 'Active' : 'Inactive',
  //       description: data.description
  //     });
  //   }
  // }, [data, form]);

  const onSubmit = (values: PaymentLinkSchemaProps) => {
    console.log('User form submitted:', values);
    mutate({
      type: isGeneralWatcher ? 'GENERAL' : 'COUPON',
      title: values.title,
      amount: parseFloat(values.amount),
      userId: values.customer ? parseInt(values.customer.id, 10) : undefined,
      customData: (values.coupon || []).map((item) => ({
        couponId: parseInt(item.id, 10),
        qty: item.qty
      }))
    });
  };

  return (
    <div>
      {/* Header with Save Button */}
      <CustomHeader
        isLoading={isPending}
        onSave={form.handleSubmit(onSubmit, (error) => console.log(error))}
        buttonText="Generate Now"
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, (error) => console.log(error))}>
          <ContentWrapper>
            <div className="p-6 flex flex-row items-baseline">
              <Card className="flex flex-1 gap-4">
                <CardHeader>
                  <div className="flex justify-between mb-4">
                    <CardTitle className="text-base">Account Information</CardTitle>
                    <FormField
                      control={form.control}
                      name="isGeneral"
                      render={({ field }) => (
                        <FormItem className="flex gap-4 items-center">
                          <Checkbox
                            id="isGeneral"
                            checked={field.value}
                            onCheckedChange={() => field.onChange(!field.value)}
                          />
                          <FormLabel htmlFor="isGeneral">General Link</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardHeader>

                <CardContent className="px-6 pb-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6">
                    <div className="col-span-3 md:col-span-1">
                      <FormInput
                        control={form.control}
                        name="title"
                        label="Title"
                        labelClassName="block mb-2"
                        placeholder="Title"
                      />
                    </div>

                    <div className="col-span-3 md:col-span-1">
                      <FormInput
                        type="number"
                        control={form.control}
                        name="amount"
                        label="Amount For User To pay"
                        labelClassName="block mb-2"
                        placeholder="Amount"
                      />
                    </div>

                    {!isGeneralWatcher && (
                      <>
                        <div className="col-span-3 md:col-span-1">
                          <FormField
                            control={form.control}
                            name="customer"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel className="block mb-2">Select Customer</FormLabel>

                                <CustomerDialog
                                  onSelect={(user) => {
                                    field.onChange(user);
                                  }}
                                >
                                  <Button
                                    variant="outline"
                                    className={clsx('flex justify-start', {
                                      'text-gray-500': !field.value?.firstName
                                    })}
                                  >
                                    {field.value?.firstName
                                      ? `${field.value?.firstName} ${field.value?.lastName} (${field.value?.username})`
                                      : 'Select Customer'}
                                  </Button>
                                </CustomerDialog>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="col-span-3 border rounded-sm space-y-4">
                          <div className="bg-muted p-3 grid grid-cols-[1fr_80px]">
                            <span>Coupon</span>
                            <span>Quantity</span>
                          </div>
                          {fields.map((field, index) => (
                            <div
                              key={field.id}
                              className="px-3 grid grid-cols-[1fr_80px] gap-x-4 items-center"
                            >
                              <FormField
                                control={form.control}
                                name={`coupon.${index}.id`}
                                render={({ field: idField }) => (
                                  <FormItem>
                                    <CustomSelect
                                      data={(data || []).map((item) => ({
                                        label: item.name,
                                        value: `${item.id}`
                                      }))}
                                      placeholder="Select Coupon"
                                      value={idField.value}
                                      onValueChange={idField.onChange}
                                    />
                                  </FormItem>
                                )}
                              />

                              <div className="flex flex-1 items-center gap-4">
                                <div className="w-full">
                                  <FormInput
                                    displayMessage={false}
                                    control={form.control}
                                    name={`coupon.${index}.qty`}
                                    placeholder="Qty"
                                    type="decimal"
                                  />
                                </div>
                                {index > 0 && (
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Delete02Icon
                                        size="20"
                                        className="text-destructive cursor-pointer"
                                        type="button"
                                      />
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Confirmation</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to delete?
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>No</AlertDialogCancel>
                                        <AlertDialogAction
                                          className="bg-destructive"
                                          onClick={() => {
                                            remove(index);
                                          }}
                                        >
                                          Yes
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                )}
                              </div>
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="link"
                            onClick={() => append({ id: '', qty: 0 })}
                          >
                            <Plus />
                            Add coupon
                          </Button>
                        </div>
                      </>
                    )}
                    {/* <FormField
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
                </CardContent>
              </Card>
            </div>
          </ContentWrapper>
        </form>
      </Form>
    </div>
  );
}
