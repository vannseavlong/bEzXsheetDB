import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Calendar,
  MessageSquare,
  ShoppingCart,
  Users,
  UserCheck,
  Megaphone,
  DollarSign,
  Headphones,
  Settings,
  ChevronDown,
  ChevronRight,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navSections = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
      { label: 'Calendar', icon: Calendar, path: '/calendar' },
      { label: 'Chat', icon: MessageSquare, path: '/chat' },
    ],
  },
  {
    label: 'Operations',
    items: [
      { label: 'Order', icon: ShoppingCart, path: '/order' },
      { label: 'Cleaners', icon: Users, path: '/cleaner' },
    ],
  },
  {
    label: 'Partner Management',
    items: [
      {
        label: 'Partners',
        icon: UserCheck,
        collapsible: true,
        key: 'partners',
        children: [
          { label: 'Partners', path: '/partner' },
          { label: 'Onboarding', path: '/partner/onboarding' },
          { label: 'Tracking', path: '/partner/tracking' },
          { label: 'Payout', path: '/partner/payout' },
        ],
      },
    ],
  },
  {
    label: 'Business Growth',
    items: [
      {
        label: 'Marketing',
        icon: Megaphone,
        collapsible: true,
        key: 'marketing',
        children: [
          { label: 'Overview', path: '/overview' },
          { label: 'Coupon', path: '/coupon' },
          { label: 'Payment Link', path: '/payment-link' },
          { label: 'OTP', path: '/otp' },
          { label: 'Banner', path: '/banner' },
          { label: 'Push Notification', path: '/push-notification' },
        ],
      },
      {
        label: 'Finance',
        icon: DollarSign,
        collapsible: true,
        key: 'finance',
        children: [
          { label: 'Orders', path: '/finance-orders' },
          { label: 'Top Up', path: '/top-up' },
          { label: 'B-Combos', path: '/b-combos' },
          { label: 'Direct Sales', path: '/direct-sales' },
          { label: 'All User', path: '/all-user' },
        ],
      },
    ],
  },
  {
    label: 'Support & Config',
    items: [
      {
        label: 'Customer Service',
        icon: Headphones,
        collapsible: true,
        key: 'customer-service',
        children: [
          { label: 'Overview', path: '/customer-overview' },
          { label: 'Customer', path: '/customer' },
          { label: 'Direct Sales', path: '/direct-sale-customer' },
          { label: 'Registered Customers', path: '/registered-customer' },
          { label: 'Tickets', path: '/tickets' },
        ],
      },
    ],
  },
  {
    label: 'Setup',
    items: [
      {
        label: 'Setup',
        icon: Settings,
        collapsible: true,
        key: 'setup',
        children: [
          { label: 'Category', path: '/category' },
          { label: 'Category Addon', path: '/category-addon' },
          { label: 'Popular Service', path: '/popular-service' },
          { label: 'Product', path: '/product' },
          { label: 'Product Option', path: '/product-option' },
          { label: 'Items', path: '/item' },
          { label: 'Blocked Schedule', path: '/blocked-schedule' },
          { label: 'Activity Log', path: '/activity-log' },
        ],
      },
    ],
  },
]

function isChildActive(children, pathname) {
  return children.some((child) => {
    if (child.path === '/') return pathname === '/'
    return pathname === child.path || pathname.startsWith(child.path + '/')
  })
}

function isPathActive(path, pathname) {
  if (path === '/') return pathname === '/'
  return pathname === path || pathname.startsWith(path + '/')
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation()
  const navigate = useNavigate()
  const pathname = location.pathname

  // Determine which groups should start open based on the active route
  const getInitialOpenGroups = () => {
    const open = {}
    navSections.forEach((section) => {
      section.items.forEach((item) => {
        if (item.collapsible && item.children) {
          if (isChildActive(item.children, pathname)) {
            open[item.key] = true
          }
        }
      })
    })
    return open
  }

  const [openGroups, setOpenGroups] = useState(getInitialOpenGroups)

  // Auto-open group when navigating to a child route
  useEffect(() => {
    navSections.forEach((section) => {
      section.items.forEach((item) => {
        if (item.collapsible && item.children) {
          if (isChildActive(item.children, pathname)) {
            setOpenGroups((prev) => ({ ...prev, [item.key]: true }))
          }
        }
      })
    })
  }, [pathname])

  const toggleGroup = (key) => {
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleNavClick = (path) => {
    navigate(path)
    setSidebarOpen(false)
  }

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[hsl(var(--sidebar-background))] text-[hsl(var(--sidebar-foreground))] transition-transform duration-300 ease-in-out',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        'lg:translate-x-0'
      )}
    >
      {/* Brand / Logo */}
      <div className="flex items-center justify-between border-b border-[hsl(var(--sidebar-border))] px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[hsl(var(--primary))]">
            <span className="text-sm font-bold text-white">bE</span>
          </div>
          <span className="text-xl font-bold text-white">bEasy</span>
        </div>
        {/* Mobile close button */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-[hsl(var(--sidebar-accent))] hover:text-white lg:hidden"
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin">
        {navSections.map((section) => (
          <div key={section.label} className="mb-5">
            <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
              {section.label}
            </p>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                if (item.collapsible) {
                  const isOpen = openGroups[item.key]
                  const Icon = item.icon
                  const hasActiveChild = isChildActive(item.children, pathname)

                  return (
                    <li key={item.key}>
                      <button
                        onClick={() => toggleGroup(item.key)}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm font-medium transition-colors',
                          hasActiveChild
                            ? 'bg-[hsl(var(--sidebar-accent))] text-white'
                            : 'text-gray-300 hover:bg-[hsl(var(--sidebar-accent))]/50 hover:text-white'
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="flex-1 text-left">{item.label}</span>
                        {isOpen ? (
                          <ChevronDown className="h-4 w-4 shrink-0 transition-transform" />
                        ) : (
                          <ChevronRight className="h-4 w-4 shrink-0 transition-transform" />
                        )}
                      </button>

                      {isOpen && (
                        <ul className="mt-0.5 space-y-0.5">
                          {item.children.map((child) => {
                            const active = isPathActive(child.path, pathname)
                            return (
                              <li key={child.path}>
                                <button
                                  onClick={() => handleNavClick(child.path)}
                                  className={cn(
                                    'flex w-full items-center rounded-md py-2 pr-3 pl-8 text-sm transition-colors',
                                    active
                                      ? 'border-l-2 border-[hsl(var(--primary))] font-semibold text-white'
                                      : 'text-gray-400 hover:bg-[hsl(var(--sidebar-accent))]/50 hover:text-white'
                                  )}
                                >
                                  {child.label}
                                </button>
                              </li>
                            )
                          })}
                        </ul>
                      )}
                    </li>
                  )
                }

                // Regular (non-collapsible) item
                const Icon = item.icon
                const active = isPathActive(item.path, pathname)
                return (
                  <li key={item.path}>
                    <button
                      onClick={() => handleNavClick(item.path)}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm font-medium transition-colors',
                        active
                          ? 'bg-[hsl(var(--sidebar-accent))] text-white'
                          : 'text-gray-300 hover:bg-[hsl(var(--sidebar-accent))]/50 hover:text-white'
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  )
}
