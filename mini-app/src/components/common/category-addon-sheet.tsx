import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import type { CategoryAddonItem } from '@/types/api';
import React, { useEffect, useState, useMemo } from 'react';
import QuantityControl from './quantity-control';
import { useTranslation } from 'react-i18next';
import { getLocalizedName } from '@/lib/language-helper';

type Props = {
  data: CategoryAddonItem[] | undefined;
  loading?: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  addonId?: string | null;
  initialQuantities?: Record<string, number>;
  onConfirm: (selections: { itemId: string; qty: number }[]) => void;
};

const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

const CategoryAddonSheet: React.FC<Props> = ({
  data,
  loading,
  open,
  onOpenChange,
  addonId,
  initialQuantities,
  onConfirm
}) => {
  const { t, i18n } = useTranslation();
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    if (open) {
      setQuantities(initialQuantities ?? {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, addonId]);

  const handleQuantityChange = (id: string, value: number) => {
    setQuantities((prev) => ({ ...prev, [id]: value }));
  };

  const total = useMemo(() => {
    if (!data || data.length === 0) return 0;
    return data.reduce((sum, item) => {
      const qty = quantities[item.id] || 0;
      const price = item.amount ?? 0;
      return sum + qty * price;
    }, 0);
  }, [data, quantities]);

  const handleConfirm = () => {
    const selections = Object.entries(quantities)
      .filter(([, qty]) => qty > 0)
      .map(([itemId, qty]) => ({ itemId, qty }));
    onConfirm(selections);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        aria-describedby={undefined}
        className="max-h-[80%] h-auto rounded-t-2xl flex flex-col">
        <div className="px-4 overflow-y-auto flex-1">
          <SheetHeader className="sticky top-0 bg-white z-10">
            <SheetTitle className="text-center text-lg font-bold py-4">
              {t('service.serviceAddon')}
            </SheetTitle>
          </SheetHeader>

          {loading && (
            <div className="mt-6 text-center text-gray-500">
              <p>{t('common.loading')}</p>
            </div>
          )}

          {!loading && (!data || data.length === 0) && (
            <div className="mt-6 text-center text-gray-500">
              <p>{t('addon.noAddons')}</p>
            </div>
          )}

          {!loading && data && data.length > 0 && (
            <div className="mt-4 space-y-4">
              {data.map((item) => {
                const qty = quantities[item.id] || 0;
                const isActive = qty > 0;

                return (
                  <div
                    key={item.id}
                    className={`flex items-center pb-4 p-2 rounded-lg border transition
                      ${isActive ? 'border-[#1B4CFA] bg-blue-50' : 'border-gray-200 bg-white'}`}>
                    <div className="border-2 p-2 rounded-lg">
                      <img
                        src={item.imgUrl ?? '/fallback-image.png'}
                        alt={item.nameEn || 'Add-on'}
                        className="w-[73px] h-[73px] rounded-lg object-cover"
                      />
                    </div>
                    <div className="flex flex-col justify-center px-4">
                      <p
                        className={`text-lg font-bold ${
                          isActive ? 'text-[#1B4CFA]' : 'text-black'
                        }`}>
                        {getLocalizedName(item, i18n.language)}
                      </p>
                      {item.amount !== undefined && (
                        <p className="text-sm font-semibold text-gray-600">${item.amount}</p>
                      )}
                    </div>
                    <div className="ml-auto">
                      <QuantityControl
                        initialQuantity={qty}
                        onChange={(value) => handleQuantityChange(item.id, value)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {data && data.length > 0 && (
          <div className="p-4 flex items-center justify-between">
            <SheetClose asChild>
              <Button
                onClick={handleConfirm}
                className="h-[51px] text-xl w-full flex justify-between items-center
                          bg-gradient-to-r from-[#102C90] to-[#1B4CFA] rounded-2xl">
                <span className="text-white">{formatCurrency(total)}</span>
                <span className="text-white">{t('addon.addon')}</span>
              </Button>
            </SheetClose>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CategoryAddonSheet;
