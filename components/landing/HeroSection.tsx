import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge }  from '@/components/ui/badge'
import { ArrowRight, Sparkles, Check, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

/* ─────────────────────────────────────────
   Data
───────────────────────────────────────── */
const MOCK_LINKS = [
  { emoji: '🎨', label: 'Moje portfolio'  },
  { emoji: '📺', label: 'YouTube'         },
  { emoji: '📸', label: 'Instagram'       },
  { emoji: '🛍️', label: 'Sklep online'   },
  { emoji: '📧', label: 'Kontakt'         },
] as const

const SOCIAL_ICONS = ['𝕏', 'in', 'yt'] as const

const TRUST_ITEMS = [
  'Bez karty kredytowej',
  'Gotowe w 2 minuty',
  '14 dni Pro gratis',
] as const

const AVATAR_EMOJIS = ['🧑', '👩', '👨', '🧑‍💻', '👩‍🎨'] as const

/* ─────────────────────────────────────────
   Phone mock
───────────────────────────────────────── */
function PhoneMock() {
  return (
    <div className="relative flex justify-center md:justify-end">
      {/* Floating badges */}
      <div className="absolute -left-4 top-16 z-20 animate-float-slow hidden sm:block">
        <div className="bg-background border shadow-lg rounded-xl px-3 py-2 flex items-center gap-2 text-xs font-medium whitespace-nowrap">
          <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center flex-shrink-0">
            <Check className="h-3 w-3 text-emerald-600" />
          </span>
          Nowy obserwator!
        </div>
      </div>

      <div className="absolute -right-2 bottom-28 z-20 animate-float hidden sm:block">
        <div className="bg-background border shadow-lg rounded-xl px-3 py-2 flex items-center gap-2 text-xs font-medium whitespace-nowrap">
          <Zap className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />
          +124 kliknięcia dziś
        </div>
      </div>

      {/* Outer glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-purple-500/20 to-pink-500/20 rounded-[44px] blur-2xl scale-110 pointer-events-none" />

      {/* Phone frame */}
      <div className="relative w-[260px] h-[530px] rounded-[40px] border-[6px] border-neutral-800 bg-neutral-950 shadow-2xl overflow-hidden flex-shrink-0">

        {/* Status bar */}
        <div className="absolute top-0 left-0 right-0 h-8 bg-black/40 z-10 flex items-center justify-between px-5 pt-1">
          <span className="text-white/60 text-[9px] font-medium">9:41</span>
          <div className="w-14 h-4 bg-neutral-800 rounded-full" />
          <div className="flex items-center gap-1">
            <div className="w-3 h-1.5 rounded-sm bg-white/50" />
            <div className="w-1 h-1 rounded-full bg-white/50" />
          </div>
        </div>

        {/* Page content */}
        <div className="h-full bg-gradient-to-br from-violet-600 via-purple-500 to-pink-500 flex flex-col items-center pt-10 px-4 gap-2.5 overflow-hidden">

          {/* Profile */}
          <div className="flex flex-col items-center gap-1.5 mb-1">
            <div className="relative mt-2">
              <div className="w-16 h-16 rounded-full bg-white/20 border-[3px] border-white/60 shadow-xl flex items-center justify-center text-2xl backdrop-blur-sm">
                👩‍🎨
              </div>
              {/* Online dot */}
              <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white" />
            </div>
            <p className="font-bold text-white text-sm tracking-tight">Anna Kowalska</p>
            <p className="text-white/70 text-[10px] text-center leading-tight px-2">
              Designerka & twórczyni treści ✨
            </p>
            {/* Stats row */}
            <div className="flex gap-4 mt-0.5">
              {[['12k', 'obserwujących'], ['248', 'linków'], ['4.9', 'ocena']].map(([val, lbl]) => (
                <div key={lbl} className="flex flex-col items-center">
                  <span className="text-white text-[11px] font-bold leading-tight">{val}</span>
                  <span className="text-white/50 text-[8px] leading-tight">{lbl}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          {MOCK_LINKS.map((item, i) => (
            <div
              key={item.label}
              className={cn(
                'w-full py-2 px-3.5 rounded-xl flex items-center gap-2',
                'bg-white/15 backdrop-blur-sm border border-white/20',
                'text-white text-[11px] font-semibold',
                'shadow-sm',
                i === 0 && 'bg-white/30 border-white/40',
              )}
            >
              <span className="text-sm leading-none">{item.emoji}</span>
              {item.label}
              {i === 0 && (
                <span className="ml-auto text-[8px] bg-white/30 rounded-full px-1.5 py-0.5 font-bold">
                  HOT
                </span>
              )}
            </div>
          ))}

          {/* Social icons */}
          <div className="flex gap-2.5 mt-1">
            {SOCIAL_ICONS.map(s => (
              <div
                key={s}
                className="w-7 h-7 rounded-full bg-white/15 border border-white/25 flex items-center justify-center text-white text-[10px] font-bold backdrop-blur-sm"
              >
                {s}
              </div>
            ))}
          </div>

          {/* Powered by */}
          <p className="text-white/30 text-[8px] mt-auto mb-3 tracking-widest uppercase">
            Powered by BioLink
          </p>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   Main component
───────────────────────────────────────── */
export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">

      {/* ── Background ── */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: `linear-gradient(currentColor 1px, transparent 1px),
                              linear-gradient(90deg, currentColor 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />
        {/* Glows */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] animate-pulse delay-1000" />
        <div className="absolute top-2/3 left-1/3 w-[300px] h-[300px] bg-pink-500/10 rounded-full blur-[80px] animate-pulse delay-500" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 grid md:grid-cols-2 gap-16 items-center">

        {/* ── Left column ── */}
        <div className="flex flex-col gap-7">

          {/* Badge */}
          <Badge
            variant="outline"
            className="w-fit flex items-center gap-2 px-3 py-1.5 text-xs font-medium border-primary/20 bg-primary/5"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />
            100% darmowy start · bez karty kredytowej
          </Badge>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-[1.08] tracking-tight">
              Jedna strona,
            </h1>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-[1.08] tracking-tight">
              <span className="relative">
                <span className="bg-gradient-to-r from-primary via-violet-500 to-purple-600 bg-clip-text text-transparent">
                  wszystkie linki
                </span>
                {/* Underline accent */}
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 300 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <path
                    d="M2 8.5C60 3.5 150 1 298 8.5"
                    stroke="url(#grad)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="300" y2="0">
                      <stop offset="0%"   stopColor="hsl(var(--primary))" />
                      <stop offset="100%" stopColor="#9333ea" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h1>
          </div>

          {/* Description */}
          <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
            Stwórz profesjonalną stronę link-in-bio w mniej niż 2 minuty.
            Drag & drop, live preview, 14 typów bloków i pełna personalizacja.
          </p>

          {/* Trust checklist */}
          <ul className="flex flex-col sm:flex-row gap-x-6 gap-y-2 flex-wrap">
            {TRUST_ITEMS.map(item => (
              <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center flex-shrink-0">
                  <Check className="h-2.5 w-2.5 text-emerald-600 dark:text-emerald-400" />
                </span>
                {item}
              </li>
            ))}
          </ul>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              size="lg"
              asChild
              className="text-base px-8 gap-2 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
            >
              <Link href="/register">
                Stwórz swoją stronę
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="text-base gap-2 hover:bg-accent"
            >
              <Link href="#how-it-works">
                Zobacz jak to działa
              </Link>
            </Button>
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-3 pt-1">
            {/* Avatars */}
            <div className="flex -space-x-2.5">
              {AVATAR_EMOJIS.map((emoji, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-sm shadow-sm"
                >
                  {emoji}
                </div>
              ))}
            </div>
            <div>
              {/* Stars */}
              <div className="flex gap-0.5 mb-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" viewBox="0 0 20 20" aria-hidden>
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Dołącz do{' '}
                <strong className="text-foreground font-semibold">10 000+</strong>{' '}
                twórców
              </p>
            </div>
          </div>
        </div>

        {/* ── Right column — phone ── */}
        <PhoneMock />
      </div>
    </section>
  )
}
