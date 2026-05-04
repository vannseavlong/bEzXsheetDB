import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import CalendarOrderItem from './calendar-order-item';

interface UpcomingOrderDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  orders: OrderListAttributes[];
  isPending: boolean;
}

export default function UpcomingOrderDrawer({
  isOpen,
  onOpenChange,
  orders,
  isPending
}: UpcomingOrderDrawerProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-70 sm:w-[320px] p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Upcoming Orders</SheetTitle>
        </SheetHeader>
        <div className="overflow-auto p-4 flex flex-col gap-4 h-[calc(100vh-60px)]">
          {isPending ? (
            <div className="text-center text-muted-foreground">Loading...</div>
          ) : orders.length === 0 ? (
            <div className="text-center text-muted-foreground">No upcoming orders</div>
          ) : (
            orders.map((order, index) => <CalendarOrderItem key={index} order={order} />)
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
