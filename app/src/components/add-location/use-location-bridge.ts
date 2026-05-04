import { useCallback, useEffect, useState } from 'react';
import type { RefObject } from 'react';
import * as pkg from 'web-bridge-gateway';
import { parseCoordinates } from './utils';
import type { AddressAttributes } from '@/types/api';

const { registerHandler, callHandler } = pkg;

type UseLocationBridgeParams = {
  isLoaded: boolean;
  isEditMode: boolean;
  editAddressData?: AddressAttributes;
  mapRef: RefObject<google.maps.Map | null>;
  onLocationReceived: (coords: { lat: number; lng: number }) => void;
};

export const useLocationBridge = ({
  isLoaded,
  isEditMode,
  editAddressData,
  mapRef,
  onLocationReceived
}: UseLocationBridgeParams) => {
  const [hasCenteredEditLocation, setHasCenteredEditLocation] = useState(false);

  const requestCurrentLocation = useCallback(async () => {
    await callHandler('requestCurrentLocation');
  }, []);

  useEffect(() => {
    const handlerName = 'getCurrentLocation';

    const handler = (data: object) => {
      const payload = data as { latitude?: string; longitude?: string };
      const coordinates = parseCoordinates(payload.latitude, payload.longitude);

      if (!coordinates) {
        return;
      }

      onLocationReceived(coordinates);

      if (mapRef.current) {
        mapRef.current.panTo(coordinates);
      }
    };

    registerHandler(handlerName, handler, 0);

    return () => {
      console.log(`${handlerName} unregistered`);
    };
  }, [mapRef, onLocationReceived]);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (!isEditMode) {
      requestCurrentLocation().catch((error) => {
        alert(error);
      });

      return;
    }

    if (!editAddressData || hasCenteredEditLocation || !mapRef.current) {
      return;
    }

    const editCoordinates = parseCoordinates(editAddressData.latitude, editAddressData.longitude);

    if (!editCoordinates) {
      return;
    }

    mapRef.current.panTo(editCoordinates);
    setHasCenteredEditLocation(true);
  }, [
    editAddressData,
    hasCenteredEditLocation,
    isEditMode,
    isLoaded,
    mapRef,
    requestCurrentLocation
  ]);

  return {
    requestCurrentLocation
  };
};
