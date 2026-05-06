import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useDeleteCategoryMutation() {
  const queryClient = useQueryClient();

  const apiFn = (id: number): Promise<{ message?: string }> => {
    const endpoint = API_ENDPOINT.CATEGORY_DELETE.replace('{id}', id.toString());
    return api.delete<{ message?: string }>(endpoint);
  };

  return useMutation({
    mutationKey: [QUERY_KEY_ENUM.DELETE_CATEGORY],
    mutationFn: apiFn,
    onSuccess: (res) => {
      toast.success(res?.message ?? 'Category deleted successfully');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_ENUM.CATEGORIES] });
    }
  });
}
