import React from 'react';
import OrderAddress from './order-address';
import OrderProfile from './order-profile';
import { phoneNumber } from '@/lib/date-helper';
import { DateTimePicker } from './date-time-picker';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertCircle } from 'lucide-react';
import { useScheduleMutation } from '@/hooks/mutations/use-schedule-mutation';

type OrderDetailCardProps = {
  data?: OrderListAttributes | null;
};

export default function OrderDetailCard({ data }: OrderDetailCardProps) {
  const { mutate } = useScheduleMutation(data?.bulkOrderId);
  const handleReschedule = (date: Date) => {
    mutate(date.toISOString());
  };

  let address = data?.address;
  let latitude;
  let longitude;

  if (data?.latitude && data.longitude) {
    latitude = data.latitude;
    longitude = data.longitude;
  } else if (data?.addressId && Array.isArray(data.userAddress)) {
    const selectedAddr = data.userAddress?.find((addr) => addr.id === data.addressId);
    if (selectedAddr) {
      address = selectedAddr.address;
      latitude = selectedAddr.latitude;
      longitude = selectedAddr.longitude;
    }
  } else {
    address = '';
    latitude = undefined;
    longitude = undefined;
    // const primaryAddr = data?.userAddress?.find((addr) => addr.isPrimary);
    // if (primaryAddr) {
    //   address = primaryAddr.address;
    //   latitude = primaryAddr.latitude;
    //   longitude = primaryAddr.longitude;
    // }
  }

  if (!data) return null;

  return (
    <div className="p-6 rounded-xl shadow-sm bg-card">
      <p className="text-xl font-bold mb-6">Detail</p>

      <div className="flex items-start justify-between mb-4">
        <OrderProfile
          fullname={data.fullname || ''}
          phone={data.phone ? phoneNumber(data.phone) : ''}
          profileUrl={data.profileUrl || ''}
          paymentStatus={data.paymentStatus}
        />
      </div>

      <div className="flex justify-between text-sm items-center">
        <div>
          <OrderAddress address={address} lat={latitude} lng={longitude} />
          <div className="font-medium mt-[2px] flex gap-2">
            <div>
              Floor: <span>{data.floorNum || 'N/A'}</span>
            </div>
            |
            <div>
              Room: <span>{data.roomNum || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4 items-end">
          <DateTimePicker
            label={
              <div className="flex items-center gap-2">
                Date
                {data.rescheduledBy && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <AlertCircle className="h-4 w-4 text-yellow-500 cursor-pointer" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Rescheduled by: {data.rescheduledBy}</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            }
            date={data.scheduleDate || ''}
            onChange={handleReschedule}
            disabled={data.status == 'COMPLETED' || data.status == 'CANCELLED'}
          />
        </div>
      </div>
    </div>
  );
}
