'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import {
  Check, Sparkles, Zap, Globe, BarChart2, Palette,
  Layers, Lock, Shield, Loader2, ExternalLink, X,
  CreditCard, Crown, ArrowRight, Star,
} from 'lucide-react'
import { cn } from '@/lib/utils'

/* ─────────────────────────────────────────
   Data
───────────────────────────────────────── */
const PRO_FEATURES = [
  { icon: Layers,    text: 'Nieograniczone strony i bloki'                    },
  { icon: Zap,       text: 'Wszystkie 14 typów bloków (wideo, formularze…)'   },
  { icon: Globe,     text: 'Własna domena (np. linki.twojastrona.pl)'         },
  { icon: Palette,   text: 'Wszystkie 6 motywów + gradienty i tła'            },
  { icon: BarChart2, text: 'Szczegółowa analityka (kraj, urządzenie, źródło)' },
  { icon: Lock,      text: 'Harmonogram linków (widoczny od / do)'            },
  { icon: Shield,    text: 'Meta Pixel i Google Tag Manager'                  },
  { icon: Sparkles,  text: 'Usunięcie brandingu (white-label)'                },
] as const

const FREE_FEATURES = [
  '1 strona link-in-bio',
  'Do 15 bloków',
  '6 typów bloków',
  '3 motywy',
  'Podstawowe statystyki',
  'Subdomena biolink.app/@ty',
] as const

const FAQ_ITEMS = [
  {
    q: 'Czy mogę anulować w dowolnym momencie?',
    a: 'Tak. Anuluj przez portal Stripe — dostęp do Pro trwa do końca opłaconego okresu.',
  },
  {
    q: 'Co się stanie z moimi stronami po anulowaniu?',
    a: 'Wszystkie strony i bloki pozostają — wrócisz do limitów planu Free.',
  },
  {
    q: 'Czy jest próbny okres?',
    a: 'Tak — 14 dni za darmo. Karta wymagana, ale nie zostaniesz obciążony przez 14 dni.',
  },
  {
    q: 'Jakie metody płatności akceptujecie?',
    a: 'Wszystkie karty kredytowe i debetowe przez Stripe. Faktura VAT dostępna w portalu.',
  },
] as const

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */
interface UpgradeClientProps {
  currentPlan: string
  subscription: {
    status: string
    current_period_end: string | null
    plan: string
  } | null
}

/* ─────────────────────────────────────────
   Sub-components
───────────────────────────────────────── */
function AlertBanner({
  variant,
  children,
}: {
  variant: 'success' | 'warning'
  children: React.ReactNode
}) {
  const styles = {
    success: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-200',
    warning: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-200',
  }
  return (
    <div className={cn('flex items-start gap-3 p-4 rounded-xl border animate-fade-in', styles[variant])}>
      {children}
    </div>
  )
}

function FeatureItem({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
  return (
    <li className="flex items-center gap-3 text-sm group">
      <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
        <Icon className="h-3.5 w-3.5 text-primary" />
      </span>
      <span>{text}</span>
    </li>
  )
}

/* ─────────────────────────────────────────
   Main Component
───────────────────────────────────────── */
export function UpgradeClient({ currentPlan, subscription }: UpgradeClientProps) {
  const [loading, setLoading]           = useState(false)
  const [portalLoading, setPortalLoading] = useState(false)
  const searchParams = useSearchParams()

  const isSuccess  = searchParams.get('success') === 'true'
  const isCanceled = searchParams.get('canceled') === 'true'
  const isPro      = currentPlan === 'pro'

  const periodEnd = subscription?.current_period_end
    ? new Date(subscription.current_period_end).toLocaleDateString('pl-PL', {
        day: 'numeric', month: 'long', year: 'numeric',
      })
    : null

  async function handleUpgrade() {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' })
      const { url, error } = await res.json()
      if (error) throw new Error(error)
      window.location.href = url
    } catch {
      toast.error('Błąd płatności', { description: 'Spróbuj ponownie za chwilę.' })
      setLoading(false)
    }
  }

  async function handlePortal() {
    setPortalLoading(true)
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const { url, error } = await res.json()
      if (error) throw new Error(error)
      window.location.href = url
    } catch {
      toast.error('Nie można otworzyć portalu rozliczeń', {
        description: 'Spróbuj ponownie lub skontaktuj się z pomocą techniczną.',
      })
      setPortalLoading(false)
    }
  }

  return (
    <div className="max-w-4xl space-y-6">

      {/* ── Banners ── */}
      {isSuccess && (
        <AlertBanner variant="success">
          <span className="mt-0.5 w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center flex-shrink-0">
            <Check className="h-4 w-4 text-emerald-600" />
          </span>
          <div>
            <p className="font-semibold">🎉 Witaj w planie Pro!</p>
            <p className="text-sm opacity-80 mt-0.5">
              Twoje konto zostało zaktualizowane. Wszystkie funkcje Pro są już aktywne.
            </p>
          </div>
        </AlertBanner>
      )}

      {isCanceled && (
        <AlertBanner variant="warning">
          <X className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm">
            Płatność została anulowana. Twój plan pozostaje bez zmian.
          </p>
        </AlertBanner>
      )}

      {/* ── Current Plan Card ── */}
      <Card className={cn(
        'transition-colors',
        isPro && 'border-amber-300 dark:border-amber-700 bg-gradient-to-br from-amber-50/60 to-orange-50/30 dark:from-amber-950/20 dark:to-orange-950/10'
      )}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className={cn(
                'w-12 h-12 rounded-2xl flex items-center justify-center',
                isPro
                  ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-200 dark:shadow-amber-900/40'
                  : 'bg-secondary'
              )}>
                {isPro
                  ? <Crown className="h-6 w-6 text-white" />
                  : <Star className="h-6 w-6 text-muted-foreground" />
                }
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                  Twój aktualny plan
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xl font-bold">
                    {isPro ? 'Pro' : 'Free'}
                  </span>
                  <Badge className={cn(
                    'text-[10px] font-bold tracking-wider',
                    isPro
                      ? 'bg-amber-500 hover:bg-amber-500 text-white'
                      : 'bg-secondary text-secondary-foreground'
                  )}>
                    {isPro ? 'AKTYWNY' : 'DARMOWY'}
                  </Badge>
                </div>
                {isPro && periodEnd && (
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                    <CreditCard className="h-3 w-3" />
                    Następna płatność: {periodEnd}
                  </p>
                )}
              </div>
            </div>

            {isPro && (
              <Button
                variant="outline"
                onClick={handlePortal}
                disabled={portalLoading}
                className="gap-2"
              >
                {portalLoading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Ładowanie…</>
                ) : (
                  <><ExternalLink className="h-4 w-4" /> Zarządzaj subskrypcją</>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── Plans Comparison ── */}
      <div className="grid md:grid-cols-2 gap-6 items-start">

        {/* Free Plan */}
        <Card className={cn(
          'transition-all',
          !isPro && 'ring-2 ring-primary/20 border-primary/50'
        )}>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold">Free</CardTitle>
              {!isPro && (
                <Badge variant="outline" className="text-xs font-semibold">
                  Twój plan
                </Badge>
              )}
            </div>
            <div className="mt-3">
              <div className="flex items-end gap-1">
                <span className="text-4xl font-extrabold tracking-tight">0 zł</span>
                <span className="text-muted-foreground pb-1 text-sm">/zawsze</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Bez karty kredytowej</p>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2.5">
              {FREE_FEATURES.map(f => (
                <li key={f} className="flex items-center gap-2.5 text-sm">
                  <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Pro Plan */}
        <Card className={cn(
          'relative border-2 transition-all',
          isPro
            ? 'border-amber-400 dark:border-amber-600 shadow-lg shadow-amber-100 dark:shadow-amber-900/20'
            : 'border-primary shadow-2xl shadow-primary/10'
        )}>
          {/* Recommended badge */}
          {!isPro && (
            <div className="absolute -top-3.5 inset-x-0 flex justify-center">
              <Badge className="bg-primary px-4 py-1 text-xs font-bold shadow-sm">
                ⭐ Rekomendowany
              </Badge>
            </div>
          )}

          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-b from-primary/[0.03] to-transparent pointer-events-none" />

          <CardHeader className="pb-4 relative">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                Pro
                <Sparkles className="h-4 w-4 text-amber-500" />
              </CardTitle>
              {isPro && (
                <Badge className="bg-amber-500 hover:bg-amber-500 text-white text-xs font-bold">
                  Twój plan
                </Badge>
              )}
            </div>
            <div className="mt-3">
              <div className="flex items-end gap-1">
                <span className="text-4xl font-extrabold tracking-tight">29 zł</span>
                <span className="text-muted-foreground pb-1 text-sm">/miesiąc</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                14 dni za darmo · anuluj kiedy chcesz
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-5 relative">
            <ul className="space-y-3">
              {PRO_FEATURES.map(f => (
                <FeatureItem key={f.text} icon={f.icon} text={f.text} />
              ))}
            </ul>

            <Separator />

            {!isPro ? (
              <div className="space-y-3">
                <Button
                  className="w-full font-bold text-base h-11 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all gap-2"
                  size="lg"
                  onClick={handleUpgrade}
                  disabled={loading}
                >
                  {loading ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Przekierowanie do Stripe…</>
                  ) : (
                    <>Zacznij 14 dni za darmo <ArrowRight className="h-4 w-4" /></>
                  )}
                </Button>
                <p className="text-[11px] text-center text-muted-foreground flex items-center justify-center gap-1.5">
                  <Lock className="h-3 w-3" />
                  Płatności obsługuje Stripe · SSL · Anuluj w każdej chwili
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <Button
                  className="w-full gap-2"
                  variant="outline"
                  onClick={handlePortal}
                  disabled={portalLoading}
                >
                  {portalLoading ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Ładowanie…</>
                  ) : (
                    <><ExternalLink className="h-4 w-4" /> Portal rozliczeń</>
                  )}
                </Button>
                <p className="text-[11px] text-center text-muted-foreground">
                  Zarządzaj fakturami, zmień kartę lub anuluj subskrypcję
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── FAQ ── */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            Pytania o rozliczenia
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 grid sm:grid-cols-2 gap-x-8 gap-y-5">
          {FAQ_ITEMS.map(item => (
            <div key={item.q} className="space-y-1.5">
              <p className="text-sm font-semibold leading-snug">{item.q}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
