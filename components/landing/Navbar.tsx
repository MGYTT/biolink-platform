'use client'

import Link       from 'next/link'
import { useState, useEffect, useCallback } from 'react'
import {
  Link2, Menu, X, ArrowRight, Sparkles,
} from 'lucide-react'
import { Button }      from '@/components/ui/button'
import { Badge }       from '@/components/ui/badge'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { cn }          from '@/lib/utils'

/* ─────────────────────────────────────────
   Data
───────────────────────────────────────── */
const NAV_LINKS = [
  { label: 'Funkcje',       href: '#features'     },
  { label: 'Jak to działa', href: '#how-it-works' },
  { label: 'Cennik',        href: '#pricing'      },
  { label: 'FAQ',           href: '#faq'          },
] as const

/* ─────────────────────────────────────────
   Hook — active section tracker
───────────────────────────────────────── */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string>('')

  useEffect(() => {
    const observers = ids.map(id => {
      const el = document.getElementById(id)
      if (!el) return null

      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(`#${id}`) },
        { rootMargin: '-40% 0px -55% 0px' },
      )
      observer.observe(el)
      return observer
    })

    return () => observers.forEach(o => o?.disconnect())
  }, [ids])

  return active
}

/* ─────────────────────────────────────────
   Main component
───────────────────────────────────────── */
export function Navbar() {
  const [scrolled,    setScrolled]    = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)
  const [scrollPct,   setScrollPct]   = useState(0)

  const sectionIds = NAV_LINKS
    .filter(l => l.href.startsWith('#'))
    .map(l => l.href.slice(1))

  const activeSection = useActiveSection(sectionIds)

  /* Scroll handler */
  const handleScroll = useCallback(() => {
    const y   = window.scrollY
    const max = document.body.scrollHeight - window.innerHeight
    setScrolled(y > 20)
    setScrollPct(max > 0 ? Math.min(100, (y / max) * 100) : 0)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  /* Lock body scroll when mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  /* Close mobile menu on resize → md+ */
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMobileOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  function closeMobile() { setMobileOpen(false) }

  return (
    <>
      <header className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-background/85 backdrop-blur-xl border-b shadow-sm'
          : 'bg-transparent',
      )}>

        {/* ── Progress bar ── */}
        <div
          className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-primary to-purple-500 transition-all duration-150 z-10"
          style={{ width: `${scrollPct}%` }}
          role="progressbar"
          aria-valuenow={Math.round(scrollPct)}
          aria-valuemin={0}
          aria-valuemax={100}
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">

          {/* ── Logo ── */}
          <Link
            href="/"
            className="flex items-center gap-2.5 font-extrabold text-lg flex-shrink-0 group"
            aria-label="BioLink — strona główna"
          >
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center transition-transform group-hover:scale-105 flex-shrink-0">
              <Link2 className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="tracking-tight">BioLink</span>
            <Badge className="hidden sm:flex text-[9px] h-4 px-1.5 bg-amber-500 hover:bg-amber-500 text-white font-bold">
              BETA
            </Badge>
          </Link>

          {/* ── Desktop nav ── */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Nawigacja główna">
            {NAV_LINKS.map(link => {
              const isActive = activeSection === link.href
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'text-foreground bg-accent'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/60',
                  )}
                >
                  {link.label}
                  {/* Active dot */}
                  {isActive && (
                    <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                  )}
                </a>
              )
            })}
          </nav>

          {/* ── Desktop actions ── */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            <ThemeToggle />
            <Button variant="ghost" size="sm" asChild className="font-medium">
              <Link href="/login">Zaloguj się</Link>
            </Button>
            <Button
              size="sm"
              asChild
              className="gap-1.5 font-semibold shadow-sm shadow-primary/20 hover:shadow-primary/30 transition-shadow"
            >
              <Link href="/register">
                <Sparkles className="h-3.5 w-3.5" />
                Zacznij za darmo
              </Link>
            </Button>
          </div>

          {/* ── Mobile controls ── */}
          <div className="flex items-center gap-1.5 md:hidden flex-shrink-0">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => setMobileOpen(prev => !prev)}
              aria-label={mobileOpen ? 'Zamknij menu' : 'Otwórz menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              <Menu className={cn(
                'h-5 w-5 absolute transition-all duration-200',
                mobileOpen ? 'opacity-0 rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100',
              )} />
              <X className={cn(
                'h-5 w-5 absolute transition-all duration-200',
                mobileOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75',
              )} />
            </Button>
          </div>
        </div>
      </header>

      {/* ── Mobile menu overlay ── */}
      <div
        className={cn(
          'fixed inset-0 z-40 md:hidden transition-all duration-300',
          mobileOpen ? 'visible' : 'invisible',
        )}
      >
        {/* Backdrop */}
        <div
          className={cn(
            'absolute inset-0 bg-background/60 backdrop-blur-sm transition-opacity duration-300',
            mobileOpen ? 'opacity-100' : 'opacity-0',
          )}
          onClick={closeMobile}
          aria-hidden
        />

        {/* Drawer */}
        <nav
          id="mobile-menu"
          aria-label="Menu mobilne"
          className={cn(
            'absolute top-16 left-0 right-0 bg-background border-b shadow-xl',
            'transition-all duration-300 ease-in-out',
            mobileOpen
              ? 'translate-y-0 opacity-100'
              : '-translate-y-4 opacity-0',
          )}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col gap-1">

            {/* Nav links */}
            {NAV_LINKS.map((link, i) => {
              const isActive = activeSection === link.href
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={closeMobile}
                  className={cn(
                    'flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all',
                    'hover:bg-accent',
                    isActive
                      ? 'bg-accent text-foreground'
                      : 'text-muted-foreground',
                    'animate-in fade-in slide-in-from-top-2',
                  )}
                  style={{ animationDelay: `${i * 40}ms`, animationFillMode: 'both' }}
                >
                  {link.label}
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
                </a>
              )
            })}

            {/* Divider */}
            <div className="h-px bg-border my-2" />

            {/* Auth buttons */}
            <div className="flex flex-col gap-2 pb-2">
              <Button variant="outline" asChild className="w-full">
                <Link href="/login" onClick={closeMobile}>
                  Zaloguj się
                </Link>
              </Button>
              <Button asChild className="w-full gap-2 font-semibold">
                <Link href="/register" onClick={closeMobile}>
                  <Sparkles className="h-4 w-4" />
                  Zacznij za darmo
                  <ArrowRight className="h-4 w-4 ml-auto" />
                </Link>
              </Button>
            </div>

            {/* Trust note */}
            <p className="text-center text-[11px] text-muted-foreground pb-1">
              Bez karty kredytowej · 14 dni Pro gratis
            </p>
          </div>
        </nav>
      </div>
    </>
  )
}
