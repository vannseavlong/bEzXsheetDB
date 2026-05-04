import type { OrderDetailItem } from '@/types/api';
import Icon from '@/assets/icons/icon-asset';
import Qty from './qty';
import { useTranslation } from 'react-i18next';
import { getLocalizedName } from '@/lib/language-helper';

export function OrderService({ service }: { service: OrderDetailItem }) {
  const { t, i18n } = useTranslation();
  const isTechnician = service.type == 'TECHNICIAN';
  const hasDisplayValue = (value?: string | null) => {
    if (value == null) return false;
    const normalized = String(value).trim().toLowerCase();
    return normalized !== '' && normalized !== 'null' && normalized !== 'undefined';
  };

  const floorBedroomText = [
    hasDisplayValue(service.floorCount) ? `${t('common.floors')}: ${service.floorCount}` : null,
    hasDisplayValue(service.bedroomCount) ? `${t('common.bedroom')}: ${service.bedroomCount}` : null
  ]
    .filter((text): text is string => Boolean(text))
    .join(' | ');

  const serviceInfoText = isTechnician ? service.productOptionEn : floorBedroomText;

  return (
    <div className="cursor-pointer bg-white">
      <div className="flex items-center justify-center gap-4">
        <div className="flex-shrink-0">
          <img
            src={service.thumbnailUrl}
            alt={getLocalizedName(service, i18n.language)}
            className="w-16 h-16 object-contain"
          />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-md font-medium text-[16px]">
              {getLocalizedName(service, i18n.language)}
            </h3>
            <p className="font-bold text-gray-800 text-right">${service.amount}</p>
          </div>
          {serviceInfoText && <p className="mb-2">{serviceInfoText}</p>}

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
                  {Number(service.cleanerCount) > 1
                    ? t('common.technicians')
                    : t('common.technician')}
                </p>
              </div>
            </div>
            {service.qty > 0 && <Qty quantity={service.qty} />}
          </div>

          {(service.addOns?.length ?? 0) > 0 && (
            <div className="mt-3 space-y-1 border-t border-gray-100 pt-2">
              <p className="text-sm font-semibold">{t('service.serviceAddon')}</p>
              {service.addOns.map((addon) => (
                <div
                  key={addon.id}
                  className="flex items-center justify-between text-sm text-[#3D3D3D]">
                  <p className="truncate pr-2">{getLocalizedName(addon, i18n.language)}</p>
                  <p className="font-medium text-gray-700">x{addon.qty}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
