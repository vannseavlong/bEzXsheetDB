import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import type { ServiceItemSchemaProps } from '@/lib/schema/service-item-schema';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

export function useAddServiceItemMutation(id?: string) {
  const navigate = useNavigate();

  const apiFn = (payload: ServiceItemSchemaProps): Promise<string> => {
    return api.post(
      id === 'new'
        ? API_ENDPOINT.CREATE_SERVICE_ITEM
        : API_ENDPOINT.UPDATE_SERVICE_ITEM.replace('{id}', id || ''),
      {
        ...payload,
        status: payload.status === 'Active' ? 1 : 0
      }
    );
  };

  return useMutation({
    mutationKey: [QUERY_KEY_ENUM.CREATE_SERVICE_ITEMS, id],
    mutationFn: apiFn,
    onSuccess: () => {
      toast.success('Created successfully');
      navigate(-1);
    }
  });
}
