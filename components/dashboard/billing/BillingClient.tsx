'use client'

import { useState } from 'react'
import { toast }    from 'sonner'
import {
  Card, CardContent, CardHeader, CardTitle,
} from '@/components/ui/card'
import { Button }    from '@/components/ui/button'
import { Badge }     from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Crown, Star, CreditCard, ExternalLink, Loader2,
  CheckCircle2, XCircle, Clock, AlertTriangle,
  Receipt, ArrowRight, Sparkles, RefreshCw,
  CalendarDays, Zap, ShieldCheck,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */
interface Subscription {
  id:                     string
  user_id:                string
  stripe_customer_id:     string | null
  stripe_subscription_id: string | null
  plan:                   string
  status:                 string
  current_period_start:   string | null
  current_period_end:     string | null
}

interface BillingClientProps {
  user: {
    email: string
    id:    string
  }
  profile: {
    plan:      string
    full_name: string | null
    username:  string
  }
  subscription: Subscription | null
}

/* ─────────────────────────────────────────
   Helpers
───────────────────────────────────────── */
function formatDate(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('pl-PL', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

function getDaysLeft(iso: string | null): number | null {
  if (!iso) return null
  const diff = new Date(iso).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

type SubStatus = 'active' | 'trialing' | 'canceled' | 'past_due' | 'inactive' | 'unknown'

function normalizeStatus(sub: Subscription | null): SubStatus {
  if (!sub) return 'inactive'
  const s = sub.status?.toLowerCase()
  if (s === 'active')    return 'active'
  if (s === 'trialing')  return 'trialing'
  if (s === 'canceled')  return 'canceled'
  if (s === 'past_due')  return 'past_due'
  if (s === 'inactive')  return 'inactive'
  return 'unknown'
}

const STATUS_CONFIG: Record<SubStatus, {
  label:     string
  icon:      React.ElementType
  className: string
}> = {
  active:   { label: 'Aktywna',       icon: CheckCircle2,   className: 'text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/40' },
  trialing: { label: 'Okres próbny',  icon: Clock,          className: 'text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40' },
  canceled: { label: 'Anulowana',     icon: XCircle,        className: 'text-red-600 dark:text-red-400 border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40' },
  past_due: { label: 'Zaległa',       icon: AlertTriangle,  className: 'text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/40' },
  inactive: { label: 'Nieaktywna',    icon: XCircle,        className: 'text-muted-foreground border-border bg-muted/50' },
  unknown:  { label: 'Nieznany',      icon: AlertTriangle,  className: 'text-muted-foreground border-border bg-muted/50' },
}

/* ─────────────────────────────────────────
   Sub-components
───────────────────────────────────────── */
function SectionHeading({
  icon: Icon,
  children,
}: {
  icon: React.ElementType
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Icon className="h-4 w-4 text-primary" />
      </span>
      <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
        {children}
      </h2>
    </div>
  )
}

function InfoRow({
  label,
  children,
  className,
}: {
  label:      string
  children:   React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex items-center justify-between py-3', className)}>
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-right">{children}</span>
    </div>
  )
}

/* ─────────────────────────────────────────
   Main component
───────────────────────────────────────── */
export function BillingClient({
  user,
  profile,
  subscription,
}: BillingClientProps) {
  const [portalLoading,   setPortalLoading]   = useState(false)
  const [upgradeLoading,  setUpgradeLoading]  = useState(false)

  const isPro     = profile.plan === 'pro'
  const status    = normalizeStatus(subscription)
  const daysLeft  = getDaysLeft(subscription?.current_period_end ?? null)
  const statusCfg = STATUS_CONFIG[status]
  const StatusIcon = statusCfg.icon

  async function handlePortal() {
    setPortalLoading(true)
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const { url, error } = await res.json()
      if (error) throw new Error(error)
      window.location.href = url
    } catch {
      toast.error('Nie można otworzyć portalu', {
        description: 'Spróbuj ponownie lub skontaktuj się z pomocą.',
      })
    } finally {
      setPortalLoading(false)
    }
  }

  async function handleUpgrade() {
    setUpgradeLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' })
      const { url, error } = await res.json()
      if (error) throw new Error(error)
      window.location.href = url
    } catch {
      toast.error('Błąd płatności', {
        description: 'Spróbuj ponownie za chwilę.',
      })
    } finally {
      setUpgradeLoading(false)
    }
  }

  return (
    <div className="max-w-3xl space-y-8">

      {/* ── Page header ── */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Rozliczenia</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Zarządzaj subskrypcją, metodami płatności i fakturami.
        </p>
      </div>

      {/* ══════════════════════════════════
          PLAN OVERVIEW
      ══════════════════════════════════ */}
      <Card className={cn(
        'overflow-hidden transition-colors',
        isPro
          ? 'border-amber-300 dark:border-amber-800'
          : 'border-primary/30',
      )}>
        {/* Colored top bar */}
        <div className={cn(
          'h-1.5 w-full',
          isPro
            ? 'bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500'
            : 'bg-gradient-to-r from-primary/40 to-primary/20',
        )} />

        <CardContent className="pt-6 pb-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">

            {/* Plan info */}
            <div className="flex items-center gap-4">
              <div className={cn(
                'w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0',
                isPro
                  ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-200 dark:shadow-amber-900/40'
                  : 'bg-secondary',
              )}>
                {isPro
                  ? <Crown className="h-7 w-7 text-white"           />
                  : <Star  className="h-7 w-7 text-muted-foreground" />
                }
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-2xl font-extrabold tracking-tight">
                    {isPro ? 'Plan Pro' : 'Plan Free'}
                  </span>
                  <Badge className={cn(
                    'font-bold text-[10px] tracking-widest',
                    isPro
                      ? 'bg-amber-500 hover:bg-amber-500 text-white'
                      : 'bg-secondary text-secondary-foreground',
                  )}>
                    {isPro ? 'PRO' : 'FREE'}
                  </Badge>
                  {status !== 'inactive' && status !== 'unknown' && (
                    <Badge
                      variant="outline"
                      className={cn('text-[10px] font-semibold gap-1', statusCfg.className)}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {statusCfg.label}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {isPro
                    ? 'Masz dostęp do wszystkich funkcji Pro.'
                    : 'Uaktualnij, aby odblokować pełen potencjał.'}
                </p>
              </div>
            </div>

            {/* Action button */}
            {isPro ? (
              <Button
                variant="outline"
                onClick={handlePortal}
                disabled={portalLoading}
                className="gap-2 flex-shrink-0"
              >
                {portalLoading
                  ? <><Loader2 className="h-4 w-4 animate-spin" /> Ładowanie…</>
                  : <><ExternalLink className="h-4 w-4" /> Portal Stripe</>
                }
              </Button>
            ) : (
              <Button
                onClick={handleUpgrade}
                disabled={upgradeLoading}
                className="gap-2 flex-shrink-0 shadow-md shadow-primary/20"
              >
                {upgradeLoading
                  ? <><Loader2 className="h-4 w-4 animate-spin" /> Ładowanie…</>
                  : <><Sparkles className="h-4 w-4" /> Przejdź na Pro</>
                }
              </Button>
            )}
          </div>

          {/* Days left warning */}
          {status === 'trialing' && daysLeft !== null && (
            <div className="mt-4 flex items-center gap-2 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900">
              <Clock className="h-4 w-4 text-blue-600 flex-shrink-0" />
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Okres próbny — zostało <strong>{daysLeft} dni</strong>.
                Po jego zakończeniu zostaniesz obciążony automatycznie.
              </p>
            </div>
          )}

          {status === 'past_due' && (
            <div className="mt-4 flex items-center gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
              <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-700 dark:text-amber-300">
                  Zaległa płatność
                </p>
                <p className="text-xs text-amber-600/80 dark:text-amber-400/80 mt-0.5">
                  Zaktualizuj metodę płatności, aby zachować dostęp do Pro.
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={handlePortal}
                className="border-amber-300 text-amber-700 hover:bg-amber-50 gap-1.5 text-xs"
              >
                <CreditCard className="h-3.5 w-3.5" />
                Zaktualizuj kartę
              </Button>
            </div>
          )}

          {status === 'canceled' && subscription?.current_period_end && (
            <div className="mt-4 flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900">
              <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700 dark:text-red-300">
                Subskrypcja anulowana. Dostęp do Pro trwa do{' '}
                <strong>{formatDate(subscription.current_period_end)}</strong>.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ══════════════════════════════════
          SUBSCRIPTION DETAILS
      ══════════════════════════════════ */}
      {subscription && isPro && (
        <section>
          <SectionHeading icon={CalendarDays}>Szczegóły subskrypcji</SectionHeading>
          <Card>
            <CardContent className="pt-2 pb-0 divide-y divide-border">
              <InfoRow label="Plan">
                <span className="flex items-center gap-1.5">
                  <Crown className="h-3.5 w-3.5 text-amber-500" />
                  Pro — 29 zł / miesiąc
                </span>
              </InfoRow>
              <InfoRow label="Status">
                <Badge
                  variant="outline"
                  className={cn('text-[10px] font-semibold gap-1', statusCfg.className)}
                >
                  <StatusIcon className="h-3 w-3" />
                  {statusCfg.label}
                </Badge>
              </InfoRow>
              <InfoRow label="Okres rozliczeniowy">
                <span>
                  {formatDate(subscription.current_period_start)} –{' '}
                  {formatDate(subscription.current_period_end)}
                </span>
              </InfoRow>
              {daysLeft !== null && status === 'active' && (
                <InfoRow label="Do następnej płatności">
                  <span className={cn(
                    daysLeft <= 5 ? 'text-amber-600 dark:text-amber-400 font-semibold' : '',
                  )}>
                    {daysLeft === 0 ? 'Dziś' : `${daysLeft} dni`}
                  </span>
                </InfoRow>
              )}
              <InfoRow label="Email do faktur">
                {user.email}
              </InfoRow>
              {subscription.stripe_subscription_id && (
                <InfoRow label="ID subskrypcji" className="pb-4">
                  <span className="font-mono text-[11px] text-muted-foreground truncate max-w-[180px]">
                    {subscription.stripe_subscription_id}
                  </span>
                </InfoRow>
              )}
            </CardContent>
          </Card>
        </section>
      )}

      {/* ══════════════════════════════════
          PAYMENT METHOD + INVOICES
      ══════════════════════════════════ */}
      {isPro && (
        <section>
          <SectionHeading icon={CreditCard}>Płatności i faktury</SectionHeading>
          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-sm text-muted-foreground">
                Faktury, historia płatności i zmiana metody płatności dostępne są w portalu Stripe.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  onClick={handlePortal}
                  disabled={portalLoading}
                  className="gap-2"
                >
                  {portalLoading
                    ? <><Loader2 className="h-4 w-4 animate-spin" /> Ładowanie…</>
                    : <><Receipt className="h-4 w-4" /> Historia faktur</>
                  }
                </Button>
                <Button
                  variant="outline"
                  onClick={handlePortal}
                  disabled={portalLoading}
                  className="gap-2"
                >
                  {portalLoading
                    ? <><Loader2 className="h-4 w-4 animate-spin" /> Ładowanie…</>
                    : <><CreditCard className="h-4 w-4" /> Zmień kartę płatniczą</>
                  }
                </Button>
                <Button
                  variant="outline"
                  onClick={handlePortal}
                  disabled={portalLoading}
                  className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
                >
                  {portalLoading
                    ? <><Loader2 className="h-4 w-4 animate-spin" /> Ładowanie…</>
                    : <><XCircle className="h-4 w-4" /> Anuluj subskrypcję</>
                  }
                </Button>
              </div>
              <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                <ShieldCheck className="h-3 w-3" />
                Płatności obsługuje Stripe. BioLink nie przechowuje danych kart.
              </p>
            </CardContent>
          </Card>
        </section>
      )}

      {/* ══════════════════════════════════
          FREE → PRO UPSELL
      ══════════════════════════════════ */}
      {!isPro && (
        <section>
          <SectionHeading icon={Zap}>Odblokuj Pro</SectionHeading>
          <Card className="border-primary/20 bg-gradient-to-br from-primary/[0.02] to-transparent">
            <CardContent className="pt-6 space-y-5">
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { icon: Zap,       text: 'Wszystkie 14 typów bloków'             },
                  { icon: Crown,     text: 'Nieograniczone strony'                  },
                  { icon: RefreshCw, text: 'Harmonogram widoczności linków'         },
                  { icon: ShieldCheck, text: 'White-label — bez brandingu BioLink' },
                ].map(item => (
                  <div key={item.text} className="flex items-center gap-2.5 text-sm">
                    <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-3.5 w-3.5 text-primary" />
                    </span>
                    {item.text}
                  </div>
                ))}
              </div>

              <Separator />

              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-2xl font-extrabold tracking-tight">
                    29 zł
                    <span className="text-base font-normal text-muted-foreground"> / miesiąc</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    14 dni za darmo · anuluj kiedy chcesz
                  </p>
                </div>
                <Button
                  size="lg"
                  onClick={handleUpgrade}
                  disabled={upgradeLoading}
                  className="gap-2 font-bold shadow-md shadow-primary/20 hover:shadow-lg transition-all"
                >
                  {upgradeLoading
                    ? <><Loader2 className="h-4 w-4 animate-spin" /> Ładowanie…</>
                    : <>Zacznij 14 dni za darmo <ArrowRight className="h-4 w-4" /></>
                  }
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* ══════════════════════════════════
          ACCOUNT INFO
      ══════════════════════════════════ */}
      <section>
        <SectionHeading icon={ShieldCheck}>Konto</SectionHeading>
        <Card>
          <CardContent className="pt-2 pb-0 divide-y divide-border">
            <InfoRow label="Email">
              {user.email}
            </InfoRow>
            <InfoRow label="Nazwa użytkownika">
              @{profile.username}
            </InfoRow>
            <InfoRow label="Plan" className="pb-4">
              <span className="flex items-center gap-1.5">
                {isPro
                  ? <><Crown className="h-3.5 w-3.5 text-amber-500" /> Pro</>
                  : <><Star  className="h-3.5 w-3.5 text-muted-foreground" /> Free</>
                }
              </span>
            </InfoRow>
          </CardContent>
        </Card>
        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
          Potrzebujesz pomocy?{' '}
          <Link
            href="/dashboard/help"
            className="text-primary hover:underline font-medium inline-flex items-center gap-0.5"
          >
            Centrum pomocy <ArrowRight className="h-3 w-3" />
          </Link>
        </p>
      </section>

    </div>
  )
}
