import clsx from 'clsx';
import Icon from '@/assets/icons/icon-asset';
import useTabStore from '@/hooks/store/use-tab-store';
import { useTranslation } from 'node_modules/react-i18next';

export default function BottomTabBar() {
  const { t } = useTranslation();
  const { activeTab, setActiveTab } = useTabStore();

  return (
    <div className="bg-white border-t border-gray-200 py-4 flex-shrink-0 fixed bottom-0 w-full touch-none">
      <div className="flex justify-around">
        <button
          type="button"
          className={clsx('flex flex-col items-center justify-center gap-1 font-bold', {
            'text-[#102C90] to-[#1B4CFA]': activeTab === 'home'
          })}
          onClick={() => setActiveTab('home')}>
          <Icon name={activeTab === 'home' ? 'HomeActive' : 'HomeIcon'} />
          <span className="text-xs">{t('navigation.homeTab')}</span>
        </button>
        <button
          type="button"
          className={clsx('flex flex-col items-center justify-center gap-1 font-bold', {
            'text-[#102C90] to-[#1B4CFA]': activeTab === 'booking'
          })}
          onClick={() => setActiveTab('booking')}>
          <Icon name={activeTab === 'booking' ? 'BookActive' : 'BookIcon'} />
          <span className="text-xs">{t('navigation.bookingTab')}</span>
        </button>
      </div>
    </div>
  );
}
