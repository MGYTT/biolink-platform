'use client'

import { Label }     from '@/components/ui/label'
import { Badge }     from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn }        from '@/lib/utils'
import { Sparkles }  from 'lucide-react'

import { ColorPicker }     from './pro/ColorPicker'
import { GradientBuilder } from './pro/GradientBuilder'
import { FontPicker }      from './pro/FontPicker'
import { AnimationPicker } from './pro/AnimationPicker'
import { CustomCssEditor } from './pro/CustomCssEditor'

import type { Page, Theme, ButtonStyle, BgType } from '@/types'

interface DesignPanelProps {
  page:     Page
  onUpdate: (updates: Partial<Page>) => void
  isPro:    boolean
}

const THEMES: { id: Theme; label: string; bg: string; border: string }[] = [
  { id: 'default', label: 'Domyślny', bg: 'bg-white',      border: 'border-gray-200'   },
  { id: 'dark',    label: 'Ciemny',   bg: 'bg-gray-900',   border: 'border-gray-700'   },
  { id: 'purple',  label: 'Purple',   bg: 'bg-purple-600', border: 'border-purple-400' },
  { id: 'ocean',   label: 'Ocean',    bg: 'bg-blue-600',   border: 'border-blue-400'   },
  { id: 'sunset',  label: 'Sunset',   bg: 'bg-orange-500', border: 'border-orange-300' },
  { id: 'forest',  label: 'Forest',   bg: 'bg-green-700',  border: 'border-green-400'  },
]

const BUTTON_STYLES: { id: ButtonStyle; label: string; preview: string }[] = [
  { id: 'rounded',     label: 'Zaokrąglone', preview: 'rounded-lg'   },
  { id: 'pill',        label: 'Pill',         preview: 'rounded-full' },
  { id: 'square',      label: 'Kwadratowe',   preview: 'rounded-none' },
  { id: 'outline',     label: 'Outline',      preview: 'rounded-lg'   },
  { id: 'soft-shadow', label: 'Shadow',       preview: 'rounded-lg'   },
]

const FONTS = [
  { id: 'inter',    label: 'Inter',    style: 'font-sans'  },
  { id: 'serif',    label: 'Serif',    style: 'font-serif' },
  { id: 'mono',     label: 'Mono',     style: 'font-mono'  },
  { id: 'poppins',  label: 'Poppins',  style: 'font-sans'  },
  { id: 'playfair', label: 'Playfair', style: 'font-serif' },
]

const BG_TYPES: { id: BgType; label: string; pro?: boolean }[] = [
  { id: 'solid',    label: 'Jednolity'           },
  { id: 'gradient', label: 'Gradient', pro: true },
  { id: 'image',    label: 'Obraz',    pro: true },
]

export function DesignPanel({ page, onUpdate, isPro }: DesignPanelProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">

      {/* ── Motyw ── */}
      <div className="space-y-3">
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground block">
          Motyw kolorystyczny
        </Label>
        <div className="grid grid-cols-3 gap-2">
          {THEMES.map(theme => (
            <button
              key={theme.id}
              onClick={() => onUpdate({ theme: theme.id })}
              className={cn(
                'flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all',
                page.theme === theme.id
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'border-border hover:border-muted-foreground/30'
              )}
            >
              <div className={cn('w-full h-8 rounded-lg border', theme.bg, theme.border)} />
              <span className="text-[10px] font-medium">{theme.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Styl przycisków ── */}
      <div className="space-y-3">
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground block">
          Styl przycisków
        </Label>
        <div className="grid grid-cols-1 gap-2">
          {BUTTON_STYLES.map(style => (
            <button
              key={style.id}
              onClick={() => onUpdate({ button_style: style.id })}
              className={cn(
                'flex items-center gap-3 p-2.5 rounded-xl border-2 transition-all text-left',
                page.button_style === style.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-muted-foreground/30'
              )}
            >
              <div className={cn(
                'h-7 w-20 bg-primary/80 flex-shrink-0',
                style.preview,
                style.id === 'outline'     && 'bg-transparent border-2 border-primary',
                style.id === 'soft-shadow' && 'shadow-md'
              )} />
              <span className="text-xs font-medium">{style.label}</span>
              {page.button_style === style.id && (
                <div className="ml-auto w-2 h-2 rounded-full bg-primary" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Czcionka (basic) ── */}
      <div className="space-y-3">
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground block">
          Czcionka
        </Label>
        <div className="grid grid-cols-1 gap-2">
          {FONTS.map(font => (
            <button
              key={font.id}
              onClick={() => onUpdate({ font_family: font.id as Page['font_family'] })}
              className={cn(
                'flex items-center justify-between px-3 py-2.5 rounded-xl border-2 transition-all',
                page.font_family === font.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-muted-foreground/30'
              )}
            >
              <span className={cn('text-sm font-medium', font.style)}>{font.label}</span>
              <span className={cn('text-xs text-muted-foreground', font.style)}>Aa</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Typ tła ── */}
      <div className="space-y-3">
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground block">
          Typ tła
        </Label>
        <div className="grid grid-cols-3 gap-2">
          {BG_TYPES.map(bg => (
            <button
              key={bg.id}
              onClick={() => {
                if (bg.pro && !isPro) return
                onUpdate({ bg_type: bg.id })
              }}
              disabled={bg.pro && !isPro}
              className={cn(
                'relative flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all',
                page.bg_type === bg.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-muted-foreground/30',
                bg.pro && !isPro && 'opacity-50 cursor-not-allowed'
              )}
            >
              <span className="text-xs font-medium">{bg.label}</span>
              {bg.pro && !isPro && (
                <Badge className="absolute -top-2 -right-2 text-[8px] px-1 h-3.5 bg-amber-500">
                  PRO
                </Badge>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Kolor tła (solid) ── */}
      {(!page.bg_type || page.bg_type === 'solid') && (
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground block">
            Kolor tła
          </Label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={page.bg_color ?? '#ffffff'}
              onChange={e => onUpdate({ bg_color: e.target.value })}
              className="w-10 h-10 rounded-lg border cursor-pointer"
            />
            <span className="text-sm font-mono text-muted-foreground">
              {page.bg_color ?? '#ffffff'}
            </span>
          </div>
        </div>
      )}

      <Separator />

      {/* ════════════════════════════
          PRO — ZAAWANSOWANE
      ════════════════════════════ */}
      <div className="space-y-6">

        {/* Header Pro */}
        <div className="flex items-center gap-2 py-1">
          <Sparkles className="h-4 w-4 text-amber-500" />
          <span className="text-xs font-bold uppercase tracking-widest text-amber-500">
            Pro — zaawansowane
          </span>
        </div>

        {/* Kolor przycisku */}
        <ColorPicker
          label="Kolor przycisków"
          value={page.button_color ?? null}
          onChange={color => onUpdate({ button_color: color })}
          isPro={isPro}
        />

        {/* Kolor tekstu przycisków */}
        <ColorPicker
          label="Tekst przycisków"
          value={page.button_text_color ?? null}
          onChange={color => onUpdate({ button_text_color: color })}
          isPro={isPro}
        />

        {/* Kolor tekstu strony */}
        <ColorPicker
          label="Kolor tekstu"
          value={page.text_color ?? null}
          onChange={color => onUpdate({ text_color: color })}
          isPro={isPro}
        />

        <Separator className="opacity-50" />

        {/* Gradient */}
        <GradientBuilder page={page} onUpdate={onUpdate} isPro={isPro} />

        <Separator className="opacity-50" />

        {/* Czcionka Pro */}
        <FontPicker page={page} onUpdate={onUpdate} isPro={isPro} />

        <Separator className="opacity-50" />

        {/* Animacje */}
        <AnimationPicker page={page} onUpdate={onUpdate} isPro={isPro} />

        <Separator className="opacity-50" />

        {/* Custom CSS */}
        <CustomCssEditor page={page} onUpdate={onUpdate} isPro={isPro} />

      </div>
    </div>
  )
}
