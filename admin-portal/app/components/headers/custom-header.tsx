import { useNavigate } from 'react-router';
import useCanGoBack from '@/hooks/use-can-go-back';
import { ChevronLeft } from 'lucide-react';
import { Button } from '../ui/button';
import HeaderTitle from './header-title';
import { useTranslation } from 'react-i18next';

export default function CustomHeader({
  buttonText = 'save',
  onSave,
  isLoading,
  isDone,
  disabled
}: {
  buttonText?: string;
  onSave?: () => void;
  isLoading?: boolean;
  isDone?: boolean;
  disabled?: boolean;
}) {
  const { t } = useTranslation();
  const { canGoBack } = useCanGoBack();
  const navigate = useNavigate();
  const handleBack = () => navigate(-1);

  return (
    <div className="h-22 p-6 pl-4 flex w-full items-center flex-row bg-background">
      <div className="flex flex-1 flex-row gap-4 items-center">
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={handleBack}
          disabled={!canGoBack}
        >
          <ChevronLeft className="size-6!" />
        </Button>

        <HeaderTitle />
      </div>

      {onSave &&
        (isDone ? (
          <Button
            variant="secondary"
            isLoading={isLoading}
            onClick={() => navigate(-1)}
            type="button"
            size="sm"
          >
            Done
          </Button>
        ) : (
          <Button
            isLoading={isLoading}
            onClick={onSave}
            size="sm"
            type="button"
            disabled={disabled}
          >
            {t(buttonText)}
          </Button>
        ))}
    </div>
  );
}
