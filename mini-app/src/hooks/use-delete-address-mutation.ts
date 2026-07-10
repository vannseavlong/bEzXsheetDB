import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import api from '@/api/api';

const deleteAddress = async (addressId: string): Promise<void> => {
  return api.delete(API_ENDPOINT.ADDRESS_DELETE(addressId));
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
