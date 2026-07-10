import Icon from '@/assets/icons/icon-asset';
import { useState } from 'react';
import ScheduleDialog from './schedule-dialog';
import useOrderDetailQuery from '@/hooks/use-order-detail-query';
import { useTranslation } from 'react-i18next';
import { formatScheduleDateTime } from '@/lib/date-display';

const DateTimePicker = ({ bulkOrderId }: { bulkOrderId?: string }) => {
  const { t } = useTranslation();
  const [openDialog, setOpenDialog] = useState(false);
  const { data: orderDetail, isLoading, refetch } = useOrderDetailQuery(bulkOrderId);
  const normalizedStatus = orderDetail?.status?.toUpperCase();
  const isEndedOrder =
    normalizedStatus === 'COMPLETED' ||
    normalizedStatus === 'COMPLETE' ||
    normalizedStatus === 'CANCELLED' ||
    normalizedStatus === 'CANCELED' ||
    normalizedStatus === 'CANCEL';

  // Display scheduleDate as-is to match required format
  const scheduleDateRaw = orderDetail?.scheduleDate;

  const formattedDateTime = formatScheduleDateTime(scheduleDateRaw, t);

  // console.log('Formatted scheduleDate:', formattedDateTime);

  return (
    <div>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-2">
          <Icon name="calender" />
          <div>
            <h3 className="text-base font-bold text-[#1A1A1A]">{t('order.dateAndTime')}</h3>
          </div>
        </div>
        {!isEndedOrder && (
          <button
            className="text-primary-gradient hover:text-blue-700 text-sm font-medium underline"
            onClick={() => setOpenDialog(true)}>
            {t('order.pickNewTime')}
          </button>
        )}
      </div>
      <div className="ml-0 mt-2">
        <p className="text-gray-700 text-sm">
          {isLoading ? t('common.loading') : formattedDateTime}
        </p>
      </div>
      {/* Dialog for picking a new time */}
      <ScheduleDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        serviceId={bulkOrderId ? Number(bulkOrderId) : undefined}
        onSubmit={() => refetch()}
      />
    </div>
  );
};

export default DateTimePicker;
