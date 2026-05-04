import { Select } from '../ui/select';
import SearchBar from '../common/search-bar';
import { Button } from '../ui/button';
import DateRangePickerV2, { type DateRangePickerProps } from '../common/date-range-picker-v2';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';

type Props = {
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  search: string;
  setSearch: (value: string) => void;
} & DateRangePickerProps;

export default function PushNotificationHeader({
  setStatusFilter,
  statusFilter,
  search,
  setSearch,
  ...rest
}: Props) {
  const { t } = useTranslation();
  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <SearchBar placeholder="Search for notification..." value={search} onChange={setSearch} />
          <Select value={statusFilter} onValueChange={setStatusFilter}></Select>
        </div>

        <div className="flex items-center gap-4">
          <DateRangePickerV2 {...rest} />
          <NavLink to="/push-notification/new">
            <Button size="sm">
              <span className="hidden md:inline">{t('header.newPushNotification')}</span>
              <span className="inline md:hidden">{t('header.newNoti')}</span>
              <Plus />
            </Button>
          </NavLink>
        </div>
      </div>
    </div>
  );
}
