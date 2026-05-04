import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useDeleteBannerMutation() {
  const queryClient = useQueryClient();

  const apiFn = (id: number) => {
    const endpoint = API_ENDPOINT.DELETE_BANNER.replace('{id}', id.toString());
    return api.delete(endpoint);
  };

  return useMutation({
    mutationKey: [QUERY_KEY_ENUM.DELETE_BANNER],
    mutationFn: apiFn,
    onSuccess: () => {
      toast.success('Banner deleted successfully');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_ENUM.BANNERS] });
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      const message = error?.response?.data?.message ?? 'Failed to delete banner';
      toast.error(message);
    }
  });
}
