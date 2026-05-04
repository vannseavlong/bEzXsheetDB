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
  Copy
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
import clsx from 'clsx';
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
    <>
      <DialogHeader className="border-b flex flex-row items-center justify-between pl-1 pr-4 py-1">
        <Button variant="ghost" size="icon" onClick={handleClose}>
          <ChevronLeft className="size-6!" />
        </Button>
        <DialogTitle className="text-base">{moment(date).format('D MMMM YYYY')}</DialogTitle>
      </DialogHeader>
      <div className="flex-1 overflow-auto px-4 pt-4 flex flex-col gap-4">
        {dateOrders.map((order, index) => (
          <CalendarOrderItem
            key={index}
            order={order}
            endTime
            onClick={() => handleOrderClick(order.bulkOrderId)}
          />
        ))}
      </div>
    </>
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
    <>
      <DialogHeader className="border-b flex flex-row items-center pl-1 pr-4 py-1 sticky top-0 bg-white z-10">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ChevronLeft className="size-6!" />
        </Button>
        <DialogTitle className="flex-1 text-base">
          {orderDetailData.type === 'DIRECT_SALE' ? 'DS ID' : 'Order'}: {bulkOrderId}
        </DialogTitle>
        <Badge
          variant={getBadgeStatusVariant(orderDetailData.status)}
          className="rounded-full h-6 px-2"
        >
          <span className="text-xs">{getStatusDisplayText(orderDetailData.status)}</span>
        </Badge>
      </DialogHeader>

      <div className="border-b p-4">
        <OrderProfile
          fullname={orderDetailData.fullname || ''}
          phone={orderDetailData.phone ? phoneNumber(orderDetailData.phone) : ''}
          profileUrl={orderDetailData.profileUrl || ''}
        />
      </div>

      <div className="border-b space-y-4 p-4 px-5">
        <div className="flex items-center space-x-4">
          <Clock4 className="size-5! text-gray-600" />
          <p>
            {moment(orderDetailData.scheduleDate).format('hh:mm A')} -{' '}
            {moment(orderDetailData.scheduleDate)
              .add(orderDetailData.duration, 'hour')
              .format('hh:mm A')}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Calendar className="size-5! text-gray-600" />
          <p>{moment(orderDetailData.scheduleDate).format('DD MMM YYYY')}</p>
        </div>
        <div className="flex items-center space-x-4">
          <MapPin className="size-5! shrink-0 text-gray-600" />
          <p>{orderDetailData.address}</p>
        </div>
        <div className="flex items-center space-x-4">
          <MessageSquareText className="size-5! shrink-0 text-gray-600" />
          <p className="wrap-break-word min-w-0">{orderDetailData.note || 'N/A'}</p>
        </div>
      </div>

      <div className="border-b space-y-4 p-4 px-5">
        <h2 className="text-base font-bold text-gray-700">Assign Cleaners</h2>
        <AssignCleaner
          scheduleStartDate={orderDetailData.scheduleStartDate}
          orderCleaners={orderDetailData.cleaners}
          onChange={async (cleaner) => {
            await mutateAsync({ bulkOrderId: orderDetailData.bulkOrderId, cleanerId: cleaner.id });
            refetch();
          }}
        />
      </div>

      <div className="border-b py-2 px-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-700">Service</h2>
          <NavLink to={`/order?bulkOrderId=${orderDetailData.bulkOrderId}`}>
            <Button className="p-0" variant="link">
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

      <div className="py-4 px-5">
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

      <div className="w-full space-x-3 p-4 flex justify-end sticky bottom-0 bg-white shadow-[0px_-2px_12px_0px_#1C1C1C1A] z-10">
        <Button
          variant="outline"
          type="button"
          isLoading={isPending}
          onClick={handleCopyBooking}
          className={clsx('h-9')}
        >
          <Copy />
          Copy
        </Button>
        <Button
          type="button"
          isLoading={isPending}
          onClick={handlePrintInvoice}
          className={clsx('h-9')}
        >
          <PrinterIcon />
          Print Invoice
        </Button>
      </div>
    </>
  );
};

export default function OrderListDrawer({ orders, date, isOpen, setIsOpen }: Props) {
  const [selectedOrderId, setSelectedOrderId] = useState('');

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        setSelectedOrderId('');
      }}
    >
      <DialogContent
        className="w-full max-w-100 flex flex-col gap-0 p-0 h-[calc(100vh-32px)] my-4 left-auto right-10 top-0 translate-none rounded-xl overflow-auto"
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
