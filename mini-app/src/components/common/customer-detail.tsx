import type { OrderDetail } from '@/types/api';
import { useTranslation } from 'react-i18next';

type CheckoutCustomer = {
  customerFirstName?: string;
  customerLastName?: string;
  customerPhone?: string;
  customerEmail?: string;
  note?: string;
};

type CustomerData = OrderDetail | CheckoutCustomer;

const isOrderDetail = (customer: CustomerData): customer is OrderDetail => 'fullname' in customer;

export function CustomerDetail({ customer }: { customer: CustomerData }) {
  const { t } = useTranslation();
  const fullname = isOrderDetail(customer)
    ? customer.fullname
    : `${customer.customerFirstName || ''} ${customer.customerLastName || ''}`.trim();

  const phone = isOrderDetail(customer) ? customer.phone : customer.customerPhone || '';

  // OrderDetail has no email field — only the local checkout draft carries one.
  const email = isOrderDetail(customer) ? '' : customer.customerEmail || '';

  return (
    <div className="bg-white">
      <div className="grid grid-cols-2 gap-y-2 pt-3">
        <p className="text-[#3D3D3D] text-[14px] font-medium">{t('order.fullName')}:</p>
        <p className="text-right text-[14px] font-medium text-[#3D3D3D]">{fullname}</p>

        <p className="text-[#3D3D3D] text-[14px] font-medium">{t('order.customerPhone')}:</p>
        <p className="text-right text-[14px] font-medium text-[#3D3D3D]">{phone}</p>

        {email && email.trim() !== '' && (
          <>
            <p className="text-[#3D3D3D] text-[14px] font-medium">{t('order.customerEmail')}:</p>
            <p className="text-right text-[14px] font-medium text-[#3D3D3D] truncate">{email}</p>
          </>
        )}

        {customer.note && customer.note.trim() !== '' && (
          <>
            <p className="text-[#3D3D3D] text-[14px] font-medium">{t('location.note')}:</p>
            <p className="text-right text-[14px] font-medium text-[#3D3D3D]">{customer.note}</p>
          </>
        )}
      </div>
    </div>
  );
}

export default CustomerDetail;
