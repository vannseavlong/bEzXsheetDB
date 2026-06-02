import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { MenuIcon, ChevronLeft, LogOut, User, Settings } from 'lucide-react'
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

const PAGE_TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/calendar': 'Calendar',
  '/chat': 'Chat',
  '/order': 'Order',
  '/cleaner': 'Cleaners',
  '/partner': 'Partners',
  '/partner/onboarding': 'Onboarding',
  '/partner/tracking': 'Map Tracking',
  '/partner/payout': 'Partner Payout',
  '/overview': 'Overview',
  '/coupon': 'Coupon',
  '/payment-link': 'Payment Link',
  '/otp': 'OTP',
  '/banner': 'Banner',
  '/push-notification': 'Push Notification',
  '/finance-orders': 'Finance Orders',
  '/top-up': 'Top Up',
  '/b-combos': 'B-Combos',
  '/direct-sales': 'Direct Sales',
  '/all-user': 'All User',
  '/coupons': 'Coupons',
  '/customer-overview': 'Customer Overview',
  '/customer': 'Customer',
  '/direct-sale-customer': 'Direct Sale Customers',
  '/registered-customer': 'Registered Customers',
  '/tickets': 'Tickets',
  '/category': 'Category',
  '/category-addon': 'Category Addon',
  '/popular-service': 'Popular Service',
  '/product': 'Product',
  '/product-option': 'Product Option',
  '/item': 'Items',
  '/blocked-schedule': 'Blocked Schedule',
  '/activity-log': 'Activity Log',
}

function getPageTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname]
  for (const key of Object.keys(PAGE_TITLES)) {
    if (pathname.startsWith(key + '/') && key !== '/') return PAGE_TITLES[key]
  }
  return pathname.replace(/^\//, '').replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || 'Dashboard'
}

function LogoutDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const handleLogout = () => {
    onClose()
  }
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm flex flex-col p-0" aria-describedby={undefined}>
        <DialogHeader className="border-b px-4 py-1">
          <DialogTitle className="sr-only">Logout</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ChevronLeft className="size-5" />
          </Button>
        </DialogHeader>
        <div className="flex flex-col items-center text-center py-6 px-8">
          <LogOut className="text-red-500 size-10 mb-4" />
          <p className="font-medium mb-2">Are you sure you want to logout?</p>
          <p className="text-sm text-muted-foreground">You'll need to sign in again to access your account.</p>
        </div>
        <div className="p-4 flex gap-3">
          <Button className="flex-1" variant="outline" onClick={onClose}>Cancel</Button>
          <Button className="flex-1 bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700" variant="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function Topbar() {
  const location = useLocation()
  const { toggleSidebar } = useSidebar()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [logoutOpen, setLogoutOpen] = useState(false)

  const title = getPageTitle(location.pathname)

  return (
    <>
      <header className="h-[88px] px-6 pl-4 flex w-full items-center flex-row bg-background">
        {/* Left: mobile sidebar toggle */}
        <div className="flex flex-row items-center gap-4 md:hidden">
          <button
            onClick={toggleSidebar}
            className="flex h-9 w-9 items-center justify-center rounded-md text-foreground transition-colors hover:bg-accent"
            aria-label="Toggle sidebar"
          >
            <MenuIcon className="size-5" />
          </button>
        </div>

        {/* Page title */}
        <div className="flex flex-1 items-center">
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold">{title}</p>
        </div>

        {/* Right: user avatar */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen((v) => !v)}
            className="flex items-center gap-3 rounded-md px-2 py-1.5 transition-colors hover:bg-accent"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-primary text-xs font-bold text-primary-foreground">
              TE
            </div>
            <div className="hidden flex-col items-start sm:flex">
              <span className="text-sm font-semibold leading-none">Testing</span>
              <span className="mt-1 text-xs leading-none text-muted-foreground">ADMIN</span>
            </div>
          </button>

          {userMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
              <div className="absolute right-0 top-14 z-50 w-48 rounded-lg border bg-popover shadow-lg">
                <div className="border-b px-4 py-3">
                  <p className="text-sm font-semibold">Testing</p>
                  <p className="text-xs text-muted-foreground">ADMIN</p>
                </div>
                <ul className="py-1">
                  <li>
                    <button
                      onClick={() => setUserMenuOpen(false)}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm transition-colors hover:bg-accent"
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setUserMenuOpen(false)}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm transition-colors hover:bg-accent"
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </button>
                  </li>
                  <li><div className="my-1 border-t" /></li>
                  <li>
                    <button
                      onClick={() => { setUserMenuOpen(false); setLogoutOpen(true) }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>
      </header>

      <LogoutDialog open={logoutOpen} onClose={() => setLogoutOpen(false)} />
    </>
  )
}
