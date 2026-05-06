import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useDeleteProductAddOnGroupMutation() {
  const queryClient = useQueryClient();

  const apiFn = (id: number): Promise<{ message?: string }> => {
    const endpoint = API_ENDPOINT.PRODUCT_ADDON_GROUP_DELETE.replace('{id}', id.toString());
    return api.delete<{ message?: string }>(endpoint);
  };

  return useMutation({
    mutationKey: [QUERY_KEY_ENUM.PRODUCT_ADDON_GROUP_DELETE],
    mutationFn: apiFn,
    onSuccess: (res) => {
      toast.success(res?.message ?? 'Product add-on group deleted successfully');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_ENUM.PRODUCT_ADDON_GROUP_LIST] });
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      const message = error?.response?.data?.message ?? 'Failed to delete product add-on group';
      toast.error(message);
    }
  });
}
