import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import type { UniqueIdentifier } from '@dnd-kit/core';
import { useMutation } from '@tanstack/react-query';

export function useBannerRearrangeMutation() {
  const apiFn = ({ id, sort }: { id: UniqueIdentifier; sort: number }): Promise<unknown> =>
    api.post(API_ENDPOINT.BANNER_REARRANGE, {
      id,
      sort
    });

  return useMutation({
    mutationKey: [QUERY_KEY_ENUM.BANNER_REARRANGE],
    mutationFn: apiFn
  });
}
