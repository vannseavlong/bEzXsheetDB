import Icon from '@/assets/icons/icon-asset';
import { useTranslation } from 'node_modules/react-i18next';

export default function ErrorPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="text-center max-w-sm">
        {/* Illustration */}
        <div className="mb-11 flex justify-center">
          <Icon name="ErrorIcon" />
        </div>

        {/* Error message */}
        <p className="text-[#1A1A1A] text-base font-semibold leading-relaxed">
          {t('notFound.oopsSomethingWentWrong')}
        </p>
      </div>
    </div>
  );
}
