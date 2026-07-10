import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from '@/components/ui/sheet';
import TotalPriceButton from './total-price-button';
import Qty from './qty';
import type { PairProduct, PairProductOption } from '@/types/api';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import ServicePreview from './service-preview';
import { useTranslation } from 'react-i18next';
import { getLocalizedName } from '@/lib/language-helper';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (option: PairProductOption, quantity: number, categoryProductId: string) => void;
  pairProductObj: { [key: string]: PairProduct[] };
  pairProductKeys: string[];
  activePairId?: string | null;
};

const ServicePreviewSheet: React.FC<Props> = ({
  open,
  onOpenChange,
  onConfirm,
  pairProductObj,
  pairProductKeys,
  activePairId
}) => {
  const { t, i18n } = useTranslation();
  const [selectedPairId, setSelectedPairId] = useState<string | null>(activePairId || null);
  const [selectedOption, setSelectedOption] = useState<PairProductOption | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

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
        setSelectedOption(null);
        setQuantity(1);
        firstOpenRef.current = false;
      }
    } else {
      setSelectedOption(null);
      setSelectedPairId(null);
      setQuantity(1);
      firstOpenRef.current = true;
    }
  }, [open, activePairId]);

  const handlePairProductClick = (id: string) => {
    setSelectedPairId(id);
    setSelectedOption(null);
  };

  const handleOptionClick = (option: PairProductOption) => {
    setSelectedOption(option);
    setQuantity(1); // Reset quantity when selecting new option
  };

  const handleConfirm = () => {
    if (!selectedOption || !selectedPairId) return;
    const categoryProductId = pairProductObj[selectedPairId]?.[0]?.categoryProductId;
    if (!categoryProductId) return;
    onConfirm(selectedOption, quantity, categoryProductId);
    onOpenChange(false);
  };

  const total = (selectedOption?.amount ?? 0) * quantity;

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

  const selectedPairProduct = selectedPairId ? pairProductObj[selectedPairId]?.[0] : undefined;

  if (!pairProductKeys || pairProductKeys.length === 0) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[80%] h-auto rounded-t-[32px] flex flex-col">
        <div className="sticky top-0 bg-white z-20 rounded-t-[32px]">
          <SheetHeader>
            <SheetTitle className="text-center text-lg font-bold">
              {selectedPairProduct
                ? getLocalizedName(selectedPairProduct, i18n.language)
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

            {/* Option List */}
            <p className="font-bold text-md mt-6 mb-6">{t('service.serviceType')}</p>
            {!!selectedPairId &&
              selectedPairProduct?.options.map((option, index) => {
                const isActive = selectedOption?.id === option.id;
                const optionName = getLocalizedName(
                  { nameEn: option.nameEn ?? undefined, nameKm: option.nameKm ?? undefined },
                  i18n.language
                );
                const durationHours = option.duration > 0 ? Math.round(option.duration / 60) : null;
                return (
                  <div
                    key={index}
                    onClick={() => handleOptionClick(option)}
                    className={`rounded-[6px] cursor-pointer mb-5 ${
                      isActive
                        ? 'border-1 border-[#1B4CFA] bg-[#E8F0F7]'
                        : 'border-1 border-[#d7d5d5]'
                    }`}>
                    <div className="flex flex-col p-3 rounded-lg">
                      <div className="flex flex-row justify-between w-full pb-[8px]">
                        <h3 className="text-lg font-semibold">{optionName}</h3>
                        <p className="font-bold text-lg text-right">${option.amount}</p>
                      </div>

                      <div className="flex flex-row items-center justify-between w-full text-[#4a4f52] text-[15px]">
                        <div className="flex items-center gap-2">
                          {durationHours !== null && (
                            <p>
                              {durationHours} {t('common.hours')}
                            </p>
                          )}
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
            totalPrice={selectedOption ? formatCurrency(total) : undefined}
            buttonText={t('addon.addon')}
            disabled={!selectedOption}
            showPriceSection={!!selectedOption}
            showQuantityControls={!!selectedOption}
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
