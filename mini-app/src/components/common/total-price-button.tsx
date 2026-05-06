import React from 'react';
import PrimaryButton from './primary-button';
import Icon from '@/assets/icons/icon-asset';
import { useTranslation } from 'node_modules/react-i18next';

interface TotalPriceButtonProps {
  totalPrice?: string;
  originalPrice?: string;
  buttonText?: React.ReactNode;
  showPriceSection?: boolean;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  showQuantityControls?: boolean;
  quantity?: number;
  onIncrement?: () => void;
  onDecrement?: () => void;
}

const TotalPriceButton: React.FC<TotalPriceButtonProps> = ({
  totalPrice,
  // originalPrice,
  buttonText = 'Next',
  showPriceSection = true,
  onClick,
  className = '',
  disabled = false,
  showQuantityControls = false,
  quantity = 0,
  onIncrement,
  onDecrement
}) => {
  const { t } = useTranslation();
  const handleQuantityAction = (e: React.MouseEvent, action?: () => void) => {
    e.stopPropagation();
    if (action) action();
  };

  return (
    <div className="bg-white fixed bottom-0 left-1/2 -translate-x-1/2 w-[100%] md:w-[400px] z-50 shadow-lg">
      {/* Price Section - Only show when showPriceSection is true */}
      {showPriceSection && (
        <div className="p-4 pb-3">
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-semibold text-gray-900">
              {t('checkout.totalPrice')}:
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[20px] font-bold text-primary-gradient inline-block w-fit">
                {totalPrice || '$0.00'}
              </span>
              {/* {originalPrice && (
                <span className="text-[16px] text-gray-400 line-through">{originalPrice}</span>
              )} */}
            </div>
          </div>
        </div>
      )}

      {/* Button Section with Quantity Controls */}
      <div className={`p-4 ${showPriceSection ? 'pt-0' : ''}`}>
        {showQuantityControls && onIncrement && onDecrement ? (
          // When quantity controls are needed, show them on the left side of the button
          <div className="flex items-center gap-4">
            {/* Quantity Controls */}
            <div className="bg-white rounded-full flex items-center px-3 py-2">
              <button
                onClick={(e) => handleQuantityAction(e, onDecrement)}
                className="font-bold text-xl w-8 h-8 flex items-center justify-center border rounded-full">
                <Icon name="MinusIcon" />
              </button>
              <span className="mx-1 text-lg font-medium min-w-[20px] text-center">{quantity}</span>
              <button
                onClick={(e) => handleQuantityAction(e, onIncrement)}
                className="font-bold text-xl w-8 h-8 flex items-center justify-center border rounded-full">
                <Icon name="PlusIcon" />
              </button>
            </div>

            {/* Button taking remaining space */}
            <div className="flex-1">
              <PrimaryButton
                singleText={buttonText}
                onClick={onClick}
                disabled={disabled}
                variant="relative"
                className={className}
              />
            </div>
          </div>
        ) : (
          // When no quantity controls, show full width button
          <PrimaryButton
            singleText={buttonText}
            onClick={onClick}
            disabled={disabled}
            variant="relative"
            className={className}
          />
        )}
      </div>
    </div>
  );
};

export default TotalPriceButton;
