import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { immer } from 'zustand/middleware/immer';

export type PermissionsMap = Record<string, string[]>;

type AuthStoreState = {
  user: UserResponseProps | null;
  setUser: (user: UserResponseProps | null, permissions: Permission[] | null) => void;
  permissions: PermissionsMap | null;
};

const useAuthStore = create<AuthStoreState>()(
  persist(
    immer((set) => ({
      user: null,
      setUser: (user, permissions) => {
        const permissionsObj = permissions?.reduce<PermissionsMap>((acc, { module, action }) => {
          if (!acc[module]) acc[module] = [];
          acc[module].push(action);
          return acc;
        }, {});
        set({ user, permissions: permissionsObj || null });
      },
      permissions: null
    })),
    {
      name: 'auth-store'
    }
  )
);

export default useAuthStore;
