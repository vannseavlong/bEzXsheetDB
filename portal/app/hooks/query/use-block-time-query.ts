import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { formatDatePayload } from '@/lib/date-helper';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

// Define types based on the backend response structure
export interface BlockTimeItem {
  id: number | string;
  bulkOrderId: number | string;
  name?: string;
  status: string;
  address?: string;
  blockedDate: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
  associatedAddress?: {
    id: number;
    name: string;
    address: string;
  };
  cleanerDetails?: {
    cleaner?: {
      id: number;
      name: string;
      image: string;
    };
  }[];
}

export default function useBlockTimeQuery({
  dateRange
}: {
  dateRange?: { from?: Date; to?: Date };
}) {
  const apiFn = (): Promise<BlockTimeItem[]> => {
    let params: { [key: string]: string } = {};

    if (dateRange?.from && dateRange?.to) {
      params = {
        startDate: formatDatePayload(dateRange.from),
        endDate: formatDatePayload(dateRange.to)
      };
    }

    return api.get(API_ENDPOINT.BLOCKED_TIME_LIST, {
      params
    });
  };

  const query = useQuery({
    queryKey: [QUERY_KEY_ENUM.BLOCKED_TIME, dateRange],
    queryFn: apiFn,
    placeholderData: keepPreviousData
  });

  return query;
}
