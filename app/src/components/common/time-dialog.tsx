import { useState, useEffect } from 'react';
import { WheelPicker, WheelPickerWrapper } from '../wheel-picker';
import { useTranslation } from 'react-i18next';

interface TimeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTime: string;
  onConfirm: (time: string) => void;
}

export default function TimeDialog({ isOpen, onClose, onConfirm, selectedTime }: TimeDialogProps) {
  const { t } = useTranslation();
  const timeSlots = [
    { value: '9:00 AM', label: '9:00 AM' },
    { value: '10:00 AM', label: '10:00 AM' },
    { value: '11:00 AM', label: '11:00 AM' },
    { value: '12:00 PM', label: '12:00 PM' },
    { value: '1:00 PM', label: '1:00 PM' },
    { value: '2:00 PM', label: '2:00 PM' },
    { value: '3:00 PM', label: '3:00 PM' },
    { value: '4:00 PM', label: '4:00 PM' },
    { value: '5:00 PM', label: '5:00 PM' },
    { value: '6:00 PM', label: '6:00 PM' }
  ];

  const [currentTime, setCurrentTime] = useState(selectedTime);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showContent, setShowContent] = useState(false);

  // Sync currentTime with selectedTime when dialog opens
  useEffect(() => {
    if (isOpen) {
      setCurrentTime(selectedTime);
      setShowContent(true);
      setTimeout(() => setIsAnimating(true), 10); // Start animation after mount
      document.body.style.overflow = 'hidden';
    } else {
      setIsAnimating(false);
      setTimeout(() => setShowContent(false), 300); // Wait for animation to finish before unmount
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, selectedTime]);

  const handleTimeChange = (time: string) => {
    setCurrentTime(time);
    // Do not call onSelectTime here; only update local state
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only close if clicking on the backdrop, not the dialog content
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 300); // Match transition duration
  };

  const handleDone = () => {
    onConfirm(currentTime);
    handleClose();
  };

  if (!showContent) return null;

  return (
    <div
      className={`fixed inset-0 flex items-end justify-center z-[9999] transition-all duration-300 ease-out ${
        isAnimating ? 'bg-black/50 opacity-100' : 'bg-black/0 opacity-0'
      }`}
      onClick={handleBackdropClick}>
      <div
        className={`bg-white rounded-t-3xl w-full max-w-md transition-all duration-300 ease-out ${
          isAnimating ? 'translate-y-0' : 'translate-y-full'
        }`}>
        <div className="px-6 pb-6 pt-4">
          {/* Header */}
          <div className="flex items-center justify-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">{t('timeDialog.selectStartTime')}</h2>
          </div>

          {/* Wheel Time Picker */}
          <div className="flex justify-center ">
            <WheelPickerWrapper className="w-64 h-58">
              <WheelPicker
                options={timeSlots}
                value={currentTime}
                onValueChange={handleTimeChange}
              />
            </WheelPickerWrapper>
          </div>

          {/* Done Button */}
          <div className="flex justify-center">
            <button
              onClick={handleDone}
              className="bg-primary-gradient text-white px-8 py-3 rounded-full text-lg font-medium hover:opacity-90 transition-opacity w-full max-w-xs">
              {t('common.done')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
