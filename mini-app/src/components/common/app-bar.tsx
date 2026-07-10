import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

interface AppBarProps {
  title: string;
  showBackButton?: boolean;
}

export default function AppBar({ title, showBackButton = true }: AppBarProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 bg-gradient-to-r from-[#102C90] to-[#1B4CFA] px-4 text-white">
      {showBackButton && (
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label={t('common.back')}
          className="-ml-2 flex h-8 w-8 shrink-0 items-center justify-center">
          <ArrowLeft className="h-5 w-5" />
        </button>
      )}
      <h1 className="flex-1 truncate text-base font-semibold">{title}</h1>
    </header>
  );
}
