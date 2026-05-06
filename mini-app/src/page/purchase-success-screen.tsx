import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useNavigationTitle from '@/hooks/use-navigation-title';
import { useTranslation } from 'node_modules/react-i18next';

export default function PurchaseSuccessInterface() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Set navigation bar title
  useNavigationTitle(t('purchaseSuccess.success'));

  // Sample order details
  const orderDetails = {
    orderId: '58110063',
    orderDate: 'Feb 25, 2021 10:56',
    paidTo: 'BEasy',
    paidFrom: '000 123 456',
    originalAmount: '20.90 USD',
    totalAmount: '20.90 USD'
  };

  const handleViewBookingDetails = () => {
    alert('Redirecting to booking details...');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="max-w-sm mx-auto bg-white min-h-screen flex flex-col">
      {/* Main Content */}
      <div className="flex-1 px-6 pt-38">
        {/* Success Icon */}
        <div className="flex justify-center mb-2">
          <div className="w-16 h-16 bg-primary-gradient rounded-full flex items-center justify-center shadow-lg">
            <Check className="w-8 h-8 text-white stroke-[3]" />
          </div>
        </div>

        {/* Success Message */}
        <div className="text-center mb-12">
          <h1 className="text-[20px] font-semibold text-[#000]">
            {t('purchaseSuccess.purchaseSuccessful')}
          </h1>
        </div>

        {/* Decorative bar */}
        <div className="flex justify-center mb-4 relative">
          <div className="relative w-[324.139px] h-[18.246px] bg-[#ebebeb] p-2 rounded-[27.52px] flex items-center justify-center overflow-hidden">
            <div className="shadow absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[312.725px] h-[9.123px] rounded-[14px] flex items-center justify-center"></div>
          </div>
        </div>
      </div>

      {/* Transaction Details Card */}
      <div className="flex-1 px-12 pb-6 absolute bottom-58.5 left-0 right-0">
        <div className="bg-[#FFFFFF] p-4 mb-8 relative shadow-[-6px_0_15px_rgba(0,0,0,0.05),6px_0_15px_rgba(0,0,0,0.05),0_6px_15px_rgba(0,0,0,0.08)]">
          <div className="absolute inset-x-0 top-0 h-[8px] bg-gradient-to-b from-[rgba(0,0,0,0.27)] to-[rgba(0,0,0,0)] pointer-events-none z-20" />

          {/* Transaction Info */}
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">{t('purchaseSuccess.orderId')}</span>
              <span className="text-gray-900 font-medium">{orderDetails.orderId}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">{t('purchaseSuccess.orderDate')}</span>
              <span className="text-gray-900 font-medium">{orderDetails.orderDate}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">{t('purchaseSuccess.paidTo')}</span>
              <span className="text-gray-900 font-medium">{orderDetails.paidTo}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">{t('purchaseSuccess.paidFrom')}</span>
              <span className="text-gray-900 font-medium">{orderDetails.paidFrom}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">{t('purchaseSuccess.originalAmount')}</span>
              <span className="text-gray-900 font-medium">{orderDetails.originalAmount}</span>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-4"></div>

          {/* Total Amount */}
          <div className="flex justify-between">
            <span className="text-gray-900 font-medium">
              {t('purchaseSuccess.totalAmountLabel')}
            </span>
            <span className="text-gray-900 font-semibold">{orderDetails.totalAmount}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 pb-6 space-y-3">
        <button
          onClick={handleViewBookingDetails}
          className="w-full bg-primary-gradient hover:bg-blue-700 text-white font-medium py-4 transition-colors">
          {t('purchaseSuccess.viewBookingDetails')}
        </button>
        <button
          onClick={handleGoHome}
          className="w-full bg-white hover:bg-gray-50 text-blue-600 font-medium py-4 border border-gray-200 transition-colors">
          {t('purchaseSuccess.goHome')}
        </button>
      </div>
    </div>
  );
}
