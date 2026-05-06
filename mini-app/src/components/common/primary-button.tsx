import React from 'react';
import { Button } from '../ui/button';

interface PrimaryButtonProps {
  leftText?: string;
  rightText?: string;
  singleText?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  variant?: 'fixed' | 'relative'; // New prop for positioning
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  leftText,
  rightText,
  singleText,
  onClick,
  className = '',
  disabled = false,
  variant = 'fixed'
}) => {
  // If singleText is provided, use it. Otherwise use leftText and rightText
  const isSingleText = !!singleText;
  const displayLeftText = singleText || leftText;
  const displayRightText = rightText;

  // Base classes for the button
  const baseClasses = 'text-white h-12 shadow-lg rounded-full';

  // Background classes based on disabled state
  const backgroundClasses = disabled
    ? 'bg-gray-400 cursor-not-allowed'
    : 'bg-primary-gradient hover:bg-primary-gradient';

  // Conditional classes based on variant
  const variantClasses =
    variant === 'fixed'
      ? 'fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] md:w-[400px] z-50'
      : 'relative w-full';

  return (
    <>
      <Button
        onClick={onClick}
        disabled={disabled}
        className={`${baseClasses} ${backgroundClasses} ${variantClasses} ${className}`}>
        {isSingleText ? (
          // Single text - centered
          <span className="text-center w-full font-[18px]">{displayLeftText}</span>
        ) : (
          // Two texts - left and right
          <div className="flex justify-between items-center w-full">
            <span className="font-[18px]">{displayLeftText}</span>
            <span className="font-[18px]">{displayRightText}</span>
          </div>
        )}
      </Button>
    </>
  );
};

export default PrimaryButton;
