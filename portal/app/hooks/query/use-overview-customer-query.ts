import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

type Props = {
  totalUserRegistered: TrendProps;
  totalNewUserRegistered: TrendProps;
  totalAvgOrderRevenue: TrendProps;
  totalReturnCustomerRate: TrendProps;
};

export default function useOverviewCustomerQuery({
  dateRange,
  enabled = true,
  excludeUserIds
}: {
  dateRange?: { from?: Date; to?: Date };
  enabled?: boolean;
  excludeUserIds?: string[];
}) {
  const apiFn = (): Promise<Props> => {
    let params: {
      startDate?: string;
      endDate?: string;
      excludeUserIds?: string[];
    } = {
      excludeUserIds
      // startDate: dateRange?.from?.toISOString(),
      // endDate: dateRange?.to?.toISOString()
    };

    if (dateRange?.from) {
      params = {
        ...params,
        startDate: dateRange?.from?.toISOString()
      };
    }
    if (dateRange?.to) {
      params = {
        ...params,
        endDate: dateRange?.to?.toISOString()
      };
    }

    return api.get(API_ENDPOINT.OVERVIEW_CUSTOMER, {
      params
    });
  };

  const query = useQuery({
    queryKey: [QUERY_KEY_ENUM.OVERVIEW_CUSTOMER, dateRange?.from, dateRange?.to, excludeUserIds],
    queryFn: apiFn,
    placeholderData: keepPreviousData,
    enabled
  });

  return query;
}
