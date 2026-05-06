type Props = {
  scheduleDate: string;
  onReschedule: (date: Date) => void;
};

const OrderDate = ({ scheduleDate }: Props) => {
  return (
    <div className="space-y-1  gap-8  ">
      <div className="flex justify-between items-center">
        <p className="text-[#707070] font-medium text-sm font-inter">Date</p>
      </div>
      <p className="text-black font-medium text-sm font-inter">{scheduleDate}</p>
    </div>
  );
};
export default OrderDate;
