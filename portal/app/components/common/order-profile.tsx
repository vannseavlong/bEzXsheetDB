import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { getAvatarFallbackText } from '@/lib/utils';

type Props = {
  fullname?: string;
  phone: string;
  profileUrl?: string;
  paymentStatus?: PaymentStatusProps;
};

const OrderProfile: React.FC<Props> = (props) => {
  // const getInitials = (fullName?: string) => {
  //   if (!fullName) return '';
  //   const parts = fullName.trim().split(' ');
  //   if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  //   return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  // };
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
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-4 flex-1">
        <Avatar className="size-12">
          <AvatarImage src={props.profileUrl} alt={props.fullname} />
          <AvatarFallback>{getAvatarFallbackText(props.fullname)}</AvatarFallback>
        </Avatar>
        <div className="text-sm">
          <h3 className="text-[#1A1A1A] font-inter text-base font-bold leading-6 capitalize">
            {props.fullname}
          </h3>
          <p className="text-gray-600">{props.phone}</p>
        </div>
      </div>
      {props.paymentStatus && (
        <span
          className={`text-xs font-bold rounded-full px-4 py-1 ${statusStyle(props.paymentStatus)}`}
        >
          {props.paymentStatus}
        </span>
      )}
    </div>
  );
};
export default OrderProfile;
