'use client'

import { useState } from 'react'
import { Label }     from '@/components/ui/label'
import { Badge }     from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button }    from '@/components/ui/button'
import { cn }        from '@/lib/utils'
import {
  Sparkles, ChevronDown, Palette, Type,
  Square, ImageIcon, Lock,
} from 'lucide-react'

import { ColorPicker }     from './pro/ColorPicker'
import { GradientBuilder } from './pro/GradientBuilder'
import { FontPicker }      from './pro/FontPicker'
import { AnimationPicker } from './pro/AnimationPicker'
import { CustomCssEditor } from './pro/CustomCssEditor'

import type { Page, Theme, ButtonStyle, BgType } from '@/types'

/* ─────────────────────────────────────────
   Data
───────────────────────────────────────── */
const THEMES: {
  id: Theme
  label: string
  colors: [string, string]   // [bg, accent]
}[] = [
  { id: 'default', label: 'Domyślny', colors: ['#ffffff', '#111827'] },
  { id: 'dark',    label: 'Ciemny',   colors: ['#111827', '#f9fafb'] },
  { id: 'purple',  label: 'Purple',   colors: ['#7c3aed', '#ddd6fe'] },
  { id: 'ocean',   label: 'Ocean',    colors: ['#2563eb', '#bfdbfe'] },
  { id: 'sunset',  label: 'Sunset',   colors: ['#f97316', '#fed7aa'] },
  { id: 'forest',  label: 'Forest',   colors: ['#15803d', '#bbf7d0'] },
]

const BUTTON_STYLES: {
  id: ButtonStyle
  label: string
  className: string
  description: string
}[] = [
  { id: 'rounded',     label: 'Zaokrąglone', className: 'rounded-lg',   description: 'Standardowe' },
  { id: 'pill',        label: 'Pill',         className: 'rounded-full', description: 'Bardzo okrągłe' },
  { id: 'square',      label: 'Kwadratowe',   className: 'rounded-none', description: 'Ostre rogi' },
  { id: 'outline',     label: 'Outline',      className: 'rounded-lg',   description: 'Przeźroczyste' },
  { id: 'soft-shadow', label: 'Shadow',       className: 'rounded-lg',   description: 'Z cieniem' },
]

const FONTS: {
  id: Page['font_family']
  label: string
  sample: string
  className: string
}[] = [
  { id: 'inter',    label: 'Inter',    sample: 'Nowoczesny',    className: 'font-sans'  },
  { id: 'poppins',  label: 'Poppins',  sample: 'Przyjazny',     className: 'font-sans'  },
  { id: 'playfair', label: 'Playfair', sample: 'Elegancki',     className: 'font-serif' },
  { id: 'serif',    label: 'Serif',    sample: 'Klasyczny',     className: 'font-serif' },
  { id: 'mono',     label: 'Mono',     sample: 'Techniczny',    className: 'font-mono'  },
]

const BG_TYPES: { id: BgType; label: string; icon: React.ElementType; pro?: boolean }[] = [
  { id: 'solid',    label: 'Jednolity', icon: Square    },
  { id: 'gradient', label: 'Gradient',  icon: Palette,    pro: true },
  { id: 'image',    label: 'Obraz',     icon: ImageIcon,  pro: true },
]

/* ─────────────────────────────────────────
   Sub-components
───────────────────────────────────────── */
function SectionLabel({
  icon: Icon,
  children,
}: {
  icon: React.ElementType
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Icon className="h-3 w-3 text-primary" />
      </span>
      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {children}
      </span>
    </div>
  )
}

function ProSection({
  open,
  onToggle,
  children,
}: {
  open: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-amber-200 dark:border-amber-900/60 overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20 hover:from-amber-100 dark:hover:from-amber-950/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
            Pro — zaawansowane
          </span>
        </div>
        <ChevronDown className={cn(
          'h-4 w-4 text-amber-500 transition-transform duration-200',
          open && 'rotate-180',
        )} />
      </button>

      {open && (
        <div className="p-4 space-y-5 animate-fade-in">
          {children}
        </div>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────
   Main component
───────────────────────────────────────── */
export function DesignPanel({ page, onUpdate, isPro }: DesignPanelProps) {
  const [proOpen, setProOpen] = useState(isPro)

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 space-y-6">

        {/* ── Motyw ── */}
        <section>
          <SectionLabel icon={Palette}>Motyw kolorystyczny</SectionLabel>
          <div className="grid grid-cols-3 gap-2">
            {THEMES.map(theme => {
              const isActive = page.theme === theme.id
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => onUpdate({ theme: theme.id })}
                  className={cn(
                    'flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all group',
                    isActive
                      ? 'border-primary ring-2 ring-primary/20 shadow-sm'
                      : 'border-border hover:border-primary/40 hover:shadow-sm',
                  )}
                >
                  {/* Two-tone color swatch */}
                  <div
                    className="w-full h-8 rounded-lg overflow-hidden flex"
                    style={{ border: `1px solid ${theme.colors[0]}22` }}
                  >
                    <div className="flex-1" style={{ background: theme.colors[0] }} />
                    <div className="flex-1" style={{ background: theme.colors[1] }} />
                  </div>
                  <span className={cn(
                    'text-[10px] font-medium transition-colors',
                    isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground',
                  )}>
                    {theme.label}
                  </span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
                </button>
              )
            })}
          </div>
        </section>

        <Separator />

        {/* ── Styl przycisków ── */}
        <section>
          <SectionLabel icon={Square}>Styl przycisków</SectionLabel>
          <div className="grid grid-cols-1 gap-1.5">
            {BUTTON_STYLES.map(style => {
              const isActive = page.button_style === style.id
              return (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => onUpdate({ button_style: style.id })}
                  className={cn(
                    'flex items-center gap-3 p-2.5 rounded-xl border-2 transition-all text-left group',
                    isActive
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-border hover:border-primary/40',
                  )}
                >
                  {/* Live preview */}
                  <div className={cn(
                    'h-6 w-16 flex-shrink-0 bg-primary/80 transition-shadow',
                    style.className,
                    style.id === 'outline'     && 'bg-transparent border-2 border-primary',
                    style.id === 'soft-shadow' && 'shadow-md shadow-primary/30',
                  )} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold leading-tight">{style.label}</p>
                    <p className="text-[10px] text-muted-foreground">{style.description}</p>
                  </div>
                  {isActive && (
                    <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                  )}
                </button>
              )
            })}
          </div>
        </section>

        <Separator />

        {/* ── Czcionka ── */}
        <section>
          <SectionLabel icon={Type}>Czcionka</SectionLabel>
          <div className="grid grid-cols-1 gap-1.5">
            {FONTS.map(font => {
              const isActive = page.font_family === font.id
              return (
                <button
                  key={font.id}
                  type="button"
                  onClick={() => onUpdate({ font_family: font.id })}
                  className={cn(
                    'flex items-center justify-between px-3 py-2.5 rounded-xl border-2 transition-all group',
                    isActive
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-border hover:border-primary/40',
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className={cn('text-lg font-bold leading-none text-primary/70', font.className)}>
                      Aa
                    </span>
                    <div>
                      <p className={cn('text-sm font-semibold', font.className)}>{font.label}</p>
                      <p className="text-[10px] text-muted-foreground">{font.sample}</p>
                    </div>
                  </div>
                  {isActive && (
                    <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                  )}
                </button>
              )
            })}
          </div>
        </section>

        <Separator />

        {/* ── Typ tła ── */}
        <section>
          <SectionLabel icon={ImageIcon}>Tło strony</SectionLabel>

          {/* BgType selector */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {BG_TYPES.map(bg => {
              const locked   = bg.pro && !isPro
              const isActive = page.bg_type === bg.id
              const Icon     = bg.icon
              return (
                <button
                  key={bg.id}
                  type="button"
                  onClick={() => !locked && onUpdate({ bg_type: bg.id })}
                  disabled={locked}
                  className={cn(
                    'relative flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all',
                    isActive
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-border hover:border-primary/40',
                    locked && 'opacity-50 cursor-not-allowed hover:border-border',
                  )}
                >
                  <Icon className={cn('h-4 w-4', isActive ? 'text-primary' : 'text-muted-foreground')} />
                  <span className="text-[10px] font-medium">{bg.label}</span>
                  {locked && (
                    <Badge className="absolute -top-2 -right-2 text-[8px] px-1 h-4 bg-amber-500 hover:bg-amber-500 text-white font-bold gap-0.5">
                      <Lock className="h-2 w-2" />PRO
                    </Badge>
                  )}
                </button>
              )
            })}
          </div>

          {/* Solid color picker */}
          {(!page.bg_type || page.bg_type === 'solid') && (
            <div className="space-y-2 animate-fade-in">
              <Label className="text-xs text-muted-foreground">Kolor tła</Label>
              <div className="flex items-center gap-3 p-2.5 rounded-xl border bg-muted/30">
                <div className="relative">
                  <div
                    className="w-9 h-9 rounded-lg border-2 border-white shadow-sm cursor-pointer overflow-hidden"
                    style={{ background: page.bg_color ?? '#ffffff' }}
                  >
                    <input
                      type="color"
                      value={page.bg_color ?? '#ffffff'}
                      onChange={e => onUpdate({ bg_color: e.target.value })}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
                <span className="text-xs font-mono text-muted-foreground flex-1">
                  {(page.bg_color ?? '#ffffff').toUpperCase()}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs px-2"
                  onClick={() => onUpdate({ bg_color: '#ffffff' })}
                >
                  Reset
                </Button>
              </div>
            </div>
          )}
        </section>

        <Separator />

        {/* ════════════════════════════
            PRO SECTION — collapsible
        ════════════════════════════ */}
        <ProSection open={proOpen} onToggle={() => setProOpen(v => !v)}>

          {/* Kolory przycisków i tekstu */}
          <div className="space-y-4">
            <ColorPicker
              label="Kolor przycisków"
              value={page.button_color ?? null}
              onChange={color => onUpdate({ button_color: color })}
              isPro={isPro}
            />
            <ColorPicker
              label="Tekst przycisków"
              value={page.button_text_color ?? null}
              onChange={color => onUpdate({ button_text_color: color })}
              isPro={isPro}
            />
            <ColorPicker
              label="Kolor tekstu strony"
              value={page.text_color ?? null}
              onChange={color => onUpdate({ text_color: color })}
              isPro={isPro}
            />
          </div>

          <Separator className="opacity-40" />
          <GradientBuilder page={page} onUpdate={onUpdate} isPro={isPro} />

          <Separator className="opacity-40" />
          <FontPicker page={page} onUpdate={onUpdate} isPro={isPro} />

          <Separator className="opacity-40" />
          <AnimationPicker page={page} onUpdate={onUpdate} isPro={isPro} />

          <Separator className="opacity-40" />
          <CustomCssEditor page={page} onUpdate={onUpdate} isPro={isPro} />

        </ProSection>

      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   Types (local re-export for clarity)
───────────────────────────────────────── */
interface DesignPanelProps {
  page:     Page
  onUpdate: (updates: Partial<Page>) => void
  isPro:    boolean
}
