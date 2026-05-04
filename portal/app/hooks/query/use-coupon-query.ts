import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { CONSTANTS } from '@/constants/constants';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useQuery } from '@tanstack/react-query';
import type { ColumnFiltersState } from '@tanstack/react-table';

type Props = {
  data: CouponAttributes[];
  pagination: PaginationProps;
};

function useCouponQuery({
  columnFilters,
  currentPage,
  searchText
}: {
  columnFilters?: ColumnFiltersState;
  currentPage: number;
  searchText?: string;
}) {
  const apiFn = (): Promise<Props> => {
    let params = {
      page: currentPage + 1,
      limit: CONSTANTS.LIMIT_PER_PAGE,
      searchText
    };
    if (columnFilters) {
      columnFilters.forEach((filter) => {
        params = {
          ...params,
          [filter.id]: filter.value
        };
      });
    }
    return api.get(API_ENDPOINT.COUPONS, {
      params
    });
  };

  return useQuery({
    queryKey: [QUERY_KEY_ENUM.COUPONS, JSON.stringify(columnFilters), currentPage, searchText],
    queryFn: apiFn
  });
}

function useCouponDetailQuery(id?: string) {
  const apiFn = (): Promise<CouponAttributes> => {
    return api.get(API_ENDPOINT.COUPON_DETAIL.replace('{id}', id || ''));
  };

  const query = useQuery({
    queryKey: [QUERY_KEY_ENUM.COUPON_DETAIL, id],
    queryFn: apiFn,
    enabled: id !== 'new'
  });

  return query;
}

function useCouponListSummaryQuery() {
  const apiFn = (): Promise<CouponAttributes[]> => {
    return api.get(API_ENDPOINT.COUPON_LIST_SUMMARY);
  };

  const query = useQuery({
    queryKey: [QUERY_KEY_ENUM.COUPON_LIST_SUMMARY],
    queryFn: apiFn
  });

  return query;
}

export { useCouponQuery, useCouponDetailQuery, useCouponListSummaryQuery };
