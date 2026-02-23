import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Sparkles } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Gradient tła */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-12 items-center">
        {/* Lewa kolumna — tekst */}
        <div className="flex flex-col gap-6">
          <Badge variant="outline" className="w-fit flex items-center gap-1.5 px-3 py-1">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span className="text-xs">100% darmowy start · bez karty kredytowej</span>
          </Badge>

          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
            Jedna strona,{' '}
            <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              wszystkie Twoje linki
            </span>
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
            Stwórz profesjonalną stronę link-in-bio w mniej niż 2 minuty.
            Drag & drop, live preview, 14 typów bloków i pełna personalizacja.
            Zacznij za darmo — bez limitu czasu.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button size="lg" asChild className="text-base px-8">
              <Link href="/register">
                Stwórz swoją stronę
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-base">
              <Link href="#how-it-works">
                Zobacz jak to działa
              </Link>
            </Button>
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-4 pt-2">
            <div className="flex -space-x-2">
              {['🧑', '👩', '👨', '🧑‍💻', '👩‍🎨'].map((emoji, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-sm">
                  {emoji}
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Dołącz do <strong className="text-foreground">10 000+</strong> twórców
            </p>
          </div>
        </div>

        {/* Prawa kolumna — mock telefon */}
        <div className="flex justify-center md:justify-end">
          <div className="relative">
            {/* Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-purple-500/30 rounded-[40px] blur-2xl scale-105" />

            {/* Telefon */}
            <div className="relative w-[260px] h-[520px] rounded-[40px] border-[6px] border-neutral-800 bg-white dark:bg-neutral-950 shadow-2xl overflow-hidden">
              {/* Notch */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-neutral-800 rounded-full z-10" />

              {/* Zawartość mock strony */}
              <div className="h-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex flex-col items-center pt-12 px-4 gap-3">
                <div className="w-16 h-16 rounded-full bg-white/30 border-4 border-white/50 shadow-lg flex items-center justify-center text-2xl">
                  👩‍🎨
                </div>
                <p className="font-bold text-white text-sm">Anna Kowalska</p>
                <p className="text-white/70 text-[11px] text-center">Designerka & twórczyni treści ✨</p>

                {['🎨 Moje portfolio', '📺 YouTube', '📸 Instagram', '🛍️ Sklep online', '📧 Kontakt'].map((item, i) => (
                  <div key={i} className="w-full py-2.5 px-4 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-[11px] font-semibold text-center hover:bg-white/30 transition-all">
                    {item}
                  </div>
                ))}

                <div className="flex gap-3 mt-2">
                  {['𝕏', 'in', 'yt'].map((s, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white text-xs font-bold">
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
