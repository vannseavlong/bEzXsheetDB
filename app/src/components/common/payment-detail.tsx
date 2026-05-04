import type { OrderDetail } from '@/types/api';
import { Badge } from '../ui/badge';
import { getPaymentStatus, getPaymentStatusVariant } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

export function PaymentDetail({ payment }: { payment: OrderDetail }) {
  const { t } = useTranslation();

  return (
    <div className="bg-white p-4">
      <h1 className="font-bold text-[16px] text-gray-800">{t('payment.paymentDetails')}</h1>

      <div className="grid grid-cols-2 gap-y-4 pt-4">
        <p className="text-gray-600">{t('payment.service')}:</p>
        <p className="text-right font-medium text-[#3D3D3D]">{payment.amountDisplay}</p>

        {payment.couponCode && (
          <>
            <p className="text-gray-600">{t('payment.coupon')}:</p>
            <p className="text-right font-medium text-[#3D3D3D]">{payment.couponCode}</p>
          </>
        )}

        <p className="text-gray-600">{t('payment.discount')}:</p>
        <p className="text-right font-medium text-[#3D3D3D]">{payment.discountDisplay}</p>

        <p className="text-gray-600">{t('payment.serviceFee')}:</p>
        <p className="text-right font-medium text-[#3D3D3D]">{payment.serviceFeeDisplay}</p>

        <p className="text-gray-600">{t('payment.transportFee')}:</p>
        <p className="text-right font-medium text-[#3D3D3D]">{payment.transportFeeDisplay}</p>

        <p className="text-gray-600">{t('payment.subtotal')}:</p>
        <p className="text-right font-medium text-[#3D3D3D]">{payment.subTotalDisplay}</p>

        <div className="col-span-2 border-t border-dashed border-gray-300 my-2"></div>

        <p className="text-gray-600">{t('payment.vat')}:</p>
        <p className="text-right font-medium text-[#3D3D3D]">{payment.vatFeeDisplay}</p>

        <p className="text-gray-600">{t('payment.total')}:</p>
        <p className="text-right font-medium text-[#3D3D3D]">{payment.totalPayableAmountDisplay}</p>

        <div className="col-span-2 border-t border-dashed border-gray-300 my-2"></div>

        <p className="text-gray-600">{t('payment.paymentMethod')}:</p>
        <p className="text-right font-medium text-[#3D3D3D]">{payment.paymentMethodDisplay}</p>

        <p className="text-gray-600">{t('payment.paymentStatus')}:</p>
        <div className="flex justify-end">
          <Badge
            variant={getPaymentStatusVariant(payment.paymentStatus)}
            className="rounded-full h-8 text-sm">
            {t(getPaymentStatus(payment.paymentStatus))}
          </Badge>
        </div>
      </div>
    </div>
  );
}
export default PaymentDetail;
