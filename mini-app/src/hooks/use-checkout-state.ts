import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import useAuthStore from '@/hooks/store/use-auth-store';
import { useAddressContext } from '@/context/AddressContext';

interface CustomerInfo {
  customerFirstName: string;
  customerLastName: string;
  customerPhone: string;
  customerEmail: string;
}

interface ScheduleData {
  date: Date | null;
  time?: string;
}

// Simplified service type for selected services in checkout
export interface SelectedService {
  id: number;
  qty?: number;
  amount?: number;
  productId?: number;
  nameEn?: string;
  hourCount?: string | null;
  cleanerCount?: string | null;
  iconUrl?: string;
  [key: string]: unknown;
}

interface UseCheckoutStateReturn {
  customerInfo: CustomerInfo;
  setCustomerInfo: React.Dispatch<React.SetStateAction<CustomerInfo>>;
  scheduleData: ScheduleData;
  setScheduleData: React.Dispatch<React.SetStateAction<ScheduleData>>;
  selectedServices: SelectedService[];
  setSelectedServices: React.Dispatch<React.SetStateAction<SelectedService[]>>;
  note: string;
  setNote: React.Dispatch<React.SetStateAction<string>>;
  openSheet: boolean;
  setOpenSheet: React.Dispatch<React.SetStateAction<boolean>>;
  activePairId: string | null;
  setActivePairId: React.Dispatch<React.SetStateAction<string | null>>;
  editPersonalInfoOpen: boolean;
  setEditPersonalInfoOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleCustomerUpdate: (updatedData: CustomerInfo) => void;
  handleServicePreviewClick: (pairId: string) => void;
}

interface NavigationState {
  selectedServices?: SelectedService[];
  selectedAddress?: string;
  [key: string]: unknown;
}

export function useCheckoutState(): UseCheckoutStateReturn {
  const { user } = useAuthStore();
  const { setSelectedAddress } = useAddressContext();
  const location = useLocation();

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    customerFirstName: user?.firstName || '',
    customerLastName: user?.lastName || '',
    customerPhone: user?.username || '',
    customerEmail: user?.email || ''
  });

  const [scheduleData, setScheduleData] = useState<ScheduleData>({
    date: null,
    time: undefined
  });

  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);
  const [openSheet, setOpenSheet] = useState(false);
  const [activePairId, setActivePairId] = useState<string | null>(null);
  const [note, setNote] = useState<string>('');
  const [editPersonalInfoOpen, setEditPersonalInfoOpen] = useState(false);

  // Initialize customer info from user
  useEffect(() => {
    if (user) {
      setCustomerInfo({
        customerFirstName: user.firstName || '',
        customerLastName: user.lastName || '',
        customerPhone: user.username || '',
        customerEmail: user.email || ''
      });
    }
  }, [user]);

  // Restore or reset selectedServices on mount
  useEffect(() => {
    const navState = location.state as NavigationState | null;
    if (navState?.selectedServices) {
      setSelectedServices(navState.selectedServices);
      saveSelectedServices(navState.selectedServices);
    } else {
      setSelectedServices([]);
      saveSelectedServices([]);
    }

    // Restore selectedAddress from navigation state if available
    if (navState?.selectedAddress) {
      setSelectedAddress(navState.selectedAddress);
      localStorage.setItem('selectedAddress', navState.selectedAddress);
    }
  }, [location.state, setSelectedAddress]);

  const handleCustomerUpdate = (updatedData: CustomerInfo) => {
    console.log('Customer info updated:', updatedData);
    setCustomerInfo(updatedData);
  };

  const handleServicePreviewClick = (pairId: string) => {
    setActivePairId(pairId);
    setOpenSheet(true);
  };

  return {
    customerInfo,
    setCustomerInfo,
    scheduleData,
    setScheduleData,
    selectedServices,
    setSelectedServices,
    note,
    setNote,
    openSheet,
    setOpenSheet,
    activePairId,
    setActivePairId,
    editPersonalInfoOpen,
    setEditPersonalInfoOpen,
    handleCustomerUpdate,
    handleServicePreviewClick
  };
}

// Helper function to save selected services to localStorage
export function saveSelectedServices(services: SelectedService[]) {
  localStorage.setItem('selectedServices', JSON.stringify(services));
}
