import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { buildProductAddOnGroupFormData } from '@/lib/product-add-on-group-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

export function useUpdateProductAddOnGroupMutation() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [QUERY_KEY_ENUM.PRODUCT_ADDON_GROUP_UPDATE],
    mutationFn: (payload: ProductAddOnGroupFormAttributes & { id: string | number }) => {
      const endpoint = API_ENDPOINT.PRODUCT_ADDON_GROUP_UPDATE.replace(
        '{id}',
        payload.id.toString()
      );
      const formData = buildProductAddOnGroupFormData(payload);
      return api.put(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    },
    onSuccess: () => {
      toast.success('Product add-on group updated successfully');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_ENUM.PRODUCT_ADDON_GROUP_LIST] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_ENUM.PRODUCT_ADDON_GROUP_DETAIL] });
      navigate(-1);
    }
  });
}
