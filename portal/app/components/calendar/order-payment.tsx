import React from 'react';
import PaymentLabel from '../common/order-payment-label';
import { Card } from '../ui/card';

import { formatDate } from '@/lib/date-helper';
// import { Label } from '../ui/label';
// import { IOSToggle } from '../ui/ios-toggle';
// import { Textarea } from '../ui/textarea';

type Props = {
  serviceFeeDisplay: string;
  discountDisplay: string;
  transportFeeDisplay: string;
  subTotalDisplay: string;
  vatFeeDisplay: string;
  paymentMethodDisplay: string;
  totalPayableAmountDisplay: string;
  couponCode: string;
  totalAmountDisplay: string;
  type: 'ORDER' | 'DIRECT_SALE';
  depositDisplay?: string;
  remainingDisplay?: string;
  paymentMethod?: string;
  paymentStatus?: PaymentStatusProps;
  directSaleNextPaymentDate?: string;
};

const PaymentInfo: React.FC<Props> = (props) => {
  // const [isABAPayment, setIsABAPayment] = React.useState(false);

  const statusStyle = (paymentStatus?: PaymentStatusProps) => {
    switch (paymentStatus) {
      case 'PAID':
        return 'bg-[#E6F9F1] text-[#06C270]';
      case 'PENDING':
        return 'bg-[#FFF4E5] text-[#FFA726]';
      case 'UNPAID':
        return 'bg-[#FDECEA] text-[#E53935]';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <Card className="bg-card gap-2 pt-0">
      <div className="relative space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-700">Payment Information</h2>
          {props.paymentStatus && (
            <span
              className={`text-xs font-bold rounded-full px-4 py-1 ${statusStyle(props.paymentStatus)}`}
            >
              {props.paymentStatus}
            </span>
          )}
        </div>

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
        {/* {props.paymentMethod === 'abapay_khqr_deeplink' && props.type === 'ORDER' && (
          <div className="flex gap-2 items-center justify-between mt-4">
            <Label>View ABA Payway</Label>
            <IOSToggle checked={isABAPayment} onCheckedChange={setIsABAPayment} />
          </div>
        )} */}
      </div>
    </Card>
  );
};

export default PaymentInfo;
