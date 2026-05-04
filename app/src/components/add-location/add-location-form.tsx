import React from 'react';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type AddLocationFormProps = {
  address: string;
  floor: string;
  room: string;
  note: string;
  isPending: boolean;
  isEditMode: boolean;
  onAddressFocus: () => void;
  onFloorChange: (value: string) => void;
  onRoomChange: (value: string) => void;
  onNoteChange: (value: string) => void;
  onSubmit: () => void;
};

const AddLocationForm: React.FC<AddLocationFormProps> = ({
  address,
  floor,
  room,
  note,
  isPending,
  isEditMode,
  onAddressFocus,
  onFloorChange,
  onRoomChange,
  onNoteChange,
  onSubmit
}) => {
  const { t } = useTranslation();
  return (
    <>
      <div className="p-4">
        <div className="mb-6">
          <div className="flex items-center mb-3">
            <h2 className="text-lg font-medium text-gray-900">{t('location.addressDetails')}</h2>
            <span className="text-red-500 ml-1">*</span>
          </div>

          <div className="relative">
            <input
              type="text"
              value={address}
              onClick={onAddressFocus}
              className="w-full px-4 py-3 pr-12 border border-gray-200 bg-[#eeeeee] rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={t('location.searchLocation')}
              readOnly
            />
            <button
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={onAddressFocus}
              className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Search className="w-5 h-5 text-[#102C90]" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('location.floor')}
            </label>
            <input
              type="text"
              value={floor}
              onChange={(event) => onFloorChange(event.target.value)}
              placeholder={t('location.floor')}
              className="w-full px-4 py-3 bg-[#eeeeee] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('location.room')}
            </label>
            <input
              type="text"
              value={room}
              onChange={(event) => onRoomChange(event.target.value)}
              placeholder={t('location.room')}
              className="w-full px-4 py-3 bg-[#eeeeee] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('location.note')}
          </label>
          <input
            type="text"
            value={note}
            onChange={(event) => onNoteChange(event.target.value)}
            placeholder={t('location.note')}
            className="w-full px-4 py-3 bg-[#eeeeee] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>
      </div>

      <div className="sticky bottom-0 left-0 w-full p-4">
        <button
          onClick={onSubmit}
          className="w-full bg-[#163cc5] hover:bg-blue-700 text-white font-normal py-4 rounded-lg transition-colors mt-4"
          disabled={isPending}>
          {isPending
            ? isEditMode
              ? t('addLocation.updating')
              : t('addLocation.saving')
            : isEditMode
              ? t('addLocation.updateLocation')
              : t('addLocation.saveLocation')}
        </button>
      </div>
    </>
  );
};

export default AddLocationForm;
