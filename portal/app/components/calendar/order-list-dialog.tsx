import CalendarOrderItem from '@/components/calendar/calendar-order-item';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState, type Dispatch, type SetStateAction } from 'react';
import moment from 'moment';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  ChevronLeft,
  Clock4,
  MapPin,
  MessageSquareText,
  PrinterIcon,
  RefreshCcw,
  Copy,
  X
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { getBadgeStatusVariant, getStatusDisplayText } from '@/lib/utils';
import { phoneNumber } from '@/lib/date-helper';
import OrderProfile from '../common/order-profile';
import useOrderDetailQuery from '@/hooks/query/use-order-detail-query';
import AssignCleaner from '../common/assign-cleaner';
import { useAddCleanerDetailMutation } from '@/hooks/mutations/use-add-cleaner-detail-mutation';
import ServiceItem from './service-item';
import useCategoryIconDirectSaleQuery from '@/hooks/query/use-category-icon-direct-sale-query';
import { get } from 'lodash';
import PaymentInfo from './order-payment';
import usePrintInvoiceMutation from '@/hooks/mutations/use-print-invoice-mutation';
// import clsx from 'clsx';
import { NavLink } from 'react-router';
import { toast } from 'sonner';

type Props = {
  orders: OrderListAttributes[];
  date: Date;
  handleClose?: () => void;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

const OrderList = ({
  orders,
  date,
  handleClose,
  handleOrderClick
}: {
  orders: OrderListAttributes[];
  date: Date;
  handleClose?: () => void;
  handleOrderClick: (id: string) => void;
}) => {
  const dateOrders = orders.filter((or) => moment(or.scheduleStartDate).isSame(date, 'D'));

  return (
    <div className="flex flex-col h-full">
      <DialogHeader className="border-b flex flex-row items-center justify-between px-4 py-3 sticky top-0 bg-white z-10">
        <DialogTitle className="text-lg font-semibold">
          {moment(date).format('D MMMM YYYY')}
        </DialogTitle>
        <Button variant="ghost" size="icon" onClick={handleClose} className="h-8 w-8">
          <X className="h-5 w-5" />
        </Button>
      </DialogHeader>
      <div className="flex-1 overflow-auto px-4 pt-4 pb-4 flex flex-col gap-3">
        {dateOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground py-8">
            <Calendar className="h-12 w-12 mb-4 opacity-50" />
            <p>No orders for this date</p>
          </div>
        ) : (
          dateOrders.map((order, index) => (
            <CalendarOrderItem
              key={index}
              order={order}
              endTime
              onClick={() => handleOrderClick(order.bulkOrderId)}
            />
          ))
        )}
      </div>
    </div>
  );
};

const OrderDetail = ({
  bulkOrderId,
  handleBack
}: {
  bulkOrderId: string;
  handleBack?: () => void;
}) => {
  const { data } = useCategoryIconDirectSaleQuery();
  const { data: orderDetailData, isLoading, refetch } = useOrderDetailQuery(bulkOrderId);
  const { mutateAsync } = useAddCleanerDetailMutation();
  const { mutateAsync: printInvoice, isPending } = usePrintInvoiceMutation();

  const handlePrintInvoice = () => {
    printInvoice(bulkOrderId);
  };

  const handleCopyBooking = () => {
    let address = orderDetailData?.address;
    let latitude;
    let longitude;

    if (orderDetailData?.latitude && orderDetailData?.longitude) {
      latitude = orderDetailData.latitude;
      longitude = orderDetailData.longitude;
    } else if (orderDetailData?.addressId) {
      const selectedAddr = orderDetailData?.userAddress?.find(
        (addr) => addr.id === orderDetailData.addressId
      );
      if (selectedAddr) {
        address = selectedAddr.address;
        latitude = selectedAddr.latitude;
        longitude = selectedAddr.longitude;
      }
    } else {
      const primaryAddr = orderDetailData?.userAddress?.find((addr) => addr.isPrimary);
      if (primaryAddr) {
        address = primaryAddr.address;
        latitude = primaryAddr.latitude;
        longitude = primaryAddr.longitude;
      }
    }

    let googleMapLink = '';
    if (latitude && longitude) {
      googleMapLink = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    }

    navigator.clipboard
      .writeText(
        `In charge sale person: ${orderDetailData?.sale?.lastName || ''} ${orderDetailData?.sale?.firstName || ''}

- Resource: ${orderDetailData?.reseller?.lastName || ''} ${orderDetailData?.reseller?.firstName || ''}
- Cleaning date: ${moment(orderDetailData?.scheduleDate).format('DD/MM/YYYY')}
- Time: ${moment(orderDetailData?.scheduleDate).format('hh:mm A')}
- Address: ${address}
- Name: ${orderDetailData?.fullname}
- Phone number: ${orderDetailData?.phone}
- Service: ${orderDetailData?.items?.reduce((acc, item, index) => acc + `${item.categoryNameKm}` + (index + 1 === orderDetailData?.items?.length ? '' : ' + '), '')}
- Size: ${orderDetailData?.items?.reduce((acc, item, index) => acc + `${item.productOptionKm}` + (index + 1 === orderDetailData?.items?.length ? '' : ' + '), '')}
- Note: ${orderDetailData?.note}
- Price: ${orderDetailData?.totalPayableAmountDisplay}
- Cleaner: ${orderDetailData?.cleaners?.length} (${orderDetailData?.cleaners?.reduce((acc, item, index) => acc + `${item.name}` + (index + 1 === orderDetailData?.cleaners?.length ? '' : ' + '), '')})
- Location: ${googleMapLink}
`
      )
      .then(() => {
        toast('Booking Info Copied');
      });
  };

  if (isLoading)
    return (
      <div className="flex-1 h-full justify-center items-center flex w-full gap-4">
        <span className="text-sm text-muted-foreground">Loading Please Wait ... </span>
        <RefreshCcw className="h-5 w-5 transition-transform cursor-pointer animate-spin text-primary" />
      </div>
    );

  if (!orderDetailData) return null;

  return (
    <div className="flex flex-col h-full">
      <DialogHeader className="border-b flex flex-row items-center px-4 py-3 sticky top-0 bg-white z-10 gap-2">
        <Button variant="ghost" size="icon" onClick={handleBack} className="h-8 w-8 shrink-0">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <DialogTitle className="flex-1 text-base truncate">
          {orderDetailData.type === 'DIRECT_SALE' ? 'DS ID' : 'Order'}: {bulkOrderId}
        </DialogTitle>
        <Badge
          variant={getBadgeStatusVariant(orderDetailData.status)}
          className="rounded-full h-6 px-2 shrink-0"
        >
          <span className="text-xs">{getStatusDisplayText(orderDetailData.status)}</span>
        </Badge>
      </DialogHeader>

      <div className="flex-1 overflow-auto">
        <div className="border-b p-4">
          <OrderProfile
            fullname={orderDetailData.fullname || ''}
            phone={orderDetailData.phone ? phoneNumber(orderDetailData.phone) : ''}
            profileUrl={orderDetailData.profileUrl || ''}
          />
        </div>

        <div className="border-b space-y-4 p-4">
          <div className="flex items-center space-x-3">
            <Clock4 className="size-5 shrink-0 text-gray-600" />
            <p className="text-sm">
              {moment(orderDetailData.scheduleDate).format('hh:mm A')} -{' '}
              {moment(orderDetailData.scheduleDate)
                .add(orderDetailData.duration, 'hour')
                .format('hh:mm A')}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Calendar className="size-5 shrink-0 text-gray-600" />
            <p className="text-sm">{moment(orderDetailData.scheduleDate).format('DD MMM YYYY')}</p>
          </div>
          <div className="flex items-start space-x-3">
            <MapPin className="size-5 shrink-0 text-gray-600 mt-0.5" />
            <p className="text-sm break-words min-w-0 flex-1">{orderDetailData.address}</p>
          </div>
          <div className="flex items-start space-x-3">
            <MessageSquareText className="size-5 shrink-0 text-gray-600 mt-0.5" />
            <p className="text-sm break-words min-w-0 flex-1">{orderDetailData.note || 'N/A'}</p>
          </div>
        </div>

        <div className="border-b space-y-4 p-4">
          <h2 className="text-base font-bold text-gray-700">Assign Cleaners</h2>
          <AssignCleaner
            scheduleStartDate={orderDetailData.scheduleStartDate}
            orderCleaners={orderDetailData.cleaners}
            onChange={async (cleaner) => {
              await mutateAsync({
                bulkOrderId: orderDetailData.bulkOrderId,
                cleanerId: cleaner.id
              });
              refetch();
            }}
          />
        </div>

        <div className="border-b py-4 px-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-bold text-gray-700">Service</h2>
            <NavLink to={`/order?bulkOrderId=${orderDetailData.bulkOrderId}`}>
              <Button className="p-0 h-auto" variant="link">
                View Details
              </Button>
            </NavLink>
          </div>
          {orderDetailData?.items?.map((service, index) => (
            <ServiceItem
              icon={get(data, [service.categoryNameEn], service.thumbnailUrl)}
              index={index}
              key={index}
              service={service}
            />
          ))}
        </div>

        <div className="py-4 px-4 pb-20">
          <PaymentInfo
            paymentStatus={orderDetailData.paymentStatus}
            paymentMethod={orderDetailData.paymentMethod}
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
          />
        </div>
      </div>

      <div className="w-full space-x-3 p-4 flex justify-end sticky bottom-0 bg-white border-t shadow-[0px_-2px_12px_0px_#1C1C1C1A] z-10">
        <Button
          variant="outline"
          type="button"
          isLoading={isPending}
          onClick={handleCopyBooking}
          className="h-9 flex-1 sm:flex-none"
        >
          <Copy className="h-4 w-4" />
          Copy
        </Button>
        <Button
          type="button"
          isLoading={isPending}
          onClick={handlePrintInvoice}
          className="h-9 flex-1 sm:flex-none"
        >
          <PrinterIcon className="h-4 w-4" />
          Print
        </Button>
      </div>
    </div>
  );
};

export default function OrderListDialog({ orders, date, isOpen, setIsOpen }: Props) {
  const [selectedOrderId, setSelectedOrderId] = useState('');

  const handleClose = () => {
    setIsOpen(false);
    setSelectedOrderId('');
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          setSelectedOrderId('');
        }
      }}
    >
      <DialogContent
        className="w-full h-full max-h-screen lg:h-auto lg:max-h-[90vh] max-w-full lg:max-w-md flex flex-col gap-0 p-0 m-0 lg:m-4 rounded-none lg:rounded-xl overflow-hidden"
        showCloseButton={false}
      >
        {selectedOrderId === '' && (
          <OrderList
            {...{ orders, date, handleClose, handleOrderClick: (id) => setSelectedOrderId(id) }}
          />
        )}
        {selectedOrderId !== '' && (
          <OrderDetail
            {...{ bulkOrderId: selectedOrderId, handleBack: () => setSelectedOrderId('') }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
