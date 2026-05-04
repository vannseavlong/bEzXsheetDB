import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';

import { useAuth } from '@/hooks/use-auth';
import { UnsupportedBrowser } from '@/components/common/unsupported-browser';
import { isABAMobile, shouldCheckEnvironment } from '@/lib/env';

const AppContext = createContext(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const { authError } = useAuth();
  const isUnsupportedUA = !isABAMobile();

  if (shouldCheckEnvironment() && isUnsupportedUA) {
    return <UnsupportedBrowser />;
  }

  // useEffect(() => {
  //   // Register the handler when component mounts
  //   const handlerName = 'getCurrentLocation';

  //   const handler3 = (data: object) => {
  //     const coord = data as { latitude: string; longitude: string };
  //     alert(JSON.stringify(coord));
  //   };

  //   // Register listener
  //   registerHandler(handlerName, handler);
  // }, []);

  if (authError)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500 text-center">
          Failed to authenticate {JSON.stringify(authError)}
        </p>
      </div>
    );

  return <AppContext.Provider value={undefined}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
