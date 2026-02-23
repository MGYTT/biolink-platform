import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const plans = [
  {
    name: 'Free',
    price: '0 zł',
    period: 'zawsze',
    description: 'Idealny start dla każdego twórcy',
    badge: null,
    cta: 'Zacznij za darmo',
    ctaVariant: 'outline' as const,
    href: '/register',
    features: [
      { label: '1 strona link-in-bio',          included: true  },
      { label: 'Do 15 bloków',                   included: true  },
      { label: '6 typów bloków (link, obraz...)',included: true  },
      { label: '3 motywy kolorystyczne',         included: true  },
      { label: 'Podstawowe statystyki',          included: true  },
      { label: 'Subdomena biolink.app/@ty',      included: true  },
      { label: 'Własna domena',                  included: false },
      { label: 'Bloki PRO (wideo, formularze…)', included: false },
      { label: 'Szczegółowa analityka',          included: false },
      { label: 'Piksele reklamowe',              included: false },
      { label: 'Usunięcie brandingu',            included: false },
    ],
  },
  {
    name: 'Pro',
    price: '29 zł',
    period: 'miesięcznie',
    description: 'Dla profesjonalistów i marek',
    badge: 'Najpopularniejszy',
    cta: 'Zacznij 14 dni za darmo',
    ctaVariant: 'default' as const,
    href: '/register?plan=pro',
    features: [
      { label: 'Nieograniczone strony',          included: true },
      { label: 'Nieograniczone bloki',           included: true },
      { label: 'Wszystkie 14 typów bloków',      included: true },
      { label: 'Wszystkie 6 motywów + gradienry',included: true },
      { label: 'Szczegółowa analityka',          included: true },
      { label: 'Subdomena biolink.app/@ty',      included: true },
      { label: 'Własna domena',                  included: true },
      { label: 'Harmonogram linków',             included: true },
      { label: 'Piksele Meta & Google',          included: true },
      { label: 'Usunięcie brandingu (white-label)', included: true },
    ],
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-muted/30">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Cennik</p>
          <h2 className="text-4xl font-extrabold tracking-tight mb-4">
            Prosty i uczciwy cennik
          </h2>
          <p className="text-muted-foreground text-lg">
            Zacznij za darmo. Przejdź na Pro gdy jesteś gotowy.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                'relative rounded-2xl border p-8 flex flex-col gap-6 bg-background',
                plan.badge && 'border-primary shadow-xl shadow-primary/10 scale-[1.02]'
              )}
            >
              {plan.badge && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary px-4">
                  {plan.badge}
                </Badge>
              )}

              <div>
                <h3 className="font-bold text-xl mb-1">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>

              <div className="flex items-end gap-1">
                <span className="text-5xl font-extrabold">{plan.price}</span>
                <span className="text-muted-foreground pb-1">/{plan.period}</span>
              </div>

              <ul className="space-y-2.5 flex-1">
                {plan.features.map((f) => (
                  <li key={f.label} className="flex items-start gap-2.5 text-sm">
                    {f.included
                      ? <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      : <X className="h-4 w-4 text-muted-foreground/40 mt-0.5 flex-shrink-0" />
                    }
                    <span className={cn(!f.included && 'text-muted-foreground/50')}>
                      {f.label}
                    </span>
                  </li>
                ))}
              </ul>

              <Button variant={plan.ctaVariant} size="lg" className="w-full" asChild>
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
