'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import {
  Check, Sparkles, Zap, Globe, BarChart2, Palette,
  Layers, Lock, Shield, Loader2, ExternalLink, X
} from 'lucide-react'
import { cn } from '@/lib/utils'

const proFeatures = [
  { icon: Layers,   text: 'Nieograniczone strony i bloki'                    },
  { icon: Zap,      text: 'Wszystkie 14 typów bloków (wideo, formularze…)'   },
  { icon: Globe,    text: 'Własna domena (np. linki.twojastrona.pl)'         },
  { icon: Palette,  text: 'Wszystkie 6 motywów + gradienty tła'              },
  { icon: BarChart2,text: 'Szczegółowa analityka (kraj, urządzenie, źródło)' },
  { icon: Lock,     text: 'Harmonogram linków (widoczny od / do)'            },
  { icon: Shield,   text: 'Piksele Meta Pixel i Google Tag Manager'          },
  { icon: Sparkles, text: 'Usunięcie brandingu (white-label)'                },
]

const freeFeatures = [
  '1 strona link-in-bio',
  'Do 15 bloków',
  '6 typów bloków',
  '3 motywy',
  'Podstawowe statystyki',
  'Subdomena biolink.app/@ty',
]

interface UpgradeClientProps {
  currentPlan: string
  subscription: {
    status: string
    current_period_end: string | null
    plan: string
  } | null
}

export function UpgradeClient({ currentPlan, subscription }: UpgradeClientProps) {
  const [loading, setLoading] = useState(false)
  const [portalLoading, setPortalLoading] = useState(false)
  const searchParams = useSearchParams()

  const isSuccess  = searchParams.get('success') === 'true'
  const isCanceled = searchParams.get('canceled') === 'true'
  const isPro      = currentPlan === 'pro'

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
      toast.error('Nie można otworzyć portalu')
      setPortalLoading(false)
    }
  }

  return (
    <div className="max-w-4xl space-y-6">

      {/* Banner sukcesu */}
      {isSuccess && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-900">
          <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
            <Check className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="font-semibold text-green-800 dark:text-green-200">
              🎉 Witaj w planie Pro!
            </p>
            <p className="text-sm text-green-700 dark:text-green-300">
              Twoje konto zostało zaktualizowane. Wszystkie funkcje Pro są już dostępne.
            </p>
          </div>
        </div>
      )}

      {/* Banner anulowania */}
      {isCanceled && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900">
          <X className="h-5 w-5 text-amber-600 flex-shrink-0" />
          <p className="text-sm text-amber-800 dark:text-amber-200">
            Płatność została anulowana. Twój plan pozostaje bez zmian.
          </p>
        </div>
      )}

      {/* Aktualny plan */}
      <Card className={cn(isPro && 'border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-950/20')}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Twój aktualny plan</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl font-extrabold">
                  {isPro ? 'Plan Pro ⭐' : 'Plan Free'}
                </span>
                <Badge className={cn(isPro ? 'bg-amber-500' : 'bg-secondary text-secondary-foreground')}>
                  {isPro ? 'AKTYWNY' : 'DARMOWY'}
                </Badge>
              </div>
              {isPro && subscription?.current_period_end && (
                <p className="text-xs text-muted-foreground mt-1">
                  Następna płatność:{' '}
                  {new Date(subscription.current_period_end).toLocaleDateString('pl-PL', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </p>
              )}
            </div>
            {isPro && (
              <Button
                variant="outline"
                onClick={handlePortal}
                disabled={portalLoading}
              >
                {portalLoading
                  ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Ładowanie...</>
                  : <><ExternalLink className="h-4 w-4 mr-2" />Zarządzaj subskrypcją</>
                }
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Porównanie planów */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Free */}
        <Card className={cn(!isPro && 'border-primary ring-1 ring-primary/20')}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Free</CardTitle>
              {!isPro && <Badge variant="outline">Twój plan</Badge>}
            </div>
            <div className="flex items-end gap-1 mt-2">
              <span className="text-4xl font-extrabold">0 zł</span>
              <span className="text-muted-foreground pb-1">/zawsze</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2.5">
              {freeFeatures.map(f => (
                <li key={f} className="flex items-center gap-2.5 text-sm">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Pro */}
        <Card className={cn(
          'relative border-2',
          isPro
            ? 'border-amber-400 dark:border-amber-600'
            : 'border-primary shadow-xl shadow-primary/10'
        )}>
          {!isPro && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge className="bg-primary px-4 text-sm">⭐ Rekomendowany</Badge>
            </div>
          )}
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                Pro
                <Sparkles className="h-4 w-4 text-amber-500" />
              </CardTitle>
              {isPro && <Badge className="bg-amber-500">Twój plan</Badge>}
            </div>
            <div className="flex items-end gap-1 mt-2">
              <span className="text-4xl font-extrabold">29 zł</span>
              <span className="text-muted-foreground pb-1">/miesiąc</span>
            </div>
            <p className="text-xs text-muted-foreground">
              14 dni za darmo · anuluj kiedy chcesz
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2.5">
              {proFeatures.map(f => (
                <li key={f.text} className="flex items-center gap-2.5 text-sm">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <f.icon className="h-3 w-3 text-primary" />
                  </div>
                  {f.text}
                </li>
              ))}
            </ul>

            <Separator />

            {!isPro ? (
              <Button
                className="w-full font-bold"
                size="lg"
                onClick={handleUpgrade}
                disabled={loading}
              >
                {loading
                  ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Przekierowanie do Stripe...</>
                  : <>Zacznij 14 dni za darmo →</>
                }
              </Button>
            ) : (
              <Button className="w-full" variant="outline" onClick={handlePortal} disabled={portalLoading}>
                {portalLoading
                  ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Ładowanie...</>
                  : <><ExternalLink className="h-4 w-4 mr-2" />Portal rozliczeń</>
                }
              </Button>
            )}

            <p className="text-[11px] text-center text-muted-foreground">
              🔒 Płatności obsługuje Stripe · SSL · Anuluj w każdej chwili
            </p>
          </CardContent>
        </Card>
      </div>

      {/* FAQ rozliczenia */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pytania o rozliczenia</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-4">
          {[
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
          ].map(item => (
            <div key={item.q} className="space-y-1">
              <p className="text-sm font-semibold">{item.q}</p>
              <p className="text-sm text-muted-foreground">{item.a}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
