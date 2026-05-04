import { Button } from '../ui/button';
import OrderAddCleaner from './order-add-cleaner';
import PaymentInfo from './order-payment';

export default function OrderEditAssignCleaner() {
  return (
    <div className="max-w-md mx-auto bg-white rounded-lg p-6 shadow-sm ">
      <div className="flex items-center justify-between mb-6 p-6 border-b">
        <h4 className="text-lg font-bold text-gray-900">Assign Cleaner</h4>
        <Button variant="link">Save</Button>
      </div>
      <OrderAddCleaner serviceNumber={1} />

      <PaymentInfo />
    </div>
  );
}
