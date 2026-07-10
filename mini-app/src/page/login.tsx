import { useEffect, useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GoogleIcon } from '@/components/common/google-icon';
import useAuthStore from '@/hooks/store/use-auth-store';
import { useLoginMutation } from '@/hooks/use-login-mutation';
import { loginWithGoogle } from '@/lib/google-auth';

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser } = useAuthStore();
  const { mutate, isPending } = useLoginMutation();

  const from = (location.state as { from?: string } | null)?.from ?? '/';

  useEffect(() => {
    const error = searchParams.get('error');
    if (error) toast.error(decodeURIComponent(error));
  }, [searchParams]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    mutate(
      { email, password },
      {
        onSuccess: (response) => {
          Cookies.set('token', response.token, { expires: 30 });
          setUser(response.user);
          navigate(from, { replace: true });
        }
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6 py-10">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-foreground">Sign in</h1>
        <p className="mt-1 text-sm text-muted-foreground">Sign in to your bEasy account</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isPending}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isPending}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-background px-3 text-muted-foreground">or continue with</span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full gap-2 h-11"
          onClick={() => loginWithGoogle(from)}
          type="button"
        >
          <GoogleIcon />
          Continue with Google
        </Button>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-medium text-foreground underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
