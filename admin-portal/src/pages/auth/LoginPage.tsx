import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth, type AdminUser } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import beasyIcon from '@/assets/beasy-icon.png'

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}

function PhoneFrame({ src, className = '' }: { src: string; className?: string }) {
  return (
    <div className={`relative rounded-[24px] overflow-hidden border-[10px] border-slate-800 shadow-2xl ${className}`}>
      <img src={src} alt="" className="w-full h-full object-cover" draggable={false} />
    </div>
  )
}

export default function LoginPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { loginWithGoogle, handleAuthCallback } = useAuth()

  const from = (location.state as { from?: string } | null)?.from ?? '/'
  const urlError = searchParams.get('error')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleEmailLogin(e: FormEvent) {
    e.preventDefault()
    setFormError(null)
    setIsSubmitting(true)
    try {
      const base = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'
      const res = await fetch(`${base}/admin/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json() as { token?: string; user?: AdminUser; message?: string }
      if (!res.ok) throw new Error(data.message ?? 'Sign in failed')
      handleAuthCallback(data.user!, data.token!)
      navigate(from, { replace: true })
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Sign in failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  const errorMsg = formError ?? (urlError ? decodeURIComponent(urlError) : null)

  return (
    <div className="min-h-screen flex">

      {/* ── Left panel: phone mockup (desktop only) ── */}
      <div className="hidden lg:flex flex-col w-[50%] items-center justify-center bg-slate-50 overflow-hidden relative">
        {/* Decorative blurred circles */}
        <div className="absolute w-[500px] h-[500px] rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: 'var(--bEasy-linear)', top: '10%', left: '5%' }} />
        <div className="absolute w-[300px] h-[300px] rounded-full opacity-10 blur-2xl pointer-events-none"
          style={{ background: 'var(--bEasy-linear)', bottom: '10%', right: '5%' }} />

        {/* Phone frame */}
        <PhoneFrame
          src="/home-screen.png"
          className="w-[230px] h-[465px]"
        />

        <p className="relative mt-8 max-w-sm text-center text-sm text-slate-600">
          Manage bEasy&apos;s home-services platform: orders, cleaners,
          partners, customers, marketing, and finance.
        </p>
      </div>

      {/* ── Right panel: login form ── */}
      <div className="flex flex-1 items-center justify-center bg-background px-6 py-10">
        <div className="w-full max-w-sm">

          {/* Brand */}
          <div className="flex items-center gap-2 mb-3">
            <img src={beasyIcon} alt="bEasy" className="h-7 w-7 object-contain" />
            <span className="text-lg font-semibold">bEasy Admin Portal</span>
          </div>

          <p className="mb-6 text-sm text-slate-600 lg:hidden">
            The internal console bEasy staff use to manage orders, cleaners,
            partners, customers, marketing, and finance for the bEasy
            home-services platform.
          </p>

          <h1 className="text-2xl font-bold text-foreground">Sign in</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Access your bEasy admin portal
          </p>

          {errorMsg && (
            <p className="mt-4 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {errorMsg}
            </p>
          )}

          {/* Email + Password */}
          <form onSubmit={handleEmailLogin} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
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
                disabled={isSubmitting}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-background px-3 text-muted-foreground">or continue with</span>
            </div>
          </div>

          {/* Google */}
          <Button
            variant="outline"
            className="w-full gap-2 h-11"
            onClick={() => loginWithGoogle(from)}
            type="button"
          >
            <GoogleIcon />
            Continue with Google
          </Button>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            By continuing, you agree to our{' '}
            <Link to="/terms-of-use" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
              Terms of Use
            </Link>{' '}
            and{' '}
            <Link to="/privacy-policy" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
              Privacy Policy
            </Link>
            .
          </p>

          <p className="mt-2 text-center text-xs text-muted-foreground">
            Access is restricted to authorised admin accounts only.
            <br /> <br />
            Manage bEasy&apos;s home-services platform: orders, cleaners,
            partners, customers, marketing, and finance.
          </p>
        </div>
      </div>
    </div>
  )
}
