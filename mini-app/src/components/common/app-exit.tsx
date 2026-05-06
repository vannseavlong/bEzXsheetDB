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
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'node_modules/react-i18next';

interface AppExitProps {
  triggerText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export interface AppExitRef {
  open: () => void;
  close: () => void;
  isOpen: () => boolean;
}

const AppExit = forwardRef<AppExitRef, AppExitProps>(
  ({ triggerText, onConfirm, onCancel }, ref) => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);

    const handleConfirm = () => {
      if (onConfirm) {
        onConfirm();
      } else {
        // Default behavior - close window/tab
        window.close();
      }
    };

    const handleCancel = () => {
      if (onCancel) {
        onCancel();
      }
      // Dialog will close automatically
    };

    useImperativeHandle(ref, () => ({
      open: () => setOpen(true),
      close: () => setOpen(false),
      isOpen: () => open
    }));

    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        {triggerText && (
          <AlertDialogTrigger asChild>
            <Button variant="outline">{triggerText}</Button>
          </AlertDialogTrigger>
        )}
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-primary-gradient font-bold text-lg">
              {t('appExit.title')}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[#1A1A1A] text-[14px] font-medium py-1 ">
              {t('appExit.description')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-between">
            <AlertDialogCancel onClick={handleCancel} className="w-[48%]">
              {t('common.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm} className="w-[48%] bg-primary-gradient">
              {t('common.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
);
AppExit.displayName = 'AppExit';
export default AppExit;
