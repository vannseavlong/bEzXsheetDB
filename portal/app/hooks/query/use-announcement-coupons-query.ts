import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { CONSTANTS } from '@/constants/constants';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useQuery } from '@tanstack/react-query';

type Props = {
  data: AnnouncementCouponAttributes[];
  pagination: PaginationProps;
};

export default function useAnnouncementCouponsQuery({
  currentPage,
  dateRange,
  searchText
}: {
  currentPage: number;
  dateRange?: { from?: Date; to?: Date };
  searchText?: string;
}) {
  const apiFn = (): Promise<Props> => {
    return api.get(API_ENDPOINT.ANNOUNCEMENT_COUPONS, {
      params: {
        page: currentPage + 1,
        limit: CONSTANTS.LIMIT_PER_PAGE,
        searchText,
        startDate: dateRange?.from?.toISOString(),
        endDate: dateRange?.to?.toISOString()
      }
    });
  };

  const query = useQuery({
    queryKey: [QUERY_KEY_ENUM.ANNOUNCEMENT_USERS, currentPage, dateRange, searchText],
    queryFn: apiFn
  });

  return query;
}
