import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

type AddressContextType = {
  selectedAddress: string | null;
  setSelectedAddress: (address: string) => void;
};

const AddressContext = createContext<AddressContextType | undefined>(undefined);

export const AddressProvider = ({ children }: { children: ReactNode }) => {
  const [selectedAddress, setSelectedAddressState] = useState<string | null>(null);

  // Load from localStorage only on client
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('selectedAddress');
      if (stored) setSelectedAddressState(stored);
    }
  }, []);

  const setSelectedAddress = (address: string) => {
    setSelectedAddressState(address);
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedAddress', address);
    }
  };

  return (
    <AddressContext.Provider value={{ selectedAddress, setSelectedAddress }}>
      {children}
    </AddressContext.Provider>
  );
};

export const useAddressContext = () => {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error('useAddressContext must be used within an AddressProvider');
  }
  return context;
};
