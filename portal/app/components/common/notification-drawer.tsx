import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer';
import { ArrowRight, Bell } from 'lucide-react';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import IconAssets from '@/asset/icons/icon-assets';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

const notifications = [
  {
    id: 1,
    title: 'New Request!',
    description: 'A new leave request has been submitted for your review.',
    isRead: false,
    timestamp: '2 minutes ago'
  },
  {
    id: 2,
    title: 'New Request!',
    description: 'A new leave request has been submitted for your review.',
    isRead: false,
    timestamp: '5 minutes ago'
  },
  {
    id: 3,
    title: 'New Request!',
    description: 'A new leave request has been submitted for your review.',
    isRead: false,
    timestamp: '10 minutes ago'
  },
  {
    id: 4,
    title: 'New Request!',
    description: 'A new leave request has been submitted for your review.',
    isRead: false,
    timestamp: '15 minutes ago'
  }
];

export function RightSideDrawer() {
  const { t } = useTranslation();
  const [notificationList, setNotificationList] = useState(notifications);

  const markAllAsRead = () => {
    setNotificationList((prev) => prev.map((notification) => ({ ...notification, isRead: true })));
  };

  const unreadNotifications = notificationList.filter((n) => !n.isRead);
  const readNotifications = notificationList.filter((n) => n.isRead);

  return (
    <Drawer direction="right">
      {/* Add direction="right" here */}
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="!size-6" />
          <div className="rounded-full bg-red-600 text-white text-xs font-semibold w-4 h-4 absolute top-1 right-1">
            2
          </div>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-full w-full sm:w-[400px] mt-0 rounded-none fixed inset-y-0 right-0">
        <DrawerHeader className="flex flex-row items-center justify-between pb-4">
          <DrawerTitle className="text-lg font-semibold">
            {t('appSidebar.notifications')}
          </DrawerTitle>
          <Button
            variant="destructive"
            size="sm"
            onClick={markAllAsRead}
            disabled={unreadNotifications.length === 0}
          >
            {t('appSidebar.markAllAsRead')}
          </Button>
        </DrawerHeader>

        <div className="">
          <Tabs defaultValue="all">
            <TabsList className="ml-4">
              <TabsTrigger value="all" className="text-sm">
                {t('appSidebar.all')}
              </TabsTrigger>
              <TabsTrigger value="read" className="text-sm">
                {t('appSidebar.read')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              {notificationList.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {t('appSidebar.noNotifications')}
                </div>
              ) : (
                notificationList.map((notification) => (
                  <NotificationItem key={notification.id} notification={notification} />
                ))
              )}
            </TabsContent>

            <TabsContent value="read" className="mt-0">
              {readNotifications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {t('appSidebar.noReadNotifications')}
                </div>
              ) : (
                readNotifications.map((notification) => (
                  <NotificationItem key={notification.id} notification={notification} />
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function NotificationItem({ notification }: { notification: (typeof notifications)[0] }) {
  return (
    <div
      className={clsx('flex gap-4 p-4', {
        'bg-muted': !notification.isRead
      })}
    >
      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
        <IconAssets.Message />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-base font-medium text-red-600 mb-1">{notification.title}</h4>
        <p className="text-sm text-gray-600 leading-relaxed">{notification.description}</p>
      </div>

      <div className="flex items-end">
        <ArrowRight className="w-4 h-4 text-red-400" />
      </div>
    </div>
  );
}
