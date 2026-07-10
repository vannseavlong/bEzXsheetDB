import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import Cookies from 'js-cookie';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GoogleIcon } from '@/components/common/google-icon';
import useAuthStore from '@/hooks/store/use-auth-store';
import { useRegisterMutation } from '@/hooks/use-register-mutation';
import { loginWithGoogle } from '@/lib/google-auth';

export default function Register() {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const { mutate, isPending } = useRegisterMutation();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    mutate(
      { firstName, lastName, phone, email, password },
      {
        onSuccess: (response) => {
          Cookies.set('token', response.token, { expires: 30 });
          setUser(response.user);
          navigate('/', { replace: true });
        }
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6 py-10">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-foreground">Create account</h1>
        <p className="mt-1 text-sm text-muted-foreground">Sign up for a bEasy account</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                autoComplete="given-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                disabled={isPending}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lastName">Last name</Label>
              <Input
                id="lastName"
                autoComplete="family-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                disabled={isPending}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              autoComplete="tel"
              placeholder="012345678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              disabled={isPending}
            />
          </div>
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
              autoComplete="new-password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isPending}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Creating account…' : 'Create account'}
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
          onClick={() => loginWithGoogle('/')}
          type="button"
        >
          <GoogleIcon />
          Continue with Google
        </Button>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-foreground underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
