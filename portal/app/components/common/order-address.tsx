import clsx from 'clsx';
import { MapsIcon } from 'hugeicons-react';
import React from 'react';

const OrderAddress: React.FC<{ address?: string; lat?: string; lng?: string }> = ({
  address,
  lat,
  lng
}) => {
  const openMap = () => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank');
  };

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <p className="text-[#707070] font-medium text-sm font-inter">Address</p>
        <button
          onClick={openMap}
          className={clsx(
            'flex items-center gap-1 text-sm text-primary hover:underline focus:outline-none',
            {
              hidden: !lng || !lng
            }
          )}
        >
          View Map
          <MapsIcon size={18} strokeWidth={1.5} color="#102C90" />
        </button>
      </div>
      <p className="text-black font-medium text-sm font-inter">{address}</p>
    </div>
  );
};
export default OrderAddress;
