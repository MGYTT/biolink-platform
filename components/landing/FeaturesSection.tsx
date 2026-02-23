import { Layers, Palette, BarChart2, Globe, Zap, Lock } from 'lucide-react'

const features = [
  {
    icon: Layers,
    title: '14 typów bloków',
    description: 'Linki, nagłówki, obrazy, wideo, muzyka, formularze, mapy, odliczanie i więcej — wszystko drag & drop.',
    color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950',
  },
  {
    icon: Palette,
    title: 'Pełna personalizacja',
    description: '6 gotowych motywów, własne kolory, gradienty, czcionki i 5 stylów przycisków.',
    color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950',
  },
  {
    icon: BarChart2,
    title: 'Analityka kliknięć',
    description: 'Śledź kliknięcia, kraje, urządzenia i źródła ruchu w czasie rzeczywistym.',
    color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-950',
  },
  {
    icon: Globe,
    title: 'Własna domena',
    description: 'Podłącz swoją domenę (np. linki.twojamarka.pl) zamiast naszej subdomeny. Plan Pro.',
    color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-950',
  },
  {
    icon: Zap,
    title: 'Błyskawiczne ładowanie',
    description: 'Strony renderowane server-side (SSR) z Next.js — wynik 99/100 w Google PageSpeed.',
    color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-950',
  },
  {
    icon: Lock,
    title: 'Bezpieczeństwo',
    description: 'Row Level Security w Supabase — Twoje dane są izolowane i chronione na poziomie bazy danych.',
    color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-950',
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Funkcje</p>
          <h2 className="text-4xl font-extrabold tracking-tight mb-4">
            Wszystko czego potrzebujesz
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Zbudowany z myślą o twórcach, influencerach i markach — od pierwszego linku do zaawansowanej analityki.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="p-6 rounded-2xl border bg-background hover:shadow-md transition-shadow group"
            >
              <div className={`w-11 h-11 rounded-xl ${f.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <f.icon className={`h-5 w-5 ${f.color}`} />
              </div>
              <h3 className="font-bold text-base mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
