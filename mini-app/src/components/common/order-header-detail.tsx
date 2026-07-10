import { Badge } from '../ui/badge';
import { getBadgeStatusVariant, getStatusDisplayText } from '@/lib/utils';
import type { OrderDetail } from '@/types/api';
import { useTranslation } from 'react-i18next';

const ORDER_STATUS_KEY_MAP: Record<string, string> = {
  PENDING: 'pending',
  IN_PROGRESS: 'inProgress',
  ACCEPTED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

export function OrderHeaderDetail({ order }: { order: OrderDetail }) {
  const { t } = useTranslation();
  const statusKey = ORDER_STATUS_KEY_MAP[order.status as string];

  const statusDisplay = statusKey
    ? t(`order.status.${statusKey}`)
    : getStatusDisplayText(order.status);

  return (
    <div className="w-full items-center p-4 bg-white">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">
          {t('order.orderId')} <span>#{order.bulkOrderId}</span>
        </h2>
        <Badge
          variant={getBadgeStatusVariant(order.status)}
          className="rounded-full h-8 px-4 text-sm">
          {statusDisplay}
        </Badge>
      </div>
    </div>
  );
}

export default OrderHeaderDetail;
