import { Card } from '../ui/card';
import { Uploader } from './uploader';
import { X, FileText } from 'lucide-react';
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
import { useDeleteReceiptMutation } from '@/hooks/mutations/use-delete-receipt-mutation';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import { useUpdatePaymentStatusMutation } from '@/hooks/mutations/use-update-payment-status-mutation';

type Props = {
  orderDetailData: OrderListAttributes;
  readOnly?: boolean;
};

export default function UploadAttachment({ orderDetailData, readOnly = false }: Props) {
  const { mutate } = useUpdatePaymentStatusMutation(orderDetailData.bulkOrderId);
  const { mutate: deleteReceiptMutate } = useDeleteReceiptMutation();

  // Helper function to check if the file is a PDF
  const isPDF = (url: string) => {
    return url.toLowerCase().endsWith('.pdf');
  };

  return (
    <Card className="mb-4 p-4">
      <div>
        <h2 className="text-base font-bold text-gray-700">Attachment</h2>
      </div>
      <div className="w-full grid grid-cols-2 rounded-sm overflow-hidden space-x-2 space-y-2">
        {!readOnly && orderDetailData.paymentStatus !== 'PAID' && (
          <Uploader
            className="h-40 space-y-2 col-span-2"
            onUploaded={(files) => {
              mutate({ image: files[0], status: 'PARTIALLY_PAID' });
            }}
          />
        )}
        {orderDetailData.receipts.map((receipt, index) => {
          const isReceiptPDF = isPDF(receipt.receiptUrl);

          return (
            <div key={index} className="h-24 col-span-1 relative">
              <Dialog>
                <DialogTrigger asChild>
                  {isReceiptPDF ? (
                    <div className="rounded-sm w-full h-full border bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                      <FileText className="w-12 h-12 text-gray-600" />
                    </div>
                  ) : (
                    <img
                      className="rounded-sm w-full h-full border object-cover cursor-pointer"
                      src={receipt.receiptUrl}
                      alt={index.toString()}
                    />
                  )}
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] pt-16">
                  {isReceiptPDF ? (
                    <iframe
                      src={receipt.receiptUrl}
                      className="w-full h-[500px] border rounded-sm"
                      title={`Receipt PDF ${index}`}
                    />
                  ) : (
                    <img
                      className="rounded-sm w-full h-full border object-cover"
                      src={receipt.receiptUrl}
                      alt={index.toString()}
                    />
                  )}
                </DialogContent>
              </Dialog>

              {!readOnly && orderDetailData.paymentStatus !== 'PAID' && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <div className="p-0.5 m-2 bg-white/50 rounded-sm absolute top-0 right-0 cursor-pointer">
                      <X className="text-destructive" />
                    </div>
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
                        onClick={() => {
                          deleteReceiptMutate({
                            id: receipt.id
                          });
                        }}
                      >
                        Yes
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
