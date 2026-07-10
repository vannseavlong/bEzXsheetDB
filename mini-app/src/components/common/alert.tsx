import Icon from '@/assets/icons/icon-asset';
import { useTranslation } from 'react-i18next';

export function Alert() {
  const { t } = useTranslation();

  return (
    <div className="bg-[#FFEBEB] flex items-start gap-2 p-4 rounded-lg">
      <div className="w-8 h-8">
        <Icon name="AlertIcon" />
      </div>
      <p
        className="text-sm text-[#333]"
        dangerouslySetInnerHTML={{ __html: t('alert.serviceNote') }}
      />
    </div>
  );
}

export default Alert;
