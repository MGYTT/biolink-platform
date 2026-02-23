'use client'

import { useState } from 'react'
import { Badge }    from '@/components/ui/badge'
import { cn }       from '@/lib/utils'
import {
  ChevronDown, HelpCircle, MessageCircle,
  Zap, CreditCard, Globe, Shield,
  Lock, BarChart2, Layers,
} from 'lucide-react'
import Link from 'next/link'

/* ─────────────────────────────────────────
   Data
───────────────────────────────────────── */
interface FaqItem {
  id:       string
  question: string
  answer:   React.ReactNode
  icon:     React.ElementType
  category: 'general' | 'pricing' | 'features' | 'technical'
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id:       'what-is',
    category: 'general',
    icon:     HelpCircle,
    question: 'Czym jest BioLink?',
    answer: (
      <>
        BioLink to platforma do tworzenia stron <strong>link-in-bio</strong> — jednej strony
        z wszystkimi Twoimi linkami, którą możesz podać w opisie profilu na Instagramie,
        TikToku czy YouTube. Zamiast jednego linku, dajesz odbiorcom dostęp do całego
        Twojego świata: portfolio, sklepu, social mediów i więcej.
      </>
    ),
  },
  {
    id:       'free-plan',
    category: 'pricing',
    icon:     CreditCard,
    question: 'Co zawiera plan darmowy?',
    answer: (
      <>
        Plan Free jest naprawdę darmowy — bez limitu czasu i bez karty kredytowej.
        Zawiera <strong>1 stronę</strong>, do <strong>15 bloków</strong>,
        6 typów bloków (link, nagłówek, tekst, obraz, separator, social media)
        oraz podstawowe statystyki. Twoja strona dostępna jest pod adresem{' '}
        <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
          biolink.app/@twojanazwa
        </code>.
      </>
    ),
  },
  {
    id:       'pro-features',
    category: 'pricing',
    icon:     Zap,
    question: 'Co dodaje plan Pro?',
    answer: (
      <ul className="space-y-2 mt-1">
        {[
          'Nieograniczone strony i bloki',
          'Wszystkie 14 typów bloków — wideo, formularze, odliczanie, mapa, PDF, HTML i więcej',
          'Własna domena (np. linki.twojastrona.pl)',
          'Zaawansowane motywy, gradienty, własne kolory i CSS',
          'Harmonogram linków — ustaw od kiedy do kiedy blok jest widoczny',
          'Szczegółowa analityka — kraj, urządzenie, źródło ruchu',
          'Meta Pixel i Google Tag Manager',
          'White-label — usuń branding BioLink ze swojej strony',
        ].map(item => (
          <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
            <span className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <ChevronDown className="h-2.5 w-2.5 text-primary rotate-[-90deg]" />
            </span>
            {item}
          </li>
        ))}
      </ul>
    ),
  },
  {
    id:       'cancel',
    category: 'pricing',
    icon:     CreditCard,
    question: 'Czy mogę anulować subskrypcję?',
    answer: (
      <>
        Tak, możesz anulować w dowolnym momencie z poziomu{' '}
        <strong>portalu Stripe</strong> dostępnego w ustawieniach konta.
        Po anulowaniu masz dostęp do Pro do końca opłaconego okresu rozliczeniowego.
        Twoje strony i bloki <strong>nie zostaną usunięte</strong> — wrócisz
        do limitów planu Free.
      </>
    ),
  },
  {
    id:       'trial',
    category: 'pricing',
    icon:     Shield,
    question: 'Jak działa 14-dniowy okres próbny?',
    answer: (
      <>
        Po rejestracji i wyborze planu Pro masz <strong>14 dni za darmo</strong>.
        Karta kredytowa jest wymagana do rozpoczęcia próby, ale{' '}
        <strong>nie zostaniesz obciążony</strong> przez pierwsze 14 dni.
        Możesz anulować przed końcem okresu próbnego — bez żadnych opłat.
      </>
    ),
  },
  {
    id:       'custom-domain',
    category: 'features',
    icon:     Globe,
    question: 'Jak działa własna domena?',
    answer: (
      <>
        W planie Pro możesz podpiąć dowolną domenę lub subdomenę — np.{' '}
        <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
          links.twojastrona.pl
        </code>
        . Wystarczy dodać rekord <strong>CNAME</strong> u swojego dostawcy domeny
        wskazujący na{' '}
        <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
          cname.biolink.app
        </code>
        . Konfiguracja SSL odbywa się automatycznie.
      </>
    ),
  },
  {
    id:       'analytics',
    category: 'features',
    icon:     BarChart2,
    question: 'Jakie statystyki są dostępne?',
    answer: (
      <>
        <p className="text-muted-foreground">Plan Free: łączna liczba wyświetleń i kliknięć.</p>
        <p className="mt-2 text-muted-foreground">
          Plan Pro: szczegółowe statystyki z podziałem na{' '}
          <strong>kraj</strong>, <strong>urządzenie</strong>,{' '}
          <strong>źródło ruchu</strong> (direct, social, referral) oraz
          wykresy trendów. Dane przechowywane przez 12 miesięcy.
        </p>
      </>
    ),
  },
  {
    id:       'blocks',
    category: 'features',
    icon:     Layers,
    question: 'Ile typów bloków jest dostępnych?',
    answer: (
      <div className="space-y-2">
        <p className="text-muted-foreground">
          Dostępnych jest <strong>14 typów bloków</strong>:
        </p>
        <div className="grid grid-cols-2 gap-1 mt-2">
          {[
            ['🔗', 'Link'],
            ['📝', 'Nagłówek'],
            ['💬', 'Tekst'],
            ['🖼️', 'Obraz'],
            ['📱', 'Social Media'],
            ['➖', 'Separator'],
            ['🎬', 'Wideo — Pro'],
            ['🎵', 'Muzyka — Pro'],
            ['⏱️', 'Odliczanie — Pro'],
            ['📋', 'Formularz — Pro'],
            ['📍', 'Mapa — Pro'],
            ['📄', 'PDF — Pro'],
            ['🛍️', 'Produkt — Pro'],
            ['⚡', 'HTML — Pro'],
          ].map(([emoji, label]) => (
            <div key={label} className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="text-sm">{emoji}</span>
              <span className={cn(label.includes('Pro') && 'text-amber-600 dark:text-amber-400 font-medium')}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id:       'security',
    category: 'technical',
    icon:     Lock,
    question: 'Czy moje dane są bezpieczne?',
    answer: (
      <>
        Tak. Dane przechowujemy na serwerach w <strong>Unii Europejskiej</strong>{' '}
        (Supabase EU region). Wszystkie połączenia szyfrowane są przez{' '}
        <strong>SSL/TLS</strong>. Płatności obsługuje{' '}
        <strong>Stripe</strong> — BioLink nigdy nie przechowuje danych kart
        płatniczych. Jesteśmy zgodni z <strong>RODO</strong>.
      </>
    ),
  },
]

const CATEGORIES = [
  { id: 'all',       label: 'Wszystkie'  },
  { id: 'general',   label: 'Ogólne'     },
  { id: 'pricing',   label: 'Cennik'     },
  { id: 'features',  label: 'Funkcje'    },
  { id: 'technical', label: 'Techniczne' },
] as const

type Category = typeof CATEGORIES[number]['id']

/* ─────────────────────────────────────────
   AccordionItem
───────────────────────────────────────── */
function AccordionItem({
  item,
  isOpen,
  onToggle,
}: {
  item:     FaqItem
  isOpen:   boolean
  onToggle: () => void
}) {
  const Icon = item.icon

  return (
    <div className={cn(
      'rounded-xl border transition-all duration-200',
      isOpen
        ? 'border-primary/30 bg-primary/[0.02] shadow-sm'
        : 'border-border bg-card hover:border-primary/20 hover:shadow-sm',
    )}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-4 px-5 py-4 text-left"
        aria-expanded={isOpen}
      >
        {/* Icon */}
        <span className={cn(
          'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors',
          isOpen
            ? 'bg-primary/10'
            : 'bg-muted',
        )}>
          <Icon className={cn(
            'h-4 w-4 transition-colors',
            isOpen ? 'text-primary' : 'text-muted-foreground',
          )} />
        </span>

        {/* Question */}
        <span className={cn(
          'flex-1 text-sm font-semibold leading-snug transition-colors',
          isOpen ? 'text-primary' : 'text-foreground',
        )}>
          {item.question}
        </span>

        {/* Chevron */}
        <ChevronDown className={cn(
          'h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform duration-300',
          isOpen && 'rotate-180 text-primary',
        )} />
      </button>

      {/* Answer — CSS height trick for smooth animation */}
      <div className={cn(
        'grid transition-all duration-300 ease-in-out',
        isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
      )}>
        <div className="overflow-hidden">
          <div className="px-5 pb-5 pt-1 ml-12 text-sm text-muted-foreground leading-relaxed">
            {item.answer}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   Main component
───────────────────────────────────────── */
export function FaqSection() {
  const [openId,   setOpenId]   = useState<string | null>('what-is')
  const [category, setCategory] = useState<Category>('all')

  const filtered = category === 'all'
    ? FAQ_ITEMS
    : FAQ_ITEMS.filter(item => item.category === category)

  function toggle(id: string) {
    setOpenId(prev => prev === id ? null : id)
  }

  return (
    <section id="faq" className="py-24 sm:py-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* ── Header ── */}
        <div className="text-center mb-12">
          <Badge
            variant="outline"
            className="mb-4 gap-2 px-3 py-1.5 text-xs font-medium"
          >
            <HelpCircle className="h-3.5 w-3.5 text-primary" />
            Masz pytania?
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Najczęstsze{' '}
            <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              pytania
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
            Wszystko co powinieneś wiedzieć zanim zaczniesz.
            Nie znalazłeś odpowiedzi?{' '}
            <Link
              href="/contact"
              className="text-primary hover:underline font-medium underline-offset-4"
            >
              Napisz do nas
            </Link>
            .
          </p>
        </div>

        {/* ── Category filter ── */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setCategory(cat.id)
                setOpenId(null)
              }}
              className={cn(
                'px-4 py-1.5 rounded-full text-sm font-medium transition-all border',
                category === cat.id
                  ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                  : 'bg-background text-muted-foreground border-border hover:border-primary/40 hover:text-foreground',
              )}
            >
              {cat.label}
              {cat.id !== 'all' && (
                <span className={cn(
                  'ml-2 text-xs',
                  category === cat.id ? 'text-primary-foreground/70' : 'text-muted-foreground/60',
                )}>
                  {FAQ_ITEMS.filter(i => i.category === cat.id).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Accordion list ── */}
        <div className="space-y-2">
          {filtered.map(item => (
            <AccordionItem
              key={item.id}
              item={item}
              isOpen={openId === item.id}
              onToggle={() => toggle(item.id)}
            />
          ))}
        </div>

        {/* ── Bottom CTA ── */}
        <div className="mt-14 text-center p-8 rounded-2xl border bg-muted/30">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-bold text-lg mb-2">Nadal masz pytania?</h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">
            Nasz zespół odpowiada w ciągu kilku godzin w dni robocze.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="mailto:hello@biolink.app"
              className={cn(
                'inline-flex items-center justify-center gap-2 rounded-lg',
                'px-5 py-2.5 text-sm font-semibold',
                'bg-primary text-primary-foreground',
                'hover:bg-primary/90 transition-colors shadow-sm',
              )}
            >
              Napisz do nas
            </Link>
            <Link
              href="/docs"
              className={cn(
                'inline-flex items-center justify-center gap-2 rounded-lg',
                'px-5 py-2.5 text-sm font-semibold',
                'border bg-background hover:bg-accent',
                'transition-colors',
              )}
            >
              Dokumentacja
            </Link>
          </div>
        </div>

      </div>
    </section>
  )
}
