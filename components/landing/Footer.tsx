import Link from 'next/link'
import { Link2, ExternalLink, Heart } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Badge }     from '@/components/ui/badge'

/* ─────────────────────────────────────────
   Data
───────────────────────────────────────── */
const NAV_COLUMNS = [
  {
    heading: 'Produkt',
    links: [
      { label: 'Funkcje',          href: '#features'           },
      { label: 'Cennik',           href: '#pricing'            },
      { label: 'Jak to działa?',   href: '#how-it-works'       },
      { label: 'FAQ',              href: '#faq'                },
    ],
  },
  {
    heading: 'Konto',
    links: [
      { label: 'Zaloguj się',      href: '/login'              },
      { label: 'Rejestracja',      href: '/register'           },
      { label: 'Dashboard',        href: '/dashboard'          },
      { label: 'Upgrade do Pro',   href: '/dashboard/upgrade'  },
    ],
  },
  {
    heading: 'Zasoby',
    links: [
      { label: 'Dokumentacja',     href: '/docs'               },
      { label: 'Blog',             href: '/blog'               },
      { label: 'Centrum pomocy',   href: '/dashboard/help'     },
      { label: 'Status systemu',   href: 'https://status.biolink.app', external: true },
    ],
  },
  {
    heading: 'Firma',
    links: [
      { label: 'O nas',            href: '/about'              },
      { label: 'Kontakt',          href: '/contact'            },
      { label: 'Polityka prywat.', href: '/privacy'            },
      { label: 'Regulamin',        href: '/terms'              },
    ],
  },
] as const

const SOCIAL_LINKS = [
  {
    label: 'X (Twitter)',
    href:  'https://x.com/biolink',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href:  'https://instagram.com/biolink',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href:  'https://linkedin.com/company/biolink',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
] as const

const TRUST_BADGES = [
  { label: 'SSL',   title: 'Szyfrowane połączenie' },
  { label: 'RODO',  title: 'Zgodny z RODO'          },
  { label: 'UE',    title: 'Dane w Unii Europejskiej'},
] as const

/* ─────────────────────────────────────────
   Main component
───────────────────────────────────────── */
export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t bg-background">

      {/* ── Main footer content ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-14 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-12">

          {/* Brand column — spans 2 cols */}
          <div className="col-span-2 flex flex-col gap-5">

            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 w-fit group"
              aria-label="BioLink — strona główna"
            >
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center transition-transform group-hover:scale-105">
                <Link2 className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-extrabold text-lg tracking-tight">BioLink</span>
            </Link>

            {/* Tagline */}
            <p className="text-sm text-muted-foreground leading-relaxed max-w-[220px]">
              Jedna strona z wszystkimi Twoimi linkami. Stwórz, opublikuj, rozwijaj.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-2">
              {SOCIAL_LINKS.map(social => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-8 h-8 rounded-lg border bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-accent transition-all"
                >
                  {social.icon}
                </a>
              ))}
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-1.5">
              {TRUST_BADGES.map(badge => (
                <Badge
                  key={badge.label}
                  variant="outline"
                  title={badge.title}
                  className="text-[9px] h-5 px-2 font-bold text-muted-foreground cursor-default"
                >
                  {badge.label}
                </Badge>
              ))}
              <Badge
                variant="outline"
                className="text-[9px] h-5 px-2 font-bold border-amber-300 text-amber-600 dark:border-amber-800 dark:text-amber-400 cursor-default"
                title="14 dni darmowego okresu próbnego"
              >
                14 dni free
              </Badge>
            </div>
          </div>

          {/* Nav columns */}
          {NAV_COLUMNS.map(col => (
            <div key={col.heading} className="flex flex-col gap-4">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {col.heading}
              </p>
              <ul className="flex flex-col gap-2.5">
                {col.links.map(link => (
                  <li key={link.label}>
                    {'external' in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 group"
                      >
                        {link.label}
                        <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-60 transition-opacity" />
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* ── Bottom bar ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">

          {/* Copyright */}
          <p className="text-xs text-muted-foreground flex items-center gap-1.5 flex-wrap justify-center sm:justify-start">
            © {year} BioLink. Wszelkie prawa zastrzeżone.
            <span className="hidden sm:inline text-muted-foreground/30">·</span>
            <span className="flex items-center gap-1">
              Zrobione z{' '}
              <Heart className="h-3 w-3 text-red-500 fill-red-500 inline-block" />
              {' '}w Polsce
            </span>
          </p>

          {/* Legal links */}
          <div className="flex items-center gap-4">
            {[
              { label: 'Prywatność', href: '/privacy' },
              { label: 'Regulamin',  href: '/terms'   },
              { label: 'Cookies',    href: '/cookies' },
            ].map(link => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Stripe badge */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground/60">
            <svg viewBox="0 0 60 25" className="h-5 fill-current opacity-40" aria-label="Stripe">
              <path d="M59.64 14.28h-8.06v-1.83c0-.91.38-1.36 1.14-1.36.77 0 1.14.45 1.14 1.36v.49h5.78v-.49c0-3.43-1.9-5.1-6.92-5.1-4.97 0-6.92 1.67-6.92 5.1v3.5c0 3.38 1.95 5.1 6.92 5.1 4.97 0 6.92-1.72 6.92-5.1v-1.67zm-8.06 1.83v1.67c0 .91-.37 1.36-1.14 1.36-.76 0-1.14-.45-1.14-1.36v-1.67h2.28zM36.74 7.38c-1.67 0-2.97.71-3.64 1.71V7.61h-5.78V21h5.78v-7.48c0-1.22.64-1.83 1.7-1.83 1.07 0 1.57.56 1.57 1.72V21h5.78v-8.69c0-3.34-1.81-4.93-5.41-4.93zM20.4 3.85l-5.78 1.27V21h5.78V3.85zM9.25 11.93c-1.2-.38-1.8-.56-1.8-1.12 0-.46.4-.72 1.17-.72.76 0 1.37.31 1.83.93l3.68-2.21C13.06 7.1 11.18 6.1 8.62 6.1c-3.73 0-6.05 1.92-6.05 4.97 0 2.84 1.84 4.09 5.01 4.97 1.44.4 2.2.63 2.2 1.24 0 .5-.43.77-1.28.77-.98 0-1.84-.38-2.46-1.14L2.4 19.26c1.22 1.83 3.24 2.74 6.18 2.74 3.98 0 6.42-1.92 6.42-5.16 0-2.89-2.02-4.19-5.75-4.91z"/>
            </svg>
            Bezpieczne płatności
          </div>
        </div>
      </div>
    </footer>
  )
}
