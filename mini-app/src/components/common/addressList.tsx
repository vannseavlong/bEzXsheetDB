import React, { useState, useRef, useEffect } from 'react';
import type { AddressAttributes } from '@/types/api';
import Icon from '@/assets/icons/icon-asset';
import { Delete02Icon } from 'hugeicons-react';
import { useTranslation } from 'node_modules/react-i18next';

interface AddressDetailsCardProps extends AddressAttributes {
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onSelect?: (address: string) => void; // New prop for submit
  isSelected?: boolean;
}

const AddressDetailsCard: React.FC<AddressDetailsCardProps> = ({
  address,
  onClick,
  onEdit,
  onDelete,
  onSelect,
  isSelected = false
}) => {
  const { t } = useTranslation();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleClick = () => {
    if (onClick) {
      onClick();
    }

    if (onSelect) {
      onSelect(address); // submit or log the address
    } else {
      console.log('AddressDetailsCard clicked:', address);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-start gap-3 p-4 bg-[#FFF] transition-colors text-left rounded-[6px] border border-[#ECECEC] hover:bg-[#F5FAFF] cursor-pointer relative"
      style={{ boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.11)' }}>
      {/* Three-dot menu button - only show when NOT selected */}
      {!isSelected && (
        <button
          ref={menuButtonRef}
          onClick={(e) => {
            e.stopPropagation();
            setShowDropdown(!showDropdown);
          }}
          className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full transition-colors z-10">
          <Icon name="threedotIcon" />
        </button>
      )}

      <div className="w-[32px] h-[32px] bg-[#E8F0F7] rounded-full flex items-center justify-center flex-shrink-0">
        <div className="w-[19.2px] h-[19.2px]">
          <Icon name="mapIcon" />
        </div>
      </div>

      <div className={`flex-1 ${!isSelected ? 'pr-6' : ''}`}>
        <p className="text-sm font-medium text-gray-700 leading-relaxed">
          <span className="font-semibold">{t('addressList.addressDetails')}</span> {address}
        </p>
      </div>

      {/* Dropdown menu - only show when NOT selected */}
      {!isSelected && showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute top-8 right-2 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[120px]"
          onClick={(e) => e.stopPropagation()}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowDropdown(false);
              onEdit?.();
            }}
            className="flex items-center gap-3 w-full px-3 py-2 text-left text-sm text-[#262626] hover:bg-gray-50 first:rounded-t-lg">
            <Icon name="pencil1" />
            {t('addressList.edit')}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowDropdown(false);
              onDelete?.();
            }}
            className="flex items-center gap-4 w-full px-3 py-2 text-left text-sm text-[#262626] hover:bg-red-50 last:rounded-b-lg">
            <Delete02Icon className="w-4 h-4 text-red-600" />
            {t('addressList.delete')}
          </button>
        </div>
      )}
    </div>
  );
};

export default AddressDetailsCard;
