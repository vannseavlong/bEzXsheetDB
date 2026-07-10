import type { PairProduct } from '@/types/api';
import React from 'react';
import Icon from '@/assets/icons/icon-asset';
import { useTranslation } from 'react-i18next';
import { getLocalizedName } from '@/lib/language-helper';
import { toEmbeddableImageUrl } from '@/lib/drive-image';

type Props = {
  data: PairProduct;
  onClick?: () => void;
  isActive?: boolean;
  showPlusIcon?: boolean;
};
const ServicePreview: React.FC<Props> = ({ data, onClick, isActive, showPlusIcon }) => {
  const { i18n } = useTranslation();
  if (!data) return null;
  return (
    <div
      className="text-sm font-medium transition-colors cursor-pointer shrink-0 w-[88px]"
      onClick={onClick}>
      <div className="flex flex-col items-center justify-center">
        <div
          className={`relative w-[64px] h-[64px] flex items-center justify-center rounded-lg border-2 ${
            isActive ? 'border-[#1B4CFA]' : 'border-transparent'
          }`}>
          <img
            src={toEmbeddableImageUrl(data?.thumbnailUrl) || ''}
            className="w-[48px] h-[48px]"
            alt={getLocalizedName(data, i18n.language)}
            loading="lazy"
          />
          {showPlusIcon && !isActive && (
            <span className="absolute -bottom-0 -right-5 bg-white rounded-full">
              <Icon name="plusIcon" />
            </span>
          )}
        </div>
        <p
          className={`mt-2 text-center text-sm
          ${isActive ? 'text-[#1B4CFA] font-semibold' : 'text-black'} whitespace-normal`}>
          {getLocalizedName(data, i18n.language)}
        </p>
      </div>
    </div>
  );
};
export default ServicePreview;
