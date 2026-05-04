import SearchBar from '../common/search-bar';
import { Button } from '../ui/button';
import { NavLink } from 'react-router';
import { Plus } from 'lucide-react';
import { usePermission } from '@/hooks/use-permission';
import { ACTIONS, MODULES } from '@/lib/permission';
import { useExportExcelMutation } from '@/hooks/mutations/use-export-excel-mutation';
import IconAssets from '@/asset/icons/icon-assets';
import { useTranslation } from 'react-i18next';
import type { DateRangePickerProps } from '../common/date-range-picker-v2';
import DateRangePickerV2 from '../common/date-range-picker-v2';

type Props = {
  initialDateRange: { from?: Date; to?: Date };
  search: string;
  setSearch: (value: string) => void;
} & DateRangePickerProps;

export default function PaymentLinkHeader({ search, setSearch, ...rest }: Props) {
  const { t } = useTranslation();
  const { mutate, isPending } = useExportExcelMutation();
  const { hasPermission } = usePermission();

  const handleExportClicked = async () => {
    mutate({
      type: 'payment-link',
      startDate: rest.dateRange?.from?.toISOString() ?? '',
      endDate: rest.dateRange?.to?.toISOString() ?? ''
    });
  };
  return (
    <div className="flex flex-wrap items-center justify-between p-4 gap-4">
      <div className="flex flex-wrap md:flex-nowrap items-center gap-4">
        <SearchBar
          placeholder={t('searchPlaceholder', 'Search for transactions id...')}
          value={search}
          onChange={setSearch}
        />
        <DateRangePickerV2 {...rest} />
        {hasPermission(MODULES.MARKETING_PAYMENT_LINK, ACTIONS.EXPORT) && (
          <Button isLoading={isPending} size="sm" onClick={handleExportClicked}>
            {t('Export')}
            <IconAssets.Export />
          </Button>
        )}
      </div>
      {hasPermission(MODULES.MARKETING_PAYMENT_LINK, ACTIONS.ADD) && (
        <NavLink to="/payment-link/new">
          <Button size="sm">
            New Payment Link
            <Plus />
          </Button>
        </NavLink>
      )}
    </div>
  );
}
