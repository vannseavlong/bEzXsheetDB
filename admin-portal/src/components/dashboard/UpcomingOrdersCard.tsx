import { NavLink } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDateSafe } from '@/lib/utils'
import type { OrderSummary } from '@/api/orders'

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

export function UpcomingOrdersCard({ orders, isLoading }: { orders: OrderSummary[]; isLoading?: boolean }) {
  return (
    <Card className="flex flex-col h-[360px]">
      <CardHeader>
        <CardTitle>Upcoming Orders</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto space-y-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-[46px] w-full" />)
        ) : orders.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nothing scheduled ahead.</p>
        ) : (
          orders.map((order) => (
            <NavLink
              key={order.id}
              to="/order"
              className="flex items-center gap-3 h-[46px] hover:bg-muted rounded-md -mx-2 px-2"
            >
              <Avatar className="h-9 w-9 shrink-0">
                <AvatarImage src={order.profileUrl ?? undefined} alt={order.customerName} />
                <AvatarFallback>{initials(order.customerName)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{order.customerName}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {formatDateSafe(order.scheduleDate, 'MMM d, h:mm a')} · {order.serviceType}
                </p>
              </div>
              <span className="text-sm font-medium shrink-0">${order.totalPayableAmount.toFixed(2)}</span>
            </NavLink>
          ))
        )}
      </CardContent>
    </Card>
  )
}
