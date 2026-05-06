import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import customQueryClient from '../use-custom-query-client';

export default function useEdtiOrderNoteMutation() {
  const apiFn = ({ id, note }: { id: string; note: string }): Promise<string> => {
    return api.post(API_ENDPOINT.EDIT_NOTE.replace('{id}', id), { note });
  };

  const query = useMutation({
    mutationKey: [QUERY_KEY_ENUM.EDIT_NOTE],
    mutationFn: apiFn,
    onSuccess: () => {
      toast.success('Saved');
      customQueryClient.invalidateQueries({ queryKey: [QUERY_KEY_ENUM.ORDER_DETAIL] });
    }
  });

  return query;
}
