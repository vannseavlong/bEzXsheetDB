import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import React from 'react';
import useLanguage from '@/hooks/use-language';
import type { ProductAttributes } from '@/types/api';
import PrimaryButton from './primary-button';
import { useTranslation } from 'node_modules/react-i18next';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: ProductAttributes;
};

const InfoDialog: React.FC<Props> = ({ open, onOpenChange, product }) => {
  const { t } = useTranslation();
  const { currentLang } = useLanguage();

  const getLocalizedInfo = (product: ProductAttributes) => {
    switch (currentLang) {
      case 'en':
        return product.infoEn;
      case 'km':
        return product.infoKm;
      case 'vi':
      case 'cn':
      case 'tw':
      default:
        return product.infoEn;
    }
  };

  const info = product ? getLocalizedInfo(product) : null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[40vh] rounded-t-2xl flex flex-col bg-white">
        <div className="px-3 py-3 bg-white rounded-t-2xl flex flex-col">
          <SheetHeader>
            <SheetTitle className="text-center text-lg font-bold mb-1">
              {t('common.remark')}
            </SheetTitle>
          </SheetHeader>
          <div className="flex flex-col flex-1 min-h-0">
            {info ? (
              <div className="flex-1 overflow-y-auto">
                <p className="text-lg text-black">{info}</p>
              </div>
            ) : (
              <div className="text-center py-8 flex-1 overflow-y-auto">
                <p className="text-gray-500">{t('common.noInformationAvailable')}</p>
              </div>
            )}
            <div className="mt-8">
              <PrimaryButton
                singleText={t('common.close')}
                onClick={() => onOpenChange(false)}
                className="px-4"
              />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default InfoDialog;
