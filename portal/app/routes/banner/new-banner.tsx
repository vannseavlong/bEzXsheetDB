import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CustomHeader from '@/components/headers/custom-header';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
import CustomSelect from '@/components/common/custom-select';
import ContentWrapper from '@/components/common/content-wrapper';
import { useTranslation } from 'react-i18next';
import FormInput from '@/components/common/form-input';
import { bannerSchema } from '@/lib/schema/banner-schema';
import type { BannerSchemaProps } from '@/lib/schema/banner-schema';
import FormInputMultipleLanguages from '@/components/common/form-input-multiple-languages';
import FormTextEditorMultipleLanguages from '@/components/common/form-text-editor-multiple-languages';
import { Uploader } from '@/components/common/uploader';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useCreateBannerMutation } from '@/hooks/mutations/use-create-banner-mutation';
import { useUpdateBannerMutation } from '@/hooks/mutations/use-update-banner-mutation';
import useBannerDetailQuery from '@/hooks/query/use-banner-detail-query';
import { toast } from 'sonner';
import { useSearchParams } from 'react-router';
import DatePicker from '@/components/common/date-picker';
import { extractBodyContent, wrapHtmlContent } from '@/lib/html-helper';
import { replaceContent } from '@/lib/banner-content-template';
import { ACTIONS, MODULES } from '@/lib/permission';
import { usePermission } from '@/hooks/use-permission';

export default function NewBanner() {
  const { t } = useTranslation();
  const { hasPermission } = usePermission();
  const canView = hasPermission(MODULES.MARKETING_BANNER, ACTIONS.VIEW);

  const [searchParams] = useSearchParams();
  const bannerIdFromQuery = searchParams.get('id');
  const bannerId = Number(bannerIdFromQuery);
  const isEditMode = !!bannerIdFromQuery && Number.isInteger(bannerId) && bannerId > 0;

  const createBannerMutation = useCreateBannerMutation();
  const updateBannerMutation = useUpdateBannerMutation();
  const { data: bannerData } = useBannerDetailQuery(bannerId, {
    enabled: isEditMode
  });

  const form = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      name: '',
      title: {
        en: '',
        km: '',
        vi: '',
        tw: '',
        cn: ''
      },
      status: 'true',
      bannerType: 'HOME-BANNER',
      hasDetail: false,
      hasTopup: false,
      content: replaceContent,
      credit: '',
      amount: '',
      startDate: undefined,
      expiredDate: undefined,
      imgUrlEn: '',
      imgUrlKm: '',
      imgUrlVi: '',
      imgUrlTw: '',
      imgUrlCn: '',
      imgDetailUrlEn: '',
      imgDetailUrlKm: '',
      imgDetailUrlVi: '',
      imgDetailUrlTw: '',
      imgDetailUrlCn: ''
    }
  });

  React.useEffect(() => {
    if (bannerData && isEditMode) {
      form.reset({
        name: bannerData.name || '',
        title: {
          en: bannerData.titleEn || '',
          km: bannerData.titleKm || '',
          vi: bannerData.titleVi || '',
          tw: bannerData.titleTw || '',
          cn: bannerData.titleCn || ''
        },
        status: bannerData.status ? 'true' : 'false',
        bannerType: bannerData.type as 'HOME-BANNER' | 'PRODUCT-BUNDLE' | 'COUPON-BANNER',
        hasDetail: bannerData.hasDetail || false,
        hasTopup: bannerData.hasTopup || false,
        content: {
          en: extractBodyContent(bannerData.contentEn || ''),
          km: extractBodyContent(bannerData.contentKm || ''),
          vi: extractBodyContent(bannerData.contentVi || ''),
          tw: extractBodyContent(bannerData.contentTw || ''),
          cn: extractBodyContent(bannerData.contentCn || '')
        },
        credit: bannerData.credit?.toString() || '',
        amount: bannerData.amount?.toString() || '',
        startDate: bannerData.startDate ? new Date(bannerData.startDate) : undefined,
        expiredDate: bannerData.expiredDate ? new Date(bannerData.expiredDate) : undefined,
        imgUrlEn: bannerData.imgUrlEn || '',
        imgUrlKm: bannerData.imgUrlKm || '',
        imgUrlVi: bannerData.imgUrlVi || '',
        imgUrlTw: bannerData.imgUrlTw || '',
        imgUrlCn: bannerData.imgUrlCn || '',
        imgDetailUrlEn: bannerData.hasDetail ? bannerData.imgDetailUrlEn || '' : '',
        imgDetailUrlKm: bannerData.hasDetail ? bannerData.imgDetailUrlKm || '' : '',
        imgDetailUrlVi: bannerData.hasDetail ? bannerData.imgDetailUrlVi || '' : '',
        imgDetailUrlTw: bannerData.hasDetail ? bannerData.imgDetailUrlTw || '' : '',
        imgDetailUrlCn: bannerData.hasDetail ? bannerData.imgDetailUrlCn || '' : ''
      } as BannerSchemaProps);
    }
  }, [bannerData, isEditMode, form]);

  const watchHasDetail = form.watch('hasDetail');
  const watchhasTopup = form.watch('hasTopup');

  const handlehasTopupChange = (checked: boolean | 'indeterminate') => {
    const isChecked = checked === true;
    form.setValue('hasTopup', isChecked, { shouldDirty: true, shouldValidate: true });

    // Top up requires detail, so enable detail whenever top up is enabled.
    if (isChecked) {
      form.setValue('hasDetail', true, { shouldDirty: true, shouldValidate: true });
    }
  };

  const handleHasDetailChange = (checked: boolean | 'indeterminate') => {
    const isChecked = checked === true;
    form.setValue('hasDetail', isChecked, { shouldDirty: true, shouldValidate: true });

    // If detail is disabled, top up must also be disabled.
    if (!isChecked) {
      form.setValue('hasTopup', false, { shouldDirty: true, shouldValidate: true });
    }
  };

  const mutation = isEditMode ? updateBannerMutation : createBannerMutation;

  const onSubmit: SubmitHandler<BannerSchemaProps> = (values) => {
    const wrappedContent = {
      en: wrapHtmlContent(values.content?.en || ''),
      km: wrapHtmlContent(values.content?.km || ''),
      vi: wrapHtmlContent(values.content?.vi || ''),
      tw: wrapHtmlContent(values.content?.tw || ''),
      cn: wrapHtmlContent(values.content?.cn || '')
    };

    const imgDetailFields = {
      imgDetailUrlEn: values.imgDetailUrlEn,
      imgDetailUrlKm: values.imgDetailUrlKm,
      imgDetailUrlVi: values.imgDetailUrlVi,
      imgDetailUrlTw: values.imgDetailUrlTw,
      imgDetailUrlCn: values.imgDetailUrlCn
    };

    const payload = { ...values, content: wrappedContent, ...imgDetailFields };

    if (isEditMode) {
      updateBannerMutation.mutate({ ...payload, id: bannerId });
    } else {
      createBannerMutation.mutate(payload);
    }
  };

  if (!canView) {
    return (
      <div className="flex flex-1 h-full items-center justify-center">
        <span className="text-muted-foreground">No Permission to View</span>
      </div>
    );
  }

  return (
    <div>
      <CustomHeader
        buttonText={isEditMode ? 'Update' : 'Save'}
        isLoading={mutation.isPending}
        onSave={form.handleSubmit(onSubmit, (error) => {
          Object.values(error).forEach((err: { message?: string }) => {
            if (err?.message) toast.error(err.message);
          });
        })}
      />

      <ContentWrapper>
        <div className="p-6 flex flex-row gap-6 items-baseline">
          <Card className="flex flex-1">
            <CardHeader className="gap-4">
              <CardTitle>{t('Details')}</CardTitle>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                    <FormInput control={form.control} name="name" label="Name" placeholder="Name" />
                    <FormInputMultipleLanguages
                      form={form}
                      name="title"
                      label="Title"
                      placeholder="Title"
                    />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-3 mt-4">
                    <FormField
                      control={form.control}
                      name="bannerType"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>{t('Banner Type')}</FormLabel>
                          <CustomSelect
                            className="h-10!"
                            placeholder={t('Select banner type')}
                            data={[
                              { label: 'Home Banner', value: 'HOME-BANNER' },
                              { label: 'Product Bundle', value: 'PRODUCT-BUNDLE' },
                              { label: 'Coupon Banner', value: 'COUPON-BANNER' }
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
                      name="status"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>{t('Status')}</FormLabel>
                          <CustomSelect
                            className="h-10!"
                            placeholder={t('Select status')}
                            data={[
                              { label: 'Active', value: 'true' },
                              { label: 'Inactive', value: 'false' }
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
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date</FormLabel>
                          <DatePicker date={field.value} onDateTimeChange={field.onChange} />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="expiredDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expired Date</FormLabel>
                          <DatePicker date={field.value} onDateTimeChange={field.onChange} />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-2 gap-x-6 gap-y-3 mt-4">
                    <FormField
                      control={form.control}
                      name="hasTopup"
                      render={({ field: { value } }) => (
                        <FormItem className="flex flex-row items-center space-x-2">
                          <Checkbox
                            id="hasTopup"
                            checked={value}
                            onCheckedChange={handlehasTopupChange}
                          />
                          <Label htmlFor="hasTopup">{t('Top Up')}</Label>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="hasDetail"
                      render={({ field: { value } }) => (
                        <FormItem className="flex flex-row items-center space-x-2">
                          <Checkbox
                            id="hasDetail"
                            checked={value}
                            onCheckedChange={handleHasDetailChange}
                          />
                          <Label htmlFor="hasDetail">{t('Detail')}</Label>
                        </FormItem>
                      )}
                    />
                  </div>

                  {watchhasTopup && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 mt-4">
                      <FormInput
                        control={form.control}
                        name="credit"
                        label={t('Credit')}
                        placeholder={t('Enter credit')}
                        type="number"
                      />
                      <FormInput
                        control={form.control}
                        name="amount"
                        label={t('Amount')}
                        placeholder={t('Enter amount')}
                        type="number"
                      />
                    </div>
                  )}

                  {watchHasDetail && (
                    <div className="mt-4">
                      <FormTextEditorMultipleLanguages
                        form={form}
                        name="content"
                        label="Content"
                        placeholder="Content"
                      />
                    </div>
                  )}

                  <div className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <ImageUpload label="Banner En" name="imgUrlEn" detailName="imgDetailUrlEn" />
                      <ImageUpload label="Banner Km" name="imgUrlKm" detailName="imgDetailUrlKm" />
                      <ImageUpload label="Banner Vi" name="imgUrlVi" detailName="imgDetailUrlVi" />
                      <ImageUpload label="Banner Cn" name="imgUrlCn" detailName="imgDetailUrlCn" />
                      <ImageUpload label="Banner Tw" name="imgUrlTw" detailName="imgDetailUrlTw" />
                    </div>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </ContentWrapper>
    </div>
  );

  type ImageUploadProps = {
    label: string;
    name: 'imgUrlEn' | 'imgUrlKm' | 'imgUrlVi' | 'imgUrlCn' | 'imgUrlTw';
    detailName:
      | 'imgDetailUrlEn'
      | 'imgDetailUrlKm'
      | 'imgDetailUrlVi'
      | 'imgDetailUrlCn'
      | 'imgDetailUrlTw';
  };

  function ImageUpload({ label, name, detailName }: ImageUploadProps) {
    const value = form.watch(name);
    const handleUpload = (file: File | string) => {
      form.setValue(name, file, { shouldDirty: true, shouldValidate: true });
      form.setValue(detailName, file, { shouldDirty: true, shouldValidate: true });
    };
    const handleRemove = () => {
      form.setValue(name, '', { shouldDirty: true, shouldValidate: true });
      form.setValue(detailName, '', { shouldDirty: true, shouldValidate: true });
    };
    return (
      <div className="aspect-square">
        <FormField
          control={form.control}
          name={name}
          render={({ fieldState }) => (
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <span>{label}</span>
                <span className="text-red-500">*</span>
              </div>
              <div className="overflow-hidden rounded-lg shadow-sm aspect-square">
                {value ? (
                  <div className="relative w-full h-full">
                    <img
                      src={value instanceof File ? URL.createObjectURL(value) : (value as string)}
                      alt={label}
                      className="object-cover w-full h-full"
                    />
                    <button
                      type="button"
                      onClick={handleRemove}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center text-sm"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <Uploader
                    className="aspect-square"
                    multiple={false}
                    onUploaded={(files) => handleUpload(files[0])}
                  />
                )}
              </div>
              {fieldState.error && (
                <p className="text-red-500 text-sm">{fieldState.error.message}</p>
              )}
            </div>
          )}
        />
      </div>
    );
  }
}
