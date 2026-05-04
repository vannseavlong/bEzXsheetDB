import SearchBar from '../common/search-bar';
import DateRangePickerV2, { type DateRangePickerProps } from '../common/date-range-picker-v2';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';
import IconAssets from '@/asset/icons/icon-assets';
import { useExportExcelMutation } from '@/hooks/mutations/use-export-excel-mutation';
import { usePermission } from '@/hooks/use-permission';
import { ACTIONS, MODULES } from '@/lib/permission';

type Props = {
  search: string;
  setSearch: (value: string) => void;
} & DateRangePickerProps;

export default function FinanceHeader(props: Props) {
  const { search, setSearch, ...rest } = props;
  const { t } = useTranslation();
  const { mutate, isPending } = useExportExcelMutation();
  const { hasPermission } = usePermission();

  const handleExportClicked = async () => {
    mutate({
      startDate: rest.dateRange?.from?.toISOString() ?? '',
      endDate: rest.dateRange?.to?.toISOString() ?? ''
    });
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center p-4 justify-between gap-3">
      {/* Search */}
      <div className="w-full md:w-1/2">
        <SearchBar
          placeholder={t('searchPlaceholder', 'Search by Order ID or Customer...')}
          value={search}
          onChange={setSearch}
        />
      </div>

      {/* Filters & Export */}
      <div className="w-full md:w-auto flex justify-end">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex-1 md:flex-none">
            <DateRangePickerV2 {...rest} />
          </div>

          {hasPermission(MODULES.FINANCE_ORDER, ACTIONS.EXPORT) && (
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
