import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CustomHeader from '@/components/headers/custom-header';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import ContentWrapper from '@/components/common/content-wrapper';
import { useTranslation } from 'react-i18next';
import FormInputMultipleLanguages from '@/components/common/form-input-multiple-languages';
import FormInput from '@/components/common/form-input';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import clsx from 'clsx';
import {
  discountPromotionSchema,
  type DiscountPromotionSchemaProps
} from '@/lib/schema/promotion-schema';
import CustomSelect from '@/components/common/custom-select';

export default function NewDiscountPromotion() {
  const { t } = useTranslation();
  const [validFromDate, setValidFromDate] = useState<Date>();
  const [validToDate, setValidToDate] = useState<Date>();

  const form = useForm<DiscountPromotionSchemaProps>({
    mode: 'onSubmit',
    resolver: zodResolver(discountPromotionSchema),
    defaultValues: {
      name: {
        en: '',
        km: '',
        vi: '',
        tw: '',
        cn: ''
      },
      appliesTo: 'Products',
      discountType: 'Amount',
      discountValue: '',
      usageLimit: '',
      perUserLimit: '',
      validFrom: '',
      validTo: '',
      eligibleServices: 'All',
      eligibleUsers: 'All'
    }
  });

  const onSubmit = async (values: DiscountPromotionSchemaProps) => {
    console.log('Form submitted with values:', values);
    // Here you would typically handle the form submission, e.g., calling an API
  };

  return (
    <div>
      <CustomHeader onSave={form.handleSubmit(onSubmit)} />
      <ContentWrapper>
        <div className="p-6">
          <Card className="w-full">
            <CardHeader className="gap-4">
              <CardTitle>{t('promotionPage.details')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6">
                    {/* First Row */}
                    <div className="space-y-2">
                      <Label htmlFor="name">{t('name')}</Label>
                      <FormInputMultipleLanguages
                        form={form}
                        name="name"
                        label=""
                        placeholder={t('Name')}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="appliesTo"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Applies To</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <CustomSelect
                              className="!h-10"
                              placeholder={t('Select Applies To')}
                              data={[
                                { label: 'Products', value: 'Products' },
                                { label: 'Services', value: 'Services' },
                                { label: 'Both', value: 'Both' }
                              ]}
                              value={field.value}
                              onValueChange={field.onChange}
                            />
                          </Select>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="discountType"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Discount Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <CustomSelect
                              className="!h-10"
                              placeholder={t('selectDiscountType')}
                              data={[
                                { label: 'Amount', value: 'Amount' },
                                { label: 'Percentage', value: 'Percentage' }
                              ]}
                              value={field.value}
                              onValueChange={field.onChange}
                            />
                          </Select>
                        </FormItem>
                      )}
                    />

                    {/* Second Row */}
                    <FormInput
                      control={form.control}
                      name="discountValue"
                      label={t('Discount Value')}
                      placeholder="DiscountValue"
                    />

                    <FormInput
                      control={form.control}
                      name="usageLimit"
                      label={t('Usage Limit')}
                      placeholder="0"
                    />

                    <FormInput
                      control={form.control}
                      name="perUserLimit"
                      label={t('Per User Limit')}
                      placeholder="0"
                    />

                    {/* Third Row */}

                    <FormField
                      control={form.control}
                      name="validFrom"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <Label>{t('Valid From')}</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={clsx(
                                    'w-full pl-3 text-left font-normal',
                                    !validFromDate && 'text-muted-foreground'
                                  )}
                                >
                                  {validFromDate ? (
                                    format(validFromDate, 'dd MMM yyyy')
                                  ) : (
                                    <span>02 July 2025</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={validFromDate}
                                onSelect={(date) => {
                                  setValidFromDate(date);
                                  field.onChange(date ? format(date, 'yyyy-MM-dd') : '');
                                }}
                                disabled={(date) =>
                                  date < new Date() || date < new Date('1900-01-01')
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="validTo"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <Label>{t('Valid To')}</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={clsx(
                                    'w-full pl-3 text-left font-normal',
                                    !validToDate && 'text-muted-foreground'
                                  )}
                                >
                                  {validToDate ? (
                                    format(validToDate, 'dd MMM yyyy')
                                  ) : (
                                    <span>03 July 2025</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={validToDate}
                                onSelect={(date) => {
                                  setValidToDate(date);
                                  field.onChange(date ? format(date, 'yyyy-MM-dd') : '');
                                }}
                                disabled={(date) =>
                                  date < new Date() || date < new Date('1900-01-01')
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </FormItem>
                      )}
                    />

                    {/* Fourth Row */}
                    <FormField
                      control={form.control}
                      name="eligibleServices"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Eligible Services</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <CustomSelect
                              className="!h-10"
                              placeholder={t('selectDiscountType')}
                              data={[
                                { label: 'All', value: 'All' },
                                { label: 'Cleaning', value: 'Cleaning' },
                                { label: 'PestControl', value: 'PestControl' }
                              ]}
                              value={field.value}
                              onValueChange={field.onChange}
                            />
                          </Select>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="eligibleUsers"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Eligible Users</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <CustomSelect
                              className="!h-10"
                              placeholder={t('selectDiscountType')}
                              data={[
                                { label: 'All', value: 'All' },
                                { label: 'New', value: 'New' },
                                { label: 'Existing', value: 'Existing' },
                                { label: 'Premium', value: 'Premium' }
                              ]}
                              value={field.value}
                              onValueChange={field.onChange}
                            />
                          </Select>
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
