import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, Bell, User, Settings, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'

const mockNotifications = [
  {
    id: 1,
    title: 'New order received',
    description: 'Order #1042 has been placed by a customer.',
    time: '2 min ago',
    unread: true,
  },
  {
    id: 2,
    title: 'Cleaner assigned',
    description: 'John Doe has been assigned to booking #887.',
    time: '15 min ago',
    unread: true,
  },
  {
    id: 3,
    title: 'Payment confirmed',
    description: 'Payment of $120.00 received for order #1040.',
    time: '1 hr ago',
    unread: true,
  },
]

export default function Topbar({ onMenuClick }) {
  const navigate = useNavigate()
  const [notifOpen, setNotifOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const notifRef = useRef(null)
  const userMenuRef = useRef(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-white px-4 shadow-sm">
      {/* Left: hamburger (mobile only) */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="flex h-9 w-9 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Right: notifications + user */}
      <div className="flex items-center gap-2">
        {/* Notification bell */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => {
              setNotifOpen((v) => !v)
              setUserMenuOpen(false)
            }}
            className="relative flex h-9 w-9 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              3
            </span>
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-11 z-50 w-80 rounded-lg border bg-white shadow-lg">
              <div className="flex items-center justify-between border-b px-4 py-3">
                <span className="text-sm font-semibold text-gray-900">Notifications</span>
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                  {mockNotifications.length} new
                </span>
              </div>
              <ul className="divide-y">
                {mockNotifications.map((notif) => (
                  <li
                    key={notif.id}
                    className={cn(
                      'cursor-pointer px-4 py-3 transition-colors hover:bg-gray-50',
                      notif.unread && 'bg-blue-50/40'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100">
                        <Bell className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900">
                          {notif.title}
                        </p>
                        <p className="mt-0.5 text-xs text-gray-500">{notif.description}</p>
                        <p className="mt-1 text-xs text-gray-400">{notif.time}</p>
                      </div>
                      {notif.unread && (
                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              <div className="border-t px-4 py-2">
                <button className="w-full text-center text-xs font-medium text-blue-600 hover:text-blue-800">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User avatar + dropdown */}
        <div ref={userMenuRef} className="relative">
          <button
            onClick={() => {
              setUserMenuOpen((v) => !v)
              setNotifOpen(false)
            }}
            className="flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-gray-100"
            aria-label="User menu"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
              TE
            </div>
            <div className="hidden flex-col items-start sm:flex">
              <span className="text-sm font-medium leading-none text-gray-900">Testing</span>
              <span className="mt-0.5 text-xs leading-none text-gray-400">ADMIN</span>
            </div>
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 top-12 z-50 w-48 rounded-lg border bg-white shadow-lg">
              <div className="border-b px-4 py-3">
                <p className="text-sm font-semibold text-gray-900">Testing</p>
                <p className="text-xs text-gray-500">ADMIN</p>
              </div>
              <ul className="py-1">
                <li>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false)
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false)
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </button>
                </li>
                <li>
                  <div className="my-1 border-t" />
                </li>
                <li>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false)
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
