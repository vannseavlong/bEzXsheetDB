import { Outlet, useLocation } from 'react-router-dom'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from './app-sidebar'
import Topbar from './Topbar'

// Multi-segment routes that are NOT form/detail pages (they're list/overview pages)
const LIST_MULTI_SEGMENT = [
  '/partner/onboarding',
  '/partner/tracking',
  '/partner/payout',
]

function isFormOrDetailPage(pathname: string): boolean {
  if (LIST_MULTI_SEGMENT.includes(pathname)) return false
  return pathname.split('/').filter(Boolean).length > 1
}

export default function Layout() {
  const { pathname } = useLocation()
  const isForm = isFormOrDetailPage(pathname)

  return (
    <div className="h-screen flex">
      <SidebarProvider>
        <AppSidebar />
        <main className="flex flex-1 flex-col bg-background overflow-hidden">
          {!isForm && (
            <div className="shrink-0">
              <Topbar />
            </div>
          )}
          <div className="flex-1 min-h-0 overflow-hidden">
            <Outlet />
          </div>
        </main>
      </SidebarProvider>
    </div>
  )
}
