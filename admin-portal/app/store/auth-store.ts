// Stub auth store — no authentication required in admin-portal.
import { create } from 'zustand';

export type PermissionsMap = Record<string, string[]>;

type AuthStoreState = {
  user: UserResponseProps | null;
  permissions: PermissionsMap | null;
  setUser: (user: UserResponseProps | null, permissions: Permission[] | null) => void;
};

const useAuthStore = create<AuthStoreState>()(() => ({
  user: {
    userId: 'mock-user',
    email: 'admin@beasy.com',
    firstName: 'Admin',
    lastName: 'User',
    username: 'admin',
    balance: 0,
    profileUrl: null,
    role: null
  } as unknown as UserResponseProps,
  permissions: null,
  setUser: () => {}
}));

export default useAuthStore;
