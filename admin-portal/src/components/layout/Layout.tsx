import { Outlet } from 'react-router-dom'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from './app-sidebar'
import Topbar from './Topbar'

export default function Layout() {
  return (
    <div className="h-screen flex">
      <SidebarProvider>
        <AppSidebar />
        <main className="flex flex-1 flex-col bg-background overflow-hidden">
          <div className="shrink-0">
            <Topbar />
          </div>
          <div className="flex-1 overflow-auto p-6">
            <Outlet />
          </div>
        </main>
      </SidebarProvider>
    </div>
  )
}
