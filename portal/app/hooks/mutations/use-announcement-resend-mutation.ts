import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useResendAnnouncementMutation() {
  const apiFn = (payload: { id: string }): Promise<string> => {
    return api.put(API_ENDPOINT.RESEND_ANNOUNCEMENT.replaceAll('{id}', payload.id));
  };

  return useMutation({
    mutationKey: [QUERY_KEY_ENUM.ANNOUNCEMENT],
    mutationFn: apiFn,
    onSuccess: () => {
      toast.success('Notification has been resent');
    }
  });
}
