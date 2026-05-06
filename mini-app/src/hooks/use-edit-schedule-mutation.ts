import { useMutation } from '@tanstack/react-query';
import { API_ENDPOINT } from '@/api/endpoint';
import api from '@/api/api';
import type { EditSchedulePayload } from '@/types/api';

const editScheduleOperation = async (payload: EditSchedulePayload) => {
  console.log('editScheduleOperation called with:', payload);
  if (payload.isEditMode && payload.bulkOrderId) {
    // Edit schedule
    const response = await api.post(API_ENDPOINT.EDIT_SCHEDULE, payload, {
      skipErrorHandler: true
    });
    console.log('Edit Schedule Response:', response);
    return response.data;
  }
  // If not edit mode, do nothing or throw error
  throw new Error('Edit schedule is only allowed in edit mode.');
};

export const useEditScheduleMutation = () => {
  return useMutation({
    mutationFn: editScheduleOperation
  });
};
