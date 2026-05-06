import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import z from 'zod';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getBadgePaymentStatusVariant = (status: PaymentStatusProps) => {
  switch (status) {
    case 'PENDING':
      return 'warning';
    case 'IN-REVIEW':
      return 'confirm';
    case 'FAILED':
      return 'destructive';
    case 'PAID':
      return 'approve';
    case 'REFUNDED':
      return 'destructive';
    case 'PARTIALLY_PAID':
      return 'purple';
    default:
      return 'destructive';
  }
};

export const getPaymentStatusDisplayText = (status: PaymentStatusProps) => {
  switch (status) {
    case 'PENDING':
      return 'Pending';
    case 'IN-REVIEW':
      return 'In Review';
    case 'FAILED':
      return 'Failed';
    case 'PAID':
      return 'Paid';
    case 'REFUNDED':
      return 'Refunded';
    case 'PARTIALLY_PAID':
      return 'Partially Paid';
    default:
      return 'Unknown';
  }
};

export const getBadgeStatusVariant = (status?: OrderStatusProps | 'REJECTED') => {
  switch (status) {
    case 'PENDING':
      return 'warning';
    case 'IN_PROGRESS':
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

export const getStatusDisplayText = (status?: OrderStatusProps | 'REJECTED') => {
  switch (status) {
    case 'PENDING':
      return 'Pending';
    case 'IN_PROGRESS':
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

export const getUserStatusVariant = (status?: UserStatusProps | 'PENDING') => {
  switch (status) {
    case 'PENDING':
      return 'warning';
    case 'ACTIVE':
      return 'approve';
    case 'SUSPENDED':
      return 'destructive';
    case 'DELETED':
      return 'destructive';
    default:
      return 'default';
  }
};

export const getUserStatusDisplayText = (status: UserStatusProps | 'PENDING') => {
  switch (status) {
    case 'PENDING':
      return 'Pending';
    case 'ACTIVE':
      return 'Active';
    case 'SUSPENDED':
      return 'Suspended';
    case 'DELETED':
      return 'Deleted';
    default:
      return 'Unknown';
  }
};

export const getNotificationStatusVariant = (status: NotificationStatusProps) => {
  switch (status) {
    case 'DELIVERING':
      return 'warning';
    case 'DELIVERED':
      return 'confirm';
    case 'FAILED':
      return 'destructive';
    case 'CANCELED':
      return 'destructive';
    default:
      return 'destructive';
  }
};

export const getNotificationStatusDisplayText = (status: NotificationStatusProps) => {
  switch (status) {
    case 'DELIVERING':
      return 'Delivering';
    case 'DELIVERED':
      return 'Delivered';
    case 'FAILED':
      return 'Failed';
    case 'CANCELED':
      return 'Cancelled';
    default:
      return 'Unknown';
  }
};

export const getAvatarFallbackText = (name?: string) => {
  if (!name) return '';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const fileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= 10 * 1024 * 1024, {
    message: 'File must be <= 10MB'
  })
  .refine((file) => ['image/jpeg', 'image/png', 'application/pdf'].includes(file.type), {
    message: 'File must be JPG, PNG, or PDF'
  });

export const DIGITS_ONLY_REGEX = /^\d+$/;

export const sanitizeNumberInput = (value: string): string => {
  return value.replace(/\D/g, '');
};

export const isDigitsOnly = (value: string): boolean => {
  return DIGITS_ONLY_REGEX.test(value);
};
