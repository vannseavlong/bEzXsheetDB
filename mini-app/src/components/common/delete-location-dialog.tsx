import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface DeleteLocationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteLocationDialog: React.FC<DeleteLocationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm
}) => {
  const { t } = useTranslation();
  // Lock/unlock body scroll when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      // Save current body overflow style
      const originalStyle = window.getComputedStyle(document.body).overflow;
      // Lock scroll
      document.body.style.overflow = 'hidden';

      // Cleanup function to restore scroll when dialog closes
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#00000080] bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl mx-1">
        {/* Header */}
        <div className="text-center mb-4 px-7 pt-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            {t('location.deleteLocation')}
          </h2>
          <p className="text-gray-700 text-sm text-center">{t('location.deleteLocationConfirm')}</p>
        </div>

        {/* Buttons */}
        <div className="flex border-t border-gray-300">
          <button
            onClick={onClose}
            className="flex-1 py-2 text-blue-600 font-normal hover:bg-blue-50 transition-colors">
            {t('common.cancel')}
          </button>
          <div className="w-[0.5px] bg-gray-300"></div>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 text-red-600 font-normal hover:bg-red-50 transition-colors">
            {t('common.delete')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteLocationDialog;
