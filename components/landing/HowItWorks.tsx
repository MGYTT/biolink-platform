import Link   from 'next/link'
import { Badge }  from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn }     from '@/lib/utils'
import {
  ArrowRight, UserPlus, Layers,
  Palette, Rocket, CheckCircle2,
} from 'lucide-react'

/* ─────────────────────────────────────────
   Data
───────────────────────────────────────── */
interface Step {
  step:        string
  icon:        React.ElementType
  emoji:       string
  title:       string
  description: string
  bullets:     string[]
  accent:      {
    bg:     string
    border: string
    text:   string
    badge:  string
    glow:   string
  }
}

const STEPS: Step[] = [
  {
    step:        '01',
    icon:        UserPlus,
    emoji:       '✉️',
    title:       'Zarejestruj się za darmo',
    description: 'Konto w 30 sekund — bez karty kredytowej.',
    bullets: [
      'Email i hasło lub Google OAuth',
      'Bez karty kredytowej',
      '14 dni Pro gratis',
    ],
    accent: {
      bg:     'bg-blue-50 dark:bg-blue-950/30',
      border: 'border-blue-200 dark:border-blue-900/60',
      text:   'text-blue-600 dark:text-blue-400',
      badge:  'bg-blue-600',
      glow:   'bg-blue-500/20',
    },
  },
  {
    step:        '02',
    icon:        Layers,
    emoji:       '🧱',
    title:       'Dodaj swoje bloki',
    description: 'Drag & drop — linki, obrazy, wideo i social media.',
    bullets: [
      'Przeciągnij blok, upuść w miejsce',
      'Live preview w czasie rzeczywistym',
      '14 typów bloków do wyboru',
    ],
    accent: {
      bg:     'bg-violet-50 dark:bg-violet-950/30',
      border: 'border-violet-200 dark:border-violet-900/60',
      text:   'text-violet-600 dark:text-violet-400',
      badge:  'bg-violet-600',
      glow:   'bg-violet-500/20',
    },
  },
  {
    step:        '03',
    icon:        Palette,
    emoji:       '🎨',
    title:       'Dobierz wygląd',
    description: 'Motyw, kolory, czcionka — Twoja marka, Twoje zasady.',
    bullets: [
      'Gotowe motywy i gradienty',
      'Własne kolory i czcionki',
      'White-label w planie Pro',
    ],
    accent: {
      bg:     'bg-pink-50 dark:bg-pink-950/30',
      border: 'border-pink-200 dark:border-pink-900/60',
      text:   'text-pink-600 dark:text-pink-400',
      badge:  'bg-pink-600',
      glow:   'bg-pink-500/20',
    },
  },
  {
    step:        '04',
    icon:        Rocket,
    emoji:       '🚀',
    title:       'Opublikuj i udostępnij',
    description: 'Jeden klik — Twoja strona żyje pod własnym adresem.',
    bullets: [
      'biolink.app/@twojanazwa',
      'Własna domena w Pro',
      'QR kod do pobrania',
    ],
    accent: {
      bg:     'bg-emerald-50 dark:bg-emerald-950/30',
      border: 'border-emerald-200 dark:border-emerald-900/60',
      text:   'text-emerald-600 dark:text-emerald-400',
      badge:  'bg-emerald-600',
      glow:   'bg-emerald-500/20',
    },
  },
]

/* ─────────────────────────────────────────
   StepCard
───────────────────────────────────────── */
function StepCard({
  step,
  index,
  isLast,
}: {
  step:   Step
  index:  number
  isLast: boolean
}) {
  const Icon = step.icon

  return (
    <div className="relative flex flex-col">

      {/* Connector line (desktop) */}
      {!isLast && (
        <div className="hidden lg:block absolute top-10 left-[calc(50%+44px)] right-[calc(-50%+44px)] h-px z-0">
          <div className="h-full bg-gradient-to-r from-border via-border/60 to-transparent" />
          {/* Arrow head */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0
            border-t-4 border-t-transparent
            border-b-4 border-b-transparent
            border-l-4 border-l-border/60"
          />
        </div>
      )}

      {/* Card */}
      <div className={cn(
        'relative flex flex-col gap-4 p-6 rounded-2xl border',
        'transition-all duration-300',
        'hover:shadow-lg hover:-translate-y-1',
        step.accent.bg,
        step.accent.border,
      )}>

        {/* Glow effect */}
        <div className={cn(
          'absolute -inset-px rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none blur-xl -z-10',
          step.accent.glow,
        )} />

        {/* Step badge + icon row */}
        <div className="flex items-start justify-between">
          <div className="relative">
            {/* Icon container */}
            <div className={cn(
              'w-14 h-14 rounded-2xl border-2 flex items-center justify-center',
              'bg-background',
              step.accent.border,
            )}>
              <span className="text-2xl" role="img" aria-hidden>{step.emoji}</span>
            </div>
            {/* Step number badge */}
            <span className={cn(
              'absolute -top-2 -right-2 w-6 h-6 rounded-full text-white',
              'text-[10px] font-extrabold flex items-center justify-center shadow-sm',
              step.accent.badge,
            )}>
              {index + 1}
            </span>
          </div>

          {/* Lucide icon — subtle */}
          <Icon className={cn('h-5 w-5 opacity-30', step.accent.text)} />
        </div>

        {/* Title */}
        <div>
          <p className={cn('text-[10px] font-bold uppercase tracking-widest mb-1', step.accent.text)}>
            Krok {step.step}
          </p>
          <h3 className="font-extrabold text-base leading-snug">
            {step.title}
          </h3>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          {step.description}
        </p>

        {/* Bullets */}
        <ul className="space-y-1.5 mt-auto">
          {step.bullets.map(bullet => (
            <li key={bullet} className="flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle2 className={cn('h-3.5 w-3.5 flex-shrink-0', step.accent.text)} />
              {bullet}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   Main component
───────────────────────────────────────── */
export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* ── Header ── */}
        <div className="text-center mb-16">
          <Badge
            variant="outline"
            className="mb-4 gap-2 px-3 py-1.5 text-xs font-medium"
          >
            <Rocket className="h-3.5 w-3.5 text-primary" />
            Jak to działa
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Od zera do online{' '}
            <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              w 2 minuty
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
            Cztery proste kroki — bez technicznej wiedzy,
            bez karty kredytowej, bez kompromisów.
          </p>
        </div>

        {/* ── Steps grid ── */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 relative">
          {STEPS.map((step, i) => (
            <StepCard
              key={step.step}
              step={step}
              index={i}
              isLast={i === STEPS.length - 1}
            />
          ))}
        </div>

        {/* ── Bottom CTA ── */}
        <div className="mt-16 flex flex-col items-center gap-5">
          {/* Time indicator */}
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            {[
              { time: '30 sek',  label: 'rejestracja'  },
              { time: '60 sek',  label: 'dodaj bloki'  },
              { time: '30 sek',  label: 'wybierz styl' },
              { time: '10 sek',  label: 'opublikuj'    },
            ].map((item, i) => (
              <div key={item.label} className="flex items-center gap-2">
                {i > 0 && <span className="text-border text-lg">+</span>}
                <div className="text-center">
                  <p className="font-bold text-foreground text-sm">{item.time}</p>
                  <p className="text-[10px]">{item.label}</p>
                </div>
              </div>
            ))}
            <div className="flex items-center gap-2 pl-2 border-l">
              <span className="text-border text-lg">=</span>
              <div className="text-center">
                <p className="font-extrabold text-primary text-sm">~2 min</p>
                <p className="text-[10px] font-medium text-primary/70">gotowe!</p>
              </div>
            </div>
          </div>

          {/* CTA button */}
          <Button
            size="lg"
            asChild
            className="px-10 gap-2 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] transition-all"
          >
            <Link href="/register">
              Zacznij teraz — to nic nie kosztuje
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>

          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            Bez karty kredytowej · Anuluj kiedy chcesz · Dane w EU
          </p>
        </div>

      </div>
    </section>
  )
}
