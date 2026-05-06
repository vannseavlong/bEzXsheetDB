import { AppSidebar } from '@/components/common/app-sidebar';
import AppHeader from '@/components/headers/app-header';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Outlet } from 'react-router';

export default function DashboardLayout() {
  return (
    <div className="h-screen flex">
      <SidebarProvider>
        <AppSidebar />
        <main className="flex flex-1 flex-col bg-background overflow-hidden">
          <div className="shrink-0">
            <AppHeader />
          </div>
          <div className="flex-1 overflow-auto">
            <Outlet />
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
}
