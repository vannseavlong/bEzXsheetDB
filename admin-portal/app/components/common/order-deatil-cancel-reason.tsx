type Props = {
  reason: string;
};

export default function OrderCancelReason({ reason }: Props) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium  text-[#FF3B3B]">Reason</label>
      <div className="space-y-1  gap-8 1">
        <textarea
          readOnly
          value={reason}
          className="flex w-[400px]  h-[88px] p-3 items-start gap-2 self-stretch rounded-md border border-[#FF3B3B]  bg-red-50  text-gray-800 text-sm focus:outline-none"
        />{' '}
      </div>
    </div>
  );
}
