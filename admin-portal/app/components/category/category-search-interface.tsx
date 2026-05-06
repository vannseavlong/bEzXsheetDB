import SearchBar from '../common/search-bar';
import { Combobox } from '../common/combobox';
import { useTranslation } from 'react-i18next';
import DateRangePickerV2, { type DateRangePickerProps } from '../common/date-range-picker-v2';
import DirectSaleDialog from '../common/direct-sale/direct-sale-dialog';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';

type Props = {
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  paymentStatusFilter: string;
  setPaymentStatusFilter: (value: string) => void;
  searchValue: string;
  setSearchValue: (value: string) => void;
  type: OrderTypeProps;
  setType?: (value: string) => void;
} & DateRangePickerProps;

export default function CategorySearchInterface({
  setStatusFilter,
  statusFilter,
  paymentStatusFilter,
  setPaymentStatusFilter,
  searchValue,
  setSearchValue,
  type,
  setType,
  ...rest
}: Props) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  console.log({ isOpenisOpen: isOpen });

  return (
    <div className="w-full pb-4 px-4 gap-3 flex flex-col">
      <div className="flex gap-3">
        <SearchBar
          placeholder="Search for order id..."
          value={searchValue}
          onChange={setSearchValue}
        />
        <Button
          type="button"
          variant="default"
          className="h-9 w-9  text-white  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          onClick={() => setIsOpen(true)}
        >
          <Plus className="h-4 w-4" />
        </Button>
        {isOpen && <DirectSaleDialog isOpen={isOpen} setIsOpen={setIsOpen} />}
      </div>
      <div className="flex flex-row md:flex-col gap-3 overflow-x-auto md:overflow-visible w-full pb-2 md:pb-0 hide-scrollbar">
        <div className="contents md:flex md:gap-3 md:w-full">
          <Combobox
            disabled={!setType}
            placeholder="All Type"
            data={[
              { label: 'All Type', value: 'all' },
              { label: 'Order', value: 'ORDER' },
              { label: 'Direct Sale', value: 'DIRECT_SALE' }
            ]}
            searchable={false}
            className="w-35 min-w-35"
            value={type}
            onSelect={(val) => {
              if (val !== 'DIRECT_SALE') {
                setPaymentStatusFilter('all');
              }
              if (setType) setType(val);
            }}
          />
          <Combobox
            placeholder={t('paymentStatus')}
            data={[
              { label: 'All Payment Status', value: 'all' },
              { label: 'Pending', value: 'Pending' },
              { label: 'Partially Paid', value: 'PARTIALLY_PAID' },
              { label: 'Paid', value: 'Paid' }
            ]}
            disabled={type !== 'DIRECT_SALE'}
            className="flex flex-1 min-w-37.5"
            value={paymentStatusFilter}
            onSelect={setPaymentStatusFilter}
          />
        </div>
        <div className="contents md:flex md:gap-3 md:w-full">
          <DateRangePickerV2
            align="start"
            side="bottom"
            iconHidden
            className="flex flex-1 min-w-50"
            {...rest}
          />
          <Combobox
            placeholder={t('allStatus')}
            data={[
              { label: 'All Status', value: 'all' },
              { label: 'Pending', value: 'Pending' },
              { label: 'Confirmed', value: 'Accepted' },
              { label: 'Completed', value: 'Completed' }
            ]}
            className="w-30 min-w-30"
            value={statusFilter}
            onSelect={setStatusFilter}
          />
        </div>
      </div>
    </div>
  );
}
