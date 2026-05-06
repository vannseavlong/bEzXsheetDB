import { useParams } from 'react-router-dom';
import OrderHeaderDetail from '@/components/common/order-header-detail';
import useOrderDetailQuery from '@/hooks/use-order-detail-query';
import HomeSkeleton from '@/components/common/home-skeleton';
import CustomerDetail from '@/components/common/customer-detail';
import { OrderService } from '@/components/common/order-service';
import PaymentDetail from '@/components/common/payment-detail';
import AddressInterface from '@/components/common/address';
import DateTimePicker from '@/components/common/date-time-detail';
import useNavigationTitle from '@/hooks/use-navigation-title';
import { useTranslation } from 'node_modules/react-i18next';

export default function OrderDetail() {
  const { t } = useTranslation();
  const { bulkOrderId } = useParams<{ bulkOrderId: string }>();
  const { data: orderDetailData, isLoading } = useOrderDetailQuery(bulkOrderId ?? '');

  // Set navigation bar title
  useNavigationTitle(t('order.orderDetails'));

  if (isLoading) return <HomeSkeleton />;

  if (!orderDetailData) {
    return <div className="p-4 text-gray-500">{t('order.orderNotFound')}</div>;
  }

  return (
    <div className="bg-muted pb-4 flex flex-col gap-y-4">
      <OrderHeaderDetail order={orderDetailData} />

      <div className="p-4 bg-white">
        <h1 className="font-medium text-lg">{t('order.customerDetails')}</h1>

        <CustomerDetail customer={orderDetailData} />
      </div>

      <div className="bg-white p-4">
        <p className="font-bold pb-2 text-[16px]">{t('order.services')}</p>
        <div className="space-y-4">
          {(orderDetailData.items ?? []).map((item, index) => (
            <OrderService key={index} service={item} />
          ))}
        </div>
      </div>

      <div className="bg-white p-4">
        <AddressInterface address={orderDetailData.address} showButton={false} />
      </div>
      <div className="bg-white p-4">
        <DateTimePicker bulkOrderId={bulkOrderId} />
      </div>

      <PaymentDetail payment={orderDetailData} />
    </div>
  );
}
