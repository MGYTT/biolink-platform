'use client'

import Link        from 'next/link'
import { useState } from 'react'
import { Button }  from '@/components/ui/button'
import { Badge }   from '@/components/ui/badge'
import { Switch }  from '@/components/ui/switch'
import { Label }   from '@/components/ui/label'
import {
  Check, X, Sparkles, ArrowRight,
  Crown, Star, Zap, Shield,
} from 'lucide-react'
import { cn } from '@/lib/utils'

/* ─────────────────────────────────────────
   Data
───────────────────────────────────────── */
interface PlanFeature {
  label:    string
  included: boolean
  highlight?: boolean   // pogrubiony tekst — kluczowa cecha
  proNote?:  string     // dodatkowy opis przy Pro
}

interface Plan {
  id:          'free' | 'pro'
  name:        string
  icon:        React.ElementType
  description: string
  monthlyPrice: number
  yearlyPrice:  number
  badge:        string | null
  cta:          string
  ctaNote:      string | null
  href:         (billing: 'monthly' | 'yearly') => string
  features:     PlanFeature[]
  highlighted:  boolean
}

const PLANS: Plan[] = [
  {
    id:           'free',
    name:         'Free',
    icon:         Star,
    description:  'Idealny start dla każdego twórcy',
    monthlyPrice: 0,
    yearlyPrice:  0,
    badge:        null,
    cta:          'Zacznij za darmo',
    ctaNote:      null,
    href:         () => '/register',
    highlighted:  false,
    features: [
      { label: '1 strona link-in-bio',            included: true,  highlight: true  },
      { label: 'Do 15 bloków',                     included: true                    },
      { label: '6 typów bloków (link, obraz…)',    included: true                    },
      { label: '3 motywy kolorystyczne',           included: true                    },
      { label: 'Podstawowe statystyki',            included: true                    },
      { label: 'biolink.app/@twojanazwa',          included: true                    },
      { label: 'Własna domena',                    included: false                   },
      { label: 'Bloki Pro (wideo, form., mapa…)',  included: false                   },
      { label: 'Szczegółowa analityka',            included: false                   },
      { label: 'Harmonogram linków',               included: false                   },
      { label: 'Piksele Meta & Google',            included: false                   },
      { label: 'White-label (bez brandingu)',      included: false                   },
    ],
  },
  {
    id:           'pro',
    name:         'Pro',
    icon:         Crown,
    description:  'Dla profesjonalistów i rozwijających się marek',
    monthlyPrice: 29,
    yearlyPrice:  19,
    badge:        'Najpopularniejszy',
    cta:          'Zacznij 14 dni za darmo',
    ctaNote:      'Bez karty kredytowej',
    href:         (billing) => `/register?plan=pro&billing=${billing}`,
    highlighted:  true,
    features: [
      { label: 'Nieograniczone strony',            included: true,  highlight: true                            },
      { label: 'Nieograniczone bloki',             included: true,  highlight: true                            },
      { label: 'Wszystkie 14 typów bloków',        included: true,  proNote: 'wideo, formularze, mapa, PDF…'   },
      { label: 'Wszystkie motywy + gradienty',     included: true                                              },
      { label: 'Szczegółowa analityka',            included: true,  proNote: 'kraj, urządzenie, źródło ruchu'  },
      { label: 'biolink.app/@twojanazwa',          included: true                                              },
      { label: 'Własna domena + SSL auto',         included: true,  highlight: true                            },
      { label: 'Harmonogram linków',               included: true,  proNote: 'pokaż/ukryj blok w danym czasie' },
      { label: 'Piksele Meta & Google',            included: true                                              },
      { label: 'White-label (bez brandingu)',      included: true,  highlight: true                            },
      { label: 'Custom CSS & HTML',                included: true                                              },
      { label: 'QR kod do pobrania',               included: true                                             },
    ],
  },
]

const COMPARISON_FEATURES = [
  { label: 'Liczba stron',         free: '1',            pro: 'Nieograniczone' },
  { label: 'Liczba bloków',        free: 'do 15',        pro: 'Nieograniczone' },
  { label: 'Typy bloków',          free: '6',            pro: '14'             },
  { label: 'Analityka',            free: 'Podstawowa',   pro: 'Szczegółowa'    },
  { label: 'Własna domena',        free: false,          pro: true             },
  { label: 'Harmonogram linków',   free: false,          pro: true             },
  { label: 'Piksele reklamowe',    free: false,          pro: true             },
  { label: 'White-label',          free: false,          pro: true             },
] as const

/* ─────────────────────────────────────────
   Price display
───────────────────────────────────────── */
function PriceDisplay({
  plan,
  billing,
}: {
  plan:    Plan
  billing: 'monthly' | 'yearly'
}) {
  const price   = billing === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice
  const isFree  = price === 0
  const isYearly = billing === 'yearly' && !isFree

  return (
    <div className="flex items-end gap-2">
      <div className="flex items-start gap-1">
        {!isFree && (
          <span className="text-xl font-bold text-muted-foreground mt-2">zł</span>
        )}
        <span className="text-6xl font-extrabold tracking-tight leading-none">
          {isFree ? '0' : price}
        </span>
      </div>
      <div className="pb-1 flex flex-col">
        <span className="text-sm text-muted-foreground">
          {isFree ? '/ zawsze' : '/ miesiąc'}
        </span>
        {isYearly && (
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            płatne rocznie
          </span>
        )}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   Plan card
───────────────────────────────────────── */
function PlanCard({
  plan,
  billing,
}: {
  plan:    Plan
  billing: 'monthly' | 'yearly'
}) {
  const Icon    = plan.icon
  const isPro   = plan.highlighted
  const href    = plan.href(billing)
  const savings = billing === 'yearly' && isPro
    ? Math.round((1 - plan.yearlyPrice / plan.monthlyPrice) * 100)
    : 0

  return (
    <div className={cn(
      'relative flex flex-col rounded-2xl border transition-all duration-300',
      isPro
        ? 'border-primary/50 shadow-2xl shadow-primary/10'
        : 'border-border bg-card hover:border-primary/20 hover:shadow-md',
    )}>

      {/* Top gradient bar */}
      {isPro && (
        <div className="h-1 w-full rounded-t-2xl bg-gradient-to-r from-primary via-violet-500 to-purple-500" />
      )}

      {/* Popular badge */}
      {plan.badge && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
          <Badge className="gap-1.5 px-4 py-1 bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/25 text-xs">
            <Sparkles className="h-3 w-3" />
            {plan.badge}
          </Badge>
        </div>
      )}

      {/* Card body */}
      <div className={cn(
        'flex flex-col flex-1 p-7 gap-6',
        isPro && 'bg-gradient-to-b from-primary/[0.03] to-transparent',
      )}>

        {/* Plan header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
              isPro
                ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-md shadow-amber-200 dark:shadow-amber-900/40'
                : 'bg-muted',
            )}>
              <Icon className={cn('h-5 w-5', isPro ? 'text-white' : 'text-muted-foreground')} />
            </div>
            <div>
              <h3 className="font-extrabold text-xl tracking-tight">{plan.name}</h3>
              <p className="text-xs text-muted-foreground">{plan.description}</p>
            </div>
          </div>
          {savings > 0 && (
            <Badge className="bg-emerald-500 hover:bg-emerald-500 text-white text-[10px] font-bold flex-shrink-0">
              -{savings}%
            </Badge>
          )}
        </div>

        {/* Price */}
        <PriceDisplay plan={plan} billing={billing} />

        {/* CTA */}
        <div className="flex flex-col gap-2">
          <Button
            size="lg"
            variant={isPro ? 'default' : 'outline'}
            asChild
            className={cn(
              'w-full font-bold gap-2 transition-all',
              isPro && 'shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:scale-[1.01]',
            )}
          >
            <Link href={href}>
              {isPro && <Sparkles className="h-4 w-4" />}
              {plan.cta}
              <ArrowRight className="h-4 w-4 ml-auto" />
            </Link>
          </Button>
          {plan.ctaNote && (
            <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5">
              <Shield className="h-3 w-3 text-emerald-500" />
              {plan.ctaNote}
            </p>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-border" />

        {/* Features list */}
        <ul className="space-y-2.5 flex-1">
          {plan.features.map(f => (
            <li key={f.label} className="flex items-start gap-2.5">
              {f.included ? (
                <span className={cn(
                  'w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
                  isPro
                    ? 'bg-primary/15'
                    : 'bg-emerald-100 dark:bg-emerald-950/50',
                )}>
                  <Check className={cn(
                    'h-2.5 w-2.5',
                    isPro ? 'text-primary' : 'text-emerald-600 dark:text-emerald-400',
                  )} />
                </span>
              ) : (
                <span className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <X className="h-3 w-3 text-muted-foreground/30" />
                </span>
              )}
              <div className="min-w-0">
                <span className={cn(
                  'text-sm',
                  !f.included && 'text-muted-foreground/40',
                  f.highlight && f.included && 'font-semibold text-foreground',
                )}>
                  {f.label}
                </span>
                {f.proNote && f.included && (
                  <p className="text-[10px] text-muted-foreground/70 mt-0.5">
                    {f.proNote}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   Comparison table
───────────────────────────────────────── */
function ComparisonTable() {
  return (
    <div className="mt-16 rounded-2xl border overflow-hidden">
      <div className="bg-muted/50 px-6 py-4 border-b">
        <h3 className="font-bold text-sm">Szczegółowe porównanie planów</h3>
      </div>
      <div className="divide-y">
        {COMPARISON_FEATURES.map(row => (
          <div
            key={row.label}
            className="grid grid-cols-3 items-center px-6 py-3.5 hover:bg-muted/20 transition-colors"
          >
            <span className="text-sm text-muted-foreground">{row.label}</span>

            {/* Free */}
            <div className="flex justify-center">
              {typeof row.free === 'boolean' ? (
                row.free
                  ? <Check className="h-4 w-4 text-emerald-500" />
                  : <X     className="h-4 w-4 text-muted-foreground/30" />
              ) : (
                <span className="text-sm font-medium">{row.free}</span>
              )}
            </div>

            {/* Pro */}
            <div className="flex justify-center">
              {typeof row.pro === 'boolean' ? (
                row.pro
                  ? <Check className="h-4 w-4 text-primary" />
                  : <X     className="h-4 w-4 text-muted-foreground/30" />
              ) : (
                <span className="text-sm font-bold text-primary">{row.pro}</span>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Header labels */}
      <div className="grid grid-cols-3 bg-muted/60 border-t px-6 py-3">
        <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Funkcja</span>
        <span className="text-xs text-center font-bold">Free</span>
        <span className="text-xs text-center font-bold text-primary">Pro</span>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   Main component
───────────────────────────────────────── */
export function PricingSection() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly')

  return (
    <section id="pricing" className="py-24 sm:py-32 bg-muted/20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* ── Header ── */}
        <div className="text-center mb-12">
          <Badge
            variant="outline"
            className="mb-4 gap-2 px-3 py-1.5 text-xs font-medium"
          >
            <Zap className="h-3.5 w-3.5 text-primary" />
            Cennik
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Prosty i{' '}
            <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              uczciwy cennik
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">
            Zacznij za darmo. Przejdź na Pro gdy jesteś gotowy —
            bez zobowiązań, anuluj kiedy chcesz.
          </p>
        </div>

        {/* ── Billing toggle ── */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <Label
            htmlFor="billing-toggle"
            className={cn(
              'text-sm font-medium cursor-pointer transition-colors',
              billing === 'monthly' ? 'text-foreground' : 'text-muted-foreground',
            )}
          >
            Miesięcznie
          </Label>
          <Switch
            id="billing-toggle"
            checked={billing === 'yearly'}
            onCheckedChange={v => setBilling(v ? 'yearly' : 'monthly')}
          />
          <Label
            htmlFor="billing-toggle"
            className={cn(
              'text-sm font-medium cursor-pointer transition-colors flex items-center gap-2',
              billing === 'yearly' ? 'text-foreground' : 'text-muted-foreground',
            )}
          >
            Rocznie
            <Badge className="bg-emerald-500 hover:bg-emerald-500 text-white text-[10px] font-bold px-2">
              -35%
            </Badge>
          </Label>
        </div>

        {/* ── Plan cards ── */}
        <div className="grid md:grid-cols-2 gap-6 items-start">
          {PLANS.map(plan => (
            <PlanCard key={plan.id} plan={plan} billing={billing} />
          ))}
        </div>

        {/* ── Comparison table ── */}
        <ComparisonTable />

        {/* ── Bottom trust row ── */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {[
            { icon: Shield,   text: 'Płatności przez Stripe — 100% bezpieczne'   },
            { icon: Zap,      text: '14 dni Pro — bez karty kredytowej'           },
            { icon: Check,    text: 'Anuluj w dowolnym momencie'                  },
            { icon: Sparkles, text: 'Dane przechowywane w Unii Europejskiej'     },
          ].map(item => (
            <div
              key={item.text}
              className="flex items-center gap-2 text-xs text-muted-foreground"
            >
              <item.icon className="h-3.5 w-3.5 text-primary/60 flex-shrink-0" />
              {item.text}
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
