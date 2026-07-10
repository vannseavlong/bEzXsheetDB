import type { CategoryAddon } from '@/types/api';
import React from 'react';
import Icon from '@/assets/icons/icon-asset';
import { useTranslation } from 'react-i18next';
import { getLocalizedName } from '@/lib/language-helper';

type Props = {
  data: CategoryAddon;
  onClick: () => void;
  isSelected?: boolean;
  quantity?: number;
  onIncrement?: () => void;
  onDecrement?: () => void;
  onQuantityClick?: () => void;
};

const CategoryAddonItem: React.FC<Props> = ({
  data,
  onClick,
  isSelected = false,
  quantity = 0,
  onIncrement,
  onDecrement,
  onQuantityClick
}) => {
  const { i18n } = useTranslation();

  const handleQuantityAction = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  const badge = i18n.language.startsWith('km') ? (data.badgeKm ?? data.badgeEn) : data.badgeEn;

  return (
    <div
      onClick={onClick}
      className="flex w-[100px] min-w-[100px] flex-col items-center cursor-pointer shrink-0">
      <div className="relative w-[100px] h-[100px]">
        <div className="w-full h-full flex items-center justify-center rounded-md bg-gray-50 border border-gray-100 px-2 text-center">
          <p className="text-xs font-semibold text-[#1B4CFA]">{badge}</p>
        </div>

        {isSelected && quantity > 0 && (
          <div className="absolute -bottom-2 right-0 flex max-w-full rounded-full border border-blue-600 bg-white px-1 shadow-sm">
            {onDecrement && (
              <button
                onClick={(e) => handleQuantityAction(e, onDecrement)}
                className="text-blue-600 font-bold text-lg w-6 h-6 flex items-center justify-center">
                <Icon name="MinusIcon" />
              </button>
            )}
            <span
              onClick={
                onQuantityClick ? (e) => handleQuantityAction(e, onQuantityClick) : undefined
              }
              className="text-sm font-medium min-w-[20px] text-center cursor-pointer">
              {quantity}
            </span>
            {onIncrement && (
              <button
                onClick={(e) => handleQuantityAction(e, onIncrement)}
                className="text-blue-600 font-bold text-lg w-6 h-6 flex items-center justify-center">
                <Icon name="PlusIcon" />
              </button>
            )}
          </div>
        )}

        {/* Blue plus button at bottom-right when not selected */}
        {(!isSelected || quantity === 0) && (
          <span className="absolute -bottom-0 -right-0 bg-white rounded-full">
            <Icon name="plusIcon" />
          </span>
        )}
      </div>
      <p
        className="mt-2 w-full truncate text-center text-sm font-medium"
        title={getLocalizedName(data, i18n.language)}>
        {getLocalizedName(data, i18n.language)}
      </p>
    </div>
  );
};

export default CategoryAddonItem;
