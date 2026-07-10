const RETURN_TO_KEY = 'beasy_google_return_to';

const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

/** Full-page redirect into the backend's Google OAuth flow; it redirects back to /auth/callback. */
export function loginWithGoogle(returnTo = '/') {
  sessionStorage.setItem(RETURN_TO_KEY, returnTo);
  window.location.href = `${VITE_BASE_URL}/auth/google`;
}

/** Reads (and clears) the destination saved before leaving for Google. */
export function consumeGoogleReturnTo(): string {
  const returnTo = sessionStorage.getItem(RETURN_TO_KEY) ?? '/';
  sessionStorage.removeItem(RETURN_TO_KEY);
  return returnTo;
}
