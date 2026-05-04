// import { Badge } from "lucide-react";
import { Badge } from '@/components/ui/badge'; // Update this import path to your actual Badge component location

type QtyProps = {
  quantity: number;
};

const Qty = ({ quantity }: QtyProps) => {
  return (
    <Badge
      variant="outline"
      className="flex h-6 w-6 items-center justify-center rounded-full border border-blue-600 bg-white p-0 text-sm font-semibold text-gray-900">
      {quantity}
    </Badge>
  );
};

export default Qty;
