import { useEffect, useMemo } from 'react';
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
import type { AddressAttributes, ProductOptionDetail } from '@/types/api';
import type { OrderCreateResponse } from '@/types/order-create';
import CheckoutContent from './checkout-content';
import useNavigationTitle from '@/hooks/use-navigation-title';
import { useTranslation } from 'react-i18next';
import { validatePhoneNumber, validateName } from '@/lib/utils/validation';

export default function Checkout() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { productId, serviceId } = useParams<{ productId: string; serviceId: string }>();

  // Set navigation bar title
  useNavigationTitle(t('checkout.checkout'));

  const { data: addressList } = useAddressQuery();
  const { selectedAddress } = useAddressContext();
  const { serviceAddons, productQuantity } = useOrderState();

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

  const productData = servicePairAddons?.productOptions;
  const pairProductObj = useMemo(
    () => groupBy(servicePairAddons?.pairProducts, 'id'),
    [servicePairAddons?.pairProducts]
  );
  const pairProductKeys = Object.keys(pairProductObj);

  // Format currency helper
  const formatCurrency = (amount?: number): string => `$${(amount ?? 0).toFixed(2)}`;

  // Calculate service total
  const calculateServiceTotal = (): number => {
    if (!productData) return 0;

    const productsAmount = productData
      .filter(
        (product: ProductOptionDetail) =>
          product.id.toString() === productId || product.id.toString() === serviceId
      )
      .reduce(
        (sum: number, product: ProductOptionDetail) =>
          sum + (product.amount ?? 0) * productQuantity,
        0
      );

    const selectedServicesAmount = selectedServices.reduce(
      (sum: number, s) => sum + (s.amount ?? 0) * (s.qty ?? 1),
      0
    );

    const serviceAddonsAmount = serviceAddons.reduce((sum: number, addon) => {
      const matchingService = selectedServices.find((s) => s.id.toString() === addon.id);
      return sum + (matchingService?.amount ?? 0) * addon.qty;
    }, 0);

    return productsAmount + selectedServicesAmount + serviceAddonsAmount;
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

  // Build order payload
  const buildOrderPayload = (paymentMethod: string, scheduleStartDate: string) => {
    const selectedAddressObj = addressList?.find(
      (addr: AddressAttributes) => addr.address === selectedAddress
    );

    return {
      paymentMethod,
      productOption: { id: parseInt(productId || serviceId || '', 10), qty: productQuantity },
      pairOptions: selectedServices.map(({ id, qty }: { id: number; qty?: number }) => ({
        id,
        qty: qty ?? 1
      })),
      productAddOns: serviceAddons.map((addon) => ({
        id: Number(addon.id),
        qty: Number(addon.qty)
      })),
      addressId: selectedAddressObj?.id ?? 0,
      address: selectedAddressObj?.address ?? '',
      floorNum: selectedAddressObj?.floorNum ?? '',
      roomNum: selectedAddressObj?.roomNum ?? '',
      scheduleStartDate,
      note: (document.getElementById('additional-info') as HTMLInputElement)?.value || note || '',
      customerFirstName: customerInfo.customerFirstName,
      customerLastName: customerInfo.customerLastName,
      customerPhone: customerInfo.customerPhone,
      customerEmail: customerInfo.customerEmail
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

    createOrder(orderPayload, {
      onSuccess: (response: OrderCreateResponse) => {
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

    const scheduleStartDate = formatScheduleDate();
    const finalPayload = buildOrderPayload('CASH', scheduleStartDate);

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
    mutate,
    navigate,
    addressList
  ]);

  if (error) return <p className="text-red-500">{t('checkout.failedToLoadServices')}</p>;

  return (
    <div className="bg-muted min-h-screen pb-28">
      {isCreatingOrder && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-lg font-medium text-white">{t('checkout.creatingOrder')}</p>
          </div>
        </div>
      )}

      <CheckoutContent
        productData={productData}
        servicePairAddons={servicePairAddons}
        pairProductObj={pairProductObj}
        pairProductKeys={pairProductKeys}
        productQuantity={productQuantity}
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
      />
    </div>
  );
}
