import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import customQueryClient from '../use-custom-query-client';

export function useScheduleMutation(id?: string) {
  const apiFn = (scheduleStartDate: string): Promise<string> => {
    return api.put(API_ENDPOINT.RESCHEDULE.replace('{id}', id || ''), {
      scheduleStartDate
    });
  };

  return useMutation({
    mutationKey: [QUERY_KEY_ENUM.RESCHEDULE, id],
    mutationFn: apiFn,
    onSuccess: () => {
      toast.success('Created successfully');
      customQueryClient.invalidateQueries({ queryKey: [QUERY_KEY_ENUM.ORDER_DETAIL] });
    }
  });
}
