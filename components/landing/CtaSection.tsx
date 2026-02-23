import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge }  from '@/components/ui/badge'
import {
  ArrowRight, Sparkles, Check,
  Zap, Shield, Clock,
} from 'lucide-react'
import { cn } from '@/lib/utils'

/* ─────────────────────────────────────────
   Data
───────────────────────────────────────── */
const GUARANTEES = [
  { icon: Check,  text: 'Bez karty kredytowej'    },
  { icon: Clock,  text: '14 dni Pro za darmo'      },
  { icon: Shield, text: 'Anuluj w każdej chwili'  },
  { icon: Zap,    text: 'Gotowe w 2 minuty'        },
] as const

const STATS = [
  { value: '10 000+', label: 'aktywnych twórców'  },
  { value: '2 min',   label: 'czas konfiguracji'  },
  { value: '99.9%',   label: 'uptime SLA'          },
  { value: '14 dni',  label: 'bezpłatny trial'    },
] as const

/* ─────────────────────────────────────────
   Sub-components
───────────────────────────────────────── */
function StatItem({
  value,
  label,
  bordered,
}: {
  value:    string
  label:    string
  bordered: boolean
}) {
  return (
    <div className={cn(
      'flex flex-col items-center gap-1 px-6 py-4',
      bordered && 'border-l border-white/10',
    )}>
      <span className="text-3xl font-extrabold text-white tracking-tight">
        {value}
      </span>
      <span className="text-xs text-white/50 text-center leading-tight">
        {label}
      </span>
    </div>
  )
}

/* ─────────────────────────────────────────
   Main component
───────────────────────────────────────── */
export function CtaSection() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">

      {/* ── Background ── */}
      <div className="absolute inset-0 -z-10">
        {/* Base dark gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950" />

        {/* Colored glows */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-primary/20 rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[400px] bg-purple-600/20 rounded-full blur-[100px] opacity-60" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-violet-500/10 rounded-full blur-[80px]" />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(white 1px, transparent 1px),
                              linear-gradient(90deg, white 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />

        {/* Noise texture */}
        <div
          className="absolute inset-0 opacity-[0.015] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Top border gradient */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {/* Bottom border gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* ── Main card ── */}
        <div className="relative rounded-3xl overflow-hidden">

          {/* Card inner glow border */}
          <div className="absolute inset-0 rounded-3xl p-px bg-gradient-to-br from-white/20 via-white/5 to-white/10 pointer-events-none" />

          <div className="relative bg-white/5 backdrop-blur-sm rounded-3xl px-6 sm:px-12 py-14 sm:py-20 text-center">

            {/* Badge */}
            <div className="flex justify-center mb-6">
              <Badge
                variant="outline"
                className="gap-2 px-4 py-1.5 text-xs font-semibold border-white/20 bg-white/5 text-white/80 backdrop-blur-sm"
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                Zacznij za darmo — żadnych niespodzianek
              </Badge>
            </div>

            {/* Heading */}
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
              Gotowy na{' '}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-primary via-violet-400 to-purple-400 bg-clip-text text-transparent">
                  więcej kliknięć?
                </span>
                {/* Decorative underline */}
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 280 10"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M2 7C60 2.5 160 1 278 7"
                    stroke="url(#ctaGrad)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    opacity="0.7"
                  />
                  <defs>
                    <linearGradient id="ctaGrad" x1="0" y1="0" x2="280" y2="0">
                      <stop offset="0%"   stopColor="hsl(var(--primary))" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h2>

            {/* Subtext */}
            <p className="text-lg text-white/60 leading-relaxed max-w-2xl mx-auto mb-10">
              Stwórz swoją stronę link-in-bio w mniej niż 2 minuty.
              Dołącz do <strong className="text-white/90 font-semibold">10 000+</strong> twórców,
              którzy już zwiększyli swój zasięg.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
              <Button
                asChild
                size="lg"
                className={cn(
                  'text-base px-10 h-13 font-bold gap-2.5',
                  'bg-white text-neutral-900 hover:bg-white/90',
                  'shadow-2xl shadow-white/10',
                  'hover:shadow-white/20 transition-all duration-200',
                  'hover:scale-[1.02] active:scale-[0.98]',
                )}
              >
                <Link href="/register">
                  Stwórz konto za darmo
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="ghost"
                className="text-base px-8 h-13 text-white/70 hover:text-white hover:bg-white/10 gap-2 font-medium"
              >
                <Link href="/dashboard/upgrade">
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  Zobacz plan Pro
                </Link>
              </Button>
            </div>

            {/* Guarantees */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {GUARANTEES.map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-2 text-sm text-white/50"
                >
                  <Icon className="h-3.5 w-3.5 text-white/30 flex-shrink-0" />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Stats row ── */}
        <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm overflow-hidden">
          <div className="grid grid-cols-2 sm:grid-cols-4">
            {STATS.map((stat, i) => (
              <StatItem
                key={stat.label}
                value={stat.value}
                label={stat.label}
                bordered={i > 0}
              />
            ))}
          </div>
        </div>

        {/* ── Bottom note ── */}
        <p className="mt-8 text-center text-xs text-white/25 leading-relaxed">
          Płatności obsługuje{' '}
          <span className="text-white/40 font-medium">Stripe</span>
          {' '}· SSL · RODO · Dane przechowywane w UE
        </p>

      </div>
    </section>
  )
}
