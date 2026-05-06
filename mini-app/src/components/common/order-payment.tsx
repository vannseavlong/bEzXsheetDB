import type { OrderPreviewResponse } from '@/types/api';
import { useTranslation } from 'node_modules/react-i18next';

export function OrderPayment({ payment }: { payment: OrderPreviewResponse }) {
  const { t } = useTranslation();

  if (!payment) return null;

  return (
    <div className="bg-white p-4">
      <h1 className="font-bold text-base text-gray-800">{t('payment.paymentDetails')}</h1>

      <div className="grid grid-cols-2 gap-y-4 pt-4">
        <p className="text-gray-600">{t('payment.service')}:</p>
        <p className="text-right font-medium text-[#3D3D3D]">${payment.amount.toFixed(2)}</p>

        <p className="text-gray-600">{t('payment.discount')}:</p>
        <p className="text-right font-medium text-[#3D3D3D]">${payment.discount?.toFixed(2)}</p>

        <p className="text-gray-600">{t('payment.serviceFee')}:</p>
        <p className="text-right font-medium text-[#3D3D3D]">${payment.serviceFee?.toFixed(2)}</p>

        <p className="text-gray-600">{t('payment.transportFee')}:</p>
        <p className="text-right font-medium text-[#3D3D3D]">${payment.transportFee?.toFixed(2)}</p>

        <p className="text-gray-600">{t('payment.subtotal')}:</p>
        <p className="text-right font-medium text-[#3D3D3D]">${payment.totalAmount.toFixed(2)}</p>

        <div className="col-span-2 border-t border-dashed border-gray-300 my-2"></div>

        <p className="text-gray-600">{t('payment.vat')}:</p>
        <p className="text-right font-medium text-[#3D3D3D]">${payment.vatFee?.toFixed(2)}</p>

        <p className="text-gray-800 font-semibold">{t('payment.totalPayable')}:</p>
        <p className="text-right font-bold text-primary-gradient text-base inline-block w-fit ml-auto">
          ${payment.totalPayableAmount.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
