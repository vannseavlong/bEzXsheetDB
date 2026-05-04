import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

type AuthStoreState = {
  user: UserResponseProps | null;
  setUser: (user: UserResponseProps | null) => void;
};

const useAuthStore = create<AuthStoreState>()(
  immer((set) => ({
    user: null,
    setUser: (user: UserResponseProps | null) => set({ user })
  }))
);

export default useAuthStore;
