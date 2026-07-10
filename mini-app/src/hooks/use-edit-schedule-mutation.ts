import { useMutation } from '@tanstack/react-query';
import { API_ENDPOINT } from '@/api/endpoint';
import api from '@/api/api';
import type { EditSchedulePayload } from '@/types/api';

const editScheduleOperation = async (payload: EditSchedulePayload) => {
  const { bulkOrderId, scheduleStartDate } = payload;
  return api.patch(
    API_ENDPOINT.ORDER_EDIT_SCHEDULE(bulkOrderId),
    { scheduleStartDate },
    { skipErrorHandler: true }
  );
};

export const useEditScheduleMutation = () => {
  return useMutation({
    mutationFn: editScheduleOperation
  });
};
