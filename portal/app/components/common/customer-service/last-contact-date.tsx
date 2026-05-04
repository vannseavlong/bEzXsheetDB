import { useUpdateLastContactMutation } from '@/hooks/mutations/use-update-last-contact-mutation';
import DatePicker from '../date-picker';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/date-helper';
import { Calendar04Icon } from 'hugeicons-react';

export default function LastContactDate({
  lastContactDate,
  id,
  remark
}: {
  lastContactDate?: string;
  id: string;
  remark?: string;
}) {
  const { mutate, isPending } = useUpdateLastContactMutation();
  const handleDateChange = (date: Date | undefined) => {
    if (!date) return;
    mutate({
      userId: id,
      lastContactDate: date.toISOString(),
      remark: remark
    });
  };
  return (
    <DatePicker
      date={lastContactDate ? new Date(lastContactDate) : undefined}
      onDateTimeChange={handleDateChange}
    >
      <Button
        isLoading={isPending}
        variant="outline"
        className="gap-2 bg-transparent justify-between h-10 w-[160px]"
      >
        <div>{lastContactDate ? formatDate(lastContactDate) : '-'}</div>
        <Calendar04Icon className="size-5" />
      </Button>
    </DatePicker>
  );
}
