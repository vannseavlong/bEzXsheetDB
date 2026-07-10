import PersonalInfo from '@/components/common/personal-info';
import AddressInterface from '@/components/common/address';
import DateTimePicker from '@/components/common/schedule';
import ServiceCheckout from '@/components/common/service-checkout';
import ServicePairCheckout from '@/components/common/service-pair-checkout';
import ServicePreview from '@/components/common/service-preview';
import ServicePreviewSheet from '@/components/common/service-preview-sheet';
import AdditionalInfo from '@/components/common/additional-info';
import { OrderPayment } from '@/components/common/order-payment';
import TotalPriceButton from '@/components/common/total-price-button';
import useProductDetailQuery from '@/hooks/use-product-detail-query';
import type { SelectedService } from '@/hooks/use-checkout-state';
import type {
  ProductOptionDetail,
  OrderPreviewResponse,
  pairProduct,
  ProductOptionV2
} from '@/types/api';
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
  productData: ProductOptionDetail[] | undefined;
  servicePairAddons: OrderPreviewResponse | undefined;
  pairProductObj: Record<string, pairProduct[]>;
  pairProductKeys: string[];
  productQuantity: number;
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
}

export default function CheckoutContent({
  productData,
  servicePairAddons,
  pairProductObj,
  pairProductKeys,
  productQuantity,
  productId,
  serviceId,
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
  onEditSheetClose
}: CheckoutContentProps) {
  const { t } = useTranslation();
  const { data: selectedAddonData } = useProductDetailQuery(activePairId ?? '');

  const handleServicePreviewClick = (pairId: string) => {
    setActivePairId(pairId);
    setOpenSheet(true);
  };

  const handleAddAddon = (addon: ProductOptionV2, quantity: number) => {
    setSelectedServices((prev) => {
      let updated: SelectedService[];
      const exists = prev.find((s) => s.id === addon.id);
      if (exists) {
        if (quantity > 0) {
          updated = prev.map((s) =>
            s.id === addon.id ? { ...s, qty: (s.qty ?? 0) + quantity } : s
          );
        } else {
          updated = prev.filter((s) => s.id !== addon.id);
        }
      } else {
        updated = [...prev, { ...addon, qty: quantity }];
      }
      localStorage.setItem('selectedServices', JSON.stringify(updated));
      return updated;
    });
    setOpenSheet(false);
    setActivePairId(null);
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

        {productData
          ?.filter(
            (service) => service.id.toString() === productId || service.id.toString() === serviceId
          )
          .map((service) => {
            const addOnQty = selectedServices
              .filter((s) => s.id === service.id)
              .reduce((sum, s) => sum + (s.qty ?? 0), 0);
            return (
              <ServiceCheckout
                key={service.id}
                product={service}
                quantity={productQuantity + addOnQty}
                addOns={servicePairAddons?.productAddOn ?? []}
              />
            );
          })}

        <div className="mt-4">
          {selectedServices
            ?.filter((pair) => pair.id.toString() !== productId && pair.id.toString() !== serviceId)
            .map((pair) => {
              return (
                <ServicePairCheckout
                  pairImage={pairProductObj[pair.productId?.toString() ?? '']?.[0]?.iconUrl || ''}
                  key={`${pair.id}`}
                  service={pair as ProductOptionV2}
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
              data={selectedAddonData as ProductOptionV2[]}
              open={openSheet}
              onOpenChange={setOpenSheet}
              onConfirm={handleAddAddon}
              pairProductObj={pairProductObj}
              pairProductKeys={pairProductKeys}
              activePairId={activePairId}
            />
          </div>
        </div>
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
