import { useState, useEffect } from 'react';
import CustomerDetail from './customer-detail';
import useAuthStore from '@/hooks/store/use-auth-store';
import EditPersonal from './edit-personalInfo-sheet';
import Icon from '@/assets/icons/icon-asset';
import { useTranslation } from 'react-i18next';
import { useUpdateProfileMutation } from '@/hooks/use-update-profile-mutation';

type customerData = {
  customerFirstName: string;
  customerLastName: string;
  customerPhone: string;
  customerEmail: string;
};

const PersonalInfo = ({
  onCustomerUpdate,
  openEditSheet,
  onEditSheetClose
}: {
  onCustomerUpdate?: (data: customerData) => void;
  openEditSheet?: boolean;
  onEditSheetClose?: () => void;
}) => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { mutateAsync: updateProfile } = useUpdateProfileMutation();

  const [customerData, setCustomerData] = useState({
    customerFirstName: user?.firstName || '',
    customerLastName: user?.lastName || '',
    customerPhone: user?.phone || '',
    customerEmail: user?.email || ''
  });

  const [isEditSheetOpen, setIsEditSheetOpen] = useState(openEditSheet ?? false);

  useEffect(() => {
    if (openEditSheet !== undefined) {
      setIsEditSheetOpen(openEditSheet);
    }
  }, [openEditSheet]);

  useEffect(() => {
    const initialData = {
      customerFirstName: user?.firstName || '',
      customerLastName: user?.lastName || '',
      customerPhone: user?.phone || '',
      customerEmail: user?.email || ''
    };
    setCustomerData(initialData);
    onCustomerUpdate?.(initialData);
  }, [user?.firstName, user?.lastName, user?.phone, user?.email]);

  const handleUpdateCustomer = async (updatedData: {
    customerFirstName: string;
    customerLastName: string;
    customerPhone: string;
    customerEmail: string;
  }) => {
    await updateProfile({
      firstName: updatedData.customerFirstName,
      lastName: updatedData.customerLastName,
      phone: updatedData.customerPhone,
      email: updatedData.customerEmail
    });
    setCustomerData(updatedData);
    onCustomerUpdate?.(updatedData);
  };

  if (!user) {
    return <div>{t('common.loading')}</div>;
  }

  return (
    <div>
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-3">
          <Icon name="UserIcon" />
          <h1 className="font-bold text-base text-[#3D3D3D]">
            {t('personalInfo.personalInformation')}
          </h1>
        </div>
        <div>
          <EditPersonal
            initialData={customerData}
            onSave={handleUpdateCustomer}
            isOpen={isEditSheetOpen}
            onOpenChange={(open) => {
              setIsEditSheetOpen(open);
              if (!open && onEditSheetClose) {
                onEditSheetClose();
              }
            }}
          />
        </div>
      </div>

      <CustomerDetail customer={customerData} />
    </div>
  );
};
export default PersonalInfo;
