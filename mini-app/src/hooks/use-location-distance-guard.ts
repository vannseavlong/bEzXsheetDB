import { useCallback, useState } from 'react';
import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import type {
  DistanceCheckData,
  DistanceCheckPayload,
  RawDistanceCheckResponse
} from '@/types/api';

const parseNumber = (value: unknown): number | undefined => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
};

const normalizeDistanceResponse = (raw: unknown): DistanceCheckData => {
  const payload = (
    raw && typeof raw === 'object' && 'data' in (raw as RawDistanceCheckResponse)
      ? (raw as RawDistanceCheckResponse).data
      : raw
  ) as RawDistanceCheckResponse;

  const distanceKm = parseNumber(payload?.distanceKm);
  const maxDistanceKm = parseNumber(payload?.maxDistanceKm);

  if (typeof payload?.isExceeded === 'boolean') {
    return { distanceKm, maxDistanceKm, isExceeded: payload.isExceeded };
  }

  if (typeof payload?.exceeded === 'boolean') {
    return { distanceKm, maxDistanceKm, isExceeded: payload.exceeded };
  }

  if (typeof payload?.inRange === 'boolean') {
    return { distanceKm, maxDistanceKm, isExceeded: !payload.inRange };
  }

  if (typeof payload?.withinRange === 'boolean') {
    return { distanceKm, maxDistanceKm, isExceeded: !payload.withinRange };
  }

  if (typeof distanceKm === 'number' && typeof maxDistanceKm === 'number') {
    return { distanceKm, maxDistanceKm, isExceeded: distanceKm > maxDistanceKm };
  }

  return { distanceKm, maxDistanceKm, isExceeded: false };
};

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
      const response = await api.post(API_ENDPOINT.ADDRESS_DISTANCE, payload);
      const normalized = normalizeDistanceResponse(response);

      if (normalized.isExceeded) {
        setDistanceResult(normalized);
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
