import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Uploader } from './uploader';
import { Button } from '../ui/button';
import { useUpdatePaymentStatusMutation } from '@/hooks/mutations/use-update-payment-status-mutation';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const PAYMENT_METHOD_OPTIONS = [
  { key: 'abapay_khqr_deeplink', name: 'ABA KHQR' },
  { key: 'cash', name: 'Cash' }
];

interface PaymentModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  bulkOrderId: string;
  status?: string;
  paymentMethod?: string;
}

export function PaymentModal({
  isOpen,
  onOpenChange,
  bulkOrderId,
  status = 'PAID',
  paymentMethod: paymentMethodFromApi
}: PaymentModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [paymentMethod, setPaymentMethod] = useState(
    paymentMethodFromApi || 'abapay_khqr_deeplink'
  );
  const { mutateAsync, isPending } = useUpdatePaymentStatusMutation(bulkOrderId);

  useEffect(() => {
    if (isOpen) {
      setPaymentMethod(paymentMethodFromApi || 'abapay_khqr_deeplink');
    }
  }, [isOpen, paymentMethodFromApi]);

  const handleConfirm = async () => {
    if (!file) {
      alert('Please select a file');
      return;
    }
    try {
      await mutateAsync({ image: file, status, paymentMethod });
      setFile(null);
      onOpenChange(false);
    } catch (error) {
      console.log({ error });
      toast.error('Failed to update payment status');
    }
    // setIsLoading(true);
    // // Simulate upload
    // await new Promise((resolve) => setTimeout(resolve, 1500));
    // setIsLoading(false);

    // Reset and close
  };

  const handleCancel = () => {
    setFile(null);
    onOpenChange(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-background rounded-xl border border-border shadow-lg max-w-md w-full my-4">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Mark This Order as Paid</h2>
          <button
            onClick={handleCancel}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Payment Method Dropdown */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Payment Method</p>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_METHOD_OPTIONS.map((method) => (
                  <SelectItem key={method.key} value={method.key}>
                    {method.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Instructions */}
          <p className="text-sm text-foreground">
            Please upload the payment attachment before confirming this order as paid
          </p>
          <div className="w-full h-40 rounded-sm overflow-hidden">
            {file ? (
              <div className="w-full h-full relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="object-cover w-full h-full"
                />
                <div
                  onClick={() => setFile(null)}
                  className="p-1 m-2 bg-white/30 rounded-sm absolute top-0 right-0 cursor-pointer"
                >
                  <X className="text-destructive" />
                </div>
              </div>
            ) : (
              <Uploader
                className="w-full h-full space-y-2"
                onUploaded={(files) => setFile(files[0])}
              >
                <p className="text-sm font-medium text-destructive">
                  Select a file or drag and drop here
                </p>
                <p className="text-xs text-muted-foreground">
                  JPG, PNG or PDF, file size no more than 10MB
                </p>
              </Uploader>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border flex gap-3 justify-end flex-wrap">
          <Button onClick={handleCancel} variant="outline">
            Cancel
          </Button>
          <Button isLoading={isPending} onClick={handleConfirm}>
            Confirm Payment
          </Button>
        </div>
      </div>
    </div>
  );
}
