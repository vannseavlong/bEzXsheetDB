import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useMutation } from '@tanstack/react-query';
import customQueryClient from '../use-custom-query-client';

export interface CreateBlockTimePayload {
  name?: string;
  status?: string;
  address?: string;
  blockedDate: Date | string; // Backend requires this
  startTime?: string;
  endTime?: string;
  userId?: number | string;
  addressId?: number | string;
  latitude?: number | string;
  longitude?: number | string;
  cleanerIds?: string[];
}

export function useCreateBlockTimeMutation() {
  const apiFn = async (payload: CreateBlockTimePayload) => {
    return api.post(API_ENDPOINT.BLOCKED_TIME_CREATE, payload);
  };

  const query = useMutation({
    mutationKey: [QUERY_KEY_ENUM.CREATE_BLOCK_TIME],
    mutationFn: apiFn,
    onSuccess: () => {
      customQueryClient.invalidateQueries({ queryKey: [QUERY_KEY_ENUM.BLOCKED_TIME] });
      customQueryClient.invalidateQueries({ queryKey: [QUERY_KEY_ENUM.CALENDAR_ORDERS] });
    }
  });

  return query;
}

export function useUpdateBlockTimeMutation() {
  const apiFn = async ({
    bulkOrderId,
    payload
  }: {
    bulkOrderId: string;
    payload: CreateBlockTimePayload;
  }) => {
    return api.post(API_ENDPOINT.BLOCKED_TIME_UPDATE.replace('{id}', bulkOrderId), payload);
  };

  const query = useMutation({
    mutationKey: [QUERY_KEY_ENUM.CREATE_BLOCK_TIME], // Reusing or create new key if needed, usually just invalidates list
    mutationFn: apiFn,
    onSuccess: () => {
      customQueryClient.invalidateQueries({ queryKey: [QUERY_KEY_ENUM.BLOCKED_TIME] });
      customQueryClient.invalidateQueries({ queryKey: [QUERY_KEY_ENUM.CALENDAR_ORDERS] });
    }
  });

  return query;
}

export function useDeleteBlockTimeMutation() {
  const apiFn = async (bulkOrderId: string) => {
    return api.post(API_ENDPOINT.BLOCKED_TIME_DELETE.replace('{id}', bulkOrderId));
  };

  const query = useMutation({
    mutationKey: [QUERY_KEY_ENUM.DELETE_BLOCK_TIME],
    mutationFn: apiFn,
    onSuccess: () => {
      customQueryClient.invalidateQueries({ queryKey: [QUERY_KEY_ENUM.BLOCKED_TIME] });
      customQueryClient.invalidateQueries({ queryKey: [QUERY_KEY_ENUM.CALENDAR_ORDERS] });
    }
  });

  return query;
}
