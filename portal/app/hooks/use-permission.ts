import useAuthStore from '@/store/auth-store';

export const usePermission = () => {
  const { permissions } = useAuthStore((state) => state);
  const hasPermission = (module: string, action: string) => {
    // console.log({ permissions });
    return permissions?.[module]?.includes(action) ?? false;
  };

  return {
    hasPermission
  };
};
