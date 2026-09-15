import React from 'react';
import type { OrderListItem } from '@/types/api';
import { useTranslation } from 'react-i18next';
import { toEmbeddableImageUrl } from '@/lib/drive-image';

// Inline fallback so a missing/broken thumbnail never renders as a broken-image
// glyph — `/default-order-icon.png` doesn't exist under public/, so the old
// onError target 404'd too.
const DEFAULT_ORDER_ICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48' fill='none'%3E%3Crect width='48' height='48' rx='8' fill='%23F0F0F0'/%3E%3Cpath d='M14 16h20v18a2 2 0 01-2 2H16a2 2 0 01-2-2V16z' stroke='%23B5B5B5' stroke-width='2' stroke-linejoin='round'/%3E%3Cpath d='M14 16l2-4h16l2 4' stroke='%23B5B5B5' stroke-width='2' stroke-linejoin='round'/%3E%3Cpath d='M20 22h8' stroke='%23B5B5B5' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E";

type Props = {
  order: OrderListItem;
};

const OrderList: React.FC<Props> = ({ order }) => {
  const { t } = useTranslation();

  return (
    <div className="w-full h-auto flex items-center justify-between p-4 bg-white border-b border-gray-100">
      <div className="flex items-center min-w-0 flex-1 space-x-3">
        <img
          src={toEmbeddableImageUrl(order.thumbnailUrl) ?? DEFAULT_ORDER_ICON}
          alt={`Order ${order.id}`}
          loading="lazy"
          decoding="async"
          className="w-[48px] h-[48px] shrink-0 object-cover rounded"
          onError={(e) => {
            e.currentTarget.src = DEFAULT_ORDER_ICON;
          }}
        />

        <div className="flex flex-col min-w-0">
          <h3
            className="text-[16px] font-bold text-[#1A1A1A] truncate"
            title={`${t('order.orderId')} #${order.bulkOrderId}`}>
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
