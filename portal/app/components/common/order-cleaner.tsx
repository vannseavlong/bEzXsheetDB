import IconAsset from '@/asset/icons/icon-assets';
import React from 'react';

const OrderCleaner: React.FC<OrderListAttributes> = (props) => {
  return (
    <div className="max-w-md mx-auto  bg-card  p-6  ">
      {/* Service Title */}
      <h4 className="text-lg font-bold text-gray-900 mb-6">Service </h4>

      {/* Service Details */}
      <div className="flex items-center justify-between">
        {/* Icon and Service Name */}
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <IconAsset.Cleaner />
            </div>
          </div>
          <span className="text-lg font-medium text-gray-900">Cleaner</span>
        </div>

        {/* Quantity */}
        <div className="text-lg font-medium text-gray-900">{props.cleanerCount}</div>
      </div>
    </div>
  );
};
export default OrderCleaner;
