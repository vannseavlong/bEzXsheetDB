import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import api from '@/api/api';

const deleteAddress = async (addressId: number) => {
  const endpoint = API_ENDPOINT.ADDRESS_DELETE.replace(':id', addressId.toString());
  const response = await api.post(endpoint);
  console.log('Delete Address Response:', response);
  return response.data;
};

export function useDeleteAddressMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAddress,
    onSuccess: () => {
      // Invalidate and refetch the address list after successful deletion
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY_ENUM.ADDRESS_LIST]
      });
    },
    onError: (error) => {
      console.error('Error deleting address:', error);
    }
  });
}

export default useDeleteAddressMutation;
