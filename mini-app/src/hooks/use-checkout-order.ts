import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAddressContext } from '@/context/AddressContext';
import {
  useOrderPreviewMutation,
  type OrderPreviewRequest
} from '@/hooks/use-order-preview-mutation';
import { useOrderCreateMutation } from '@/hooks/use-order-create-mutation';
import { useOrderStatusMutation } from '@/hooks/use-order-check-status-query';
import useOrderState from '@/hooks/store/use-order-state';
import useAddressQuery from '@/hooks/use-address-query';
import type { AddressAttributes, OrderPreviewResponse } from '@/types/api';
import type { OrderCreateResponse, OrderStatusResponse } from '@/types/order-create';
import { resetDateTime } from '@/components/common/schedule';
import { toast } from 'sonner';
import type { UseMutateFunction } from '@tanstack/react-query';

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

interface SelectedService {
  id: number;
  qty?: number;
  amount?: number;
  productId?: number;
  nameEn?: string;
  hourCount?: string | null;
  cleanerCount?: string | null;
  iconUrl?: string;
  [key: string]: unknown;
}

interface UseCheckoutOrderProps {
  customerInfo: CustomerInfo;
  scheduleData: ScheduleData;
  selectedServices: SelectedService[];
  note: string;
  productData: OrderPreviewResponse['pairProducts'] | undefined;
}

interface UseCheckoutOrderReturn {
  servicePairAddons: OrderPreviewResponse | undefined;
  error: Error | null;
  isPending: boolean;
  createOrderRes: OrderCreateResponse | undefined;
  isCreatingOrder: boolean;
  isCheckingStatus: boolean;
  checkOrderStatus: UseMutateFunction<
    OrderStatusResponse,
    Error,
    { bulkOrderId: string; tranId: string },
    unknown
  >;
  mutate: UseMutateFunction<OrderPreviewResponse, Error, OrderPreviewRequest, unknown>;
  handleNextClick: () => void;
  handleConfirmClick: (useDefault: boolean) => void;
}

export function useCheckoutOrder({
  customerInfo,
  scheduleData,
  selectedServices,
  note
}: UseCheckoutOrderProps): UseCheckoutOrderReturn {
  const navigate = useNavigate();
  const { productId, serviceId } = useParams<{ productId: string; serviceId: string }>();
  const { data: addressList } = useAddressQuery();
  const { selectedAddress } = useAddressContext();
  const { productQuantity, serviceAddons } = useOrderState();

  const { data: servicePairAddons, error, mutate, isPending } = useOrderPreviewMutation();

  const {
    data: createOrderRes,
    mutate: createOrder,
    isPending: isCreatingOrder
  } = useOrderCreateMutation();

  const { mutate: checkOrderStatus, isPending: isCheckingStatus } = useOrderStatusMutation({
    onSuccess: (data?: OrderStatusResponse) => {
      console.log('Order status checked:', data);
    }
  });

  // Format schedule date and time
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

  const buildOrderPayload = (paymentMethod: string, scheduleStartDate: string) => {
    const selectedAddressObj = addressList?.find(
      (addr: AddressAttributes) => addr.address === selectedAddress
    );

    return {
      paymentMethod,
      productOption: { id: parseInt(productId || serviceId || '', 10), qty: productQuantity },
      pairOptions: selectedServices.map(({ id, qty }) => ({ id, qty: qty ?? 1 })),
      productAddOns: serviceAddons.map((addon) => ({
        id: Number(addon.id),
        qty: Number(addon.qty)
      })),
      addressId: selectedAddressObj?.id ?? 0,
      address: selectedAddressObj?.address ?? '',
      floorNum: selectedAddressObj?.floorNum ?? '',
      roomNum: selectedAddressObj?.roomNum ?? '',
      scheduleStartDate,
      note: note || '',
      customerFirstName: customerInfo.customerFirstName,
      customerLastName: customerInfo.customerLastName,
      customerPhone: customerInfo.customerPhone,
      customerEmail: customerInfo.customerEmail
    };
  };

  const handleNextClick = () => {
    if (!scheduleData.date) {
      toast.error('Please select a date before proceeding.');
      return;
    }

    if (!customerInfo.customerPhone) {
      toast.error('Please provide your phone number.');
      return;
    }

    // The parent component will handle setting isAbaOpen
    // This is just for validation
  };

  const handleConfirmClick = (useDefault: boolean) => {
    const scheduleStartDate = formatScheduleDate();
    const orderPayload = buildOrderPayload('aba_mini_app', scheduleStartDate);

    console.log('Creating Order with payload:', orderPayload);

    createOrder(orderPayload, {
      onSuccess: (response) => {
        console.log('Order created:', response);
        // Import and use web-bridge-gateway
        import('web-bridge-gateway').then(({ callHandler }) => {
          callHandler('doPayment', { ...response.paymentResp, useDefault })
            .then((data) => {
              console.log('doPayment res: ', data);
            })
            .catch((err: Error) => alert(err));
        });
        resetDateTime();
      },
      onError: (error) => {
        toast.error('Failed to create order. Please try again.');
        console.error('Order creation failed:', error);
      }
    });
  };

  // Preview mutation effect
  useEffect(() => {
    if (!productQuantity) {
      navigate(-1);
      return;
    }

    const scheduleStartDate = formatScheduleDate();
    const finalPayload = buildOrderPayload('CASH', scheduleStartDate);

    console.log('Checkout Payload (Preview):', finalPayload);
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
    customerInfo,
    mutate,
    navigate,
    note,
    addressList
  ]);

  return {
    servicePairAddons,
    error: error ?? null,
    isPending,
    createOrderRes,
    isCreatingOrder,
    isCheckingStatus,
    checkOrderStatus,
    mutate,
    handleNextClick,
    handleConfirmClick
  };
}
