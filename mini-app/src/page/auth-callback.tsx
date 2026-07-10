import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import Cookies from 'js-cookie';
import useAuthStore from '@/hooks/store/use-auth-store';
import { consumeGoogleReturnTo } from '@/lib/google-auth';

function decodeJwtPayload(token: string): Record<string, unknown> {
  const [, payload] = token.split('.');
  // JWT uses base64url — replace chars before atob
  const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(atob(base64));
}

/**
 * Landing page after the backend's Google auth handler redirects here with:
 *   ?token=<jwt>      — success: JWT payload contains the UserResponseProps fields
 *   ?error=<message>  — failure: shown on the login page
 *
 * If the JWT payload has no 'role' it means the account wasn't provisioned
 * (email_verified was false), so treat it the same as a failed login.
 */
export default function AuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    const error = params.get('error');
    const token = params.get('token');

    if (error || !token) {
      const msg = error ?? 'Authentication failed. Please try again.';
      navigate(`/login?error=${encodeURIComponent(msg)}`, { replace: true });
      return;
    }

    try {
      const payload = decodeJwtPayload(token) as UserResponseProps & { role?: string };

      if (!payload.role) {
        navigate(`/login?error=${encodeURIComponent('Account not authorised. Please try again.')}`, {
          replace: true
        });
        return;
      }

      Cookies.set('token', token, { expires: 30 });
      setUser(payload);
      navigate(consumeGoogleReturnTo(), { replace: true });
    } catch {
      navigate('/login?error=Invalid+session+data', { replace: true });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}
