import PersonalInfo from '@/components/common/personal-info';
import AddressInterface from '@/components/common/address';
import DateTimePicker from '@/components/common/schedule';
import ServiceCheckout from '@/components/common/service-checkout';
import ServicePairCheckout from '@/components/common/service-pair-checkout';
import ServicePreview from '@/components/common/service-preview';
import ServicePreviewSheet from '@/components/common/service-preview-sheet';
import AdditionalInfo from '@/components/common/additional-info';
import Coupon from '@/components/common/coupon';
import { OrderPayment } from '@/components/common/order-payment';
import TotalPriceButton from '@/components/common/total-price-button';
import type { SelectedService } from '@/hooks/use-checkout-state';
import type { CouponResponse, OrderPreviewResponse, PairProduct, PairProductOption } from '@/types/api';
import { useTranslation } from 'react-i18next';

interface CustomerInfo {
  customerFirstName: string;
  customerLastName: string;
  customerPhone: string;
  customerEmail: string;
}

interface ScheduleData {
  date: Date | null;
  time?: string;
}

interface CheckoutContentProps {
  servicePairAddons: OrderPreviewResponse | undefined;
  pairProductObj: Record<string, PairProduct[]>;
  pairProductKeys: string[];
  productId: string | undefined;
  serviceId: string | undefined;
  selectedServices: SelectedService[];
  setSelectedServices: React.Dispatch<React.SetStateAction<SelectedService[]>>;
  scheduleData: ScheduleData;
  setScheduleData: React.Dispatch<React.SetStateAction<ScheduleData>>;
  selectedAddress: string | undefined;
  note: string;
  customerInfo: CustomerInfo;
  onCustomerUpdate: (data: CustomerInfo) => void;
  onNextClick: () => void;
  openSheet: boolean;
  setOpenSheet: React.Dispatch<React.SetStateAction<boolean>>;
  activePairId: string | null;
  setActivePairId: React.Dispatch<React.SetStateAction<string | null>>;
  isCreatingOrder: boolean;
  isPending: boolean;
  calculateServiceTotal: () => number;
  formatCurrency: (amount?: number) => string;
  openEditSheet?: boolean;
  onEditSheetClose?: () => void;
  onCouponApplied?: (code: string | undefined) => void;
}

export default function CheckoutContent({
  servicePairAddons,
  pairProductObj,
  pairProductKeys,
  selectedServices,
  setSelectedServices,
  scheduleData,
  setScheduleData,
  selectedAddress,
  note,
  onCustomerUpdate,
  onNextClick,
  openSheet,
  setOpenSheet,
  activePairId,
  setActivePairId,
  isCreatingOrder,
  isPending,
  calculateServiceTotal,
  formatCurrency,
  openEditSheet,
  onEditSheetClose,
  onCouponApplied
}: CheckoutContentProps) {
  const { t } = useTranslation();

  const handleServicePreviewClick = (pairId: string) => {
    setActivePairId(pairId);
    setOpenSheet(true);
  };

  const handleConfirmPairOption = (
    option: PairProductOption,
    quantity: number,
    categoryProductId: string
  ) => {
    setSelectedServices((prev) => {
      let updated: SelectedService[];
      const exists = prev.find((s) => s.id === option.id);
      if (exists) {
        updated = prev.map((s) =>
          s.id === option.id ? { ...s, qty: (s.qty ?? 0) + quantity } : s
        );
      } else {
        updated = [
          ...prev,
          {
            id: option.id,
            productId: categoryProductId,
            qty: quantity,
            amount: option.amount,
            nameEn: option.nameEn ?? undefined,
            nameKm: option.nameKm ?? undefined
          }
        ];
      }
      localStorage.setItem('selectedServices', JSON.stringify(updated));
      return updated;
    });
    setOpenSheet(false);
    setActivePairId(null);
  };

  const handleCouponApplied = (couponData: CouponResponse) => {
    onCouponApplied?.(couponData.isValid ? couponData.code : undefined);
  };

  return (
    <>
      <div className="bg-white p-4">
        <PersonalInfo
          onCustomerUpdate={onCustomerUpdate}
          openEditSheet={openEditSheet}
          onEditSheetClose={onEditSheetClose}
        />
      </div>

      <div className="bg-white p-4 mt-4">
        <AddressInterface />
      </div>

      <div className="bg-white mt-4">
        <DateTimePicker
          onSubmit={({ date, time }) => {
            setScheduleData({ date, time });
          }}
        />
      </div>

      <div className="bg-white p-4 mt-4">
        <h1 className="text-base font-bold mb-4">{t('checkout.yourBooking')}</h1>

        {servicePairAddons?.line && (
          <ServiceCheckout
            product={servicePairAddons.line}
            quantity={servicePairAddons.line.qty}
            addOns={servicePairAddons.addOns ?? []}
          />
        )}

        <div className="mt-4">
          {selectedServices?.map((pair) => {
            return (
              <ServicePairCheckout
                pairImage={pairProductObj[pair.productId]?.[0]?.thumbnailUrl ?? ''}
                key={pair.id}
                service={pair}
                quantity={pair.qty || 1}
              />
            );
          })}
        </div>
      </div>

      <div className="bg-white p-4">
        <p className="text-black font-semibold">{t('checkout.oftenPairedWith')}</p>
        <div className="overflow-x-auto whitespace-nowrap py-2 scroll-smooth">
          <div className="flex space-x-4">
            {pairProductKeys?.map((id) => (
              <ServicePreview
                key={id}
                data={pairProductObj[id][0]}
                showPlusIcon={true}
                onClick={() => handleServicePreviewClick(id)}
              />
            ))}

            <ServicePreviewSheet
              open={openSheet}
              onOpenChange={setOpenSheet}
              onConfirm={handleConfirmPairOption}
              pairProductObj={pairProductObj}
              pairProductKeys={pairProductKeys}
              activePairId={activePairId}
            />
          </div>
        </div>
      </div>

      <div className="bg-white mt-4">
        <Coupon onCouponApplied={handleCouponApplied} />
      </div>

      <div className="space-y-4 mt-4">
        <AdditionalInfo defaultValue={note} />
      </div>

      <div className="mb-7">
        {servicePairAddons && <OrderPayment payment={servicePairAddons} />}
      </div>

      <div className="px-6 mt-6">
        <TotalPriceButton
          totalPrice={formatCurrency(servicePairAddons?.totalPayableAmount)}
          originalPrice={formatCurrency(calculateServiceTotal())}
          buttonText={isCreatingOrder ? t('checkout.creatingOrder') : t('checkout.next')}
          disabled={!scheduleData.date || !selectedAddress || isCreatingOrder || isPending}
          showPriceSection={true}
          onClick={onNextClick}
        />
      </div>
    </>
  );
}
