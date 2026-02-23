'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Link2, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { cn } from '@/lib/utils'

const navLinks = [
  { label: 'Funkcje',  href: '#features'  },
  { label: 'Jak to działa', href: '#how-it-works' },
  { label: 'Cennik',   href: '#pricing'   },
  { label: 'FAQ',      href: '#faq'       },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      scrolled
        ? 'bg-background/80 backdrop-blur-md border-b shadow-sm'
        : 'bg-transparent'
    )}>
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <div className="p-1.5 rounded-lg bg-primary text-primary-foreground">
            <Link2 className="h-4 w-4" />
          </div>
          BioLink
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Przyciski */}
        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Zaloguj się</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/register">Zacznij za darmo →</Link>
          </Button>
        </div>

        {/* Mobile hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost" size="icon"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background border-b px-4 pb-4 flex flex-col gap-3">
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm py-2 border-b last:border-0"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <Button size="sm" asChild className="mt-2">
            <Link href="/register">Zacznij za darmo →</Link>
          </Button>
        </div>
      )}
    </header>
  )
}
