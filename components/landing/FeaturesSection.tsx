import { Badge }  from '@/components/ui/badge'
import { cn }     from '@/lib/utils'
import {
  Zap, Globe, Palette, BarChart2,
  Lock, Shield, Layers, MousePointer2,
  Smartphone, Clock, Code2, Sparkles,
} from 'lucide-react'

/* ─────────────────────────────────────────
   Data
───────────────────────────────────────── */
interface Feature {
  icon:        React.ElementType
  title:       string
  description: string
  badge?:      string
  accent:      string   // Tailwind bg color for icon bg
  span?:       'wide'   // 2-column span on large screens
  visual?:     React.ReactNode
}

const FEATURES: Feature[] = [
  {
    icon:        MousePointer2,
    title:       'Drag & Drop Editor',
    description: 'Przeciągaj bloki, zmieniaj kolejność jednym ruchem. Live preview w czasie rzeczywistym — widzisz efekt natychmiast.',
    accent:      'bg-blue-100 dark:bg-blue-950/60',
    span:        'wide',
    visual: (
      <div className="mt-5 relative h-28 select-none pointer-events-none" aria-hidden>
        {/* Simulated block list */}
        {[
          { label: '🔗 Moje portfolio',  active: false, w: 'w-full'    },
          { label: '📺 YouTube',          active: true,  w: 'w-full'    },
          { label: '📸 Instagram',        active: false, w: 'w-[85%]'  },
        ].map((b, i) => (
          <div
            key={b.label}
            className={cn(
              'absolute flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all',
              b.active
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30 z-10 scale-[1.03]'
                : 'bg-muted text-muted-foreground border',
              b.w,
            )}
            style={{ top: `${i * 38}px`, left: 0 }}
          >
            {b.active && (
              <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary/40 border-2 border-primary cursor-grab" />
            )}
            {b.label}
          </div>
        ))}
      </div>
    ),
  },
  {
    icon:        Smartphone,
    title:       'Live Preview',
    description: 'Podgląd w ramce telefonu aktualizuje się na bieżąco. Każda zmiana widoczna od razu — bez zapisywania.',
    accent:      'bg-purple-100 dark:bg-purple-950/60',
    visual: (
      <div className="mt-4 flex justify-center" aria-hidden>
        <div className="relative w-20 h-36 rounded-[16px] border-[3px] border-neutral-700 bg-gradient-to-br from-violet-500 to-pink-500 overflow-hidden shadow-xl">
          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-8 h-2 bg-neutral-800 rounded-full" />
          <div className="flex flex-col items-center gap-1.5 pt-6 px-2">
            <div className="w-7 h-7 rounded-full bg-white/30 border-2 border-white/50 text-xs flex items-center justify-center">👩</div>
            <div className="w-full h-1.5 rounded-full bg-white/30" />
            <div className="w-[80%] h-1.5 rounded-full bg-white/20" />
            {[1,2,3].map(i => (
              <div key={i} className="w-full h-4 rounded-full bg-white/20 border border-white/20" />
            ))}
          </div>
          {/* Pulse indicator */}
          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>
      </div>
    ),
  },
  {
    icon:        Layers,
    title:       '14 Typów Bloków',
    description: 'Linki, wideo, formularze, odliczanie, mapy, PDF — wszystko czego potrzebujesz w jednym miejscu.',
    badge:       'Pro',
    accent:      'bg-amber-100 dark:bg-amber-950/60',
    visual: (
      <div className="mt-4 grid grid-cols-4 gap-1.5" aria-hidden>
        {[
          ['🔗','Link'],['📝','Nagł.'],['💬','Tekst'],['🖼️','Obraz'],
          ['🎬','Wideo'],['🎵','Muzyka'],['⏱️','Timer'],['📋','Form'],
          ['📍','Mapa'],['📄','PDF'],['🛍️','Prod.'],['⚡','HTML'],
        ].map(([emoji, label], i) => (
          <div
            key={label}
            className={cn(
              'flex flex-col items-center gap-0.5 p-1.5 rounded-lg border text-center',
              i >= 4
                ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/60'
                : 'bg-muted border-border',
            )}
          >
            <span className="text-sm leading-none">{emoji}</span>
            <span className="text-[8px] text-muted-foreground font-medium">{label}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon:        Palette,
    title:       'Pełna Personalizacja',
    description: 'Motywy, gradienty, własne kolory przycisków i tekstu, wybór czcionki, animacje — Twoja marka, Twoje zasady.',
    badge:       'Pro',
    accent:      'bg-pink-100 dark:bg-pink-950/60',
    visual: (
      <div className="mt-4 space-y-2" aria-hidden>
        {/* Theme swatches */}
        <div className="flex gap-1.5">
          {[
            ['#ffffff','#111827'],
            ['#111827','#f9fafb'],
            ['#7c3aed','#ddd6fe'],
            ['#2563eb','#bfdbfe'],
            ['#f97316','#fed7aa'],
          ].map(([bg, accent], i) => (
            <div
              key={i}
              className={cn(
                'flex-1 h-8 rounded-lg overflow-hidden border-2 flex',
                i === 2 ? 'border-primary scale-110 shadow-sm' : 'border-transparent',
              )}
            >
              <div className="flex-1" style={{ background: bg }} />
              <div className="flex-1" style={{ background: accent }} />
            </div>
          ))}
        </div>
        {/* Color sliders mock */}
        <div className="space-y-1.5">
          {[
            { label: 'Tło',     from: '#7c3aed', to: '#2563eb' },
            { label: 'Przyc.', from: '#ec4899', to: '#f97316' },
          ].map(row => (
            <div key={row.label} className="flex items-center gap-2">
              <span className="text-[9px] text-muted-foreground w-7 flex-shrink-0">{row.label}</span>
              <div
                className="flex-1 h-2.5 rounded-full relative"
                style={{ background: `linear-gradient(to right, ${row.from}, ${row.to})` }}
              >
                <div className="absolute right-1/3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 border-white shadow-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    icon:        BarChart2,
    title:       'Szczegółowa Analityka',
    description: 'Śledź kliknięcia, wyświetlenia, kraj odwiedzającego, typ urządzenia i źródło ruchu. Dane przez 12 miesięcy.',
    badge:       'Pro',
    accent:      'bg-emerald-100 dark:bg-emerald-950/60',
    visual: (
      <div className="mt-4" aria-hidden>
        {/* Mini bar chart */}
        <div className="flex items-end gap-1 h-16 px-1">
          {[40, 65, 45, 80, 55, 90, 72, 85, 60, 95, 70, 88, 75, 100].map((h, i) => (
            <div
              key={i}
              className={cn(
                'flex-1 rounded-t-sm transition-all',
                i === 13
                  ? 'bg-primary'
                  : i >= 10
                  ? 'bg-primary/60'
                  : 'bg-primary/25',
              )}
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-1.5 px-1">
          <span className="text-[9px] text-muted-foreground">7 dni temu</span>
          <span className="text-[9px] text-muted-foreground font-medium text-primary">Dziś</span>
        </div>
        {/* Stats row */}
        <div className="flex gap-3 mt-2">
          {[['1.2k','Wyśw.'],['347','Klik.'],['28%','CTR']].map(([val, lbl]) => (
            <div key={lbl} className="flex-1 text-center p-1.5 rounded-lg bg-muted">
              <p className="text-sm font-bold">{val}</p>
              <p className="text-[9px] text-muted-foreground">{lbl}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    icon:        Globe,
    title:       'Własna Domena',
    description: 'Podepnij dowolną domenę lub subdomenę. SSL automatycznie. Pełna kontrola nad swoją marką.',
    badge:       'Pro',
    accent:      'bg-sky-100 dark:bg-sky-950/60',
    visual: (
      <div className="mt-4 space-y-2" aria-hidden>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted border text-xs font-mono">
          <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
          <span className="text-muted-foreground truncate">links.twojastrona.pl</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 text-xs">
          <Shield className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
          <span className="text-emerald-700 dark:text-emerald-400 font-medium">SSL aktywny</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5 text-[9px]">
          {[
            ['CNAME', 'cname.biolink.app'],
            ['Status', 'Połączono ✓'],
          ].map(([k, v]) => (
            <div key={k} className="px-2 py-1.5 rounded-lg bg-muted border font-mono">
              <p className="text-muted-foreground">{k}</p>
              <p className="font-semibold text-foreground truncate">{v}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    icon:        Lock,
    title:       'Harmonogram Linków',
    description: 'Ustaw daty od kiedy do kiedy dany blok jest widoczny. Idealne do promocji, wydarzeń i sezonowych kampanii.',
    badge:       'Pro',
    accent:      'bg-orange-100 dark:bg-orange-950/60',
    visual: (
      <div className="mt-4 space-y-2" aria-hidden>
        <div className="p-2.5 rounded-lg border bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/60">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-3 w-3 text-amber-600" />
            <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-400">Harmonogram</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {[['Od', '1 mar, 09:00'], ['Do', '31 mar, 23:59']].map(([k, v]) => (
              <div key={k} className="space-y-0.5">
                <p className="text-[8px] text-muted-foreground uppercase tracking-wide">{k}</p>
                <p className="text-[10px] font-mono font-semibold">{v}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">Aktywny teraz</span>
        </div>
      </div>
    ),
  },
  {
    icon:        Code2,
    title:       'Custom CSS & HTML',
    description: 'Pełna swoboda dla zaawansowanych. Własny CSS, blok HTML, Google Tag Manager i Meta Pixel bez kodowania.',
    badge:       'Pro',
    accent:      'bg-violet-100 dark:bg-violet-950/60',
    visual: (
      <div className="mt-4 rounded-lg bg-neutral-950 border border-neutral-800 overflow-hidden" aria-hidden>
        <div className="flex items-center gap-1.5 px-3 py-2 border-b border-neutral-800">
          {['bg-red-500','bg-yellow-500','bg-green-500'].map(c => (
            <div key={c} className={cn('w-2 h-2 rounded-full', c)} />
          ))}
          <span className="ml-1 text-[9px] text-neutral-500 font-mono">custom.css</span>
        </div>
        <pre className="px-3 py-2.5 text-[9px] font-mono leading-relaxed overflow-hidden">
          <span className="text-neutral-500">{`/* Twój styl */`}</span>{'\n'}
          <span className="text-blue-400">.bio-page</span>
          <span className="text-white">{` {`}</span>{'\n'}
          <span className="text-purple-400">{'  background'}</span>
          <span className="text-white">{`: `}</span>
          <span className="text-emerald-400">{'linear-gradient'}</span>
          <span className="text-white">{`(`}</span>{'\n'}
          <span className="text-yellow-400">{'    #7c3aed, #ec4899'}</span>{'\n'}
          <span className="text-white">{'  );'}</span>{'\n'}
          <span className="text-white">{'}'}</span>
        </pre>
      </div>
    ),
  },
]

/* ─────────────────────────────────────────
   FeatureCard
───────────────────────────────────────── */
function FeatureCard({ feature }: { feature: Feature }) {
  const Icon = feature.icon

  return (
    <div className={cn(
      'group relative flex flex-col p-6 rounded-2xl border bg-card',
      'hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5',
      'transition-all duration-300',
      feature.span === 'wide' && 'md:col-span-2',
    )}>
      {/* Hover gradient overlay */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <span className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110',
            feature.accent,
          )}>
            <Icon className="h-5 w-5 text-foreground/70" />
          </span>
          <h3 className="font-bold text-base leading-tight">{feature.title}</h3>
        </div>
        {feature.badge && (
          <Badge className="text-[9px] px-2 h-5 bg-amber-500 hover:bg-amber-500 text-white font-bold flex-shrink-0 gap-1">
            <Sparkles className="h-2.5 w-2.5" />
            {feature.badge}
          </Badge>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground leading-relaxed">
        {feature.description}
      </p>

      {/* Visual */}
      {feature.visual}
    </div>
  )
}

/* ─────────────────────────────────────────
   Section header
───────────────────────────────────────── */
function SectionHeader() {
  return (
    <div className="text-center mb-16">
      <Badge
        variant="outline"
        className="mb-4 gap-2 px-3 py-1.5 text-xs font-medium"
      >
        <Zap className="h-3.5 w-3.5 text-primary" />
        Wszystko czego potrzebujesz
      </Badge>
      <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
        Funkcje które{' '}
        <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
          robią różnicę
        </span>
      </h2>
      <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
        Zaprojektowane dla twórców, influencerów, małych firm i każdego,
        kto chce mieć jedną, profesjonalną stronę z linkami.
      </p>
    </div>
  )
}

/* ─────────────────────────────────────────
   Main component
───────────────────────────────────────── */
export function FeaturesSection() {
  return (
    <section id="features" className="py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        <SectionHeader />

        {/* ── Feature grid ── */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-auto">
          {FEATURES.map(feature => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>

        {/* ── Bottom highlight bar ── */}
        <div className="mt-16 rounded-2xl border bg-muted/40 p-6 sm:p-8">
          <div className="grid sm:grid-cols-3 gap-6 sm:gap-0 sm:divide-x divide-border">
            {[
              {
                icon:  Zap,
                title: 'Szybki setup',
                desc:  'Od rejestracji do gotowej strony w mniej niż 2 minuty. Zero konfiguracji serwera.',
              },
              {
                icon:  Shield,
                title: 'Bezpieczne dane',
                desc:  'Serwery w UE, SSL, RODO. Płatności przez Stripe — nigdy nie przechowujemy danych kart.',
              },
              {
                icon:  Sparkles,
                title: '14 dni Pro gratis',
                desc:  'Przetestuj wszystkie funkcje Pro przez 2 tygodnie. Anuluj w każdej chwili.',
              },
            ].map(item => (
              <div key={item.title} className="flex items-start gap-4 sm:px-8 first:pl-0 last:pr-0">
                <span className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="h-5 w-5 text-primary" />
                </span>
                <div>
                  <p className="font-bold text-sm mb-1">{item.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
