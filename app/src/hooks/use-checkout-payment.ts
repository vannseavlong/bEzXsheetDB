import { useEffect, useState, useRef, useCallback } from 'react';
import { useOrderStatusMutation } from '@/hooks/use-order-check-status-query';
import type { GetStatus } from '@/types/aba-bridge';
import type { PaymentSuccessSheetRef } from '@/components/common/payment-success-sheet';
import type { OrderStatusResponse } from '@/types/order-create';
import type { UseMutateFunction } from '@tanstack/react-query';
import type { PaymentDialogType } from '@/components/common/payment-status-dialog';
import { MAX_PAYMENT_RETRIES } from '@/components/common/payment-status-dialog';

interface UseCheckoutPaymentProps {
  createOrderRes: { bulkOrderId?: string } | undefined;
  paymentSheetRef: React.RefObject<PaymentSuccessSheetRef | null>;
}

interface UseCheckoutPaymentReturn {
  checkOrderStatus: UseMutateFunction<
    OrderStatusResponse,
    Error,
    { bulkOrderId: string; tranId: string },
    unknown
  >;
  isCheckingStatus: boolean;
  statusDialogOpen: boolean;
  statusDialogType: PaymentDialogType;
  retryCount: number;
  handleRetry: () => void;
  handleCloseDialog: () => void;
}

export function useCheckoutPayment({
  createOrderRes,
  paymentSheetRef
}: UseCheckoutPaymentProps): UseCheckoutPaymentReturn {
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [statusDialogType, setStatusDialogType] = useState<PaymentDialogType>('pending');
  const [retryCount, setRetryCount] = useState(0);

  // Keep a stable ref to the last {bulkOrderId, tranId} so retries can re-use it
  const lastPayloadRef = useRef<{ bulkOrderId: string; tranId: string } | null>(null);

  const { mutate: checkOrderStatus, isPending: isCheckingStatus } = useOrderStatusMutation({
    onSuccess: () => {
      setStatusDialogOpen(false);
      setRetryCount(0);
      paymentSheetRef.current?.open();
    },
    onPending: () => {
      // Payment still processing — show the pending dialog (retryable)
      setStatusDialogType('pending');
      setStatusDialogOpen(true);
    },
    onFailed: () => {
      // Terminal failure (Declined, Not Found, etc.) — show failed dialog (non-retryable)
      setStatusDialogType('failed');
      setStatusDialogOpen(true);
    },
    onError: () => {
      // HTTP 500 or network error — show the error dialog (retryable)
      setStatusDialogType('error');
      setStatusDialogOpen(true);
    }
  });

  const handleRetry = useCallback(() => {
    if (!lastPayloadRef.current) return;
    if (retryCount >= MAX_PAYMENT_RETRIES) return;

    const nextCount = retryCount + 1;
    setRetryCount(nextCount);
    checkOrderStatus(lastPayloadRef.current);
  }, [retryCount, checkOrderStatus]);

  const handleCloseDialog = useCallback(() => {
    setStatusDialogOpen(false);
    setRetryCount(0);
    lastPayloadRef.current = null;
  }, []);

  useEffect(() => {
    const handlerName = 'getStatus';

    const handler = (data: object) => {
      console.log('getStatus: ', data);

      const payload = {
        bulkOrderId: createOrderRes?.bulkOrderId || '',
        tranId: (data as GetStatus).transactionId
      };

      // Store payload so retries can re-use it
      lastPayloadRef.current = payload;
      setRetryCount(0);

      checkOrderStatus(payload);
    };

    import('web-bridge-gateway').then(({ registerHandler }) => {
      registerHandler(handlerName, handler);
    });

    return () => {
      console.log(`${handlerName} unregistered`);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createOrderRes]);

  return {
    checkOrderStatus,
    isCheckingStatus,
    statusDialogOpen,
    statusDialogType,
    retryCount,
    handleRetry,
    handleCloseDialog
  };
}
