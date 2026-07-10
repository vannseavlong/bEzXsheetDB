import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { useTranslation } from 'react-i18next';

interface LocationDistanceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  maxDistanceKm?: number;
}

const LocationDistanceDialog: React.FC<LocationDistanceDialogProps> = ({
  isOpen,
  onClose,
  maxDistanceKm
}) => {
  const { t } = useTranslation();

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="max-w-[calc(100%-2rem)] sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-[#1A1A1A] font-semibold text-lg text-center sm:text-left">
            {t('distanceDialog.title')}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-[#4B4B4B] text-sm">
            {t('distanceDialog.description', {
              maxDistanceKm: typeof maxDistanceKm === 'number' ? maxDistanceKm : '-'
            })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-end">
          <AlertDialogAction
            onClick={onClose}
            className="w-full sm:w-auto bg-primary-gradient text-white">
            {t('distanceDialog.closeButton')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LocationDistanceDialog;
