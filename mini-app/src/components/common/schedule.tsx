import Icon from '@/assets/icons/icon-asset';
import { useState, useMemo, useRef } from 'react';
import TimeDialog from './time-dialog';
import { useEffect } from 'react';
import useOrderState from '@/hooks/store/use-order-state';
import { useTranslation } from 'node_modules/react-i18next';
import useScheduleQuery from '@/hooks/use-schedule-query';
import { DateSelector, useDateSelector } from './date-selector';
import { Button } from '@/components/ui/button';
import { formatDateWithLocalizedMonth } from '@/lib/date-display';

export function saveDateTime(date: Date, time: string) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateString = `${year}-${month}-${day}`;
  sessionStorage.setItem('selectedDate', dateString);
  sessionStorage.setItem('selectedTime', time);
}

export function loadDateTime() {
  const dateStr = sessionStorage.getItem('selectedDate');
  const time = sessionStorage.getItem('selectedTime');
  const hasSavedTime = time !== null;
  return {
    date: dateStr ? new Date(dateStr + 'T00:00:00') : null,
    time: time || '9:00 AM',
    hasSavedTime
  };
}

export function resetDateTime() {
  sessionStorage.removeItem('selectedDate');
  sessionStorage.removeItem('selectedTime');
}

export function resetBooking() {
  localStorage.removeItem('selectedProductId');
  localStorage.removeItem('selectedServiceId');
  localStorage.removeItem('productQuantity');
  localStorage.removeItem('selectedAddonItems');
  localStorage.removeItem('selectedServices');
  const orderState = useOrderState.getState();
  orderState.resetAll();
}

interface DateTimePickerProps {
  serviceId?: number;
  onSubmit?: (data: { date: Date; time: string }) => void;
}

export default function DateTimePicker({ serviceId, onSubmit }: DateTimePickerProps) {
  const { t } = useTranslation();
  const { data: schedule } = useScheduleQuery({ serviceId });
  useDateSelector();

  const availabilityMap = useMemo(() => {
    const map: Record<string, boolean> = {};
    (Array.isArray(schedule) ? schedule : []).forEach((item) => {
      map[item.date] = item.available;
    });
    return map;
  }, [schedule]);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [confirmedDate, setConfirmedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('9:00 AM');
  const [showTimeDialog, setShowTimeDialog] = useState(false);
  const [isTimeSelected, setIsTimeSelected] = useState(false);

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
      saveDateTime(selectedDate, confirmedTime);
      onSubmit?.({ date: selectedDate, time: confirmedTime });
    }
    setShowTimeDialog(false);
  };

  const hasRestoredRef = useRef(false);

  useEffect(() => {
    if (hasRestoredRef.current) return;
    hasRestoredRef.current = true;

    const { date, time, hasSavedTime } = loadDateTime();

    if (date) {
      setSelectedDate(date);
      setConfirmedDate(date);
      setIsTimeSelected(true);
    }
    if (time) {
      setSelectedTime(time);
    }

    if (date && hasSavedTime && onSubmit) {
      onSubmit({ date, time });
    }
  }, [onSubmit]);

  return (
    <div className="font-sans p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon name="calender" />
          <h1 className="text-base font-bold text-[#1A1A1A]">{t('schedule.selectDateTime')}</h1>
        </div>
        <span className="text-[#1d1d1d] text-sm font-semibold">
          {confirmedDate
            ? formatDateWithLocalizedMonth(confirmedDate, t)
            : formatDateWithLocalizedMonth(new Date(), t)}
        </span>
      </div>

      <DateSelector
        confirmedDate={confirmedDate}
        isTimeSelected={isTimeSelected}
        onDateSelect={handleDateSelect}
        isClosedDate={isClosedDate}
      />

      <Button
        type="button"
        variant="outline"
        disabled={!selectedDate}
        onClick={() => setShowTimeDialog(true)}
        className="w-full border border-[#DBDBDB] rounded-[6px] p-3 mt-3 transition-colors hover:bg-gray-50 cursor-pointer">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Icon name="time" />
            <span className="text-gray-800 text-sm font-semibold">
              {t('schedule.chooseYourTime')}
            </span>
          </div>
          <span className="text-base font-semibold text-[#1A1A1A]">
            {confirmedDate ? selectedTime : '00:00 AM'}
          </span>
        </div>
      </Button>

      <TimeDialog
        isOpen={showTimeDialog}
        onClose={() => setShowTimeDialog(false)}
        onConfirm={handleConfirmTime}
        selectedTime={selectedTime}
      />
    </div>
  );
}
