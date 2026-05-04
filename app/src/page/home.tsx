import HomeContent from './home-content';
import BookingContent from './booking-content';
import useTabStore from '@/hooks/store/use-tab-store';
import useOrderState from '@/hooks/store/use-order-state';
import useNavigationTitle from '@/hooks/use-navigation-title';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import BottomTabBar from '@/components/common/BottomTabBar';

import * as pkg from 'web-bridge-gateway';
const { callHandler } = pkg;

export default function CleaningServiceApp() {
  const { t } = useTranslation();
  const { activeTab, setActiveTab } = useTabStore();
  const { resetAll } = useOrderState();
  const activeTabRef = useRef<'home' | 'booking'>('home');
  activeTabRef.current = activeTab;

  // Set navigation bar title based on active tab
  useNavigationTitle(activeTab === 'home' ? t('navigation.homeTab') : t('navigation.bookingTab'));

  // Reset order state when landing on home or booking tab
  useEffect(() => {
    resetAll();
  }, [resetAll]);

  useEffect(() => {
    window.history.pushState({}, '', '');

    const handlePopState = () => {
      // When on Booking tab, navigate to Home tab instead of showing exit alert
      if (activeTabRef.current === 'booking') {
        setActiveTab('home');
        // Push state again to maintain the history stack
        window.history.pushState({}, '', '');
      } else {
        // On Home tab, show exit alert
        callHandler('confirmOnClose');
        window.history.pushState({}, '', '');
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [setActiveTab]);

  return (
    <div className="h-[100dvh] bg-background flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto overscroll-y-contain">
        {activeTab === 'home' ? <HomeContent /> : <BookingContent />}
      </div>
      <BottomTabBar />
    </div>
  );
}
