import { useState } from 'react'
import { ArrowLeft, MapPin, PackageOpen, Phone, Ticket, UserCog } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { EmptyState } from '@/components/shared/EmptyState'
import { WarningDialog } from '@/components/shared/WarningDialog'
import { useOrderDetail, useUpdateOrderStatus, useAssignCleaner } from '@/api/orders'
import { useCleaners } from '@/api/cleaners'
import { usePermission } from '@/hooks/use-permission'
import { ACTIONS, MODULES } from '@/lib/permission-registry'
import { formatDateSafe } from '@/lib/utils'
import type { OrderStatus } from '@/types'

const UNASSIGNED = '__unassigned__'

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

// Label + resulting status for the single forward action available from each status.
// CANCELLED is handled separately since it always routes through a confirm dialog.
const NEXT_ACTION: Partial<Record<OrderStatus, { label: string; next: OrderStatus }>> = {
  PENDING: { label: 'Accept Order', next: 'ACCEPTED' },
  ACCEPTED: { label: 'Start Service', next: 'IN_PROGRESS' },
  IN_PROGRESS: { label: 'Mark Completed', next: 'COMPLETED' },
}

interface Props {
  bulkOrderId: string
  onBack: () => void
}

export function OrderDetail({ bulkOrderId, onBack }: Props) {
  const { data: order, isLoading, isFetching } = useOrderDetail(bulkOrderId || undefined)
  const { mutateAsync: updateStatus, isPending } = useUpdateOrderStatus()
  const { mutateAsync: assignCleaner, isPending: isAssigning } = useAssignCleaner()
  const { data: cleanersResult } = useCleaners({ status: true })
  const [cancelOpen, setCancelOpen] = useState(false)
  const { hasPermission } = usePermission()
  const canUpdate = hasPermission(MODULES.ORDER, ACTIONS.UPDATE)
  const canAssign = hasPermission(MODULES.ORDER, ACTIONS.ASSIGN)

  if (!bulkOrderId) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <EmptyState icon={PackageOpen} title="Select an order" description="Choose an order from the list to view its details." />
      </div>
    )
  }

  if (isLoading || (isFetching && !order)) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-56 w-full" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <EmptyState icon={PackageOpen} title="Order not found" description="This order may have been removed." />
      </div>
    )
  }

  const nextAction = canUpdate ? NEXT_ACTION[order.status] : undefined
  const canCancel = canUpdate && order.status !== 'COMPLETED' && order.status !== 'CANCELLED'

  const handleAdvance = async () => {
    if (!nextAction) return
    await updateStatus({ bulkOrderId: order.bulkOrderId, status: nextAction.next })
  }

  const handleCancel = async () => {
    await updateStatus({ bulkOrderId: order.bulkOrderId, status: 'CANCELLED' })
    setCancelOpen(false)
  }

  const cleaners = cleanersResult?.data ?? []
  const assignedCleaner = cleaners.find((c) => c.id === String(order.assignedCleanerId))

  const handleAssign = async (value: string) => {
    await assignCleaner({ bulkOrderId: order.bulkOrderId, cleanerId: value === UNASSIGNED ? null : value })
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex items-center justify-between gap-3 px-4 md:px-6 py-4 border-b shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <Button variant="ghost" size="icon" className="md:hidden -ml-2" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="min-w-0">
            <h2 className="text-base font-semibold truncate">Order #{order.bulkOrderId}</h2>
            <p className="text-xs text-muted-foreground">
              Placed {formatDateSafe(order.createdAt, 'MMM d, yyyy · h:mm a')}
            </p>
          </div>
          <StatusBadge status={order.status} />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {canCancel && (
            <Button variant="destructive" size="sm" disabled={isPending} onClick={() => setCancelOpen(true)}>
              Cancel
            </Button>
          )}
          {nextAction && (
            <Button size="sm" disabled={isPending} onClick={handleAdvance}>
              {isPending ? 'Updating…' : nextAction.label}
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-4 md:p-6 space-y-4">
        <Card className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <Avatar className="h-12 w-12">
                <AvatarImage src={order.profileUrl ?? undefined} alt={order.customerName} />
                <AvatarFallback>{initials(order.customerName)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="font-semibold truncate">{order.customerName}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" /> {order.customerPhone}
                </p>
              </div>
            </div>
            <StatusBadge status={order.paymentStatus} />
          </div>

          <Separator className="my-4" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground text-xs mb-1">Address</p>
              <p className="flex items-start gap-1.5">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-muted-foreground" />
                <span>
                  {order.address}
                  {(order.floorNum || order.roomNum) && (
                    <span className="block text-xs text-muted-foreground">
                      Floor: {order.floorNum || 'N/A'} · Room: {order.roomNum || 'N/A'}
                    </span>
                  )}
                </span>
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-1">Schedule</p>
              <p>{formatDateSafe(order.scheduleDate, 'EEEE, MMM d, yyyy · h:mm a')}</p>
              <p className="text-xs text-muted-foreground">{order.duration}h duration</p>
            </div>
          </div>

          {order.note && (
            <>
              <Separator className="my-4" />
              <div>
                <p className="text-muted-foreground text-xs mb-1">Remark</p>
                <p className="text-sm">{order.note}</p>
              </div>
            </>
          )}
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-1.5">
            <UserCog className="h-4 w-4" /> Assigned Cleaner
          </h3>
          {canAssign ? (
            <Select
              value={assignedCleaner?.id ?? UNASSIGNED}
              onValueChange={handleAssign}
              disabled={isAssigning}
            >
              <SelectTrigger className="w-full sm:w-64">
                <SelectValue placeholder="Unassigned" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={UNASSIGNED}>Unassigned</SelectItem>
                {cleaners.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p className="text-sm text-muted-foreground">{assignedCleaner?.name ?? 'Unassigned'}</p>
          )}
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-semibold mb-3">Services ({order.items.length})</h3>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-start justify-between gap-3 text-sm">
                <div>
                  <p className="font-medium">{item.category}</p>
                  <p className="text-muted-foreground text-xs">{item.serviceType} · Qty {item.qty}</p>
                  {item.addOns.length > 0 && (
                    <ul className="mt-1 space-y-0.5">
                      {item.addOns.map((addon) => (
                        <li key={addon.id} className="text-xs text-muted-foreground flex items-center gap-1">
                          <Ticket className="h-3 w-3" /> {addon.nameEn} × {addon.qty}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <span className="font-medium shrink-0">${item.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-semibold mb-3">Payment</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${order.amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Service Fee</span>
              <span>${order.serviceFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Transport Fee</span>
              <span>${order.transportFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">VAT</span>
              <span>${order.vatFee.toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount {order.couponCode ? `(${order.couponCode})` : ''}</span>
                <span>-${order.discount.toFixed(2)}</span>
              </div>
            )}
            <Separator className="my-2" />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>${order.totalPayableAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground pt-1">
              <span>Payment Method</span>
              <span>{order.paymentMethod}</span>
            </div>
          </div>
        </Card>
      </div>

      <WarningDialog
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        onConfirm={handleCancel}
        title="Cancel this order?"
        description="This will mark the order as cancelled for the customer. This action cannot be undone."
        confirmLabel="Cancel Order"
        loading={isPending}
      />
    </div>
  )
}
