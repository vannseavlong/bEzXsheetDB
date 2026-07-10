import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { cn, formatDateSafe } from '@/lib/utils'
import type { OrderSummary } from '@/api/orders'

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

interface Props {
  order: OrderSummary
  isActive: boolean
  onClick: () => void
}

export function OrderCard({ order, isActive, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-colors',
        isActive ? 'border-primary bg-primary/5' : 'border-transparent hover:bg-muted'
      )}
    >
      <Avatar className="h-11 w-11 shrink-0">
        <AvatarImage src={order.profileUrl ?? undefined} alt={order.customerName} />
        <AvatarFallback>{initials(order.customerName)}</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold truncate">{order.customerName}</p>
          <StatusBadge status={order.status} />
        </div>
        <p className="text-xs text-muted-foreground truncate mt-0.5">
          {order.category} · {order.itemCount} service{order.itemCount === 1 ? '' : 's'}
        </p>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-muted-foreground">
            {formatDateSafe(order.scheduleDate, 'MMM d, yyyy · h:mm a')}
          </span>
          <span className="text-xs font-medium">${order.totalPayableAmount.toFixed(2)}</span>
        </div>
      </div>
    </button>
  )
}
