import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import PrimaryButton from './primary-button';
import { toast } from 'sonner';
import type { CouponResponse } from '@/types/api';
import Icon from '@/assets/icons/icon-asset';
import { useTranslation } from 'react-i18next';

interface CouponProps {
  onCouponApplied?: (couponData: CouponResponse) => void;
}

const Coupon: React.FC<CouponProps> = ({ onCouponApplied }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!promoCode.trim()) {
      toast.error(t('coupon.pleaseEnterPromoCode'));
      return;
    }

    setIsLoading(true);
    try {
      // Create a mock coupon response for now
      // The actual validation will happen in the order preview
      const mockCouponResponse: CouponResponse = {
        id: promoCode.trim(),
        code: promoCode.trim(),
        discount: 10, // This should come from the order preview response
        discountType: 'percentage',
        isValid: true,
        message: 'Coupon applied successfully'
      };

      // Handle successful coupon application
      toast.success(t('coupon.couponAppliedSuccess'));
      onCouponApplied?.(mockCouponResponse);
      setOpen(false);
      setPromoCode(''); // Reset the input
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid coupon code';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setPromoCode('');
    setOpen(false);
  };

  return (
    <>
      {/* Section Title - Similar to Task Info and What's Included */}
      <div className="flex items-center justify-between p-4 bg-white">
        <div className="flex items-center gap-3">
          <p className="text-sm font-bold text-[#1A1A1A]">{t('coupon.enterPromoCodeTitle')}</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          type="button">
          <Icon name="CouponIcon" />
        </button>
      </div>

      {/* Dialog */}
      <Sheet open={open} onOpenChange={handleClose}>
        <SheetContent
          side="bottom"
          className="max-h-[80%] h-auto rounded-t-2xl flex flex-col bg-white">
          <div className="px-6 py-4 flex flex-col h-full">
            <SheetHeader className="pb-6">
              <SheetTitle className="text-left text-xl font-bold text-gray-900">
                {t('coupon.enterPromoCode')}
              </SheetTitle>
            </SheetHeader>

            <div className="flex-1 space-y-6">
              <div className="space-y-2">
                <Input
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder={t('coupon.promoCodePlaceholder')}
                  className="w-full h-12 px-4 text-base border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  disabled={isLoading}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !isLoading) {
                      handleSubmit();
                    }
                  }}
                />
              </div>
            </div>

            <div className="pt-6">
              <PrimaryButton
                singleText={isLoading ? t('common.applying') : t('common.submit')}
                onClick={handleSubmit}
                disabled={isLoading || !promoCode.trim()}
                variant="relative"
                className="w-full"
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Coupon;
