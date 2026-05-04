import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

export function useAddBlockScheduleMutation(id?: string) {
  const navigate = useNavigate();

  const apiFn = (payload: BlockedScheduleAttributes): Promise<string> => {
    return api.post(
      id === 'new' ? API_ENDPOINT.CREATE_BLOCKED_SCHEDULE : API_ENDPOINT.UPDATE_BLOCKED_SCHEDULE,
      {
        ...payload
      }
    );
  };

  return useMutation({
    mutationKey: [QUERY_KEY_ENUM.CREATE_BLOCKED_SCHEDULE, id],
    mutationFn: apiFn,
    onSuccess: () => {
      toast.success('Created successfully');
      navigate(-1);
    }
  });
}
