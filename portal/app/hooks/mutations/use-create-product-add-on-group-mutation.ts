import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { buildProductAddOnGroupFormData } from '@/lib/product-add-on-group-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

export function useCreateProductAddOnGroupMutation() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [QUERY_KEY_ENUM.PRODUCT_ADDON_GROUP_CREATE],
    mutationFn: (payload: ProductAddOnGroupFormAttributes) => {
      const formData = buildProductAddOnGroupFormData(payload);
      return api.post(API_ENDPOINT.PRODUCT_ADDON_GROUP_CREATE, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    },
    onSuccess: () => {
      toast.success('Product add-on group created successfully');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_ENUM.PRODUCT_ADDON_GROUP_LIST] });
      navigate(-1);
    }
  });
}
