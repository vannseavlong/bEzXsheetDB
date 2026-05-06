import React from 'react';
import { useAddressContext } from '@/context/AddressContext';
import { useNavigate, useParams } from 'react-router-dom';
import { Location01Icon } from 'hugeicons-react';
import Icon from '@/assets/icons/icon-asset';
import { useTranslation } from 'node_modules/react-i18next';

interface AddressProps {
  address?: string;
  onChangeClick?: () => void;
  showButton?: boolean;
}

const AddressInterface: React.FC<AddressProps> = ({
  address,
  onChangeClick,
  showButton = true
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { selectedAddress } = useAddressContext();
  const { productId, serviceId } = useParams();

  const handleAddClick = () => {
    if (onChangeClick) {
      onChangeClick();
    }
    // Pass selectedServices from localStorage if available
    const selectedServices = localStorage.getItem('selectedServices');
    navigate(`/checkout/${productId}/${serviceId}/location`, {
      state: { selectedServices: selectedServices ? JSON.parse(selectedServices) : [] }
    });
  };

  const hasAddress =
    (selectedAddress && selectedAddress?.trim() !== '') || (address && address?.trim() !== '');

  return (
    <div>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-2">
          <Location01Icon className="w-[24px] h-[24px] text-[#1A1A1A] flex-shrink-0" />
          <div>
            <h1 className="text-base font-bold text-[#1A1A1A] mb-3">
              {t('location.addressDetails')}
            </h1>
          </div>
        </div>
        {showButton && (
          <button
            onClick={handleAddClick}
            className="flex items-center gap-1 hover:opacity-80 transition-opacity ml-4 flex-shrink-0">
            <span className="text-[14px] font-medium text-primary-gradient mr-1">
              {selectedAddress ? t('common.change') : t('common.add')}
            </span>
            {hasAddress ? <Icon name="pencilGradient" /> : <Icon name="plusLineGradient" />}
          </button>
        )}
      </div>
      <div className="ml-0">
        <p className="text-sm text-gray-600">
          {hasAddress ? address || selectedAddress : t('location.selectLocation')}
        </p>
      </div>
    </div>
  );
};

export default AddressInterface;
