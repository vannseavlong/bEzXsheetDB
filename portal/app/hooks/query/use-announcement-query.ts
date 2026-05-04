import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { CONSTANTS } from '@/constants/constants';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useQuery } from '@tanstack/react-query';

type Props = {
  data: PushNotificationAttributes[];
  pagination: PaginationProps;
};

export default function useAnnouncementQuery({
  currentPage,
  dateRange,
  searchText
}: {
  currentPage: number;
  dateRange?: { from?: Date; to?: Date };
  searchText?: string;
}) {
  const apiFn = (): Promise<Props> => {
    return api.get(API_ENDPOINT.ANNOUNCEMENTS, {
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
    queryKey: [QUERY_KEY_ENUM.ANNOUNCEMENT, currentPage, dateRange, searchText],
    queryFn: apiFn
  });

  return query;
}
