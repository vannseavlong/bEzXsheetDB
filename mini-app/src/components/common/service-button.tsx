import React from 'react';
import type { ServiceCategory } from '@/types/api';
import Icon from '@/assets/icons/icon-asset';
import { useTranslation } from 'node_modules/react-i18next';
import { getLocalizedName } from '@/lib/language-helper';

type props = {
  service: ServiceCategory;
  isActive: boolean;
  onClick?: () => void;
};
const ServiceButton: React.FC<props> = ({ service, isActive, onClick }) => {
  const { i18n } = useTranslation();

  return (
    <button
      onClick={onClick}
      className="text-sm font-medium transition-colors cursor-pointer shrink-0 w-[88px]">
      <div className="flex flex-col items-center justify-center">
        <div
          className={`relative w-[64px] h-[64px] flex items-center justify-center rounded-lg border-2 ${isActive ? 'border-[#1B4CFA]' : 'border-transparent'
            }`}>
          <img src={service.iconUrl} className="w-[48px] h-[48px]" />
          {isActive && (
            <span className="absolute -top-2 -right-2 bg-white rounded-full shadow-sm">
              <Icon name="CheckIcon" />
            </span>
          )}
        </div>
        <p
          className={`mt-2 text-center text-sm
          ${isActive ? 'text-[#1B4CFA] font-semibold' : 'text-black'}`}>
          {getLocalizedName(service, i18n.language)}
        </p>
      </div>
    </button>
  );
};
export default ServiceButton;
