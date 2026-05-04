import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { PaymentModal } from './payment-dialog';
import { useUpdatePaymentStatusMutation } from '@/hooks/mutations/use-update-payment-status-mutation';
import { toast } from 'sonner';

interface PaymentMethodSelectionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  bulkOrderId: string;
}

const PAYMENT_METHODS = [
  {
    key: 'KHQR' as const,
    icon: '/abapay_khqr_icon.png',
    name: 'ABA KHQR',
    description: 'Scan to pay with any banking app'
  },
  {
    key: 'CASH' as const,
    icon: '/cash_icon.png',
    name: 'Cash',
    description: 'Select to pay after service'
  }
];

export function PaymentMethodSelectionDialog({
  isOpen,
  onOpenChange,
  bulkOrderId
}: PaymentMethodSelectionDialogProps) {
  const [isKhqrOpen, setIsKhqrOpen] = useState(false);
  const { mutateAsync: updatePaymentStatus, isPending } =
    useUpdatePaymentStatusMutation(bulkOrderId);

  const handleSelect = async (method: 'CASH' | 'KHQR') => {
    onOpenChange(false);
    if (method === 'CASH') {
      try {
        await updatePaymentStatus({ status: 'PAID' });
      } catch (error) {
        console.error(error);
        toast.error('Failed to update payment status');
      }
    } else {
      setIsKhqrOpen(true);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-md p-4 gap-0 overflow-hidden">
          <DialogHeader className="p-0 mb-6">
            <DialogTitle className="text-xl font-bold">Choose way to pay</DialogTitle>
          </DialogHeader>

          <div className="divide-y divide-border -mx-6 px-6">
            {PAYMENT_METHODS.map((method) => (
              <button
                key={method.key}
                type="button"
                disabled={isPending}
                onClick={() => handleSelect(method.key)}
                className="w-full flex items-center gap-4 py-4 hover:bg-muted/50 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <img
                  src={method.icon}
                  alt={method.name}
                  className="h-14 w-14 rounded-full object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-base leading-snug">{method.name}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{method.description}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <PaymentModal bulkOrderId={bulkOrderId} isOpen={isKhqrOpen} onOpenChange={setIsKhqrOpen} />
    </>
  );
}
