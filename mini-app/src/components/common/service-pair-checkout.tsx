import Icon from '@/assets/icons/icon-asset';
import Qty from './qty';
import type { ProductOptionV2 } from '@/types/api';
import { useTranslation } from 'react-i18next';
import { getLocalizedName } from '@/lib/language-helper';

type Props = {
  service: ProductOptionV2;
  pairImage: string;
  quantity?: number;
};

export default function ServicePairCheckout({ service, pairImage, quantity = 1 }: Props) {
  const { t, i18n } = useTranslation();

  return (
    <div className="bg-white py-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-shrink-0">
          <img
            src={pairImage || '/fallback.png'}
            alt={getLocalizedName(service, i18n.language)}
            className="w-16 h-16 object-contain"
          />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-2">
            <p className="text-md font-bold">{getLocalizedName(service, i18n.language)}</p>
            <div className="font-bold text-gray-800">${(service.amount * quantity).toFixed(2)}</div>
          </div>
          <div className="flex items-center justify-between text-[#3D3D3D]">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Icon name="clockIcon" />
                <p className="text-sm text-[#3D3D3D]">
                  {service.hourCount} {t('common.hours')}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Icon name="userGroupIcon" />
                <p className="text-sm text-[#3D3D3D]">
                  {service.cleanerCount}{' '}
                  {Number(service.cleanerCount) > 1 ? t('common.cleaners') : t('common.cleaner')}
                </p>
              </div>
            </div>
            {quantity > 0 && <Qty quantity={quantity} />}
          </div>
        </div>
      </div>
    </div>
  );
}
