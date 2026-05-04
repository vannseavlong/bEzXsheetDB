import React, { useState } from 'react';
import { MinusSignIcon, PlusSignIcon } from 'hugeicons-react';
import { PlusCircleIcon } from 'lucide-react';

interface QuantityControlProps {
  initialQuantity?: number;
  onChange?: (value: number) => void; // notify parent
}

const QuantityControl: React.FC<QuantityControlProps> = ({ initialQuantity = 0, onChange }) => {
  const [quantity, setQuantity] = useState<number>(initialQuantity);
  const [isActive, setIsActive] = useState<boolean>(false);

  const handleDecrease = () => {
    if (quantity > 1) {
      const newQty = quantity - 1;
      setQuantity(newQty);
      onChange?.(newQty);
    } else {
      setQuantity(0);
      setIsActive(false);
      onChange?.(0);
    }
  };

  const handleIncrease = () => {
    const newQty = quantity + 1;
    setQuantity(newQty);
    onChange?.(newQty);
  };

  const handleActivate = () => {
    setIsActive(true);
    setQuantity(1);
    onChange?.(1);
  };

  return (
    <div className="mb-2">
      {!isActive ? (
        <PlusCircleIcon
          color="#1964AD"
          size={28}
          className="cursor-pointer"
          onClick={handleActivate}
        />
      ) : (
        <div className="flex items-center space-x-3 text-lg font-medium text-gray-900 border-1 rounded-2xl border-[#1B4CFA]">
          <MinusSignIcon
            size={24}
            strokeWidth={1.5}
            onClick={handleDecrease}
            className="cursor-pointer"
          />
          <span>{quantity}</span>
          <PlusSignIcon
            size={24}
            strokeWidth={1.5}
            onClick={handleIncrease}
            className="cursor-pointer"
          />
        </div>
      )}
    </div>
  );
};

export default QuantityControl;
