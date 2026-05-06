export const isABAMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.navigator.userAgent.includes('ABAMobile');
};

export const shouldCheckEnvironment = (): boolean => {
  return import.meta.env.VITE_CHECK_ENVIRONMENT === 'true';
};
