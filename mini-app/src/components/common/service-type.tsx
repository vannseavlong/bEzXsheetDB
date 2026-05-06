import type { ProductAttributes } from '@/types/api';
import React from 'react';
import Icon from '@/assets/icons/icon-asset';
import { InformationCircleIcon } from 'hugeicons-react';
import Qty from './qty';
import { useTranslation } from 'node_modules/react-i18next';
import { getLocalizedName } from '@/lib/language-helper';

type Props = {
  service: ProductAttributes;
  isActive: boolean;
  onClick: () => void;
  onInfoClick?: () => void;
  quantity?: number;
};

const ServiceType: React.FC<Props> = ({
  service,
  isActive,
  onClick,
  onInfoClick,
  quantity = 0
}) => {
  const { t, i18n } = useTranslation();
  const serviceName = getLocalizedName(
    {
      nameEn: service.nameEn,
      nameKm: service.nameKm || undefined,
      nameVi: service.nameVi || undefined,
      nameCn: service.nameCn || undefined,
      nameTw: service.nameTw || undefined
    },
    i18n.language
  );
  const hasInfo =
    service.infoEn || service.infoKm || service.infoVi || service.infoCn || service.infoTw;
  const { floorCount, bedroomCount } = service;

  const handleInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onInfoClick?.();
  };

  return (
    <div
      onClick={onClick}
      className={`rounded-[6px] cursor-pointer 
        ${isActive ? 'border-1 border-[#1B4CFA] bg-[#E8F0F7]' : 'border-1 border-[#d7d5d5]'}`}>
      <div className="flex flex-col p-3 rounded-lg">
        {/* Row for service name and amount (when hasInfo is false) */}
        <div className="flex flex-row justify-between w-full pb-[8px]">
          <h3 className="text-lg font-semibold">{serviceName}</h3>
          <div className="flex items-center gap-1">
            {!hasInfo && <p className="font-bold text-lg text-right">${service.amount}</p>}
            {hasInfo && (
              <button
                onClick={handleInfoClick}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                <InformationCircleIcon size={24} className="text-[#1B4CFA]" />
              </button>
            )}
          </div>
        </div>

        {floorCount && bedroomCount && (
          <div className="flex-col text-[#4a4f52] text-[16px] pb-[6px]">
            <p>
              {t('common.floors')}: {floorCount} | {t('common.bedroom')}: {bedroomCount}
            </p>
          </div>
        )}

        {/* Row for hour/cleaner info and a separate div for Qty/amount */}
        <div className="flex flex-row items-center justify-between w-full text-[#4a4f52] text-[15px] ">
          {/* Left side: hour and cleaner */}
          <div className="flex items-center gap-2">
            <Icon name="clockIcon" />
            <p>
              {service.hourCount} {t('common.hours')}
            </p>
            <Icon name="userGroupIcon" />
            <p>
              {service.cleanerCount}{' '}
              {Number(service.cleanerCount) > 1 ? t('common.cleaners') : t('common.cleaner')}
            </p>
          </div>
          {/* Right side: Qty and Amount (conditionally rendered) */}
          <div className="flex items-center gap-2">
            {quantity > 0 && <Qty quantity={quantity} />}
            {hasInfo && <p className="font-bold text-lg text-right">${service.amount}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceType;
