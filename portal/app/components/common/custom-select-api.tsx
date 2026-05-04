import clsx from 'clsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useQuery } from '@tanstack/react-query';
import type { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import api from '@/api/api';
import type { ApiEndpointProps } from '@/api/endpoint';

type Props = {
  label?: string;
  className?: string;
  placeholder?: string;
  apiConfig: {
    queryKey: QUERY_KEY_ENUM;
    pathUrl: ApiEndpointProps;
  };
  value: unknown;
  onChange: (value: string) => void;
  prefix?: string;
  disabledAll?: boolean;
  other?: boolean;
};

export default function CustomSelectApi({
  className,
  placeholder,
  label,
  apiConfig,
  value,
  onChange,
  prefix,
  disabledAll,
  other
}: Props) {
  const { data, isFetching } = useQuery({
    queryKey: [apiConfig.queryKey],
    queryFn: (): Promise<{ id: string; nameEn: string }[]> =>
      api.get(apiConfig.pathUrl, {
        params: {
          limit: 100
        }
      })
  });

  if (label) {
    <div className="w-full relative">
      <div>{label}</div>
      {isFetching ? (
        <div className="p-2 text-left text-sm text-gray-500">Loading...</div>
      ) : (
        <Select value={String(value)} onValueChange={onChange}>
          <SelectTrigger className={clsx('w-full', className)}>
            {prefix && <span className="text-sm">{prefix}</span>}
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {!disabledAll && <SelectItem value="ALL">All</SelectItem>}
            {(data || []).map((item, index) => (
              <SelectItem key={index} value={String(item.id)}>
                {item.nameEn}
              </SelectItem>
            ))}
            {other && <SelectItem value="OTHER">Other</SelectItem>}
          </SelectContent>
        </Select>
      )}
    </div>;
  }

  return isFetching ? (
    <div className="p-2 text-left text-sm text-gray-500">Loading...</div>
  ) : (
    <Select value={String(value)} onValueChange={onChange}>
      <SelectTrigger className={clsx('w-full', className)}>
        {prefix && <span className="text-sm">{prefix}</span>}
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {!disabledAll && <SelectItem value="ALL">All</SelectItem>}
        {(data || []).map((item, index) => (
          <SelectItem key={index} value={String(item.id)}>
            {item.nameEn}
          </SelectItem>
        ))}
        {other && <SelectItem value="OTHER">Other</SelectItem>}
      </SelectContent>
    </Select>
  );
}
