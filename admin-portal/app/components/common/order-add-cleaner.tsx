import IconAsset from '@/asset/icons/icon-assets';
import React, { useState } from 'react';
import { Minus as MinusSignIcon, Plus as PlusSignIcon } from 'lucide-react';

interface QuantityControlProps {
  initialQuantity?: number;
  serviceNumber?: number;
}

const QuantityControl: React.FC<QuantityControlProps> = ({
  initialQuantity = 0,
  serviceNumber = 1
}) => {
  const [quantity, setQuantity] = useState<number>(initialQuantity);

  const handleDecrease = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  return (
    <div className="max-w-md mx-auto mb-6 bg-white  p-6  ">
      {/* Service Title */}
      <h4 className="text-lg font-bold text-gray-900 mb-6">Service {serviceNumber}</h4>

      {/* Service Details */}
      <div className="flex items-center justify-between">
        {/* Icon and Service Name */}
        <div className="flex items-center gap-4">
          <div className="shrink-0">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <IconAsset.Cleaner />
            </div>
          </div>
          <span className="text-lg font-medium text-gray-900">Cleaner</span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2 text-lg font-medium text-gray-900">
            <MinusSignIcon
              size={24}
              color="#000000"
              strokeWidth={1.5}
              onClick={handleDecrease}
              className="cursor-pointer "
            />
            <span>{quantity}</span>
            <PlusSignIcon
              size={24}
              color="#000000"
              strokeWidth={1.5}
              onClick={handleIncrease}
              className="cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default QuantityControl;
