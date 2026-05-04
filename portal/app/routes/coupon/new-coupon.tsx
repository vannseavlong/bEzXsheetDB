import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CustomHeader from '@/components/headers/custom-header';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useController, useForm, useWatch } from 'react-hook-form';
import ContentWrapper from '@/components/common/content-wrapper';
import FormInput from '@/components/common/form-input';
import { useParams } from 'react-router';
import { couponSchema, type CouponSchemaProps } from '@/lib/schema/coupon-schema';
import CategoryAndProductSelection from '@/components/common/category-and-product-selection';
import FormInputMultipleLanguages from '@/components/common/form-input-multiple-languages';
import AssignCustomersCard from '@/components/common/assign-customer-card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import CustomSelect from '@/components/common/custom-select';
import DatePicker from '@/components/common/date-picker';
import { useCreateCouponMutation } from '@/hooks/mutations/use-create-coupon-mutation';
import { useCouponDetailQuery } from '@/hooks/query/use-coupon-query';
import { useEffect, useMemo } from 'react';
import useCategoryNamesQuery from '@/hooks/query/use-category-name-query';
import { convertBackToMultiLang } from '@/lib/schema/multi-lang-schema';
import { ACTIONS, MODULES } from '@/lib/permission';
import moment from 'moment';
import OverviewCard from '@/components/common/overview-card';
import numeral from 'numeral';

export const handle = {
  module: MODULES.MARKETING_COUPON,
  action: ACTIONS.VIEW
};

export default function NewCoupon() {
  const { id: tempId } = useParams<{ id: string }>();

  const ids = tempId?.split('-') || [];
  const assign = ids.length > 1 ? ids[1] : null;

  const id = tempId === 'new' ? 'new' : ids.length > 1 ? ids[0] : tempId;

  const isEditCoupon = useMemo(() => id !== 'new', [id]);
  const isAssignCoupon = useMemo(() => assign === 'assign', [assign]);
  const { data } = useCouponDetailQuery(id);
  const { data: categoryData, isPending: isCategoryPending } = useCategoryNamesQuery(true, true);
  const { mutate, isPending } = useCreateCouponMutation(id);
  const form = useForm<CouponSchemaProps>({
    mode: 'onSubmit',
    resolver: zodResolver(couponSchema),
    defaultValues: {
      users: [],
      selectedProducts: [],
      selectedOptions: [],
      name: '',
      code: '',
      promoText: {
        en: 'Enjoy a reduced price on our service.',
        km: 'រីករាយជាមួយតម្លៃបញ្ចុះលើសេវាកម្មរបស់យើង',
        vi: 'Tận hưởng mức giá ưu đãi cho dịch vụ của chúng tôi',
        tw: '享受我們的優惠服務',
        cn: '享受我们的优惠服务'
      },
      remark: '',
      value: 0,
      type: data?.type || 'FIXED',
      targetUser: data?.targetUser || 'SELECTED',
      transportFee: 0,
      serviceFee: 0,
      effectiveDate: undefined,
      expiredDate: undefined,
      minSpentAmount: 0,
      maxRedeemAmount: undefined,
      maxRedeemPerPax: undefined,
      maxRedeemCount: undefined,
      maxRedeemCountPax: undefined,
      isNewUserOnly: false,
      isEditCoupon
    }
  });

  // console.log({ data });
  useEffect(() => {
    if (data) {
      // console.log('coupon data: ', data);
      form.reset({
        code: data.code,
        name: data.name,
        isEditCoupon,
        promoText: {
          en: data.promoTextEn,
          km: data.promoTextKm,
          vi: data.promoTextVi,
          tw: data.promoTextTw,
          cn: data.promoTextCn
        },
        remark: data.remark,
        value: data.value,
        type: data.type || 'FIXED',
        transportFee: data.transportFee ? data.transportFee : 0,
        serviceFee: data.serviceFee ? data.serviceFee : 0,
        targetUser: data.targetUser || 'SELECTED',
        effectiveDate: data.effectiveDate ? new Date(data.effectiveDate) : undefined,
        expiredDate: data.expiredDate ? new Date(data.expiredDate) : undefined,
        minSpentAmount: data?.minSpentAmount || 0,
        maxRedeemAmount: data?.maxRedeemAmount,
        maxRedeemPerPax: data?.maxRedeemAmountPax ? `${data?.maxRedeemAmountPax}` : undefined,
        maxRedeemCount: data?.maxRedeemCount ? `${data?.maxRedeemCount}` : undefined,
        maxRedeemCountPax: data?.maxRedeemCountPax ? `${data?.maxRedeemCountPax}` : undefined,
        isNewUserOnly: data?.isNewUserOnly === 'true',
        users: (data.users || []).map((item) => ({
          ...item,
          qty: item.qty,
          id: `${item.id}`,
          usageCount: `${item.usageCount}`,
          userId: `${item.id}`
        })),
        selectedProducts: (data.selectedProducts || []).map((item) => `${item}`),
        selectedOptions: (data.selectedOptions || []).map((item) => `${item}`)
      });
    }
  }, [data, form, isEditCoupon]);

  const watcher = useWatch({ control: form.control, name: 'targetUser' });
  const { field: optionsField } = useController({ control: form.control, name: 'selectedOptions' });

  const defaultCategoryIds = useMemo(() => {
    if (data && data.selectedProducts && categoryData) {
      return data.selectedProducts
        .map((productId) =>
          categoryData.find((category) =>
            category.products?.find((p) => `${p.id}` === `${productId}`)
          )
        )
        .map((category) => category?.id);
    }
    return [];
  }, [data, categoryData]);

  const onSubmit = (values: CouponSchemaProps) => {
    // console.log('User form submitted:', values);
    const payload = {
      ...convertBackToMultiLang(values.promoText, 'promoText'),
      minSpentAmount: values.minSpentAmount || null,
      maxRedeemAmount: values.maxRedeemAmount || undefined,
      maxRedeemPerPax: values.maxRedeemPerPax ? parseInt(values.maxRedeemPerPax) : undefined,
      maxRedeemCount: values.maxRedeemCount ? parseInt(values.maxRedeemCount) : undefined,
      maxRedeemCountPax: values.maxRedeemCountPax ? parseInt(values.maxRedeemCountPax) : undefined,
      name: values.name,
      code: values.code,
      value: values.value,
      type: values.type,
      isNewUserOnly: values.isNewUserOnly,
      targetUser: values.targetUser,
      remark: values.remark,
      transportFee: values.transportFee,
      serviceFee: values.serviceFee,
      users: (values.users || []).map((item) => ({
        userId: parseInt(item.id, 10),
        qty: item.qty
      })),
      selectedProducts: (values.selectedProducts || []).map((item) => parseInt(item, 10)),
      selectedOptions: (values.selectedOptions || []).map((item) => parseInt(item, 10)),
      effectiveDate: values.effectiveDate
        ? moment(values.effectiveDate).startOf('D').toISOString()
        : undefined,
      expiredDate: values.expiredDate
        ? moment(values.expiredDate).endOf('D').toISOString()
        : undefined
    };

    // console.log('payload: ', payload);

    mutate(payload);
    // mutate({
    //   value:
    //     rest.type === 'PERCENTAGE'
    //       ? (parseFloat(rest.value) / 100).toString()
    //       : rest.value.toString(),
    //   promoTextEn: rest.promoText.en,
    //   promoTextKm: rest.promoText.km,
    //   promoTextVi: rest.promoText.vi,
    //   promoTextTw: rest.promoText.tw,
    //   promoTextCn: rest.promoText.cn,
    //   maxRedeemAmount: maxRedeemAmount ? parseInt(maxRedeemAmount) : undefined,
    //   maxRedeemPerPax: maxRedeemPerPax ? parseInt(maxRedeemPerPax) : undefined,
    //   maxRedeemCount: maxRedeemCount ? parseInt(maxRedeemCount) : undefined,
    //   users: (rest.users || []).map((item) => ({ id: parseInt(item.id, 10) })),
    //   selectedProducts: (rest.selectedProducts || []).map((item) => parseInt(item, 10)),
    //   effectiveDate: rest.effectiveDate ? rest.effectiveDate.toISOString() : undefined,
    //   expiredDate: rest.expiredDate ? rest.expiredDate.toISOString() : undefined,
    //   ...rest
    // });
  };

  return (
    <div>
      {/* Header with Save Button */}
      <CustomHeader
        isLoading={isPending}
        onSave={form.handleSubmit(onSubmit, (error) => console.log(error))}
        isDone={!!assign}
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, (error) => console.log(error))}>
          <ContentWrapper className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            {id !== 'new' && (
              <div className="col-span-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <OverviewCard
                    label="Total Usage"
                    count={numeral(data?.totalUsage).format('0,0')}
                    trend="none"
                  />
                  <OverviewCard
                    label="Total Sale"
                    count={`$${numeral(data?.totalSale).format('0,0.00')}`}
                    trend="none"
                  />
                  <OverviewCard
                    label="New User Count"
                    count={numeral(data?.newUserCount).format('0,0')}
                    trend="none"
                  />
                  <OverviewCard
                    label="Returning User Count"
                    count={numeral(data?.returningCustomerCount).format('0,0')}
                    trend="none"
                  />
                </div>
              </div>
            )}
            <div className="md:col-span-2 flex flex-col w-full gap-6">
              <Card className="space-y-4">
                <CardHeader>
                  <CardTitle className="text-base">Account Information</CardTitle>
                </CardHeader>

                <CardContent className="px-0 pb-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 px-6 gap-x-6 gap-y-6">
                    <FormInput
                      disabled={isAssignCoupon}
                      control={form.control}
                      name="name"
                      label="Name"
                      placeholder="Name"
                    />
                    <FormInput
                      disabled={isAssignCoupon || isEditCoupon}
                      control={form.control}
                      name="code"
                      label="Code"
                      placeholder="Code"
                    />
                    <FormInputMultipleLanguages
                      disabled={isAssignCoupon}
                      form={form}
                      name="promoText"
                      label="Promotion Text"
                      placeholder="Promotion Text"
                    />
                    <FormInput
                      disabled={isAssignCoupon || isEditCoupon}
                      control={form.control}
                      name="value"
                      label="Discount Value"
                      placeholder="Value"
                      type="decimal"
                    />
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type</FormLabel>
                          <CustomSelect
                            disabled={isAssignCoupon || isEditCoupon}
                            data={[
                              { label: 'Fixed', value: 'FIXED' },
                              { label: 'Percentage', value: 'PERCENTAGE' }
                            ]}
                            placeholder="Select Type"
                            value={field.value}
                            onValueChange={field.onChange}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="targetUser"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Target Use</FormLabel>
                          <CustomSelect
                            disabled={isAssignCoupon || isEditCoupon}
                            data={[
                              { label: 'All', value: 'ALL' },
                              { label: 'Selected user only', value: 'SELECTED' }
                            ]}
                            placeholder="Target User"
                            value={field.value}
                            onValueChange={field.onChange}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormInput
                      disabled={isAssignCoupon || isEditCoupon}
                      control={form.control}
                      name="transportFee"
                      label="Transport Fee"
                      placeholder="Transport Fee"
                      type="decimal"
                    />
                    <FormInput
                      disabled={isAssignCoupon || isEditCoupon}
                      control={form.control}
                      name="serviceFee"
                      label="Service Fee"
                      placeholder="Service Fee"
                      type="decimal"
                    />

                    <FormField
                      control={form.control}
                      name="effectiveDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Effective Date (Optional)</FormLabel>
                          <DatePicker
                            disabled={isAssignCoupon}
                            date={field.value}
                            onDateTimeChange={field.onChange}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="expiredDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expired Date (Optional)</FormLabel>
                          <DatePicker
                            disabled={isAssignCoupon}
                            date={field.value}
                            onDateTimeChange={field.onChange}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormInput
                      disabled={isAssignCoupon}
                      control={form.control}
                      name="minSpentAmount"
                      label="Min Spend Amount (Optional)"
                      placeholder="Min Spend Amount"
                    />
                    <FormInput
                      disabled={isAssignCoupon}
                      control={form.control}
                      name="maxRedeemAmount"
                      label="Max Redeem Amount (Optional)"
                      placeholder="Max Redeem Amount"
                    />
                    <FormInput
                      disabled={isAssignCoupon}
                      control={form.control}
                      name="maxRedeemCountPax"
                      label="Max Redeem Per User (Optional)"
                      placeholder="Max Redeem Per User"
                    />
                    <FormInput
                      disabled={isAssignCoupon}
                      control={form.control}
                      name="maxRedeemCount"
                      label="Max Redeem Total (Optional)"
                      placeholder="Max Redeem Total"
                    />
                    <div className="flex items-center col-span-1 sm:col-span-2 md:col-span-3 gap-4">
                      <Checkbox disabled={isAssignCoupon || isEditCoupon} id="newUser" />
                      <Label htmlFor="newUser">New User Only</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="w-full md:col-start-3 md:col-span-1">
              <CardContent className="w-full">
                <FormField
                  control={form.control}
                  name="selectedProducts"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">Apply To</FormLabel>
                      <CategoryAndProductSelection
                        disabled={isAssignCoupon}
                        productIds={field.value}
                        optionIds={optionsField.value}
                        onProductIdsChange={field.onChange}
                        onOptionIdsChange={optionsField.onChange}
                        defaultCategoryIds={defaultCategoryIds || []}
                        // defaultProductIds={defaultProductIds || []}
                        categoryNames={categoryData}
                        isPending={isCategoryPending}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {id !== 'new' && watcher === 'ALL' ? null : (
              <div className="md:col-span-2">
                <AssignCustomersCard
                  excludeUserIds={data?.users?.map((item) => item.id)}
                  isAssignMenually={!!assign}
                  couponId={id}
                  control={form.control}
                  name="users"
                  isNew={id === 'new'}
                />
              </div>
            )}
          </ContentWrapper>
        </form>
      </Form>
    </div>
  );
}
