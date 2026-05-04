import { Button } from '../ui/button';
import OrderCleaner from './order-cleaner';
import OrderAddCleaner from './order-add-cleaner';
import PaymentInfo from './order-payment';
import { useState } from 'react';

type OrderAssignCleanerProps = {
  data?: OrderListAttributes | null;
};
export default function OrderAssignCleaner({ data }: OrderAssignCleanerProps) {
  if (!data) return null;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [isEditing, setIsEditing] = useState(false);

  // const handleEditClick = () => {
  //   setIsEditing(true);
  // };

  // const handleSaveClick = () => {
  //   setIsEditing(false);
  // };

  return (
    <div className="max-w-md mx-auto bg-card rounded-lg p-6 shadow-sm w-[340px] mt-4">
      <div className="flex items-center justify-between mb-6 p-6 border-b">
        <h4 className="text-lg font-bold text-gray-900">Assign Cleaner</h4>
        {isEditing ? (
          <Button variant="link" onClick={() => setIsEditing(false)}>
            Save
          </Button>
        ) : (
          <Button variant="link" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
        )}
      </div>

      {isEditing ? <OrderAddCleaner serviceNumber={1} /> : <OrderCleaner />}

      <PaymentInfo
        amount={data.amount}
        serviceFee={data.serviceFee}
        transportFee={data.transportFee}
        discount={data.discount}
        subTotal={data.subTotal}
        vatFee={data.vatFee}
        paymentMethod={data.paymentMethod}
        totalPayableAmount={data.totalPayableAmount}
        buttonText={'Pick Up'}
      />
    </div>
  );
}
