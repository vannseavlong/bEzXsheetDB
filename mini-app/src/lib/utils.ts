import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPhoneNumber = (value: string) => {
  if (!value) return '';
  const cleanedValue = value.replace(/\D/g, ''); // Remove non-digits
  const length = cleanedValue.length;

  if (length < 4) {
    return cleanedValue;
  } else if (length < 7) {
    return `${cleanedValue.slice(0, 3)} ${cleanedValue.slice(3)}`;
  } else {
    return `${cleanedValue.slice(0, 3)} ${cleanedValue.slice(3, 6)} ${cleanedValue.slice(6, 10)}`;
  }
};

export const getBadgeStatusVariant = (
  status?: 'PENDING' | 'IN-PROGRESS' | 'COMPLETED' | 'ACCEPTED' | 'CANCELLED' | 'REJECTED'
) => {
  switch (status) {
    case 'PENDING':
      return 'warning';
    case 'IN-PROGRESS':
      return 'confirm';
    case 'ACCEPTED':
      return 'confirm';
    case 'COMPLETED':
      return 'approve';
    case 'CANCELLED':
      return 'destructive';
    case 'REJECTED':
      return 'destructive';
    default:
      return 'destructive';
  }
};

export const getStatusDisplayText = (
  status?: 'PENDING' | 'IN-PROGRESS' | 'COMPLETED' | 'ACCEPTED' | 'CANCELLED' | 'REJECTED'
) => {
  switch (status) {
    case 'PENDING':
      return 'Pending';
    case 'IN-PROGRESS':
      return 'In Progress';
    case 'ACCEPTED':
      return 'Confirmed';
    case 'COMPLETED':
      return 'Completed';
    case 'CANCELLED':
      return 'Cancelled';
    case 'REJECTED':
      return 'Rejected';
    default:
      return 'Unknown';
  }
};

export const getPaymentStatusVariant = (paymentStatus?: 'PAID' | 'UNPAID' | 'IN-REVIEW') => {
  switch (paymentStatus) {
    case 'PAID':
      return 'approve';
    case 'UNPAID':
      return 'warning';
    case 'IN-REVIEW':
      return 'warning';
    default:
      return 'destructive';
  }
};
export const getPaymentStatus = (paymentStatus?: 'PAID' | 'UNPAID' | 'IN-REVIEW') => {
  switch (paymentStatus) {
    case 'PAID':
      return 'payment.paid';
    case 'UNPAID':
      return 'payment.unpaid';
    case 'IN-REVIEW':
      return 'payment.inReview';
    default:
      return 'payment.unknown';
  }
};
