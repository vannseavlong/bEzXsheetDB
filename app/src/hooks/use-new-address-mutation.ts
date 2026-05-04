import { useMutation } from '@tanstack/react-query';
import { API_ENDPOINT } from '@/api/endpoint';
import type { NewAddressPayload } from '@/types/api';
import api from '@/api/api';

interface AddressOperationPayload extends NewAddressPayload {
  id?: number;
  isEditMode?: boolean;
}

const addressOperation = async (payload: AddressOperationPayload) => {
  if (payload.isEditMode && payload.id) {
    // Update existing address
    const response = await api.post(API_ENDPOINT.ADDRESS_UPDATE, payload);
    console.log('Update Address Response:', response);
    return response.data;
  } else {
    // Create new address
    const response = await api.post(API_ENDPOINT.ADDRESS_CREATE, payload);
    console.log('Create Address Response:', response);
    return response.data;
  }
};

export const useAddressMutation = () => {
  return useMutation({
    mutationFn: addressOperation
  });
};
