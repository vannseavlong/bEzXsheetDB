import { formatDate } from '@/lib/date-helper';
import React from 'react';
import { Badge } from '../ui/badge';
import { getBadgeStatusVariant, getStatusDisplayText } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

type Props = {
  order: OrderListAttributes;
  isActive: boolean;
};

const OrderComponent: React.FC<Props> = (props) => {
  const { order } = props;

  return (
    <div
      className={`w-auto h-18.5 flex items-center justify-between p-3 bg-white 
        rounded-[8px] cursor-pointer
        ${props.isActive ? 'border-2 border-[#102C90]' : 'border-2 border-transparent'}`}
    >
      <div className="flex items-center space-x-4 h-full">
        <div className="relative">
          <img
            src={order.thumbnailUrl}
            alt={`Order ${order.bulkOrderId || ''} icon`}
            className="w-12 h-12 object-cover rounded-full"
          />
          {order.isExistedCustomer && (
            <Tooltip>
              <TooltipTrigger asChild>
                <CheckCircle2
                  size={20}
                  className="text-primary absolute top-[-10px] right-[-10px] bg-background rounded-full"
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Existing Customer</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        <div className="flex flex-col h-full justify-between ">
          <h3 className="text-sm font-bold text-[#1A1A1A]">
            {order.platform === 'WEB' ? 'WB' : order.type === 'DIRECT_SALE' ? 'DS ID' : 'Order'}:{' '}
            {order.bulkOrderId || 'N/A'}{' '}
            {/* {order.platform === 'WEB' ? <Earth className="w-5 h-5 text-primary" /> : ''} */}
          </h3>
          <p className="text-xs font-medium text-[#707070]">
            {order.totalCount !== undefined ? `${order.totalCount} Services` : 'No service info'}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-end justify-between h-full">
        <div className="flex flex-row">
          <Badge variant={getBadgeStatusVariant(order.status)} className="rounded-full h-6 px-2">
            <span className="text-xs">{getStatusDisplayText(order.status)}</span>
          </Badge>

          {/* <CheckIcon className="text-primary w-3 h-3" /> */}
        </div>

        {order.latestCreatedAt && (
          <span className="text-xs font-medium text-[#707070]">
            {formatDate(order.latestCreatedAt, true)}
          </span>
        )}
      </div>
    </div>
  );
};

export default OrderComponent;
