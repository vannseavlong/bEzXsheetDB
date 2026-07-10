import React from 'react';
import type { OrderListItem } from '@/types/api';
import { useTranslation } from 'react-i18next';
import { toEmbeddableImageUrl } from '@/lib/drive-image';

type Props = {
  order: OrderListItem;
};

const OrderList: React.FC<Props> = ({ order }) => {
  const { t } = useTranslation();

  return (
    <div className="w-full h-auto flex items-center justify-between p-4 bg-white border-b border-gray-100">
      <div className="flex items-center space-x-3">
        <img
          src={toEmbeddableImageUrl(order.thumbnailUrl) ?? undefined}
          alt={`Order ${order.id}`}
          loading="lazy"
          decoding="async"
          className="w-[48px] h-[48px] object-cover"
          onError={(e) => {
            e.currentTarget.src = '/default-order-icon.png';
          }}
        />

        <div className="flex flex-col">
          <h3 className="text-[16px] font-bold text-[#1A1A1A] truncate">
            {t('order.orderId')} #{order.bulkOrderId}
          </h3>
          <p className="text-sm font-medium text-[#707070]">
            {order.itemCount > 0
              ? `${order.itemCount} ${t('orderList.services')}`
              : t('orderList.noServices')}
          </p>
          <p className="text-sm text-[#707070]">{order.createdAt}</p>
        </div>
      </div>

      <div className="flex flex-col items-end justify-between h-full">
        <p className="font-bold text-[16px]">${order.totalPayableAmount.toFixed(2)}</p>
      </div>
    </div>
  );
};

const areEqual = (prevProps: Props, nextProps: Props) => {
  return (
    prevProps.order.id === nextProps.order.id &&
    prevProps.order.thumbnailUrl === nextProps.order.thumbnailUrl &&
    prevProps.order.itemCount === nextProps.order.itemCount &&
    prevProps.order.createdAt === nextProps.order.createdAt &&
    prevProps.order.totalPayableAmount === nextProps.order.totalPayableAmount
  );
};

export default React.memo(OrderList, areEqual);
