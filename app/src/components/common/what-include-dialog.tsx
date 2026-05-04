import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import React from 'react';
import useEquipmentQuery from '@/hooks/use-equipment-query';
import PrimaryButton from './primary-button';
import { useTranslation } from 'react-i18next';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryId?: string;
};

const WhatIncludeDialog: React.FC<Props> = ({ open, onOpenChange, categoryId }) => {
  const { t } = useTranslation();
  const { data: equipment, isLoading, isError, error } = useEquipmentQuery(categoryId);

  // Debug logging for equipment issues
  React.useEffect(() => {
    console.log('WhatIncludeDialog - Equipment Query Debug:', {
      categoryId: categoryId,
      categoryIdNote: 'This should be the route ID from URL (e.g., /service/1)',
      equipmentEndpoint: `category/${categoryId}/equipments`,
      isLoading,
      isError,
      equipment,
      equipmentCount: equipment?.length || 0,
      error: error?.message || 'No error',
      queryEnabled: !!categoryId,
      timestamp: new Date().toISOString()
    });
  }, [categoryId, isLoading, isError, equipment, error]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="max-h-[80%] h-auto rounded-t-2xl flex flex-col bg-white">
        <div className="px-4 overflow-y-auto flex-1">
          <SheetHeader>
            <SheetTitle className="text-center text-lg font-bold mt-4">
              {t('service.whatsIncluded')}
            </SheetTitle>
          </SheetHeader>

          <div className="mt-6 pb-20">
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">{t('common.loading')}</p>
              </div>
            ) : equipment && equipment.length > 0 ? (
              <div className="grid grid-cols-3 gap-4">
                {equipment.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col items-center">
                    <div className="w-16 h-16 mb-3 flex items-center justify-center bg-gray-50 rounded-lg">
                      <img
                        src={item.imgUrl}
                        alt={item.name}
                        className="w-full h-full object-contain rounded-lg"
                        onError={(e) => {
                          // Hide broken images gracefully
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-700 text-center leading-tight">{item.name}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">{t('whatInclude.noEquipmentAvailable')}</p>
              </div>
            )}
          </div>
        </div>

        {/* Close Button */}
        <div className="p-4 border-t border-gray-100">
          <PrimaryButton
            singleText={t('common.close')}
            variant="relative"
            onClick={() => onOpenChange(false)}
            className="w-full"
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default WhatIncludeDialog;
