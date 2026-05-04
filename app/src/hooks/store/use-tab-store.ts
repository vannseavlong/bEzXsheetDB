import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

type AuthStoreState = {
  activeTab: 'home' | 'booking';
  setActiveTab: (activeTab: 'home' | 'booking') => void;
};

const useTabStore = create<AuthStoreState>()(
  immer((set) => ({
    activeTab: 'home',
    setActiveTab: (activeTab) => set({ activeTab })
  }))
);

export default useTabStore;
