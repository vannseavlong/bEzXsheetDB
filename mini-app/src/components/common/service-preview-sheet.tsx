import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from '@/components/ui/sheet';
import Icon from '@/assets/icons/icon-asset';
import TotalPriceButton from './total-price-button';
import Qty from './qty';
import type { pairProduct, ProductOptionV2 } from '@/types/api';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import ServicePreview from './service-preview';
import { useTranslation } from 'node_modules/react-i18next';
import { getLocalizedName } from '@/lib/language-helper';

type Props = {
  data: ProductOptionV2[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (addon: ProductOptionV2, quantity: number) => void;
  pairProductObj: { [key: string]: pairProduct[] };
  pairProductKeys: string[];
  activePairId?: string | null;
};

const ServicePreviewSheet: React.FC<Props> = ({
  data,
  open,
  onOpenChange,
  onConfirm,
  pairProductObj,
  pairProductKeys,
  activePairId
}) => {
  const { t, i18n } = useTranslation();
  const [selectedPairId, setSelectedPairId] = useState<string | null>(activePairId || null);
  const [selectedAddon, setSelectedAddon] = useState<ProductOptionV2 | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  // const [isConfirming, setIsConfirming] = useState(false);

  const firstOpenRef = useRef(true);
  const pairRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());

  const setPairRef = useCallback((id: string, el: HTMLDivElement | null) => {
    pairRefs.current.set(id, el);
  }, []);

  useEffect(() => {
    if (!open || !selectedPairId) return;
    const timer = setTimeout(() => {
      const el = pairRefs.current.get(selectedPairId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [open, selectedPairId]);

  // Quantity management functions
  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  useEffect(() => {
    if (open) {
      if (firstOpenRef.current) {
        setSelectedPairId(activePairId || null);
        setSelectedAddon(null);
        setQuantity(1);
        firstOpenRef.current = false;
      }
    } else {
      setSelectedAddon(null);
      setSelectedPairId(null);
      setQuantity(1);
      // setIsConfirming(false);
      firstOpenRef.current = true;
    }
  }, [open, activePairId]);

  const handlePairProductClick = (id: string) => {
    setSelectedPairId(id);
    setSelectedAddon(null);
  };

  const handleAddonClick = (addonObj: ProductOptionV2) => {
    setSelectedAddon(addonObj);
    setQuantity(1); // Reset quantity when selecting new addon
  };

  const handleConfirm = () => {
    // if (isConfirming) return;
    // const selectedAddon = data?.find((addon) => addon.id.toString() === selectedAddonId);
    // if (!selectedAddon) {
    //   console.warn('No addon selected');
    //   return;
    // }
    // setIsConfirming(true);
    console.log('Selected addon with quantity:', selectedAddon, 'Quantity:', quantity);
    if (!selectedAddon) return;
    onConfirm(selectedAddon, quantity);
    onOpenChange(false);
  };

  // const selectedAddon = data?.find((addon) => addon.id.toString() === selectedAddonId);
  const total = (selectedAddon?.amount ?? 0) * quantity;

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

  if (!data || data.length === 0) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[80%] h-auto rounded-t-[32px] flex flex-col">
        <div className="sticky top-0 bg-white z-20 rounded-t-[32px]">
          <SheetHeader>
            <SheetTitle className="text-center text-lg font-bold">
              {selectedPairId && pairProductObj[selectedPairId]
                ? getLocalizedName(pairProductObj[selectedPairId][0], i18n.language)
                : t('servicePreview.addons')}
            </SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>
        </div>

        <div className="flex-1 overflow-y-auto px-4">
          <div className="space-y-4">
            {/* Pair Products */}
            {pairProductKeys && pairProductKeys.length > 0 && (
              <div>
                <div className="overflow-x-auto whitespace-nowrap scroll-smooth">
                  <div className="flex space-x-4">
                    {pairProductKeys.map((id) => (
                      <div key={id} ref={(el) => setPairRef(id, el)}>
                        <ServicePreview
                          data={pairProductObj[id][0]}
                          isActive={selectedPairId === id}
                          onClick={() => handlePairProductClick(id)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Addon List */}
            <p className="font-bold text-md mt-6 mb-6">{t('service.serviceType')}</p>
            {!!selectedPairId &&
              pairProductObj[selectedPairId][0].productOptionV2s.map((addon, index) => {
                const isActive = selectedAddon?.id.toString() === addon.id.toString();
                const addonName = getLocalizedName(
                  {
                    nameEn: addon.nameEn,
                    nameKm: addon.nameKm || undefined,
                    nameVi: addon.nameVi || undefined,
                    nameCn: addon.nameCn || undefined,
                    nameTw: addon.nameTw || undefined
                  },
                  i18n.language
                );
                return (
                  <div
                    key={index}
                    onClick={() => handleAddonClick(addon)}
                    className={`rounded-[6px] cursor-pointer mb-5 ${isActive
                        ? 'border-1 border-[#1B4CFA] bg-[#E8F0F7]'
                        : 'border-1 border-[#d7d5d5]'
                      }`}>
                    <div className="flex flex-col p-3 rounded-lg">
                      <div className="flex flex-row justify-between w-full pb-[8px]">
                        <h3 className="text-lg font-semibold">{addonName}</h3>
                        <p className="font-bold text-lg text-right">${addon.amount}</p>
                      </div>

                      <div className="flex flex-row items-center justify-between w-full text-[#4a4f52] text-[15px]">
                        <div className="flex items-center gap-2">
                          <Icon name="clockIcon" />
                          <p>
                            {addon.hourCount ?? 0} {t('common.hours')}
                          </p>
                          <Icon name="userGroupIcon" />
                          <p>
                            {addon.cleanerCount ?? 0}{' '}
                            {Number(addon.cleanerCount ?? 0) > 1
                              ? t('common.cleaners')
                              : t('common.cleaner')}
                          </p>
                        </div>
                        {isActive && quantity > 0 && <Qty quantity={quantity} />}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 z-20 mt-20">
          <TotalPriceButton
            totalPrice={selectedAddon ? formatCurrency(total) : undefined}
            buttonText={t('addon.addon')}
            disabled={!selectedAddon}
            showPriceSection={!!selectedAddon}
            showQuantityControls={!!selectedAddon}
            quantity={quantity}
            onIncrement={incrementQuantity}
            onDecrement={decrementQuantity}
            onClick={handleConfirm}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ServicePreviewSheet;
