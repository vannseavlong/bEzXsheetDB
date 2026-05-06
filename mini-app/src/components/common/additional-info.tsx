import { Textarea } from '@/components/ui/textarea';
import { InformationCircleIcon } from 'hugeicons-react';
import React from 'react';
import Assets from '@/assets';
import { useTranslation } from 'node_modules/react-i18next';

// ---
// ## SectionTitleProps and SectionTitle Component

// Update the interface to use 'iconSrc' which is a string
interface SectionTitleProps {
  src: string;
  title: string;
  showInfoIcon?: boolean;
  onInfoClick?: () => void;
  standalone?: boolean;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  src,
  title,
  showInfoIcon = false,
  onInfoClick,
  standalone = true
}) => {
  return (
    <div className={`flex items-center justify-between ${standalone ? 'p-4 bg-white' : ''}`}>
      <div className="flex items-center gap-3">
        {/* Use an <img> tag with the 'src' prop */}
        <img src={src} alt={`${title} icon`} className="w-6 h-6" />
        <p className="text-base font-bold text-[#1A1A1A]">{title}</p>
      </div>
      {showInfoIcon && (
        <button
          onClick={onInfoClick}
          className="rounded-full hover:bg-gray-100 transition-colors"
          type="button">
          <InformationCircleIcon className="w-6 h-6" color="#1B4CFA" strokeWidth={1.5} />
        </button>
      )}
    </div>
  );
};

// ---
// ## AdditionalInfoProps and AdditionalInfo Component

interface AdditionalInfoProps {
  defaultValue?: string;
  placeholder?: string;
}

const AdditionalInfo: React.FC<AdditionalInfoProps> = ({ defaultValue, placeholder }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-start self-stretch p-4 bg-white">
      {/* Pass the image source from your Assets file */}
      <SectionTitle
        src={Assets.taskIcon}
        title={t('additionalInfo.additionalInfo')}
        standalone={false}
      />
      <Textarea
        id="additional-info"
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="h-22 rounded-[6px] p-3 text-[14px] text-[#2C2C2C] mt-4"
      />
    </div>
  );
};

export default AdditionalInfo;
