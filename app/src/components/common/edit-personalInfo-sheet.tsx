import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '../ui/button';
import { useTranslation } from 'react-i18next';
import { validatePhoneNumber, validateName, validateEmail } from '@/lib/utils/validation';

type EditPersonalProps = {
  initialData?: {
    customerFirstName: string;
    customerLastName: string;
    customerPhone: string;
    customerEmail: string;
    note?: string;
  };
  onSave?: (data: {
    customerFirstName: string;
    customerLastName: string;
    customerPhone: string;
    customerEmail: string;
    note?: string;
  }) => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function EditPersonal({
  initialData,
  onSave,
  isOpen: externalOpen,
  onOpenChange: externalOnOpenChange
}: EditPersonalProps) {
  const { t } = useTranslation();
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = externalOpen !== undefined;
  const isOpen = isControlled ? externalOpen : internalOpen;
  const setIsOpen = (open: boolean) => {
    if (isControlled) {
      externalOnOpenChange?.(open);
    } else {
      setInternalOpen(open);
    }
  };
  const [formData, setFormData] = useState({
    customerFirstName: initialData?.customerFirstName || '',
    customerLastName: initialData?.customerLastName || '',
    customerPhone: initialData?.customerPhone || '',
    customerEmail: initialData?.customerEmail || ''
  });

  const [errors, setErrors] = useState<{
    customerFirstName?: string;
    customerPhone?: string;
    customerEmail?: string;
  }>({});

  const getInitialFormData = () => ({
    customerFirstName: initialData?.customerFirstName || '',
    customerLastName: initialData?.customerLastName || '',
    customerPhone: initialData?.customerPhone || '',
    customerEmail: initialData?.customerEmail || ''
  });

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setFormData(getInitialFormData());
      setErrors({});
    }
  };

  const updateField = (field: string, newValue: string) => {
    setFormData({
      ...formData,
      [field]: newValue
    });
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    const firstNameResult = validateName(formData.customerFirstName);
    if (!firstNameResult.isValid) {
      newErrors.customerFirstName = t(`personalInfo.${firstNameResult.error}`);
    }
    const phoneResult = validatePhoneNumber(formData.customerPhone);
    if (!phoneResult.isValid) {
      newErrors.customerPhone = t(`personalInfo.${phoneResult.error}`);
    }
    const emailResult = validateEmail(formData.customerEmail);
    if (!emailResult.isValid) {
      newErrors.customerEmail = t(`personalInfo.${emailResult.error}`);
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      if (onSave) {
        onSave(formData);
      }
      setIsOpen(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="p-0 text-primary-gradient font-medium">
          {t('personalInfo.edit')}
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="rounded-t-[32px] flex flex-col data-[state=open]:duration-300 data-[state=closed]:duration-300"
        style={{ maxHeight: '80dvh' }}
        onOpenAutoFocus={(e) => e.preventDefault()}>
        <div className="sticky top-0 bg-white z-20 rounded-t-[32px]">
          <SheetHeader>
            <SheetTitle className="text-center text-lg font-bold py-4">
              {t('personalInfo.personalInformation')}
            </SheetTitle>
          </SheetHeader>
        </div>
        <div className="flex flex-col p-6 gap-6 overflow-y-auto">
          <div className="flex flex-row gap-4">
            <div className="flex-1">
              <label className="font-sm mb-2 block text-[#707070]">
                {t('personalInfo.firstName')}
              </label>
              <input
                type="text"
                className={`w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-[#1B4CFA] ${
                  errors.customerFirstName ? 'border-red-500' : ''
                }`}
                value={formData.customerFirstName}
                onChange={(e) => {
                  updateField('customerFirstName', e.target.value);
                  if (errors.customerFirstName) {
                    setErrors((prev) => ({ ...prev, customerFirstName: undefined }));
                  }
                }}
              />
              {errors.customerFirstName && (
                <p className="text-red-500 text-xs mt-1">{errors.customerFirstName}</p>
              )}
            </div>
            <div className="flex-1">
              <label className="font-sm mb-2 block text-[#707070]">
                {t('personalInfo.lastName')}
              </label>
              <input
                type="text"
                className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-[#1B4CFA]"
                value={formData.customerLastName}
                onChange={(e) => updateField('customerLastName', e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="font-sm mb-2 text-[#707070]">{t('personalInfo.phone')}</label>
            <input
              type="tel"
              className={`w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-[#1B4CFA] ${
                errors.customerPhone ? 'border-red-500' : ''
              }`}
              value={formData.customerPhone}
              onChange={(e) => {
                updateField('customerPhone', e.target.value);
                if (errors.customerPhone) {
                  setErrors((prev) => ({ ...prev, customerPhone: undefined }));
                }
              }}
            />
            {errors.customerPhone && (
              <p className="text-red-500 text-xs mt-1">{errors.customerPhone}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="font-sm mb-2 text-[#707070]">{t('personalInfo.email')}</label>
            <input
              type="email"
              className={`w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-[#1B4CFA] ${
                errors.customerEmail ? 'border-red-500' : ''
              }`}
              value={formData.customerEmail}
              onChange={(e) => {
                updateField('customerEmail', e.target.value);
                if (errors.customerEmail) {
                  setErrors((prev) => ({ ...prev, customerEmail: undefined }));
                }
              }}
            />
            {errors.customerEmail && (
              <p className="text-red-500 text-xs mt-1">{errors.customerEmail}</p>
            )}
          </div>
        </div>

        <div className="flex justify-center p-6 border-t">
          <Button
            onClick={handleSubmit}
            className="w-full rounded-2xl bg-gradient-to-r from-[#102C90] to-[#1B4CFA]">
            {t('personalInfo.confirm')}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default EditPersonal;
