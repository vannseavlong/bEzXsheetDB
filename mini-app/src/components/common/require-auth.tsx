import { Navigate, Outlet } from 'react-router';
import { useAppContext } from '@/context/AppContext';
import HomeSkeleton from '@/components/common/home-skeleton';

export default function RequireAuth() {
  const { isLoggedIn, isLoadingAuth } = useAppContext();

  if (isLoadingAuth) {
    return <HomeSkeleton />;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
