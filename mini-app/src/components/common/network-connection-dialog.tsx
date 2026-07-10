import { useNetworkStatus } from '../../hooks/use-network-status';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle
} from '../ui/alert-dialog';
import { Button } from '../ui/button';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

export function NetworkConnectionDialog() {
  const { t } = useTranslation();
  const isOnline = useNetworkStatus();
  const [isLoading, setIsLoading] = useState(false);

  const handleRetry = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate loading for better UX
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);

    if (!navigator.onLine) {
      return;
    }
    window.location.reload();
  };

  return (
    <AlertDialog open={!isOnline}>
      <AlertDialogContent>
        <AlertDialogTitle>{t('errors.noInternetConnection')}</AlertDialogTitle>
        <AlertDialogDescription>{t('errors.checkNetworkConnection')}</AlertDialogDescription>
        <Button
          onClick={handleRetry}
          isLoading={isLoading}
          className="bg-primary-gradient text-white">
          {t('errors.tryAgain')}
        </Button>
      </AlertDialogContent>
    </AlertDialog>
  );
}
