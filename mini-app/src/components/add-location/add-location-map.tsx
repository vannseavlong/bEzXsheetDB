import React, { useRef } from 'react';
import { GoogleMap, Marker, TrafficLayer } from '@react-google-maps/api';
import { MinusSignIcon, PlusSignIcon } from 'hugeicons-react';
import Icon from '@/assets/icons/icon-asset';
import { INITIAL_CENTER, MAP_CONTAINER_STYLE } from './constants';
import type { UserLocation } from './types';
import { createUserLocationMarkerIcon, parseCoordinates } from './utils';
import type { AddressAttributes } from '@/types/api';

type AddLocationMapProps = {
  isLoaded: boolean;
  zoom: number;
  onZoomChange: React.Dispatch<React.SetStateAction<number>>;
  userLocation: UserLocation | null;
  onCenterToUser: () => void;
  isEditMode: boolean;
  editAddressData?: AddressAttributes;
  showSearchModal: boolean;
  onMapReady: (map: google.maps.Map) => void;
  onMapClick: (event: google.maps.MapMouseEvent) => void;
  onMapIdle: (coordinates: { lat: number; lng: number }) => void;
};

const AddLocationMap: React.FC<AddLocationMapProps> = ({
  isLoaded,
  zoom,
  onZoomChange,
  userLocation,
  onCenterToUser,
  isEditMode,
  editAddressData,
  showSearchModal,
  onMapReady,
  onMapClick,
  onMapIdle
}) => {
  const mapRef = useRef<google.maps.Map | null>(null);

  if (!isLoaded) {
    return <div className="h-[350px] flex items-center justify-center">Loading map...</div>;
  }

  return (
    <>
      <GoogleMap
        mapContainerStyle={MAP_CONTAINER_STYLE}
        center={INITIAL_CENTER}
        zoom={zoom}
        onLoad={(map) => {
          mapRef.current = map;
          onMapReady(map);

          if (!isEditMode || !editAddressData) {
            return;
          }

          const coordinates = parseCoordinates(
            editAddressData.latitude?.toString(),
            editAddressData.longitude?.toString()
          );

          if (!coordinates) {
            return;
          }

          map.panTo(coordinates);
          map.setZoom(15);
        }}
        onClick={onMapClick}
        onIdle={() => {
          const center = mapRef.current?.getCenter();

          if (!center || showSearchModal) {
            return;
          }

          onMapIdle({ lat: center.lat(), lng: center.lng() });
        }}
        options={{
          disableDefaultUI: true,
          zoomControl: false
        }}>
        {userLocation && (
          <Marker
            position={{ lat: userLocation.lat, lng: userLocation.lng }}
            icon={createUserLocationMarkerIcon(userLocation.heading)}
          />
        )}

        <TrafficLayer />
      </GoogleMap>

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full z-10 pointer-events-none">
        <svg width="32" height="44" viewBox="0 0 32 44" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M16 0C7.2 0 0 7.2 0 16c0 12 16 28 16 28s16-16 16-28C32 7.2 24.8 0 16 0zm0 22c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z"
            fill="#ff2a00ff"
          />
        </svg>
      </div>

      <div className="absolute top-16 right-3 z-20 flex flex-col gap-3">
        <button
          type="button"
          onClick={() => onZoomChange((value) => Math.min(value + 1, 21))}
          className="w-10 h-10 rounded-xl bg-white shadow-md border-none mb-2 flex items-center justify-center">
          <span className="text-2xl text-[#102C90]">
            <PlusSignIcon />
          </span>
        </button>

        <button
          type="button"
          onClick={() => onZoomChange((value) => Math.max(value - 1, 1))}
          className="w-10 h-10 rounded-xl bg-white shadow-md border-none mb-2 flex items-center justify-center">
          <span className="text-2xl text-[#102C90]">
            <MinusSignIcon />
          </span>
        </button>
      </div>

      <div className="absolute top-55 right-2 z-20">
        <button
          type="button"
          onClick={onCenterToUser}
          className="w-14 h-14 rounded-full bg-white shadow-md border-none flex items-center justify-center">
          <Icon name="radarIcon" />
        </button>
      </div>
    </>
  );
};

export default AddLocationMap;
