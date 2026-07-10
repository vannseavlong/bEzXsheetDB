import { useCallback, useState } from 'react';
import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import type { DistanceCheckData, DistanceCheckPayload } from '@/types/api';

export const useLocationDistanceGuard = () => {
  const [isDistanceDialogOpen, setIsDistanceDialogOpen] = useState(false);
  const [distanceResult, setDistanceResult] = useState<DistanceCheckData | null>(null);
  const [isCheckingDistance, setIsCheckingDistance] = useState(false);

  const checkDistanceAndOpenDialog = useCallback(async (payload: DistanceCheckPayload) => {
    if (!Number.isFinite(payload.latitude) || !Number.isFinite(payload.longitude)) {
      return false;
    }

    try {
      setIsCheckingDistance(true);
      const response: DistanceCheckData = await api.post(API_ENDPOINT.ADDRESS_DISTANCE, payload);

      if (response.isExceeded) {
        setDistanceResult(response);
        setIsDistanceDialogOpen(true);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Distance check failed:', error);
      return false;
    } finally {
      setIsCheckingDistance(false);
    }
  }, []);

  const closeDistanceDialog = useCallback(() => {
    setIsDistanceDialogOpen(false);
  }, []);

  return {
    isDistanceDialogOpen,
    isCheckingDistance,
    distanceResult,
    checkDistanceAndOpenDialog,
    closeDistanceDialog
  };
};
