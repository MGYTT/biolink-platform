'use client'

import { useRef, useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import {
  Globe, Lock, Search, Image as ImageIcon,
  Link2, User, FileText, Eye, EyeOff,
  Copy, Check, ExternalLink, Sparkles, Info,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Page } from '@/types'

/* ─────────────────────────────────────────
   Types & helpers
───────────────────────────────────────── */
interface PageSettingsProps {
  page: Page
  onUpdate: (updates: Partial<Page>) => void
  isPro: boolean
}

function SectionLabel({
  icon: Icon,
  children,
}: {
  icon: React.ElementType
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Icon className="h-3.5 w-3.5 text-primary" />
      </span>
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {children}
      </span>
    </div>
  )
}

function FieldLabel({
  children,
  hint,
  pro,
}: {
  children: React.ReactNode
  hint?: string
  pro?: boolean
}) {
  return (
    <div className="flex items-center gap-1.5 mb-1.5">
      <Label className="text-xs font-medium">{children}</Label>
      {pro && (
        <Badge className="text-[9px] px-1.5 py-0 h-4 bg-amber-500 hover:bg-amber-500 text-white font-bold">
          PRO
        </Badge>
      )}
      {hint && (
        <span
          className="text-muted-foreground cursor-help"
          title={hint}
        >
          <Info className="h-3 w-3" />
        </span>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────
   Avatar preview with error fallback
───────────────────────────────────────── */
function AvatarPreview({ src }: { src: string }) {
  const [error, setError] = useState(false)

  if (error) return (
    <div className="w-14 h-14 rounded-full border bg-muted flex items-center justify-center mt-2">
      <User className="h-5 w-5 text-muted-foreground" />
    </div>
  )

  return (
    <img
      src={src}
      alt="Podgląd avatara"
      className="w-14 h-14 rounded-full object-cover border-2 border-border mt-2 shadow-sm"
      onError={() => setError(true)}
    />
  )
}

/* ─────────────────────────────────────────
   SEO Preview card
───────────────────────────────────────── */
function SeoPreview({ title, description, slug }: {
  title: string
  description: string
  slug: string
}) {
  const displayTitle       = title.trim()       || 'Tytuł strony'
  const displayDescription = description.trim() || 'Opis strony pojawi się tutaj w wynikach Google.'

  return (
    <div className="rounded-lg border bg-card p-3 space-y-0.5">
      <p className="text-[11px] text-muted-foreground truncate">
        biolink.app/@{slug}
      </p>
      <p className="text-sm font-medium text-blue-600 dark:text-blue-400 truncate leading-tight">
        {displayTitle}
      </p>
      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
        {displayDescription}
      </p>
    </div>
  )
}

/* ─────────────────────────────────────────
   Main component
───────────────────────────────────────── */
export function PageSettings({ page, onUpdate, isPro }: PageSettingsProps) {
  const [copied, setCopied] = useState(false)
  const [showSeoPreview, setShowSeoPreview] = useState(false)
  const publicUrl = `https://biolink.app/@${page.slug}`

  async function copyUrl() {
    await navigator.clipboard.writeText(publicUrl)
    setCopied(true)
    toast.success('Skopiowano link!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 space-y-6">

        {/* ── Podstawowe informacje ── */}
        <section>
          <SectionLabel icon={User}>Profil strony</SectionLabel>

          <div className="space-y-4">
            <div>
              <FieldLabel>Tytuł strony</FieldLabel>
              <Input
                value={page.title}
                onChange={e => onUpdate({ title: e.target.value })}
                placeholder="Moja strona"
                className="h-9"
                maxLength={60}
              />
              <p className="text-[10px] text-muted-foreground mt-1 text-right">
                {page.title.length}/60
              </p>
            </div>

            <div>
              <FieldLabel hint="Pojawia się pod tytułem na Twojej publicznej stronie">
                Opis / Podtytuł
              </FieldLabel>
              <Textarea
                value={page.description ?? ''}
                onChange={e => onUpdate({ description: e.target.value || null })}
                placeholder="Krótki opis, bio lub tagline…"
                className="text-sm resize-none min-h-[72px]"
                maxLength={160}
              />
              <p className="text-[10px] text-muted-foreground mt-1 text-right">
                {(page.description ?? '').length}/160
              </p>
            </div>

            <div>
              <FieldLabel hint="URL do zdjęcia profilowego wyświetlanego na stronie">
                Zdjęcie profilowe
              </FieldLabel>
              <Input
                value={page.profile_pic ?? ''}
                onChange={e => onUpdate({ profile_pic: e.target.value || null })}
                placeholder="https://..."
                className="h-9 text-sm font-mono"
              />
              {page.profile_pic && <AvatarPreview src={page.profile_pic} />}
            </div>
          </div>
        </section>

        <Separator />

        {/* ── Publikacja ── */}
        <section>
          <SectionLabel icon={Globe}>Publikacja</SectionLabel>

          <div className={cn(
            'flex items-center justify-between p-3 rounded-xl border transition-colors',
            page.is_published
              ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900'
              : 'bg-muted/30'
          )}>
            <div className="flex items-center gap-3">
              <div className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors',
                page.is_published
                  ? 'bg-emerald-100 dark:bg-emerald-900'
                  : 'bg-muted'
              )}>
                {page.is_published
                  ? <Eye className="h-4 w-4 text-emerald-600" />
                  : <EyeOff className="h-4 w-4 text-muted-foreground" />
                }
              </div>
              <div>
                <p className="text-sm font-medium">
                  {page.is_published ? 'Strona publiczna' : 'Strona ukryta'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {page.is_published
                    ? `Widoczna pod /@${page.slug}`
                    : 'Nikt nie może jej teraz zobaczyć'
                  }
                </p>
              </div>
            </div>
            <Switch
              checked={page.is_published}
              onCheckedChange={v => onUpdate({ is_published: v })}
            />
          </div>
        </section>

        <Separator />

        {/* ── SEO ── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <SectionLabel icon={Search}>SEO & Social</SectionLabel>
            <button
              type="button"
              onClick={() => setShowSeoPreview(v => !v)}
              className="text-[10px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              <Eye className="h-3 w-3" />
              {showSeoPreview ? 'Ukryj' : 'Podgląd Google'}
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <FieldLabel hint="Tytuł wyświetlany w wynikach Google (max 60 znaków)">
                Meta tytuł
              </FieldLabel>
              <Input
                value={page.seo_title ?? ''}
                onChange={e => onUpdate({ seo_title: e.target.value || null })}
                placeholder={page.title}
                className="h-9 text-sm"
                maxLength={60}
              />
              <p className="text-[10px] text-muted-foreground mt-1 text-right">
                {(page.seo_title ?? '').length}/60
              </p>
            </div>

            <div>
              <FieldLabel hint="Opis w wynikach wyszukiwania (max 160 znaków)">
                Meta opis
              </FieldLabel>
              <Textarea
                value={page.seo_desc ?? ''}
                onChange={e => onUpdate({ seo_desc: e.target.value || null })}
                placeholder="Opis strony dla Google…"
                className="text-sm resize-none min-h-[64px]"
                maxLength={160}
              />
              <p className="text-[10px] text-muted-foreground mt-1 text-right">
                {(page.seo_desc ?? '').length}/160
              </p>
            </div>

            {/* Google preview */}
            {showSeoPreview && (
              <div className="animate-fade-in">
                <p className="text-[10px] text-muted-foreground mb-1.5 flex items-center gap-1">
                  <Search className="h-2.5 w-2.5" /> Podgląd wyniku w Google
                </p>
                <SeoPreview
                  title={page.seo_title ?? page.title}
                  description={page.seo_desc ?? page.description ?? ''}
                  slug={page.slug}
                />
              </div>
            )}

            {/* OG Image — Pro only */}
            <div className={cn(!isPro && 'opacity-60')}>
              <FieldLabel
                pro={!isPro}
                hint="Obraz wyświetlany przy udostępnianiu na social mediach"
              >
                Social media obraz (OG Image)
              </FieldLabel>
              <div className="relative">
                <ImageIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  value={page.meta_image ?? ''}
                  onChange={e => isPro && onUpdate({ meta_image: e.target.value || null })}
                  placeholder="https://..."
                  className="h-9 text-sm pl-8"
                  disabled={!isPro}
                />
              </div>
              {!isPro && (
                <p className="text-[10px] text-muted-foreground mt-1.5 flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-amber-500" />
                  Dostępne w planie Pro
                </p>
              )}
            </div>
          </div>
        </section>

        <Separator />

        {/* ── Adres URL ── */}
        <section>
          <SectionLabel icon={Link2}>Adres URL</SectionLabel>

          <div className="rounded-xl border bg-muted/30 p-3 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-1.5 min-w-0">
                <Globe className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                <span className="text-xs font-mono truncate text-foreground">
                  {publicUrl}
                </span>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={copyUrl}
                  title="Kopiuj link"
                >
                  {copied
                    ? <Check className="h-3.5 w-3.5 text-emerald-500" />
                    : <Copy className="h-3.5 w-3.5" />
                  }
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  asChild
                  title="Otwórz w nowej karcie"
                >
                  <a href={publicUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </Button>
              </div>
            </div>

            <p className="text-[10px] text-muted-foreground flex items-center gap-1.5">
              <Lock className="h-2.5 w-2.5" />
              Zmiana slug dostępna w ustawieniach konta
            </p>
          </div>
        </section>

      </div>
    </div>
  )
}
