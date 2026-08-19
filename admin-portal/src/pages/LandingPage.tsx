import { Link } from 'react-router-dom'
import {
  ClipboardList,
  SprayCan,
  Handshake,
  Users,
  Megaphone,
  Wallet,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import beasyIcon from '@/assets/beasy-icon.png'

const FEATURES = [
  { icon: ClipboardList, title: 'Orders', desc: 'Track and manage customer bookings end to end.' },
  { icon: SprayCan, title: 'Cleaners', desc: 'Onboard, schedule, and oversee service staff.' },
  { icon: Handshake, title: 'Partners', desc: 'Manage partner accounts, tracking, and payouts.' },
  { icon: Users, title: 'Customers', desc: 'View customer accounts and support tickets.' },
  { icon: Megaphone, title: 'Marketing', desc: 'Run coupons, banners, and push campaigns.' },
  { icon: Wallet, title: 'Finance', desc: 'Reconcile top-ups, combos, and direct sales.' },
]

function PhoneFrame({ src, className = '' }: { src: string; className?: string }) {
  return (
    <div className={`relative rounded-[24px] overflow-hidden border-[10px] border-slate-800 shadow-2xl ${className}`}>
      <img src={src} alt="bEasy customer app" className="w-full h-full object-cover" draggable={false} />
    </div>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* ── Top bar ── */}
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
        <div className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
          <div className="flex items-center gap-2.5">
            <img src={beasyIcon} alt="bEasy" className="h-7 w-7 rounded-[6px] object-contain" />
            <span className="text-base font-semibold tracking-tight">bEasy Admin Portal</span>
          </div>
          <Button asChild>
            <Link to="/login">Sign in</Link>
          </Button>
        </div>
      </header>

      {/* ── Hero ── */}
      <main className="flex-1">
        <div className="relative overflow-hidden">
          {/* Decorative gradient wash */}
          <div
            className="absolute -top-32 -right-40 w-[560px] h-[560px] rounded-full opacity-[0.12] blur-3xl pointer-events-none"
            style={{ background: 'var(--bEasy-linear)' }}
          />
          <div
            className="absolute top-40 -left-32 w-[320px] h-[320px] rounded-full opacity-[0.08] blur-3xl pointer-events-none"
            style={{ background: 'var(--bEasy-linear)' }}
          />

          <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-20 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
            <div>
              <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium text-slate-600 bg-card">
                Internal tool for bEasy staff
              </span>

              <h1 className="mt-5 text-3xl sm:text-[2.75rem] font-bold tracking-tight leading-[1.1] text-foreground">
                The admin console behind{' '}
                <span className="text-beasy-gradient">bEasy&apos;s</span>{' '}
                home-services platform
              </h1>

              <p className="mt-5 text-base text-slate-600 leading-relaxed max-w-xl">
                bEasy Admin Portal is the internal management console bEasy staff
                use to run day-to-day operations for bEasy&apos;s home-services
                platform &mdash; from booking and dispatching cleaners to managing
                partners, customers, marketing campaigns, and finance.
              </p>

              <div className="mt-8 flex items-center gap-3">
                <Button asChild size="lg" className="gap-2">
                  <Link to="/login">
                    Sign in to the portal
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <p className="mt-6 text-xs text-muted-foreground max-w-sm">
                Access is restricted to authorised bEasy admin accounts.
                This portal is not a public sign-up product.
              </p>
            </div>

            <div className="hidden lg:flex justify-center">
              <PhoneFrame src="/home-screen.png" className="w-[240px] h-[485px]" />
            </div>
          </div>
        </div>

        {/* ── What it manages ── */}
        <div className="max-w-6xl mx-auto px-6 pb-24">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-6">
            What the portal manages
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="group rounded-xl border p-5 bg-card transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-white"
                  style={{ background: 'var(--bEasy-linear)' }}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold text-foreground">{title}</h3>
                <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t bg-card/40">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-xs text-muted-foreground">
          <span>&copy; {new Date().getFullYear()} bEasy, by Suntel Technology Co., Ltd.</span>
          <div className="flex items-center gap-5">
            <Link to="/privacy-policy" className="underline-offset-4 hover:text-foreground hover:underline">
              Privacy Policy
            </Link>
            <Link to="/terms-of-use" className="underline-offset-4 hover:text-foreground hover:underline">
              Terms of Use
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
