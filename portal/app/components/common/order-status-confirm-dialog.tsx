import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '../ui/alert-dialog';
import { Button } from '../ui/button';

import type { VariantProps } from 'class-variance-authority';
import type { buttonVariants } from '../ui/button';

interface OrderStatusConfirmDialogProps {
  status: string;
  isPending: boolean;
  buttonText: string;
  buttonVariant: VariantProps<typeof buttonVariants>['variant'];
  buttonClassName?: string;
  onConfirm: () => void;
  triggerAsChild?: boolean;
  confirmText?: string;
  description?: string;
}

const OrderStatusConfirmDialog: React.FC<OrderStatusConfirmDialogProps> = ({
  isPending,
  buttonText,
  buttonVariant,
  buttonClassName,
  onConfirm,
  triggerAsChild = true,
  confirmText = 'Confirm',
  description = 'Are you sure you want to proceed with this order?'
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild={triggerAsChild}>
        <Button
          type="button"
          isLoading={isPending}
          variant={buttonVariant}
          size="sm"
          className={buttonClassName}
        >
          {buttonText}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmation</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="h-9">Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="h-9">
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default OrderStatusConfirmDialog;
