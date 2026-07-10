import React, { useRef, useState } from 'react';
import { toast } from 'sonner';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useJsApiLoader } from '@react-google-maps/api';
import SearchLocationModal from '@/components/common/search-location-modal';
import { useAddressMutation } from '@/hooks/use-new-address-mutation';
import type { NewAddressPayload } from '@/types/api';
import AddLocationForm from '../components/add-location/add-location-form';
import AddLocationMap from '../components/add-location/add-location-map';
import { GOOGLE_MAP_LIBRARIES, INITIAL_CENTER } from '../components/add-location/constants';
import type { AddLocationRouteState, UserLocation } from '../components/add-location/types';
import { parseCoordinates, reverseGeocode } from '../components/add-location/utils';
import { useLocationBridge } from '../components/add-location/use-location-bridge';
import { useLocationSearch } from '../components/add-location/use-location-search';
import useNavigationTitle from '@/hooks/use-navigation-title';
import { useAddressContext } from '@/context/AddressContext';
import { useTranslation } from 'react-i18next';
import { useLocationDistanceGuard } from '@/hooks/use-location-distance-guard';
import LocationDistanceDialog from '@/components/common/location-distance-dialog';

const AddLocation: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { productId, serviceId } = useParams();
  const { setSelectedAddress } = useAddressContext();
  const { isDistanceDialogOpen, distanceResult, checkDistanceAndOpenDialog, closeDistanceDialog } =
    useLocationDistanceGuard();

  const routeState = (location.state as AddLocationRouteState | null) ?? null;
  const isEditMode = Boolean(routeState?.editMode);

  // Set navigation bar title based on mode
  useNavigationTitle(isEditMode ? t('addLocation.editLocation') : t('addLocation.addLocation'));
  const editAddressData = routeState?.addressData;

  const initialEditCoordinates = parseCoordinates(
    editAddressData?.latitude,
    editAddressData?.longitude
  );

  const [marker, setMarker] = useState(initialEditCoordinates ?? INITIAL_CENTER);
  const [address, setAddress] = useState(
    isEditMode && editAddressData ? editAddressData.address : ''
  );
  const [floor, setFloor] = useState(
    isEditMode && editAddressData ? (editAddressData.floorNum ?? '') : ''
  );
  const [room, setRoom] = useState(
    isEditMode && editAddressData ? (editAddressData.roomNum ?? '') : ''
  );
  const [note, setNote] = useState(
    isEditMode && editAddressData ? (editAddressData.note ?? '') : ''
  );
  const [zoom, setZoom] = useState(15);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);

  const { mutate, isPending } = useAddressMutation();
  const mapRef = useRef<google.maps.Map | null>(null);

  const updateAddressFromCoordinates = (lat: number, lng: number) => {
    reverseGeocode({ lat, lng }, setAddress);
  };

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY!,
    libraries: GOOGLE_MAP_LIBRARIES
  });

  const { requestCurrentLocation } = useLocationBridge({
    isLoaded,
    isEditMode,
    editAddressData,
    mapRef,
    onLocationReceived: ({ lat, lng }) => {
      setMarker({ lat, lng });
      setUserLocation({ lat, lng });
    }
  });

  const handleCenterToUser = async () => {
    try {
      await requestCurrentLocation();
    } catch (error) {
      alert(error);
    }
  };

  const {
    showSearchModal,
    setShowSearchModal,
    searchQuery,
    searchSuggestions,
    handleSearchQuery,
    handleSelectLocation,
    handleUseCurrentLocationFromModal,
    handleCloseSearchModal,
    handleClearSearch
  } = useLocationSearch({
    onLocationSelected: (coordinates, selectedAddress) => {
      setMarker(coordinates);
      setAddress(selectedAddress);

      if (mapRef.current) {
        mapRef.current.panTo(coordinates);
        mapRef.current.setZoom(16);
      }
    },
    onUseCurrentLocation: handleCenterToUser
  });

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (!event.latLng) {
      return;
    }

    const coordinates = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    };

    setMarker(coordinates);
    updateAddressFromCoordinates(coordinates.lat, coordinates.lng);
  };

  const handleMapIdle = (coordinates: { lat: number; lng: number }) => {
    setMarker(coordinates);
    updateAddressFromCoordinates(coordinates.lat, coordinates.lng);
  };

  const handleSubmit = () => {
    const payload: NewAddressPayload = {
      name: address,
      latitude: marker.lat,
      longitude: marker.lng,
      address,
      addressDetail: '',
      floorNum: floor,
      roomNum: room,
      note
    };

    const operationPayload = {
      ...payload,
      ...(isEditMode && editAddressData ? { id: editAddressData.id, isEditMode: true } : {})
    };

    mutate(operationPayload, {
      onSuccess: async () => {
        const isExceeded = await checkDistanceAndOpenDialog({
          latitude: marker.lat,
          longitude: marker.lng
        });

        if (isExceeded) {
          return;
        }

        toast.success(
          isEditMode
            ? t('addLocation.locationUpdatedSuccess')
            : t('addLocation.locationSavedSuccess')
        );

        // Save the address to localStorage for checkout page to use
        if (typeof window !== 'undefined') {
          localStorage.setItem('selectedAddress', address);
        }
        setSelectedAddress(address);

        setTimeout(() => {
          if (productId && serviceId) {
            navigate(-2);
            return;
          }

          navigate('/location', { replace: true });
        }, 1000);
      },
      onError: (error: unknown) => {
        let errorMessage = 'Unknown error';

        if (
          error &&
          typeof error === 'object' &&
          'message' in error &&
          typeof (error as { message?: string }).message === 'string'
        ) {
          errorMessage = (error as { message: string }).message;
        }

        toast.error(`${t('addLocation.failedToSaveLocation')}: ${errorMessage}`);
      }
    });
  };

  return (
    <div className="bg-white min-h-screen relative">
      <div className="relative">
        <AddLocationMap
          isLoaded={isLoaded}
          zoom={zoom}
          onZoomChange={setZoom}
          userLocation={userLocation}
          onCenterToUser={handleCenterToUser}
          isEditMode={isEditMode}
          editAddressData={editAddressData}
          showSearchModal={showSearchModal}
          onMapReady={(map) => {
            mapRef.current = map;
          }}
          onMapClick={handleMapClick}
          onMapIdle={handleMapIdle}
        />
      </div>

      <AddLocationForm
        address={address}
        floor={floor}
        room={room}
        note={note}
        isPending={isPending}
        isEditMode={isEditMode}
        onAddressFocus={() => setShowSearchModal(true)}
        onFloorChange={setFloor}
        onRoomChange={setRoom}
        onNoteChange={setNote}
        onSubmit={handleSubmit}
      />

      <SearchLocationModal
        isOpen={showSearchModal}
        onClose={handleCloseSearchModal}
        searchQuery={searchQuery}
        onSearchQueryChange={handleSearchQuery}
        searchSuggestions={searchSuggestions}
        onSelectLocation={handleSelectLocation}
        onUseCurrentLocation={handleUseCurrentLocationFromModal}
        onClearSearch={handleClearSearch}
      />

      <LocationDistanceDialog
        isOpen={isDistanceDialogOpen}
        onClose={closeDistanceDialog}
        maxDistanceKm={distanceResult?.maxDistanceKm}
      />
    </div>
  );
};

export default AddLocation;
