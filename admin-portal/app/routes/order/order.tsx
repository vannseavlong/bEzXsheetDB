import OrderComponent from '@/components/common/order-component';
import { toast } from 'sonner';
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import OrderDetailCard from '@/components/common/order-detail-card';
import CategorySearchInterface from '@/components/category/category-search-interface';
import useOrderQuery from '@/hooks/query/use-order-query';
import useOrderDetailQuery from '@/hooks/query/use-order-detail-query';
import { Skeleton } from '@/components/ui/skeleton';
import OrderHeaderDetail from '@/components/common/order-detail-header';
import OrderHeaderLeft from '@/components/order/order-header-left';
import ServiceDetailsV2 from '@/components/common/service-details-v2';
import PaymentInfo from '@/components/common/order-payment';

import { useUpdateOrderStatusMutation } from '@/hooks/mutations/use-update-order-status-mutation';
import socket from '@/lib/socket';
import { ServiceDetailsDialog } from '@/components/common/service-details-dialog';
import { CircleDollarSign, RefreshCcw, SquarePen as Edit01Icon } from 'lucide-react';
import useCategoryIconDirectSaleQuery from '@/hooks/query/use-category-icon-direct-sale-query';
import { get } from 'lodash';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import useEdtiOrderNoteMutation from '@/hooks/mutations/use-edit-order-note-mutation';
import { ACTIONS, MODULES } from '@/lib/permission';
import useExchangeRateListQuery from '@/hooks/query/use-exchange-rate-list-query';
import useAuthStore from '@/store/auth-store';
import { useSearchParams } from 'react-router';
import moment from 'moment';
import UploadAttachment from '@/components/common/upload-attachment';
import CustomPagination from '@/components/common/custom-pagination';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import OrderStatusConfirmDialog from '@/components/common/order-status-confirm-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { buttonConfig } from '@/constants/constants';
import useCancelOrderMutation from '@/hooks/mutations/use-cancel-order-mutation';

export const handle = {
  module: MODULES.ORDER,
  action: ACTIONS.VIEW
};

export default function Order() {
  const { user } = useAuthStore();
  const defaultType = user?.type == 'SALES' || user?.type == 'SALES_OUTDOOR' ? 'DIRECT_SALE' : '';
  // console.log('defaultType:', defaultType);
  const [searchParams] = useSearchParams();
  const bulkOrderIdQuery = searchParams.get('bulkOrderId');

  const [statusFilter, setStatusFilter] = useState('all');
  const isCalledRef = useRef(false);
  const [bulkIdSelected, setBulkIdSelected] = useState<string>('');

  const [currentPage, setCurrentPage] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [type, setType] = useState<OrderTypeProps>(defaultType || 'all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const {
    data: ordersData,
    isPending,
    refetch: refetchOrders
  } = useOrderQuery({
    currentPage: currentPage,
    statusFilter,
    dateRange,
    searchText: searchValue,
    paymentStatusFilter,
    type
  });
  const [permission, setPermission] = useState(
    !('Notification' in window) ? undefined : Notification.permission
  );
  const { data: orderDetailData, refetch, isFetching } = useOrderDetailQuery(bulkIdSelected);
  const { mutateAsync, isPending: isUpdatePending } = useUpdateOrderStatusMutation();

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const ordersArray: OrderListAttributes[] = ordersData?.data || [];

  useEffect(() => {
    try {
      if (!('Notification' in window)) {
        console.log('This browser does not support desktop notification');
        return;
      }
      if (Notification.permission !== 'granted') {
        requestPermission();
      }
    } catch (error) {
      console.log({ error });
    }
  }, []);

  const requestPermission = async () => {
    const result = await Notification.requestPermission();
    setPermission(result);
    return result;
  };

  useEffect(() => {
    const showNotification = (title: string, body: string) => {
      toast.success(body);
      refetchOrders();
      if (permission === 'granted') {
        console.log('call tas');
        const notification = new Notification(title, {
          body,
          icon: '/beasy-icon.png'
        });

        notification.onclick = () => {
          window.focus();
          notification.close();
        };
      } else if (permission === 'default') {
        requestPermission().then((newPermission) => {
          if (newPermission === 'granted') {
            showNotification(title, body);
          }
        });
      } else {
        alert('Notification permission was denied. Please enable it in your browser settings.');
      }
    };

    if (isCalledRef.current) return;
    socket.on('connect', () => {
      console.log('Connected to server');
    });
    socket.on('updateData', ({ payload }: { payload: { title?: string; body?: string } }) => {
      showNotification(payload?.title || '', payload?.body || '');
    });
    return () => {
      isCalledRef.current = true;
    };
  }, [permission, refetchOrders]);

  useEffect(() => {
    setBulkIdSelected('');
  }, [statusFilter, dateRange, searchValue, paymentStatusFilter, currentPage]);

  useEffect(() => {
    if (bulkOrderIdQuery) setBulkIdSelected(bulkOrderIdQuery);
  }, [bulkOrderIdQuery]);

  const handleOrderClick = async () => {
    if (!orderDetailData) return;
    if (orderDetailData.status === 'PENDING') {
      await mutateAsync({
        bulkOrderId: orderDetailData.bulkOrderId,
        status: 'ACCEPTED',
        paymentMethod: orderDetailData.paymentMethod || ''
      });
    } else if (orderDetailData.status === 'ACCEPTED') {
      await mutateAsync({
        bulkOrderId: orderDetailData.bulkOrderId,
        status: 'COMPLETED',
        paymentMethod: orderDetailData.paymentMethod || ''
      });
    }
    refetch();
    refetchOrders();
  };

  if (isPending)
    return (
      <div className="flex items-center h-full">
        <div className="h-full w-100 gap-10 flex flex-col items-center" />
        <Skeleton className="h-full flex-1" />
      </div>
    );

  return (
    <>
      <div className="flex h-screen overflow-hidden">
        <div
          className={clsx('w-full md:w-97.5', {
            hidden: bulkIdSelected,
            block: !bulkIdSelected,
            'md:block': true
          })}
        >
          <OrderHeaderLeft />
          <div className="flex flex-col h-[calc(100vh-88px)]">
            <CategorySearchInterface
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              dateRange={dateRange}
              setDateRange={setDateRange}
              isCalendarOpen={isCalendarOpen}
              setIsCalendarOpen={setIsCalendarOpen}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              paymentStatusFilter={paymentStatusFilter}
              setPaymentStatusFilter={setPaymentStatusFilter}
              type={type}
              setType={!defaultType ? (val) => setType(val as OrderTypeProps) : undefined}
            />
            <div className="flex flex-col h-full overflow-y-scroll px-4 gap-2">
              {ordersArray.map((order, index: number) => (
                <div
                  key={index}
                  className="cursor-pointer"
                  onClick={() => {
                    setBulkIdSelected(order.bulkOrderId);
                  }}
                >
                  <OrderComponent isActive={bulkIdSelected === order.bulkOrderId} order={order} />
                </div>
              ))}
            </div>
            <div className="w-full">
              <CustomPagination
                currentPage={currentPage || 0}
                totalPages={ordersData?.pagination?.totalPages || 0}
                onPageChange={(val) => {
                  console.log({ val });
                  setCurrentPage(val);
                }}
              />
            </div>
          </div>
        </div>

        <div
          className={clsx('flex-1 flex-col overflow-hidden items-start bg-muted', {
            hidden: !bulkIdSelected,
            flex: bulkIdSelected,
            'md:flex': true
          })}
        >
          {isFetching ? (
            <div className="flex-1 justify-center items-center flex w-full gap-4">
              <span className="text-sm text-muted-foreground">Loading Please Wait ... </span>
              <RefreshCcw className="h-5 w-5 transition-transform cursor-pointer animate-spin text-primary" />
            </div>
          ) : orderDetailData ? (
            <>
              <OrderHeaderDetail
                orderDetail={orderDetailData}
                status={orderDetailData.status || 'PENDING'}
                type={orderDetailData.type}
                orderId={orderDetailData.bulkOrderId}
                isPending={isUpdatePending}
                paymentMethod={orderDetailData.paymentMethod || ''}
                paymentMethodDisplay={orderDetailData.paymentMethodDisplay || ''}
                paymentStatus={orderDetailData.paymentStatus}
                onClick={handleOrderClick}
                onBack={() => setBulkIdSelected('')}
              />
              <OrderDetailContent orderDetailData={orderDetailData} />
            </>
          ) : (
            <div className="flex-1 justify-center items-center flex w-full">
              <span className="text-sm text-muted-foreground">
                Please Select Order to View Detail
              </span>
            </div>
          )}
        </div>
      </div>
      {orderDetailData && (
        <div className="flex md:hidden sticky bottom-0 bg-background shadow-sm p-4">
          <MobileFooter
            orderId={orderDetailData.bulkOrderId}
            status={orderDetailData?.status || 'PENDING'}
            isPending={isUpdatePending}
            paymentMethod={orderDetailData.paymentMethod || ''}
            onClick={handleOrderClick}
          />
        </div>
      )}
      <Dialog>
        <DialogTrigger asChild>
          <Button
            size="icon"
            className="fixed bottom-6 left-6 h-14 w-14 rounded-full shadow-lg z-50 hover:shadow-xl transition-shadow"
          >
            <CircleDollarSign className="h-6! w-6!" />
          </Button>
        </DialogTrigger>
        <ExchangeRateDialogContent />
      </Dialog>
    </>
  );
}

const OrderDetailContent = ({ orderDetailData }: { orderDetailData: OrderListAttributes }) => {
  const { data } = useCategoryIconDirectSaleQuery();
  const { mutateAsync } = useEdtiOrderNoteMutation();
  const [note, setNote] = useState<string>(orderDetailData.note || '');
  const [isEdit, setIsEdit] = useState(false);

  const handleSave = async () => {
    try {
      await mutateAsync({ id: orderDetailData.bulkOrderId, note });
      setIsEdit(false);
    } catch (error) {
      console.log({ error });
      toast.error('Failed to update note');
    }
    // call api here
  };

  return (
    <div className="w-full overflow-hidden flex-1 min-h-0">
      <div className="overflow-y-scroll h-full p-4">
        <OrderDetailCard data={orderDetailData} />
        <div className="flex gap-4 flex-col md:flex-row pt-4 pb-20 md:pb-0">
          <div className="flex flex-1 flex-col gap-4">
            {orderDetailData?.items?.map((service, index) => (
              <ServiceDetailsV2
                icon={get(data, [service.categoryNameEn], service.thumbnailUrl)}
                index={index}
                key={index}
                service={service}
                orderStatus={orderDetailData.status}
                paymentStatus={orderDetailData.paymentStatus}
                orderType={orderDetailData.type}
              />
            ))}
            <ServiceDetailsDialog
              bulkOrderId={orderDetailData.bulkOrderId}
              serviceItemDetails={orderDetailData.serviceItemDetails}
            />
          </div>
          <div className="w-full md:w-85">
            <Card className="w-full mx-auto bg-card p-6 gap-2 mb-4">
              <div className="flex justify-between">
                <h2 className="text-base font-bold text-gray-700">Remark</h2>
                {isEdit ? (
                  <div className="cursor-pointer text-primary text-sm" onClick={handleSave}>
                    Save
                  </div>
                ) : (
                  <Edit01Icon
                    onClick={() => setIsEdit(true)}
                    className="cursor-pointer text-primary"
                  />
                )}
              </div>
              <Textarea disabled={!isEdit} value={note} onChange={(e) => setNote(e.target.value)} />
            </Card>

            {orderDetailData.type === 'DIRECT_SALE' && (
              <Card className="w-full mx-auto bg-card p-6 gap-6 mb-4">
                {orderDetailData.sale && (
                  <div>
                    <div className="flex justify-between">
                      <h2 className="text-base font-bold text-gray-700">Sales Agent</h2>
                    </div>
                    <div>{`${orderDetailData.sale?.firstName} ${orderDetailData.sale?.lastName} (${orderDetailData.sale?.username})`}</div>
                  </div>
                )}
                {orderDetailData.reseller && (
                  <div>
                    <div className="flex justify-between">
                      <h2 className="text-base font-bold text-gray-700">Reseller</h2>
                    </div>
                    <div>{`${orderDetailData.reseller?.firstName} ${orderDetailData.reseller?.lastName} (${orderDetailData.reseller?.username})`}</div>
                  </div>
                )}
              </Card>
            )}
            {orderDetailData.receipts?.length > 0 || orderDetailData.type === 'DIRECT_SALE' ? (
              <UploadAttachment
                orderDetailData={orderDetailData}
                readOnly={orderDetailData.type !== 'DIRECT_SALE'}
              />
            ) : null}
            <PaymentInfo
              scheduleStartDate={orderDetailData.scheduleStartDate}
              paymentStatus={orderDetailData.paymentStatus}
              paymentMethod={orderDetailData.paymentMethod}
              tranId={orderDetailData.tranId}
              orderCleaners={orderDetailData.cleaners || []}
              bulkOrderId={orderDetailData.bulkOrderId}
              couponCode={orderDetailData?.couponCode || ''}
              serviceFeeDisplay={orderDetailData?.serviceFeeDisplay || ''}
              discountDisplay={orderDetailData?.discountDisplay || ''}
              transportFeeDisplay={orderDetailData?.transportFeeDisplay || ''}
              totalAmountDisplay={orderDetailData?.totalAmountDisplay || ''}
              subTotalDisplay={orderDetailData?.subTotalDisplay || ''}
              vatFeeDisplay={orderDetailData?.vatFeeDisplay || ''}
              paymentMethodDisplay={orderDetailData?.paymentMethodDisplay || ''}
              totalPayableAmountDisplay={orderDetailData?.totalPayableAmountDisplay || ''}
              type={orderDetailData?.type || 'ORDER'}
              depositDisplay={orderDetailData.depositDisplay}
              remainingDisplay={orderDetailData.remainingDisplay}
              directSaleNextPaymentDate={orderDetailData.directSaleNextPaymentDate}
              exchangeRate={orderDetailData.exchangeRate}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

type MobileProps = {
  orderId: string;
  status: OrderStatusProps;
  isPending: boolean;
  paymentMethod: string;
  onClick: (status: OrderStatusProps) => void;
};
const MobileFooter = ({ orderId, status, isPending, paymentMethod, onClick }: MobileProps) => {
  const { mutateAsync: cancelOrder, isPending: isCancelPending } = useCancelOrderMutation();

  const handleCancel = async () => {
    await cancelOrder({ bulkOrderId: orderId, paymentMethod });
  };
  return (
    <div className="items-center gap-4 flex w-full">
      {!(status === 'CANCELLED' || status === 'COMPLETED') && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              className="flex flex-1"
              variant="destructive"
              isLoading={isCancelPending}
              disabled={isCancelPending}
            >
              Cancel
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmation</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to cancel this order?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="h-9">No</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleCancel}
                className="h-9 bg-destructive"
                disabled={isCancelPending}
              >
                {isCancelPending ? 'Cancelling...' : 'Yes'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {status === 'PENDING' || status === 'ACCEPTED' || status === 'IN_PROGRESS' ? (
        status === 'ACCEPTED' || status === 'IN_PROGRESS' ? (
          <OrderStatusConfirmDialog
            status={status}
            isPending={isPending}
            buttonText={buttonConfig[status].text}
            buttonVariant={buttonConfig[status].variant}
            buttonClassName={clsx('flex flex-1', { hidden: !onClick })}
            onConfirm={() => onClick && onClick(status)}
            description={`Are you sure you want to mark this order as ${buttonConfig[status].text.toLowerCase()}?`}
          />
        ) : (
          <Button
            type="button"
            isLoading={isPending}
            variant={buttonConfig[status].variant}
            onClick={() => onClick && onClick(status)}
            className={clsx('flex flex-1', {
              hidden: !onClick
            })}
          >
            {buttonConfig[status].text}
          </Button>
        )
      ) : null}
    </div>
  );
};

const ExchangeRateDialogContent = () => {
  const { data, isPending } = useExchangeRateListQuery();
  const list = data?.data || [];

  return (
    <DialogContent className="max-w-xl">
      <DialogHeader>
        <DialogTitle>Exchange Rate History</DialogTitle>
      </DialogHeader>
      <div className="py-4 flex flex-col items-center max-h-[60vh] overflow-y-auto w-full">
        {isPending ? (
          <div className="flex gap-2 text-muted-foreground items-center justify-center p-8">
            <RefreshCcw className="h-5 w-5 animate-spin" />
            <span>Loading exchange rates...</span>
          </div>
        ) : list.length > 0 ? (
          <div className="w-full">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-muted sticky top-0">
                <tr>
                  <th className="p-3 border-b">Date recorded</th>
                  <th className="p-3 border-b text-right">Exchange Rate (៛/USD)</th>
                </tr>
              </thead>
              <tbody>
                {list.map((rate, i) => (
                  <tr
                    key={rate.id || i}
                    className="border-b last:border-0 hover:bg-muted/50 transition-colors"
                  >
                    <td className="p-3">{moment(rate.createdAt).format('dddd, DD-MM-YYYY')}</td>
                    <td className="p-3 text-right font-medium text-emerald-600">
                      ៛ {rate.exchangeRate?.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            No exchange rate data available.
          </div>
        )}
      </div>
    </DialogContent>
  );
};
