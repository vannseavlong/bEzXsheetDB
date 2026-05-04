import React, { useEffect, useRef } from 'react';
import PaymentLabel from './order-payment-label';
import { Card } from '../ui/card';
import AssignCleaner, { type AssignCleanerHandle } from './assign-cleaner';
import { useAddCleanerDetailMutation } from '@/hooks/mutations/use-add-cleaner-detail-mutation';
import { Badge } from '../ui/badge';
import { getBadgePaymentStatusVariant } from '@/lib/utils';
import useCheckABAPaymentQuery from '@/hooks/query/use-check-aba-payment-status-query';
import { formatDate } from '@/lib/date-helper';
import { Label } from '../ui/label';
import { IOSToggle } from '../ui/ios-toggle';
import { usePermission } from '@/hooks/use-permission';
import { Input } from '../ui/input';

import { ACTIONS, MODULES } from '@/lib/permission';
import { useUpdateExchangeRateMutation } from '@/hooks/mutations/use-update-exchange-rate-mutation';
// import { Textarea } from '../ui/textarea';

type Props = {
  scheduleStartDate: string;
  serviceFeeDisplay: string;
  discountDisplay: string;
  transportFeeDisplay: string;
  subTotalDisplay: string;
  vatFeeDisplay: string;
  paymentMethodDisplay: string;
  totalPayableAmountDisplay: string;
  couponCode: string;
  totalAmountDisplay: string;
  bulkOrderId: string;
  tranId?: string;
  orderCleaners: CleanerAttributes[];
  type: 'ORDER' | 'DIRECT_SALE';
  depositDisplay?: string;
  remainingDisplay?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  directSaleNextPaymentDate?: string;
  status?: string;
  exchangeRate?: string;
};

const PaymentInfo: React.FC<Props> = (props) => {
  const assignCleanerRef = useRef<AssignCleanerHandle>(null);
  const { mutate } = useAddCleanerDetailMutation(() => {
    assignCleanerRef.current?.resetCleaner();
  });
  const [isABAPayment, setIsABAPayment] = React.useState(false);
  const { mutate: updateExchangeRate } = useUpdateExchangeRateMutation();
  const { hasPermission } = usePermission();
  const [exchangeRate, setExchangeRate] = React.useState(props.exchangeRate ?? '');

  const { data, refetch, isFetching } = useCheckABAPaymentQuery({ tranId: props.tranId });

  useEffect(() => {
    if (isABAPayment && props.tranId && props.type === 'ORDER') {
      refetch();
    }
  }, [isABAPayment, props.tranId, props.type, refetch]);

  const handleSave = () => {
    // call api
    updateExchangeRate({ id: props.bulkOrderId, exchangeRate });
  };

  return (
    <Card className="w-full md:w-[340px] mx-auto bg-card p-6 gap-2">
      <div className="space-y-4 pb-4">
        <h2 className="text-base font-bold text-gray-700">Assign Cleaners</h2>
        <div className="w-full bg-gray-100 h-[2px]" />
        <AssignCleaner
          ref={assignCleanerRef}
          scheduleStartDate={props.scheduleStartDate}
          orderCleaners={props.orderCleaners}
          onChange={(cleaner) => {
            mutate({ bulkOrderId: props.bulkOrderId, cleanerId: cleaner.id });
          }}
        />
      </div>

      {isFetching && <div>Loading...</div>}
      {props?.paymentMethod === 'abapay_khqr_deeplink' && data && isABAPayment && (
        <ABAPaymentStatus data={data} />
      )}

      <div className="relative space-y-4">
        <h2 className="text-base font-bold text-gray-700">Payment Information</h2>

        <div className="w-full bg-gray-100 h-[2px]" />
        <div className="space-y-4">
          {/* Service */}
          <PaymentLabel label="Total Amount:" value={props.totalAmountDisplay} />
          {props.discountDisplay && (
            <PaymentLabel label="Discount:" value={`(${props.discountDisplay})`} />
          )}
          {props.couponCode && <PaymentLabel label="Coupon:" value={props.couponCode} />}
          <PaymentLabel label="Service Fee:" value={props.serviceFeeDisplay} />
          <PaymentLabel label="Transport Fee:" value={props.transportFeeDisplay} />
          <PaymentLabel label="SubTotal:" value={props.subTotalDisplay} />

          <PaymentLabel label="VAT (10%):" value={props.vatFeeDisplay} />
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Exchange Rate</span>
            <Input
              value={exchangeRate}
              disabled={!hasPermission(MODULES.EXCHANGE_RATE, ACTIONS.ADD)}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= 4) {
                  setExchangeRate(value);
                }
              }}
              placeholder="Exchange Rate"
              className="w-38 text-end"
              type="number"
              onBlur={handleSave}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSave();
                  e.preventDefault();
                }
              }}
            />
          </div>
          <PaymentLabel label="Payment Method:" value={props.paymentMethodDisplay} />
          <div className="w-full bg-gray-100 h-[2px]" />
          <span className="font-bold text-gray-900">
            <PaymentLabel label="Total:" value={props.totalPayableAmountDisplay ?? 0} />
            {props.type === 'DIRECT_SALE' && props.paymentStatus !== 'PAID' && (
              <>
                <PaymentLabel label="Deposit:" value={props.depositDisplay || ''} />
                <PaymentLabel label="Remaining:" value={props.remainingDisplay || ''} />
                <PaymentLabel
                  label="Next Payment Date:"
                  value={
                    props.directSaleNextPaymentDate
                      ? formatDate(props.directSaleNextPaymentDate)
                      : '-'
                  }
                />
              </>
            )}
          </span>
        </div>
        {props.paymentMethod === 'abapay_khqr_deeplink' && props.type === 'ORDER' && (
          <div className="flex gap-2 items-center justify-between mt-8">
            <Label>View ABA Payway</Label>
            <IOSToggle checked={isABAPayment} onCheckedChange={setIsABAPayment} />
          </div>
        )}
      </div>
    </Card>
  );
};

const ABAPaymentStatus = ({
  data
}: {
  data?: { data: ABAPaymentCheckProps; status: { code: string; message: string; tran_id: string } };
}) => {
  const paymentStatusData = data?.data;

  return (
    <div className="mt-4 mb-8 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-base font-bold text-gray-700">ABA PayWay</h2>
        <Badge
          className="rounded-full px-4"
          variant={getBadgePaymentStatusVariant(paymentStatusData?.payment_status || 'PENDING')}
        >
          {paymentStatusData?.payment_status}
        </Badge>
      </div>
      <div className="w-full bg-gray-100 h-[2px] mb-4" />
      <PaymentLabel label="Tran ID:" value={`${data?.status?.tran_id}`} />
      <PaymentLabel label="Amount:" value={`$ ${paymentStatusData?.original_amount}`} />
      <PaymentLabel label="Discount:" value={`($ ${paymentStatusData?.discount_amount})`} />
      <PaymentLabel
        label="Transaction Date:"
        value={
          paymentStatusData?.transaction_date
            ? formatDate(paymentStatusData?.transaction_date, true)
            : ''
        }
      />
      <div className="w-full bg-gray-100 h-[2px] mb-4" />
      <PaymentLabel
        label="Amount:"
        value={`$ ${paymentStatusData?.total_amount}`}
        labelClassName="font-bold"
        valueClassName="!font-bold text-lg"
      />
      {/* <PaymentLabel label="Total Amount:" value={props.totalAmountDisplay} />
      <PaymentLabel label="Total Amount:" value={props.totalAmountDisplay} /> */}
    </div>
  );
};

export default PaymentInfo;
