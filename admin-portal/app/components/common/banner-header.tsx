import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import SearchBar from './search-bar';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';
import { ACTIONS, MODULES } from '@/lib/permission';
import { usePermission } from '@/hooks/use-permission';

type Props = {
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  searchText: string;
  onSearchTextChange: (value: string) => void;
};

export default function BannerHeader({
  searchText,
  onSearchTextChange,
  setStatusFilter,
  statusFilter
}: Props) {
  const { t } = useTranslation();
  const { hasPermission } = usePermission();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center p-4 gap-4 justify-between">
      <div className="w-full sm:w-auto">
        <SearchBar
          placeholder={t('Search for banner...')}
          value={searchText}
          onChange={onSearchTextChange}
        />
      </div>

      <div className="flex items-center gap-4 overflow-x-auto">
        <div className="w-45 shrink-0">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('Filter by status')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('All Status')}</SelectItem>
              <SelectItem value="Active">{t('Active')}</SelectItem>
              <SelectItem value="Inactive">{t('Inactive')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* If you want date range picker, add here */}

        <div className="shrink-0">
          {hasPermission(MODULES.MARKETING_BANNER, ACTIONS.ADD) && (
            <NavLink to="/banner/new-banner">
              <Button size="sm">
                {t('header.newBanner')} <Plus />
              </Button>
            </NavLink>
          )}
        </div>
      </div>
    </div>
  );
}
