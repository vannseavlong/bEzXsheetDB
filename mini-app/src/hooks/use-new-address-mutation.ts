import { useMutation } from '@tanstack/react-query';
import { API_ENDPOINT } from '@/api/endpoint';
import type { AddressAttributes, NewAddressPayload } from '@/types/api';
import api from '@/api/api';

interface AddressOperationPayload extends Partial<NewAddressPayload> {
  id?: string;
  isEditMode?: boolean;
}

const addressOperation = async (payload: AddressOperationPayload): Promise<AddressAttributes> => {
  const { id, isEditMode, ...rest } = payload;

  if (isEditMode && id) {
    // Update existing address
    return api.patch(API_ENDPOINT.ADDRESS_UPDATE(id), rest);
  }

  // Create new address
  return api.post(API_ENDPOINT.ADDRESS_CREATE, rest as NewAddressPayload);
};

export const useAddressMutation = () => {
  return useMutation({
    mutationFn: addressOperation
  });
};
