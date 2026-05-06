/* eslint-disable react/prop-types */
import Icon from '@/assets/icons/icon-asset';
import { useState, useMemo, useEffect } from 'react';
import { useEditScheduleMutation } from '@/hooks/use-edit-schedule-mutation';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from '@/components/ui/sheet';
import TimeDialog from './time-dialog';
import useScheduleQuery from '@/hooks/use-schedule-query';
import { useTranslation } from 'node_modules/react-i18next';
import { DateSelector, useDateSelector } from './date-selector';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';

interface ScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: { date: Date | null; time: string }) => void;
  serviceId?: number;
  initialDate?: string;
}

const ScheduleDialog: React.FC<ScheduleDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  serviceId,
  initialDate
}) => {
  const { t } = useTranslation();
  const { data: schedule } = useScheduleQuery({ serviceId });
  useDateSelector();

  useEffect(() => {
    if (open && initialDate) {
      const parts = initialDate.split(' ');
      if (parts.length >= 2) {
        const datePart = parts[0];
        const timePart = parts.slice(1).join(' ');

        const [day, month, year] = datePart.split('-').map(Number);
        if (day && month && year) {
          const parsedDate = new Date(year, month - 1, day);
          if (!isNaN(parsedDate.getTime())) {
            setSelectedDate(parsedDate);
            setConfirmedDate(parsedDate);
            setSelectedTime(timePart);
            setIsTimeSelected(true);
          }
        }
      }
    }
  }, [open, initialDate]);

  const availabilityMap = useMemo(() => {
    const map: Record<string, boolean> = {};
    if (Array.isArray(schedule)) {
      schedule.forEach((item) => {
        map[item.date] = item.available;
      });
    }
    return map;
  }, [schedule]);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [confirmedDate, setConfirmedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('9:00 AM');
  const [showTimeDialog, setShowTimeDialog] = useState(false);
  const [isTimeSelected, setIsTimeSelected] = useState(false);

  const editScheduleMutation = useEditScheduleMutation();

  const isClosedDate = (date: Date) => {
    const key = date.toISOString().split('T')[0];
    return availabilityMap[key] === false;
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setShowTimeDialog(true);
  };

  const handleConfirmTime = (confirmedTime: string) => {
    if (selectedDate) {
      setIsTimeSelected(true);
      setConfirmedDate(selectedDate);
      setSelectedTime(confirmedTime);
    }
    setShowTimeDialog(false);
  };

  const handleCloseTimeDialog = () => {
    setShowTimeDialog(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="max-h-[80%] h-auto rounded-t-3xl flex flex-col bg-white">
        <div className="px-4 overflow-y-auto flex-1">
          <SheetHeader>
            <SheetTitle className="text-center text-lg font-bold mt-4">
              {t('schedule.reschedule')}
            </SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>

          <DateSelector
            confirmedDate={confirmedDate}
            isTimeSelected={isTimeSelected}
            onDateSelect={handleDateSelect}
            isClosedDate={isClosedDate}
          />

          <Button
            type="button"
            variant="outline"
            onClick={() => setShowTimeDialog(true)}
            className="w-full border border-[#DBDBDB] rounded-[6px] p-3 mt-3 bg-transparent cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <Icon name="time" />
                <span className="text-gray-800 font-sm font-semibold">
                  {t('schedule.chooseYourTime')}
                </span>
              </div>
              <span className="text-base font-semibold text-[#1A1A1A]">
                {selectedDate ? selectedTime : '00:00 AM'}
              </span>
            </div>
          </Button>

          <TimeDialog
            isOpen={showTimeDialog}
            onClose={handleCloseTimeDialog}
            onConfirm={handleConfirmTime}
            selectedTime={selectedTime}
          />

          <div className="-mx-4">
            <div className="flex gap-6 mt-[60px] justify-center py-[24px] shadow-[0_2px_12px_0_rgba(0,0,0,0.10)] bg-white px-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSelectedDate(null);
                  setConfirmedDate(null);
                  setIsTimeSelected(false);
                  setSelectedTime('9:00 AM');
                  onOpenChange(false);
                }}
                className="flex-1 py-3 px-6 rounded-full border-2 border-gray-200 bg-white text-[#1A1A1A] font-bold text-base hover:bg-gray-50 transition-colors">
                {t('common.cancel')}
              </Button>
              <Button
                type="button"
                disabled={!confirmedDate || !isTimeSelected || editScheduleMutation.isPending}
                onClick={async () => {
                  if (confirmedDate && isTimeSelected) {
                    let bulkOrderId = '';
                    if (serviceId !== undefined && serviceId !== null) {
                      bulkOrderId = String(serviceId).padStart(10, '0');
                    }
                    if (!bulkOrderId) {
                      console.warn('Cannot update schedule: bulkOrderId (serviceId) is missing.');
                      onOpenChange(false);
                      return;
                    }
                    try {
                      const payload = {
                        bulkOrderId,
                        scheduleStartDate: `${confirmedDate.toISOString().split('T')[0]} ${selectedTime}`,
                        isEditMode: true
                      };
                      console.log('Calling editScheduleMutation with:', payload);
                      await editScheduleMutation.mutateAsync(payload);
                    } catch (error) {
                      console.error('Edit schedule error:', error);
                      if (isAxiosError(error)) {
                        const errorMessage = error.response?.data?.message;
                        if (
                          errorMessage ===
                          'Rescheduling is only allowed at least 1 day before the scheduled date.'
                        ) {
                          toast.error(t(`order.rescheduleLimitError`));
                        } else {
                          toast.error(errorMessage || t('errors.somethingWentWrong'));
                        }
                      } else {
                        toast.error(t('errors.somethingWentWrong'));
                      }
                    }
                    onSubmit?.({ date: confirmedDate, time: selectedTime });
                    onOpenChange(false);
                  }
                }}
                className="flex-1 py-3 px-6 rounded-full bg-primary-gradient text-white font-bold text-base transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed">
                {editScheduleMutation.isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    {t('common.loading')}
                  </span>
                ) : (
                  t('common.confirm')
                )}
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ScheduleDialog;
