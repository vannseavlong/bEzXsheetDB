import type { CategoryProduct } from '@/types/api';
import React from 'react';
import Icon from '@/assets/icons/icon-asset';
import { InformationCircleIcon } from 'hugeicons-react';
import Qty from './qty';
import { useTranslation } from 'react-i18next';
import { getLocalizedName } from '@/lib/language-helper';

type Props = {
  product: CategoryProduct;
  isActive: boolean;
  onClick: () => void;
  onInfoClick?: () => void;
  quantity?: number;
};

const ProductCard: React.FC<Props> = ({ product, isActive, onClick, onInfoClick, quantity = 0 }) => {
  const { t, i18n } = useTranslation();
  const productName = getLocalizedName(product, i18n.language);
  const durationHours = product.duration > 0 ? Math.round(product.duration / 60) : null;

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
        {/* Row for product name and amount/info */}
        <div className="flex flex-row justify-between w-full pb-[8px]">
          <h3 className="text-lg font-semibold">{productName}</h3>
          <div className="flex items-center gap-1">
            <p className="font-bold text-lg text-right">${product.amount}</p>
            {onInfoClick && (
              <button
                onClick={handleInfoClick}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                <InformationCircleIcon size={24} className="text-[#1B4CFA]" />
              </button>
            )}
          </div>
        </div>

        {/* Row for duration info and Qty */}
        <div className="flex flex-row items-center justify-between w-full text-[#4a4f52] text-[15px] ">
          <div className="flex items-center gap-2">
            {durationHours !== null && (
              <>
                <Icon name="clockIcon" />
                <p>
                  {durationHours} {t('common.hours')}
                </p>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            {quantity > 0 && <Qty quantity={quantity} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
