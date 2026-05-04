import { useState } from 'react';

export const usePopupDialog = () => {
  const [popupId, setPopupId] = useState<string | null>(null);

  const openDialog = (id: string) => {
    setPopupId(id);
  };

  const closeDialog = () => {
    setPopupId(null);
  };

  const handleConfirm = () => {
    closeDialog();
  };

  return {
    popupId,
    openDialog,
    closeDialog,
    handleConfirm,
    isOpen: !!popupId
  };
};
