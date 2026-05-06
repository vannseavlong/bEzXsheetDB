import { PageUrlTypes } from '@/constants/constants';
import { FormItem, FormLabel, FormMessage } from '../ui/form';
import CustomSelect from './custom-select';
import { type CustomDataSchemaProps } from '@/lib/schema/push-notification-schema';
import { Input } from '../ui/input';

export default function NotificationCustomDataSelection({
  watchCustomDataType,
  categoryData,
  isPageUrlsPending,
  bCombos,
  isBComboPending,
  banners,
  isBannerPending,
  value,
  onChange
}: {
  watchCustomDataType: string;
  categoryData: CategoryAttributes[];
  isPageUrlsPending: boolean;
  bCombos: BannerProps[];
  isBComboPending: boolean;
  banners: BannerProps[];
  isBannerPending: boolean;
  value: CustomDataSchemaProps['value'];
  onChange: (data: CustomDataSchemaProps['value']) => void;
}) {
  // console.log('value: ', value);

  const categoryId = typeof value === 'object' ? value.categoryId?.toString() : '';
  const productId = typeof value === 'object' ? value.productId?.toString() : '';
  const bComboId = typeof value === 'object' ? '' : value;
  const bannerId = typeof value === 'object' ? '' : value;

  if (isPageUrlsPending) return <div>loading...</div>;

  switch (watchCustomDataType) {
    case PageUrlTypes.browser:
      return (
        <div className="grid grid-cols-2 gap-4">
          <FormItem>
            <FormLabel>Link URL</FormLabel>
            <Input placeholder={'Link URL'} onChange={onChange} />
            <FormMessage />
          </FormItem>
        </div>
      );

    case PageUrlTypes.bookingScreen:
      return (
        <div className="grid grid-cols-2 gap-4">
          <FormItem>
            <FormLabel>Select Category</FormLabel>
            <CustomSelect
              disabled={isPageUrlsPending}
              data={
                categoryData?.map((cat) => ({
                  label: cat.nameEn,
                  value: cat.id
                })) || []
              }
              placeholder=""
              value={categoryId}
              onValueChange={(v) => {
                if (typeof value === 'object') {
                  onChange({ ...value, categoryId: v });
                } else if (!value) {
                  onChange({ categoryId: v });
                }
              }}
            />
            <FormMessage />
          </FormItem>
          <FormItem>
            <FormLabel>Select Product</FormLabel>
            <CustomSelect
              disabled={isPageUrlsPending}
              data={
                categoryData
                  .find((cat) => cat.id === categoryId)
                  ?.products?.map((pro) => ({
                    label: pro.nameEn,
                    value: pro.id
                  })) || []
              }
              placeholder=""
              value={productId}
              onValueChange={(v) => {
                if (typeof value === 'object') {
                  onChange({ ...value, productId: v });
                } else if (!value) {
                  onChange({ productId: v });
                }
              }}
            />
            <FormMessage />
          </FormItem>
        </div>
      );

    case PageUrlTypes.bComboScreen:
      return (
        <div className="grid grid-cols-2 gap-4">
          <FormItem>
            <FormLabel>Select bCombo</FormLabel>
            <CustomSelect
              disabled={isBComboPending}
              data={
                bCombos?.map((bCombo) => ({
                  label: bCombo.titleEn ?? '',
                  value: bCombo.id.toString()
                })) || []
              }
              placeholder=""
              value={bComboId}
              onValueChange={onChange}
            />
            <FormMessage />
          </FormItem>
        </div>
      );

    case PageUrlTypes.bannerScreen:
      return (
        <div className="grid grid-cols-2 gap-4">
          <FormItem>
            <FormLabel>Select Banner</FormLabel>
            <CustomSelect
              disabled={isBannerPending}
              data={
                banners?.map((banner) => ({
                  label: banner.titleEn ?? '',
                  value: banner.id.toString()
                })) || []
              }
              placeholder=""
              value={bannerId}
              onValueChange={onChange}
            />
            <FormMessage />
          </FormItem>
        </div>
      );

    default:
      return;
  }
}
