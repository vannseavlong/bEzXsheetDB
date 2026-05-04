import Icon from '@/assets/icons/icon-asset';
import type { GetDefaultAcc } from '@/types/aba-bridge';
import React, { useEffect, useState } from 'react';
import * as pkg from 'web-bridge-gateway';
import { useTranslation } from 'react-i18next';

const { callHandler } = pkg;

interface ABAPayInterfaceProps {
  isOpen?: boolean;
  onClose?: () => void;
  totalAmount?: number;
  handleConfirmPaytClick?: (useDefault: boolean) => void;
}

export default function ABAPayInterface({
  isOpen = false,
  onClose,
  totalAmount = 0,
  handleConfirmPaytClick
}: ABAPayInterfaceProps) {
  const { t } = useTranslation();
  const [showAnim, setShowAnim] = useState(false);
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [animationDirection, setAnimationDirection] = useState<'up' | 'down'>('up');
  const [defaultAcc, setDefaultAcc] = useState<GetDefaultAcc | undefined>();

  const handlePaymentClick = () => {
    // In a real app, you would navigate to ABA PAY
    // window.location.href = 'https://www.ababank.com/';
    // or use React Router: navigate('/aba-pay');

    if (handleConfirmPaytClick) {
      handleConfirmPaytClick(Boolean(defaultAcc?.accountNumber));
    }
    // alert(
    //   'Navigating to ABA PAY...\n\nIn a real app, this would redirect you to:\nhttps://www.ababank.com/'
    // );
    onClose?.();
  };

  const handleChangeClick = () => {
    // In a real app, you would navigate to ABA PAY
    // window.location.href = 'https://www.ababank.com/';
    // or use React Router: navigate('/aba-pay');

    if (handleConfirmPaytClick) {
      handleConfirmPaytClick(false);
    }
    // alert(
    //   'Navigating to ABA PAY...\n\nIn a real app, this would redirect you to:\nhttps://www.ababank.com/'
    // );
    onClose?.();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };

  useEffect(() => {
    if (isOpen) {
      callHandler('getDefaultAcc', {
        currency: 'USD', // KHR,
        amount: totalAmount.toFixed(2)
      })
        .then((data: GetDefaultAcc) => {
          setAnimationDirection('up');
          setShouldRender(true);
          setTimeout(() => setShowAnim(true), 10);
          setDefaultAcc(data);
        })
        .catch((err) => alert(err));
    } else {
      setAnimationDirection('down');
      setShowAnim(false);
      setTimeout(() => setShouldRender(false), 300);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  let modalClass = 'bg-white w-full max-w-md transition-transform duration-300 ease-out transform';
  if (showAnim && animationDirection === 'up') {
    modalClass += ' translate-y-0 opacity-100';
  } else if (!showAnim && animationDirection === 'up') {
    modalClass += ' translate-y-full opacity-0';
  } else if (!showAnim && animationDirection === 'down') {
    modalClass += ' -translate-y-full opacity-0';
  } else if (showAnim && animationDirection === 'down') {
    modalClass += ' translate-y-0 opacity-100';
  }

  return (
    <div>
      {/* Modal Overlay */}
      <div
        className="fixed inset-0 bg-black/50 flex items-end justify-center z-[9999] transition-all duration-300 ease-out"
        onClick={handleBackdropClick}>
        {/* Modal Content */}
        <div className={modalClass}>
          <div className="px-[18.21px] pt-[18.21px] pb-[17.93px]">
            {/* Header with ABA PAY logo and title */}
            {defaultAcc?.accountName && (
              <>
                <div className="flex items-center mb-[18.26px] gap-[17.3px]">
                  <Icon name="abaicon" />
                  <h1 className="text-[16px] font-bold text-[#000000]">{t('payment.abaPay')}</h1>
                </div>

                {/* Account selection section */}
                <div className="mb-[18.26px]">
                  <div className="flex items-center justify-between">
                    <h2 className="text-[18.261px] font-semibold text-[#000]">
                      {/* Mobile Savings Account with... */}
                      {defaultAcc?.accountName}
                    </h2>
                    <button
                      className="flex items-center text-[18.261px] text-primary-gradient font-medium"
                      onClick={handleChangeClick}>
                      {t('common.change')}
                      <div className="ml-[4.57px] ">
                        <Icon name="chevronDown" />
                      </div>
                    </button>
                  </div>
                  <p className="text-gray-500 text-[13.696px]">
                    {defaultAcc?.accountNumber?.replace(/(\d{3})(?=\d)/g, '$1 ')} |{' '}
                    {defaultAcc?.currency}
                  </p>
                </div>
              </>
            )}

            {/* Payment button */}
            <button
              onClick={handlePaymentClick}
              className="w-full bg-primary-gradient hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg text-lg transition-colors">
              {t('payment.pay')} ${totalAmount.toFixed(2)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
