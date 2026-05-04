import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
// import type { ServiceItemSchemaProps } from '@/lib/schema/service-item-schema';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import customQueryClient from '../use-custom-query-client';

export function useAddServiceItemDetailsMutation() {
  const apiFn = (payload: {
    bulkOrderId: string;
    serviceItems: { serviceItemId: string; serviceItemRemarks: string[] }[];
  }): Promise<string> => {
    return api.post(API_ENDPOINT.ADD_SERVICE_DETAILS, {
      ...payload
    });
  };

  return useMutation({
    mutationKey: [QUERY_KEY_ENUM.ADD_SERVICE_ITEM_DETAILS],
    mutationFn: apiFn,
    onSuccess: () => {
      toast.success('Created successfully');
      customQueryClient.invalidateQueries({ queryKey: [QUERY_KEY_ENUM.ORDER_DETAIL] });
    }
  });
}
