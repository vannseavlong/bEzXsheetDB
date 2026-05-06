import OrderList from '@/components/common/orderlist';
import useOrderQuery from '@/hooks/use-order-query';
import HomeSkeleton from '@/components/common/home-skeleton';
import { Link } from 'react-router';
import { useTranslation } from 'node_modules/react-i18next';
import useTabStore from '@/hooks/store/use-tab-store';

export default function BookingContent() {
  const { t } = useTranslation();
  const { setActiveTab } = useTabStore();
  const { data: ordersData, isFetching } = useOrderQuery();

  const ShowLoading = !ordersData && isFetching;
  const inProgressData = ordersData?.['IN-PROGRESS'] ?? [];
  const completedData = ordersData?.['COMPLETED'] ?? [];

  if (ShowLoading) return <HomeSkeleton />;

  const isEmpty = inProgressData.length === 0 && completedData.length === 0;

  return (
    <>
      <div className="flex-1 overflow-y-auto bg-muted min-h-[calc(100vh-85px)]">
        {inProgressData.length > 0 && (
          <>
            <p className="p-4 text-[#3D3D3D] text-[16px]">{t('booking.inProgress')}</p>
            {inProgressData.map((order) => (
              <Link
                key={order.id}
                to={`/v5/detail/${order.bulkOrderId}`}
                className="block [content-visibility:auto] [contain-intrinsic-size:1px_88px]">
                <OrderList order={order} />
              </Link>
            ))}
          </>
        )}

        {completedData.length > 0 && (
          <>
            <p className="p-4 text-[#3D3D3D]">{t('booking.recent')}</p>
            {completedData.map((order) => (
              <Link
                key={order.id}
                to={`/v5/detail/${order.bulkOrderId}`}
                className="block [content-visibility:auto] [contain-intrinsic-size:1px_88px]">
                <OrderList order={order} />
              </Link>
            ))}
          </>
        )}

        {isEmpty && (
          <div className="justify-center items-center flex flex-col py-8 h-[calc(100vh-115px)]">
            <p className="text-gray-500 mb-4">{t('booking.noBookingFound')}</p>
            <button
              onClick={() => setActiveTab('home')}
              className="px-6 py-2 bg-primary-gradient text-white rounded-lg font-medium">
              {t('booking.bookNow')}
            </button>
          </div>
        )}
      </div>
      <p className="text-xs text-center py-8.5">
        {t('common.appVersion')}: {import.meta.env.VITE_VERSION}
      </p>
    </>
  );
}
