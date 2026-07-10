import { useEffect } from 'react';
import * as pkg from 'web-bridge-gateway';

const { callHandler } = pkg;

/**
 * Hook to set the navigation bar title dynamically
 * This communicates with the partner's native app via web-bridge-gateway
 *
 * @param title - The title to display in the navigation bar
 */
export const useNavigationTitle = (title: string) => {
  useEffect(() => {
    callHandler('setBarTitle', { title })
      .then(() => {
        // Title updated successfully
      })
      .catch((error) => {
        console.warn('Failed to set navigation title:', error);
      });
  }, [title]);
};

export default useNavigationTitle;
