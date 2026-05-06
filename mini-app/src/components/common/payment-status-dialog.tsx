import { AlertTriangle, Clock, XCircle } from 'lucide-react';
import { useTranslation } from 'node_modules/react-i18next';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle
} from '../ui/alert-dialog';
import { Button } from '../ui/button';

/** 'pending' = still processing (retryable), 'error' = technical error (retryable), 'failed' = terminal failure (non-retryable) */
export type PaymentDialogType = 'pending' | 'error' | 'failed';

export const MAX_PAYMENT_RETRIES = 3;

interface PaymentStatusDialogProps {
  open: boolean;
  type: PaymentDialogType;
  retryCount: number;
  isRetrying: boolean;
  onRetry: () => void;
  onClose: () => void;
}

export function PaymentStatusDialog({
  open,
  type,
  retryCount,
  isRetrying,
  onRetry,
  onClose
}: PaymentStatusDialogProps) {
  const { t } = useTranslation();

  const isFailed = type === 'failed';
  const isPending = type === 'pending';

  // 'failed' is a terminal state — no retry allowed regardless of count
  const isExhausted = isFailed || retryCount >= MAX_PAYMENT_RETRIES;

  const title = isPending
    ? t('payment.statusDialog.pendingTitle')
    : isFailed
      ? t('payment.statusDialog.failedTitle')
      : t('payment.statusDialog.errorTitle');

  const description = isPending
    ? t('payment.statusDialog.pendingMessage')
    : isFailed
      ? t('payment.statusDialog.failedMessage')
      : t('payment.statusDialog.errorMessage');

  const iconColorClass = isPending ? 'bg-amber-100 text-amber-500' : 'bg-red-100 text-red-500';

  const Icon = isPending ? Clock : isFailed ? XCircle : AlertTriangle;

  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <AlertDialogContent>
        <div className="flex flex-col items-center gap-4 text-center">
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-full ${iconColorClass}`}>
            <Icon className="h-7 w-7" />
          </div>

          <div className="flex flex-col gap-1">
            <AlertDialogTitle className="text-base font-semibold">{title}</AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              {retryCount >= MAX_PAYMENT_RETRIES && !isFailed
                ? t('payment.statusDialog.maxRetriesMessage')
                : description}
            </AlertDialogDescription>
          </div>

          {/* Show attempt counter only while retries are still available */}
          {!isExhausted && (
            <p className="text-muted-foreground text-xs">
              {t('payment.statusDialog.retriesLeft', {
                current: retryCount,
                max: MAX_PAYMENT_RETRIES
              })}
            </p>
          )}

          <div className="flex w-full flex-col gap-2">
            {!isExhausted ? (
              <Button
                className="bg-primary-gradient w-full text-white"
                isLoading={isRetrying}
                onClick={onRetry}>
                {t('payment.statusDialog.retryButton', {
                  current: retryCount,
                  max: MAX_PAYMENT_RETRIES
                })}
              </Button>
            ) : (
              <Button className="bg-primary-gradient w-full text-white" onClick={onClose}>
                {t('common.close')}
              </Button>
            )}

            {!isExhausted && (
              <Button variant="outline" className="w-full" onClick={onClose} disabled={isRetrying}>
                {t('common.cancel')}
              </Button>
            )}
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
