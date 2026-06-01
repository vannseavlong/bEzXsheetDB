import { Bell, CheckCheck, Info, AlertCircle, Package, CreditCard, Users } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    icon: Users,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-100",
    title: "New user registered",
    description: "John Doe signed up and is pending approval.",
    time: "2 min ago",
    read: false,
  },
  {
    id: 2,
    icon: CreditCard,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-100",
    title: "Payment received",
    description: "Invoice #INV-2026-0043 has been paid successfully.",
    time: "15 min ago",
    read: false,
  },
  {
    id: 3,
    icon: AlertCircle,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-100",
    title: "Withdrawal pending review",
    description: "A withdrawal request of $500 requires your attention.",
    time: "1 hour ago",
    read: false,
  },
  {
    id: 4,
    icon: Package,
    iconColor: "text-purple-500",
    iconBg: "bg-purple-100",
    title: "Product stock low",
    description: "Item \"Premium Plan\" has fewer than 10 units remaining.",
    time: "3 hours ago",
    read: true,
  },
  {
    id: 5,
    icon: Info,
    iconColor: "text-slate-500",
    iconBg: "bg-slate-100",
    title: "System maintenance",
    description: "Scheduled maintenance on June 5, 2026 from 2–4 AM UTC.",
    time: "Yesterday",
    read: true,
  },
];

export function NotificationDrawer({ open, onClose }) {
  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose?.()}>
      <SheetContent side="right" className="flex w-80 flex-col p-0">
        {/* Header */}
        <SheetHeader className="flex-row items-center justify-between border-b px-4 py-3 space-y-0">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <SheetTitle className="text-base">Notifications</SheetTitle>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="h-5 px-1.5 text-xs">
                {unreadCount}
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
            <CheckCheck className="h-3.5 w-3.5" />
            Mark all as read
          </Button>
        </SheetHeader>

        {/* Notification list */}
        <div className="flex-1 overflow-y-auto">
          {MOCK_NOTIFICATIONS.map((notification) => {
            const IconComponent = notification.icon;
            return (
              <div
                key={notification.id}
                className={`flex gap-3 border-b px-4 py-3 transition-colors hover:bg-muted/50 ${
                  !notification.read ? "bg-blue-50/40" : ""
                }`}
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${notification.iconBg}`}
                >
                  <IconComponent
                    className={`h-4 w-4 ${notification.iconColor}`}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className={`text-sm leading-tight ${
                        !notification.read ? "font-semibold" : "font-medium"
                      }`}
                    >
                      {notification.title}
                    </p>
                    {!notification.read && (
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                    {notification.description}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground/70">
                    {notification.time}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="border-t px-4 py-3">
          <Button variant="outline" className="w-full" size="sm">
            View all notifications
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
