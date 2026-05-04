import { Navigate, Outlet, useLocation, useMatches } from 'react-router';
import { useAuth } from './hooks/use-auth';
import { usePermission } from './hooks/use-permission';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = () => {
  const { user, isLoadingAuth } = useAuth(); // Get user and loading state from useAuth hook
  const location = useLocation();
  const { hasPermission } = usePermission();

  const matches = useMatches();
  const currentRoute = matches[matches.length - 1];
  const routeHandle = currentRoute?.handle as { module?: string; action?: string } | undefined;
  // console.log('routeHandle: ', routeHandle);

  if (routeHandle && !hasPermission(routeHandle.module || '', routeHandle.action || '')) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (isLoadingAuth) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
