import React from 'react';
import { Badge } from '../ui/badge';
import { getBadgeStatusVariant, getStatusDisplayText } from '@/lib/utils';
import { Button } from '../ui/button';
import clsx from 'clsx';
import { ArrowLeftIcon, Check, PrinterIcon } from 'lucide-react';
import usePrintMutation from '@/hooks/mutations/use-print-mutation';
import useCancelOrderMutation from '@/hooks/mutations/use-cancel-order-mutation';
import usePrintInvoiceMutation from '@/hooks/mutations/use-print-invoice-mutation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '../ui/alert-dialog';
import OrderStatusConfirmDialog from './order-status-confirm-dialog';
import DirectSaleDialog from './direct-sale/direct-sale-dialog';
import { PaymentModal } from './payment-dialog';
import { buttonConfig } from '@/constants/constants';

type Props = {
  orderId: string;
  status: OrderStatusProps;
  paymentStatus?: PaymentStatusProps;
  type?: 'ORDER' | 'DIRECT_SALE' | 'BLOCKED';
  onClick?: (status: string) => void;
  isPending: boolean;
  onBack?: () => void;
  paymentMethod: string;
  paymentMethodDisplay: string;
  orderDetail: OrderListAttributes;
};

const OrderHeaderDetail: React.FC<Props> = ({
  orderDetail,
  onClick,
  status,
  orderId,
  isPending,
  type,
  paymentMethod,
  // paymentMethodDisplay,
  paymentStatus,
  onBack
}) => {
  const [isDirectSaleOpen, setDirectSaleOpen] = React.useState(false);
  const [isPaymentMethodOpen, setIsPaymentMethodOpen] = React.useState(false);
  const [isPrinting, setIsPrinting] = React.useState(false);
  const [isPrintingInvoice, setIsPrintingInvoice] = React.useState(false);
  const { mutateAsync: print } = usePrintMutation();
  const { mutateAsync: printInvoice } = usePrintInvoiceMutation();
  const { mutateAsync: cancelOrder, isPending: isCancelPending } = useCancelOrderMutation();

  const printHtml = (html: string) => {
    const blob = new Blob([html], { type: 'text/html; charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;';

    // Set onload BEFORE src/append so Safari doesn't miss the event
    iframe.onload = () => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      URL.revokeObjectURL(url);
      setTimeout(() => document.body.removeChild(iframe), 1000);
    };

    iframe.src = url;
    document.body.appendChild(iframe);
  };

  const handlePrintClick = async () => {
    setIsPrinting(true);
    try {
      const html = await print(orderId);
      printHtml(html);
    } finally {
      setIsPrinting(false);
    }
  };

  const handlePrintInvoice = async () => {
    setIsPrintingInvoice(true);
    try {
      const html = await printInvoice(orderId);
      printHtml(html);
    } finally {
      setIsPrintingInvoice(false);
    }
  };

  const handleCancel = async () => {
    await cancelOrder({ bulkOrderId: orderId, paymentMethod });
  };

  return (
    <div className="min-h-22 h-auto w-full items-start md:items-center flex flex-col md:flex-row px-4 md:px-6 bg-background py-4 md:py-0 gap-4 md:gap-0 border-b md:border-b-0 shrink-0">
      <div className="flex space-x-4 items-center w-full md:w-auto justify-between md:justify-start">
        <Button
          onClick={onBack}
          size="icon"
          variant="ghost"
          className="md:hidden flex h-8 w-8 -ml-2"
        >
          <ArrowLeftIcon className="h-4 w-4" />
        </Button>
        <h2 className="text-base font-semibold">
          {orderDetail.platform === 'WEB' ? 'WB' : type === 'DIRECT_SALE' ? 'DS ID' : 'Order Id'}{' '}
          <span className="font-bold">#{orderId}</span>
        </h2>
        <div className="h-5 w-px bg-gray-300" />
        <Badge variant={getBadgeStatusVariant(status)} className="rounded-full h-8 px-4 text-sm">
          {getStatusDisplayText(status)}
        </Badge>
      </div>

      <div className="flex items-center gap-3 w-full md:ml-auto md:w-auto overflow-x-auto pb-1 md:pb-0 hide-scrollbar">
        <Button
          type="button"
          isLoading={isPrintingInvoice}
          disabled={isPrintingInvoice}
          variant="outline"
          onClick={handlePrintInvoice}
          className={clsx('h-9', {
            hidden: !onClick
          })}
        >
          Print Invoice
          <PrinterIcon />
        </Button>
        <Button
          type="button"
          isLoading={isPrinting}
          disabled={isPrinting}
          variant="outline"
          onClick={handlePrintClick}
          className={clsx('h-9', {
            hidden: !onClick
          })}
        >
          Print
          <PrinterIcon />
        </Button>
        {type === 'DIRECT_SALE' && status === 'PENDING' && (
          <>
            <Button key="edit" size="sm" variant="outline" onClick={() => setDirectSaleOpen(true)}>
              Edit Order
            </Button>
            {isDirectSaleOpen && (
              <DirectSaleDialog
                isOpen={isDirectSaleOpen}
                setIsOpen={setDirectSaleOpen}
                orderDetail={orderDetail}
              />
            )}
          </>
        )}
        {status === 'COMPLETED' && paymentStatus !== 'PAID' && (
          <Button
            type="button"
            onClick={() => setIsPaymentMethodOpen(true)}
            className={clsx('h-9', {
              hidden: !onClick
            })}
          >
            <Check />
            Mark As Paid
          </Button>
        )}
        <div className="items-center gap-3 hidden md:flex">
          {!(status === 'CANCELLED' || status === 'COMPLETED') && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="sm"
                  variant="destructive"
                  isLoading={isCancelPending}
                  disabled={isCancelPending}
                >
                  Cancel
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmation</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to cancel this order?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="h-9">No</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleCancel}
                    className="h-9 bg-destructive"
                    disabled={isCancelPending}
                  >
                    {isCancelPending ? 'Cancelling...' : 'Yes'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          {status === 'PENDING' || status === 'ACCEPTED' || status === 'IN_PROGRESS' ? (
            status === 'ACCEPTED' || status === 'IN_PROGRESS' ? (
              <OrderStatusConfirmDialog
                status={status}
                isPending={isPending}
                buttonText={buttonConfig[status].text}
                buttonVariant={buttonConfig[status].variant}
                buttonClassName={clsx({ hidden: !onClick })}
                onConfirm={() => onClick?.(status)}
                description={`Are you sure you want to mark this order as ${buttonConfig[status].text.toLowerCase()}?`}
              />
            ) : (
              <Button
                type="button"
                isLoading={isPending}
                variant={buttonConfig[status].variant}
                onClick={() => onClick?.(status)}
                size="sm"
                className={clsx({
                  hidden: !onClick
                })}
              >
                {buttonConfig[status].text}
              </Button>
            )
          ) : null}
        </div>
      </div>

      <PaymentModal
        isOpen={isPaymentMethodOpen}
        onOpenChange={setIsPaymentMethodOpen}
        bulkOrderId={orderId}
        paymentMethod={paymentMethod}
      />
    </div>
  );
};

export default OrderHeaderDetail;
