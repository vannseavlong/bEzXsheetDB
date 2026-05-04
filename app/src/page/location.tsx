import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PlusSignCircleIcon } from 'hugeicons-react';
import AddressDetailsCard from '@/components/common/addressList';
import DeleteLocationDialog from '@/components/common/delete-location-dialog';
import { useAddressContext } from '@/context/AddressContext';
import useAddressQuery from '../hooks/use-address-query';
import useDeleteAddressMutation from '../hooks/use-delete-address-mutation';
import type { AddressAttributes } from '@/types/api';
import { toast } from 'sonner';
import useNavigationTitle from '@/hooks/use-navigation-title';
import { useTranslation } from 'react-i18next';
import { useLocationDistanceGuard } from '@/hooks/use-location-distance-guard';
import LocationDistanceDialog from '@/components/common/location-distance-dialog';

const Location: React.FC = () => {
  const { t } = useTranslation();
  const { data: addressList = [], isLoading, isError } = useAddressQuery();
  const { mutate: deleteAddress } = useDeleteAddressMutation();
  const navigate = useNavigate();
  const { selectedAddress, setSelectedAddress } = useAddressContext();
  const { productId, serviceId } = useParams();
  const { isDistanceDialogOpen, distanceResult, checkDistanceAndOpenDialog, closeDistanceDialog } =
    useLocationDistanceGuard();

  // Set navigation bar title
  useNavigationTitle(t('location.location'));

  // Delete dialog state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<AddressAttributes | null>(null);

  const handleAddLocation = () => {
    navigate(`/checkout/${productId}/${serviceId}/add-location`);
  };

  const handleAddressClick = async (address: AddressAttributes) => {
    const latitude = Number(address.latitude);
    const longitude = Number(address.longitude);

    const isExceeded = await checkDistanceAndOpenDialog({
      latitude,
      longitude
    });

    if (isExceeded) {
      return;
    }

    setSelectedAddress(address.address);
    navigate(-1);
  };

  const handleEditAddress = (address: AddressAttributes) => {
    navigate(`/checkout/${productId}/${serviceId}/add-location`, {
      state: {
        editMode: true,
        addressData: address
      }
    });
  };

  const handleDeleteAddress = (address: AddressAttributes) => {
    setAddressToDelete(address);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (!addressToDelete) return;

    deleteAddress(addressToDelete.id, {
      onSuccess: () => {
        toast.success(t('location.addressDeletedSuccess'));
        if (selectedAddress === addressToDelete.address) {
          setSelectedAddress('');
        }
        setShowDeleteDialog(false);
        setAddressToDelete(null);
      },
      onError: (error) => {
        console.error('Delete error:', error);
        toast.error(t('location.failedToDeleteAddress'));
        setShowDeleteDialog(false);
        setAddressToDelete(null);
      }
    });
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
    setAddressToDelete(null);
  };

  useEffect(() => {
    if (addressList.length === 0) {
      setSelectedAddress('');
    }
  }, [addressList, setSelectedAddress]);

  return (
    <div className="bg-[#F5F5F5] min-h-screen">
      {/* Add New Location - Fixed at top */}
      <div className="fixed top-0 left-0 right-0 bg-[#F5F5F5] px-4 pt-4 z-10">
        <button
          onClick={handleAddLocation}
          className="flex items-center gap-3 px-4 py-3 w-full bg-white transition-colors text-left rounded-[6px] border border-[#ECECEC] shadow-custom"
          style={{ boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.11)' }}>
          <PlusSignCircleIcon className="w-[21px] h-[21px] text-[#102C90] flex-shrink-0" />
          <span className="text-sm font-bold text-black">{t('location.addNewLocationBtn')}</span>
        </button>
      </div>

      {/* Address List - with top padding */}
      <div className="pt-14 px-4">
        <div className="mt-6 space-y-4">
          {isLoading && <div>{t('location.loadingAddresses')}</div>}
          {isError && <div className="text-red-500">{t('location.errorLoadingAddresses')}</div>}
          {addressList.map((item) => (
            <AddressDetailsCard
              key={item.id}
              {...item}
              onClick={() => handleAddressClick(item)}
              onEdit={() => handleEditAddress(item)}
              onDelete={() => handleDeleteAddress(item)}
              onSelect={(address) => console.log('Submitting address:', address)}
              isSelected={selectedAddress === item.address}
            />
          ))}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteLocationDialog
        isOpen={showDeleteDialog}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />

      <LocationDistanceDialog
        isOpen={isDistanceDialogOpen}
        onClose={closeDistanceDialog}
        maxDistanceKm={distanceResult?.maxDistanceKm}
      />
    </div>
  );
};

export default Location;
