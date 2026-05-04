import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CustomHeader from '@/components/headers/custom-header';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useController, useFieldArray, useForm, type Control, type Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import FormInputMultipleLanguages from '@/components/common/form-input-multiple-languages';
import FormTextEditorMultipleLanguages from '@/components/common/form-text-editor-multiple-languages';
import {
  pushNotificationSchema,
  type NotificationCouponSchemaProps,
  type PushNotificationSchemaProps
} from '@/lib/schema/push-notification-schema';
import FormInput from '@/components/common/form-input';
import { Uploader } from '@/components/common/uploader';
import TargetUsersForm from '@/components/common/target-users-form-v2';
import { useAnnouncementMutation, type payload } from '@/hooks/mutations/use-announcement-mutation';
import ContentWrapper from '@/components/common/content-wrapper';
import useCategoryNamesQuery from '@/hooks/query/use-category-name-query';
import { useEffect, useMemo, useRef, useState } from 'react';
import FormDateRangePicker from '@/components/common/form-date-range';
import CategoryAndProductSelectionV2 from '@/components/common/category-and-product-selection-v2';
import useAnnouncementPageUrlQuery from '@/hooks/query/use-announcement-page-urls-query';
import NotificationCustomDataSelection from '@/components/common/notification-custom-data-selection';
import { AnnouncementType, PageUrlTypes, ScheduleType, UserType } from '@/constants/constants';
import { useCouponListSummaryQuery } from '@/hooks/query/use-coupon-query';
import { Delete02Icon } from 'hugeicons-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { AlertDialogCancel } from '@radix-ui/react-alert-dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { DateTimePicker } from '@/components/common/date-time-picker';
import useBannerQuery from '@/hooks/query/use-banner-query';
import { useParams } from 'react-router';
import useAnnouncementDetailQuery from '@/hooks/query/use-announcement-detail-query';
import FormCustomSelect from '@/components/common/form-custom-select';

export default function NewPushNotification() {
  const { id: tempId } = useParams<{ id: string }>();

  const ids = tempId?.split('-') || [];
  const assign = ids.length > 1 ? ids[1] : null;

  const id = tempId === 'new' ? 'new' : ids.length > 1 ? ids[0] : tempId;

  // const isEdit= useMemo(() => id !== 'new', [id]);
  const isResend = useMemo(() => assign === 'resend', [assign]);
  // console.log('isResend: ', isResend);

  const { mutate, isPending } = useAnnouncementMutation();
  const { data: couponData } = useCouponListSummaryQuery();
  const { data: announcementDetail, isPending: isPendingAnnouncement } = useAnnouncementDetailQuery(
    id || ''
  );
  const { data: categoryData, isPending: isCategoryPending } = useCategoryNamesQuery(true, true);
  const { data: pageUrls, isPending: isPageUrlsPending } = useAnnouncementPageUrlQuery('GENERAL');
  const { data: bCombos, isPending: isBComboPending } = useBannerQuery('PRODUCT-BUNDLE', '1');
  const { data: banners, isPending: isBannerPending } = useBannerQuery('HOME-BANNER', '1');

  let defaultValues: PushNotificationSchemaProps = {
    name: 'Guest Day 1',
    title: {
      en: '$5 free + 50% off your first bFamily booking!',
      km: 'ទទួលបាន$5 ឥតគិតថ្លៃ + បញ្ចុះតម្លៃ 50% សម្រាប់ការកក់ bFamily ដំបូងរបស់អ្នក!',
      vi: 'Nhận $5 miễn phí + 50% cho lần đặt bFamily đầu tiên!',
      tw: '首次使用 bFamily 享有 $5 免費額度 + 50% 折扣！',
      cn: '首次使用 bFamily 立享 $5 免费 + 50% 折扣！'
    },
    description: {
      en: 'Register now to claim $5 credit and enjoy 50% off with our bFamily promo code. Book your first service today!',
      km: 'ចុះឈ្មោះឥឡូវនេះ ដើម្បីទទួលបានទឹកប្រាក់ $5 និងរីករាយនឹងបញ្ចុះតម្លៃ 50% ជាមួយប្រូម៉ូកូដ bFamily របស់យើង។ កក់សេវាកម្មដំបូងរបស់អ្នកថ្ងៃនេះ!',
      vi: 'Đăng ký ngay để nhận $5 tín dụng và hưởng ưu đãi 50% với mã bFamily. Đặt dịch vụ đầu tiên của bạn hôm nay!',
      tw: '立即註冊即可領取 $5 額度，並使用 bFamily 優惠碼享 50% 折扣。馬上預約您的首次服務！',
      cn: '立即注册领取 $5 额度，并使用 bFamily 优惠码享受 50% 折扣。马上预订您的首次服务！'
    },
    detail: {
      en: '<p><b><strong style="white-space: pre-wrap;">$5 free + 50% off your first bFamily booking!</strong></b></p><p></p><p><span style="white-space: pre-wrap;">Register now to claim $5 credit and enjoy 50% off with our bFamily promo code. Book your first service today!</span></p>',
      km: '<p><b><strong style="white-space: pre-wrap;">ទទួលបាន$5 ឥតគិតថ្លៃ + បញ្ចុះតម្លៃ 50% សម្រាប់ការកក់ bFamily ដំបូងរបស់អ្នក!</strong></b></p><p></p><p><span style="white-space: pre-wrap;">ចុះឈ្មោះឥឡូវនេះ ដើម្បីទទួលបានទឹកប្រាក់ $5 និងរីករាយនឹងបញ្ចុះតម្លៃ 50% ជាមួយប្រូម៉ូកូដ bFamily របស់យើង។ កក់សេវាកម្មដំបូងរបស់អ្នកថ្ងៃនេះ!</span></p>',
      vi: '<p><b><strong style="white-space: pre-wrap;">Nhận $5 miễn phí + 50% cho lần đặt bFamily đầu tiên!</strong></b></p><p></p><p><span style="white-space: pre-wrap;">Đăng ký ngay để nhận $5 tín dụng và hưởng ưu đãi 50% với mã bFamily. Đặt dịch vụ đầu tiên của bạn hôm nay!</span></p>',
      tw: '<p><b><strong style="white-space: pre-wrap;">首次使用 bFamily 享有 $5 免費額度 + 50% 折扣！</strong></b></p><p></p><p><span style="white-space: pre-wrap;">立即註冊即可領取 $5 額度，並使用 bFamily 優惠碼享 50% 折扣。馬上預約您的首次服務！</span></p>',
      cn: '<p><b><strong style="white-space: pre-wrap;">首次使用 bFamily 立享 $5 免费 + 50% 折扣！</strong></b></p><p></p><p><span style="white-space: pre-wrap;">立即注册领取 $5 额度，并使用 bFamily 优惠码享受 50% 折扣。马上预订您的首次服务！</span></p>'
    },
    bannerCn: undefined,
    bannerEn: undefined,
    bannerKm: undefined,
    bannerTw: undefined,
    bannerVi: undefined,
    type: 'GENERAL',
    // topics: ['user_type_all'],
    topics: {
      id: '1',
      userType: 'user_type_guest',
      gender: undefined,
      age: undefined
    },
    selectedCategories: [],
    selectedProducts: [],
    selectedOptions: [],
    dateRange: { from: undefined, to: undefined },
    scheduleType: ScheduleType.now,
    timeOffset: 0,
    sentAt: undefined,
    startAt: undefined,
    endAt: undefined,
    customData: { type: PageUrlTypes.announcementDetailScreen, value: undefined }
  };

  if (isResend && announcementDetail && !isPendingAnnouncement) {
    if (announcementDetail) {
      // console.log('announcementDetail: ', announcementDetail);
      let topics = {
        id: '1',
        userType: 'user_type_guest',
        gender: undefined,
        age: undefined
      };
      let selectedCategories: string[] = [];
      let selectedProducts: string[] = [];
      let selectedOptions: string[] = [];
      let coupons: NotificationCouponSchemaProps[] | undefined = undefined;
      let dateRange: { from?: Date; to?: Date } = { from: undefined, to: undefined };

      if (announcementDetail.topics) {
        announcementDetail.topics.map((tp) => {
          topics = {
            ...topics,
            [tp.groupId.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase())]: tp.topic
          };
          if (tp.announcementTopics) {
            if (tp.announcementTopics.categoryIds && selectedCategories.length == 0) {
              selectedCategories = tp.announcementTopics.categoryIds;
            }
            if (tp.announcementTopics.productIds && selectedProducts.length == 0) {
              selectedProducts = tp.announcementTopics.productIds;
            }
            if (tp.announcementTopics.optionIds && selectedOptions.length == 0) {
              selectedOptions = tp.announcementTopics.optionIds;
            }
            if (tp.announcementTopics.coupons && !coupons) {
              coupons = tp.announcementTopics.coupons.map((c) => ({
                id: c.id,
                price: +c.price,
                qty: +c.qty
              }));
            }
            if (
              tp.announcementTopics.startDate &&
              tp.announcementTopics.endDate &&
              !dateRange.from &&
              !dateRange.to
            ) {
              dateRange = {
                from: new Date(tp.announcementTopics.startDate),
                to: new Date(tp.announcementTopics.endDate)
              };
            }
          }
        });
      }
      // console.log('coupon data: ', data);
      defaultValues = {
        name: announcementDetail.name,
        title: {
          en: announcementDetail.titleEn,
          km: announcementDetail.titleKm,
          vi: announcementDetail.titleVi,
          tw: announcementDetail.titleTw,
          cn: announcementDetail.titleCn
        },
        description: {
          en: announcementDetail.contentEn,
          km: announcementDetail.contentKm,
          vi: announcementDetail.contentVi,
          tw: announcementDetail.contentTw,
          cn: announcementDetail.contentCn
        },
        detail: {
          en: announcementDetail.detailEn,
          km: announcementDetail.detailKm,
          vi: announcementDetail.detailVi,
          tw: announcementDetail.detailTw,
          cn: announcementDetail.detailCn
        },
        bannerCn: undefined,
        bannerEn: undefined,
        bannerKm: undefined,
        bannerTw: undefined,
        bannerVi: undefined,
        type: announcementDetail.type,
        topics,
        selectedCategories,
        selectedProducts,
        selectedOptions,
        dateRange,
        scheduleType: announcementDetail.scheduleType,
        timeOffset: announcementDetail.timeOffset,
        sentAt: new Date(announcementDetail.sentAt),
        startAt: undefined,
        endAt: undefined,
        customData: announcementDetail.customData,
        coupons
      };
    }
  }

  if (isResend && isPendingAnnouncement) return null;

  if (isCategoryPending || isPageUrlsPending || isBComboPending || isBannerPending) {
    return null;
  }

  return (
    <PushNotificationForm
      {...{
        defaultValues,
        mutate,
        isPending,
        isPageUrlsPending,
        isBComboPending,
        isBannerPending,
        isCategoryPending,
        pageUrls,
        couponData,
        categoryData,
        bCombos,
        banners
      }}
    />
  );
}

function PushNotificationForm({
  defaultValues,
  mutate,
  isPending,
  isPageUrlsPending,
  isBComboPending,
  isBannerPending,
  isCategoryPending,
  pageUrls,
  couponData,
  categoryData,
  bCombos,
  banners
}: {
  defaultValues: PushNotificationSchemaProps;
  mutate: (values: payload) => void;
  isPending: boolean;
  isPageUrlsPending: boolean;
  isBComboPending: boolean;
  isBannerPending: boolean;
  isCategoryPending: boolean;
  pageUrls?: PageUrl[];
  couponData?: CouponAttributes[];
  categoryData?: CategoryAttributes[];
  bCombos?: BannerProps[];
  banners?: BannerProps[];
  // bCombos?: BannerProps[];
  // banners?: BannerProps[];
}) {
  const { t } = useTranslation();

  const form = useForm<PushNotificationSchemaProps>({
    mode: 'onSubmit',
    resolver: zodResolver(pushNotificationSchema),
    defaultValues
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'coupons'
  });

  const { field: productsField } = useController({
    control: form.control,
    name: 'selectedProducts'
  });
  const { field: optionsField } = useController({ control: form.control, name: 'selectedOptions' });

  const watchUserType = form.watch('topics.userType');
  const watchType = form.watch('type');
  const watchCustomData = form.watch('customData');
  const watchScheduleType = form.watch('scheduleType');
  console.log('watchCustomData: ', watchCustomData);
  const { ref: titleNameRef, isNarrow: isTitleNameNarrow } = useContainerNarrow(500);
  const { ref: typePageUrlRef, isNarrow: isTypePageUrlNarrow } = useContainerNarrow(500);
  const { ref: bannersRef, isNarrow: isBannersNarrow } = useContainerNarrow(480);
  const { ref: couponsRef, isNarrow: isCouponsNarrow } = useContainerNarrow(480);

  const onSubmit = async (values: PushNotificationSchemaProps) => {
    // console.log('onSubmit: ', values);

    let customData = values.customData;
    switch (values.customData.type) {
      case PageUrlTypes.bookingScreen:
      case PageUrlTypes.bComboScreen:
      case PageUrlTypes.bannerScreen:
      case PageUrlTypes.browser:
        if (!values.customData.value) {
          form.setError('customData.value', {
            type: 'manual',
            message: 'This field is required'
          });
          return;
        }
        break;

      case PageUrlTypes.announcementDetailScreen:
        customData = { type: PageUrlTypes.announcementDetailScreen, value: undefined };
        break;

      default:
        break;
    }

    let triggerBase;
    let timeOffset = values.timeOffset !== undefined ? `+${values.timeOffset} DAYS` : undefined;
    switch (values.scheduleType) {
      case ScheduleType.event:
        // dateRange = { from: undefined, to: undefined };
        switch (values.topics.userType) {
          case 'user_type_user':
            triggerBase = 'REGISTRATION';
            break;

          case 'user_type_customer':
            triggerBase = 'LAST_BOOKING';
            break;

          default:
            break;
        }
        break;

      default:
        timeOffset = undefined;
        break;
    }

    const topicsConverted: string[] = [];
    topicsConverted.push(values.topics.userType || '');
    if (values.topics.gender) topicsConverted.push(values.topics.gender || '');
    if (values.topics.age) topicsConverted.push(values.topics.age || '');

    const preparePayload = {
      type: values.type,
      name: values.name,
      bannerCn: values.bannerCn,
      bannerEn: values.bannerEn,
      bannerKm: values.bannerKm,
      bannerTw: values.bannerTw,
      bannerVi: values.bannerVi,
      titleEn: values.title.en,
      titleKm: values.title.km,
      titleVi: values.title.vi,
      titleTw: values.title.tw,
      titleCn: values.title.cn,
      contentEn: values.description.en,
      contentKm: values.description.km,
      contentVi: values.description.vi,
      contentTw: values.description.tw,
      contentCn: values.description.cn,
      detailEn: values.detail.en,
      detailKm: values.detail.km,
      detailVi: values.detail.vi,
      detailTw: values.detail.tw,
      detailCn: values.detail.cn,

      dateRange: values.dateRange,
      topics: topicsConverted,
      categoryIds: values.selectedCategories,
      productIds: values.selectedProducts,
      optionIds: values.selectedOptions,
      customData,
      scheduleType: values.scheduleType,
      triggerBase,
      timeOffset,
      sentAt: values.sentAt,
      coupons: values.coupons
    };
    // console.log('preparePayload: ', preparePayload);
    mutate(preparePayload);
  };

  console.log('form.formState: ', form.formState);

  useEffect(() => {
    if (form.formState.isDirty) {
      switch (watchUserType) {
        case UserType.user_type_all:
          form.resetField('selectedCategories');
          form.resetField('selectedProducts');
          form.resetField('selectedOptions');
          form.resetField('dateRange');

          form.resetField('type');
          if (watchScheduleType === ScheduleType.event) {
            form.resetField('scheduleType');
          }
          break;

        case UserType.user_type_guest:
          form.resetField('topics.gender');
          form.resetField('topics.age');

          form.resetField('selectedCategories');
          form.resetField('selectedProducts');
          form.resetField('selectedOptions');
          form.resetField('dateRange');

          form.resetField('type');
          if (watchScheduleType === ScheduleType.event) {
            form.resetField('scheduleType');
          }
          break;

        case UserType.user_type_customer:
        case UserType.user_type_user:
          form.resetField('dateRange');
          break;

        default:
          break;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchUserType]);

  useEffect(() => {
    if (form.formState.isDirty) {
      form.setValue('customData.value', '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchCustomData.type]);

  useEffect(() => {
    if (form.formState.isDirty) {
      switch (watchType) {
        case 'GENERAL':
          form.resetField('coupons');
          break;

        case 'PACKAGE_DEAL':
          form.setValue('customData.type', PageUrlTypes.announcementDetailScreen);
          form.setValue('customData.value', '');
          break;

        default:
          break;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchType]);

  useEffect(() => {
    if (form.formState.isDirty) {
      form.resetField('timeOffset');
      form.resetField('dateRange');
      form.resetField('sentAt');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchScheduleType]);

  return (
    <div>
      <CustomHeader
        isLoading={isPending}
        buttonText="send"
        onSave={form.handleSubmit(onSubmit, (error) => console.log({ error }))}
      />

      <Form {...form}>
        <form>
          <ContentWrapper className="flex flex-col md:flex-row items-start gap-6 p-6">
            <div className="flex flex-col w-full gap-6">
              <Card className="w-full">
                <CardHeader className="gap-4">
                  <CardTitle>{t('productPage.details')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div
                    ref={titleNameRef}
                    className={`flex w-full gap-4 ${isTitleNameNarrow ? 'flex-col' : 'flex-col md:flex-row'}`}
                  >
                    <FormInputMultipleLanguages
                      form={form}
                      name="title"
                      label="Title"
                      placeholder="Title"
                    />
                    <FormInput placeholder="Name" label="Name" control={form.control} name="name" />
                  </div>
                  <div
                    ref={typePageUrlRef}
                    className={`grid gap-4 ${isTypePageUrlNarrow ? 'grid-cols-1' : 'grid-cols-2'}`}
                  >
                    <FormCustomSelect
                      control={form.control}
                      name="type"
                      label="Notification Type"
                      disabled={watchUserType === UserType.user_type_guest}
                      data={[
                        { label: 'General Announcement', value: 'GENERAL' },
                        { label: 'Package Deals', value: 'PACKAGE_DEAL' }
                      ]}
                      placeholder=""
                    />
                    <FormCustomSelect
                      control={form.control}
                      name="customData.type"
                      label="Page Url"
                      disabled={isPageUrlsPending || watchType === 'PACKAGE_DEAL'}
                      data={
                        pageUrls?.map((pu) => ({
                          label: pu.label,
                          value: pu.key
                        })) || []
                      }
                      placeholder=""
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="customData.value"
                    render={({ field }) => (
                      <NotificationCustomDataSelection
                        watchCustomDataType={watchCustomData.type}
                        categoryData={categoryData || []}
                        isPageUrlsPending={isPageUrlsPending}
                        bCombos={bCombos || []}
                        isBComboPending={isBComboPending}
                        isBannerPending={isBannerPending}
                        banners={banners || []}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />

                  <FormInputMultipleLanguages
                    form={form}
                    name="description"
                    label="Description"
                    placeholder="Description"
                    isTextArea
                  />

                  <FormTextEditorMultipleLanguages
                    form={form}
                    name="detail"
                    label="Detail"
                    placeholder="Detail"
                  />
                  <div
                    ref={bannersRef}
                    className={`grid gap-4 ${isBannersNarrow ? 'grid-cols-1' : 'grid-cols-3'}`}
                  >
                    <ImageUpload label="Banner En" control={form.control} name="bannerEn" />
                    <ImageUpload label="Banner Km" control={form.control} name="bannerKm" />
                    <ImageUpload label="Banner Vi" control={form.control} name="bannerVi" />
                    <ImageUpload label="Banner Cn" control={form.control} name="bannerCn" />
                    <ImageUpload label="Banner Tw" control={form.control} name="bannerTw" />
                  </div>
                </CardContent>
              </Card>

              <TargetUsersForm control={form.control} userType={watchUserType} />

              {watchType === AnnouncementType.packageDeal && (
                <Card className="w-full">
                  <CardHeader className="gap-4">
                    <CardTitle>Add Coupon</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div ref={couponsRef} className="col-span-3 border rounded-sm space-y-4">
                      <div
                        className={`bg-muted p-3 grid ${isCouponsNarrow ? 'grid-cols-1' : 'grid-cols-3'}`}
                      >
                        <span>Coupon</span>
                        <span>Quantity</span>
                        <span>Price</span>
                      </div>
                      {fields.map((field, index) => (
                        <div
                          key={field.id}
                          className={`px-3 grid ${isCouponsNarrow ? 'grid-cols-1' : 'grid-cols-3'} ${isCouponsNarrow ? 'space-y-4' : 'space-x-4'}`}
                        >
                          <FormCustomSelect
                            control={form.control}
                            name={`coupons.${index}.id`}
                            data={(couponData || []).map((item) => ({
                              label: item.name,
                              value: `${item.id}`
                            }))}
                            placeholder="Select Coupon"
                          />

                          <FormInput
                            displayMessage={false}
                            control={form.control}
                            name={`coupons.${index}.qty`}
                            placeholder="Quantity"
                            type="decimal"
                          />

                          <div className="flex flex-1 items-center gap-4">
                            <div className="w-full">
                              <FormInput
                                displayMessage={false}
                                control={form.control}
                                name={`coupons.${index}.price`}
                                placeholder="Price"
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
                        onClick={() => append({ id: '', qty: 0, price: 0 })}
                      >
                        <Plus />
                        Add coupon
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="w-full md:max-w-[320px] space-y-4">
              <Card>
                <CardContent>
                  <FormLabel className="font-bold mb-6">Scheduling</FormLabel>
                  <div className="grid grid-cols-1 gap-4">
                    <FormCustomSelect
                      control={form.control}
                      name="scheduleType"
                      label="Send to eligible users"
                      data={[
                        { label: 'Now', value: ScheduleType.now },
                        { label: 'Scheduled', value: ScheduleType.schedule },
                        {
                          label: 'Event Triggered',
                          value: ScheduleType.event,
                          disabled:
                            watchUserType === UserType.user_type_guest ||
                            watchUserType === UserType.user_type_all
                        }
                      ]}
                      placeholder=""
                    />
                    {watchScheduleType === ScheduleType.schedule && (
                      <FormField
                        control={form.control}
                        name="sentAt"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Date</FormLabel>
                            <DateTimePicker
                              title="Schedule Date"
                              buttonText="Apply"
                              haveIcon
                              date={field.value}
                              onChange={field.onChange}
                              serviceTime={false}
                              disabledPast
                            />
                            {/* <FormMessage /> */}
                          </FormItem>
                        )}
                      />
                    )}
                    {watchScheduleType === ScheduleType.event &&
                      (watchUserType === UserType.user_type_user ||
                        watchUserType === UserType.user_type_customer) && (
                        <FormInput
                          control={form.control}
                          name="timeOffset"
                          label={
                            watchUserType === UserType.user_type_user
                              ? 'Day after signup'
                              : 'Day after last booking'
                          }
                          placeholder=""
                          type="decimal"
                        />
                      )}
                  </div>
                </CardContent>
              </Card>
              {(watchUserType === UserType.user_type_user ||
                watchUserType === UserType.user_type_customer) && (
                <Card>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="selectedCategories"
                      render={({ field: { value, onChange } }) => (
                        <FormItem>
                          <FormLabel className="font-bold">
                            {watchUserType === 'user_type_user'
                              ? 'Preferred Service'
                              : watchUserType === 'user_type_customer'
                                ? 'Service Usage'
                                : 'Preferred Service/Service Usage'}
                          </FormLabel>
                          <CategoryAndProductSelectionV2
                            disabled={false}
                            categoryIds={value}
                            productIds={productsField.value}
                            optionIds={optionsField.value}
                            onCategoryIdsChange={onChange}
                            onProductIdsChange={productsField.onChange}
                            onOptionIdsChange={optionsField.onChange}
                            categoryNames={categoryData}
                            isPending={isCategoryPending}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              )}
              {watchScheduleType !== ScheduleType.event &&
                (watchUserType === UserType.user_type_user ||
                  watchUserType === UserType.user_type_customer) && (
                  <Card>
                    <CardContent>
                      <FormLabel className="font-bold mb-4">
                        {watchUserType !== 'user_type_user' ? 'Booking History' : 'Register Date'}
                      </FormLabel>
                      <FormDateRangePicker control={form.control} name="dateRange" />
                    </CardContent>
                  </Card>
                )}
            </div>
          </ContentWrapper>
        </form>
      </Form>
    </div>
  );
}

function useContainerNarrow(threshold = 500) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isNarrow, setIsNarrow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => setIsNarrow(el.clientWidth < threshold);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [threshold]);

  return { ref, isNarrow } as const;
}

type Props = {
  label: string;
  control: Control<PushNotificationSchemaProps>;
  name: Path<PushNotificationSchemaProps>;
};

const ImageUpload = ({ label, control, name }: Props) => {
  return (
    <div className="aspect-square">
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <div className="space-y-2">
            <div>{label}</div>
            <div className="overflow-hidden rounded-lg shadow-sm aspect-square">
              {field.value ? (
                <img
                  src={URL.createObjectURL(field.value as never)}
                  alt={label}
                  className="object-cover w-full h-full"
                />
              ) : (
                <Uploader
                  className="aspect-square"
                  multiple={false}
                  onUploaded={(files) => field.onChange(files[0])}
                />
              )}
            </div>
          </div>
        )}
      />
    </div>
  );
};
