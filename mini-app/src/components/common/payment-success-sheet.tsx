import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import Assets from '@/assets';
import { useTranslation } from 'node_modules/react-i18next';

interface PaymentSuccessSheetProps {
  bulkOrderId?: string;
}

export interface PaymentSuccessSheetRef {
  open: () => void;
  close: () => void;
  isOpen: () => boolean;
}

const PaymentSuccessSheet = forwardRef<PaymentSuccessSheetRef, PaymentSuccessSheetProps>(
  ({ bulkOrderId }, ref) => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    useImperativeHandle(ref, () => ({
      open: () => setOpen(true),
      close: () => setOpen(false),
      isOpen: () => open
    }));

    useEffect(() => {
      if (!open) return;

      window.history.pushState({}, '', '');

      const handlePopState = () => {
        setOpen(false);
        navigate('/', { replace: true });
      };

      window.addEventListener('popstate', handlePopState);

      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }, [open, navigate]);

    if (!bulkOrderId) return null;

    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="h-full flex flex-col">
          <div className="flex flex-col justify-center items-center p-6 flex-1">
            <div className="bg-green-100 rounded-full mb-8">
              <img src={Assets.checkmarkBadge} alt="Banner bEASY" className="w-28 m-2" />
            </div>
            <p className="font-bold text-primary-gradient">
              {t('paymentSuccess.appointmentConfirmed')}
            </p>
            <p className="text-sm text-gray-400">{t('paymentSuccess.lookForward')}</p>
          </div>

          <div className="flex justify-between space-x-4 p-6">
            <Button
              autoFocus={false}
              onClick={() => {
                navigate(`/`, { replace: true });
              }}
              className="flex-1 rounded-full bg-gradient-to-r from-[#102C90] to-[#1B4CFA]">
              {t('common.home')}
            </Button>
            <Button
              onClick={() => {
                navigate('/', { replace: true });
                window.setTimeout(() => {
                  navigate(`/v5/detail/${bulkOrderId}`, {
                    state: { fromPaymentSuccess: true }
                  });
                }, 0);
              }}
              className="flex-1 rounded-full bg-gradient-to-r from-[#102C90] to-[#1B4CFA]">
              {t('paymentSuccess.viewBooking')}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    );
  }
);
PaymentSuccessSheet.displayName = 'PaymentSuccessSheet';

export default PaymentSuccessSheet;
