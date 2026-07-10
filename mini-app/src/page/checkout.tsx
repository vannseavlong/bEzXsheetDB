import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { groupBy } from 'lodash-es';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { resetDateTime } from '@/components/common/schedule';
import useAddressQuery from '@/hooks/use-address-query';
import useOrderState from '@/hooks/store/use-order-state';
import { useOrderPreviewMutation } from '@/hooks/use-order-preview-mutation';
import { useOrderCreateMutation } from '@/hooks/use-order-create-mutation';
import { useAddressContext } from '@/context/AddressContext';
import { useCheckoutState } from '@/hooks/use-checkout-state';
import type { AddressAttributes, OrderCreateResponse, OrderPreviewRequest } from '@/types/api';
import CheckoutContent from './checkout-content';
import useNavigationTitle from '@/hooks/use-navigation-title';
import { useTranslation } from 'react-i18next';
import { validatePhoneNumber, validateName } from '@/lib/utils/validation';
import AppBar from '@/components/common/app-bar';

export default function Checkout() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { productId, serviceId } = useParams<{ productId: string; serviceId: string }>();

  // Set navigation bar title
  useNavigationTitle(t('checkout.checkout'));

  const { data: addressList } = useAddressQuery();
  const { selectedAddress } = useAddressContext();
  const { serviceAddons, productQuantity } = useOrderState();

  const [couponCode, setCouponCode] = useState<string | undefined>(undefined);

  // Use custom hook for state management
  const {
    customerInfo,
    scheduleData,
    setScheduleData,
    selectedServices,
    setSelectedServices,
    note,
    openSheet,
    setOpenSheet,
    activePairId,
    setActivePairId,
    handleCustomerUpdate,
    editPersonalInfoOpen,
    setEditPersonalInfoOpen
  } = useCheckoutState();

  // Order preview mutation
  const { data: servicePairAddons, error, isPending, mutate } = useOrderPreviewMutation();

  const pairProductObj = useMemo(
    () => groupBy(servicePairAddons?.pairProducts, 'categoryProductId'),
    [servicePairAddons?.pairProducts]
  );
  const pairProductKeys = Object.keys(pairProductObj);

  // Format currency helper
  const formatCurrency = (amount?: number): string => `$${(amount ?? 0).toFixed(2)}`;

  // Calculate service total (pre-fee, pre-discount subtotal for products + addons)
  const calculateServiceTotal = (): number => {
    if (!servicePairAddons) return 0;
    return (servicePairAddons.amount ?? 0) + (servicePairAddons.addOnAmount ?? 0);
  };

  // Format schedule date helper
  const formatScheduleDate = (): string => {
    if (!scheduleData.date || !scheduleData.time) return '';

    const timeMatch = scheduleData.time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!timeMatch) return '';

    let hours = parseInt(timeMatch[1], 10);
    const minutes = parseInt(timeMatch[2], 10);
    const ampm = timeMatch[3].toUpperCase();

    if (ampm === 'PM' && hours < 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;

    const dateObj = new Date(scheduleData.date);
    dateObj.setHours(hours, minutes, 0, 0);

    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const hourStr = String(dateObj.getHours()).padStart(2, '0');
    const minuteStr = String(dateObj.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hourStr}:${minuteStr}:00`;
  };

  const selectedAddressObj = addressList?.find(
    (addr: AddressAttributes) => addr.address === selectedAddress
  );

  // Build order payload (also used for /order/preview, which shares the same shape)
  const buildOrderPayload = (
    paymentMethod: string,
    scheduleStartDate: string
  ): OrderPreviewRequest | null => {
    if (!productId || !selectedAddressObj) return null;

    return {
      line: {
        categoryProductOptionId: productId,
        qty: productQuantity,
        addonItems: serviceAddons.map((addon) => ({ id: addon.id, qty: addon.qty }))
      },
      pairLines: selectedServices.map((s) => ({
        categoryProductOptionId: s.id,
        qty: s.qty ?? 1
      })),
      addressId: selectedAddressObj.id,
      scheduleStartDate,
      note: (document.getElementById('additional-info') as HTMLInputElement)?.value || note || '',
      couponCode,
      paymentMethod
    };
  };

  // Order create mutation
  const { mutate: createOrder, isPending: isCreatingOrder } = useOrderCreateMutation();

  // Handle next click — validates, then creates the order directly (no ABA/payment step for now)
  const handleNextClick = () => {
    if (!scheduleData.date) {
      toast.error(t('checkout.pleaseSelectDate'));
      return;
    }

    const firstNameResult = validateName(customerInfo.customerFirstName);
    if (!firstNameResult.isValid) {
      setEditPersonalInfoOpen(true);
      return;
    }

    const phoneResult = validatePhoneNumber(customerInfo.customerPhone);
    if (!phoneResult.isValid) {
      setEditPersonalInfoOpen(true);
      return;
    }

    const scheduleStartDate = formatScheduleDate();
    const orderPayload = buildOrderPayload('CASH', scheduleStartDate);
    if (!orderPayload) return;

    createOrder(orderPayload, {
      onSuccess: (response: OrderCreateResponse) => {
        void response;
        resetDateTime();
        toast.success(t('checkout.orderCreated'));
        navigate('/order');
      },
      onError: (error: Error) => {
        toast.error(t('checkout.failedToCreateOrder'));
        console.error('Order creation failed:', error);
      }
    });
  };

  // Preview effect
  useEffect(() => {
    if (!productQuantity) {
      navigate(-1);
      return;
    }

    // Don't fire a preview request until an address has actually been selected
    if (!selectedAddressObj) {
      return;
    }

    const scheduleStartDate = formatScheduleDate();
    const finalPayload = buildOrderPayload('CASH', scheduleStartDate);
    if (!finalPayload) return;

    mutate(finalPayload);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    productId,
    serviceId,
    selectedServices,
    serviceAddons,
    productQuantity,
    scheduleData.date,
    scheduleData.time,
    couponCode,
    mutate,
    navigate,
    selectedAddressObj
  ]);

  if (error)
    return (
      <>
        <AppBar title={t('checkout.checkout')} />
        <p className="text-red-500">{t('checkout.failedToLoadServices')}</p>
      </>
    );

  return (
    <div className="bg-muted min-h-screen pb-28">
      <AppBar title={t('checkout.checkout')} />
      {isCreatingOrder && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-lg font-medium text-white">{t('checkout.creatingOrder')}</p>
          </div>
        </div>
      )}

      <CheckoutContent
        servicePairAddons={servicePairAddons}
        pairProductObj={pairProductObj}
        pairProductKeys={pairProductKeys}
        productId={productId}
        serviceId={serviceId}
        selectedServices={selectedServices}
        setSelectedServices={setSelectedServices}
        scheduleData={scheduleData}
        setScheduleData={setScheduleData}
        selectedAddress={selectedAddress ?? undefined}
        note={note}
        customerInfo={customerInfo}
        onCustomerUpdate={handleCustomerUpdate}
        onNextClick={handleNextClick}
        openSheet={openSheet}
        setOpenSheet={setOpenSheet}
        activePairId={activePairId}
        setActivePairId={setActivePairId}
        isCreatingOrder={isCreatingOrder}
        isPending={isPending}
        calculateServiceTotal={calculateServiceTotal}
        formatCurrency={formatCurrency}
        openEditSheet={editPersonalInfoOpen}
        onEditSheetClose={() => setEditPersonalInfoOpen(false)}
        onCouponApplied={(code) => setCouponCode(code)}
      />
    </div>
  );
}
