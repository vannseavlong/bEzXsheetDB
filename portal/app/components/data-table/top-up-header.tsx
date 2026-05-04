import SearchBar from '../common/search-bar';
import DateRangePickerV2, { type DateRangePickerProps } from '../common/date-range-picker-v2';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';
import { useExportExcelMutation } from '@/hooks/mutations/use-export-excel-mutation';
import IconAssets from '@/asset/icons/icon-assets';
import { Dollar01Icon } from 'hugeicons-react';
import { NavLink } from 'react-router';
import { ACTIONS, MODULES } from '@/lib/permission';
import { usePermission } from '@/hooks/use-permission';

type Props = {
  initialDateRange: { from?: Date; to?: Date };
  search: string;
  setSearch: (value: string) => void;
} & DateRangePickerProps;

export default function TopupHeader({ search, setSearch, ...rest }: Props) {
  const { t } = useTranslation();
  const { mutate, isPending } = useExportExcelMutation();
  const { hasPermission } = usePermission();

  const handleExportClicked = async () => {
    mutate({
      type: 'topup',
      startDate: rest.dateRange?.from?.toISOString() ?? '',
      endDate: rest.dateRange?.to?.toISOString() ?? ''
    });
  };
  return (
    <div className="flex flex-col md:flex-row md:items-center p-4 justify-between gap-3">
      <div className="w-full md:w-1/2">
        <SearchBar
          placeholder={t('searchPlaceholder', 'Search for transactions id...')}
          value={search}
          onChange={setSearch}
        />
      </div>

      <div className="w-full md:w-auto flex justify-end">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex-1 md:flex-none">
            <DateRangePickerV2 {...rest} />
          </div>

          <div className="flex-none">
            <NavLink to="/top-up/new">
              <Button size="sm">
                Topup
                <Dollar01Icon />
              </Button>
            </NavLink>
          </div>

          {hasPermission(MODULES.FINANCE_TOPUP, ACTIONS.EXPORT) && (
            <div className="flex-none">
              <Button isLoading={isPending} size="sm" onClick={handleExportClicked}>
                {t('Export')}
                <IconAssets.Export />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
