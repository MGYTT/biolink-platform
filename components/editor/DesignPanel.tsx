'use client'

import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import type { Page, Theme, ButtonStyle } from '@/types'
import { Lock } from 'lucide-react'

const themes: { id: Theme; name: string; preview: string; pro?: boolean }[] = [
  { id: 'minimal',       name: 'Minimal',       preview: 'bg-white border'                              },
  { id: 'dark',          name: 'Dark',           preview: 'bg-gray-950'                                 },
  { id: 'gradient',      name: 'Gradient',       preview: 'bg-gradient-to-br from-purple-500 to-orange-400' },
  { id: 'glassmorphism', name: 'Glass',          preview: 'bg-gradient-to-br from-blue-400 to-purple-600', pro: true },
  { id: 'neon',          name: 'Neon',           preview: 'bg-black border border-green-400',            pro: true },
  { id: 'retro',         name: 'Retro',          preview: 'bg-yellow-100 border',                        pro: true },
]

const buttonStyles: { id: ButtonStyle; name: string; class: string }[] = [
  { id: 'rounded', name: 'Rounded',  class: 'rounded-lg'  },
  { id: 'pill',    name: 'Pill',     class: 'rounded-full'},
  { id: 'square',  name: 'Square',   class: 'rounded-none'},
  { id: 'outline', name: 'Outline',  class: 'rounded-lg border-2'},
  { id: 'shadow',  name: 'Shadow',   class: 'rounded-lg shadow-xl'},
]

const fonts = [
  { id: 'inter',  name: 'Inter (domyślny)' },
  { id: 'serif',  name: 'Serif' },
  { id: 'mono',   name: 'Monospace' },
]

interface DesignPanelProps {
  page: Page
  onUpdate: (updates: Partial<Page>) => void
  isPro: boolean
}

export function DesignPanel({ page, onUpdate, isPro }: DesignPanelProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">

      {/* Motywy */}
      <div>
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 block">
          Motyw
        </Label>
        <div className="grid grid-cols-3 gap-2">
          {themes.map(theme => {
            const locked = theme.pro && !isPro
            return (
              <button
                key={theme.id}
                onClick={() => !locked && onUpdate({ theme: theme.id })}
                className={cn(
                  'relative flex flex-col items-center gap-1.5 p-2 rounded-lg border-2 transition-all',
                  page.theme === theme.id
                    ? 'border-primary shadow-sm'
                    : 'border-transparent hover:border-muted-foreground/30',
                  locked && 'opacity-50 cursor-not-allowed'
                )}
              >
                <div className={cn('w-full h-10 rounded-md', theme.preview)} />
                <span className="text-[10px] font-medium">{theme.name}</span>
                {theme.pro && (
                  <Badge className={cn(
                    'absolute top-1 right-1 text-[8px] px-1 py-0 h-3.5',
                    isPro ? 'bg-amber-500' : 'bg-muted text-muted-foreground'
                  )}>
                    {locked ? <Lock className="h-2 w-2" /> : 'PRO'}
                  </Badge>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Kolor tła */}
      <div>
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 block">
          Kolor tła
        </Label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={page.bg_color}
            onChange={e => onUpdate({ bg_color: e.target.value })}
            className="h-10 w-16 rounded-lg border cursor-pointer p-0.5"
          />
          <Input
            value={page.bg_color}
            onChange={e => onUpdate({ bg_color: e.target.value })}
            className="h-9 font-mono text-sm"
            maxLength={7}
          />
        </div>
      </div>

      {/* Kolor tekstu */}
      <div>
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 block">
          Kolor tekstu
        </Label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={page.text_color}
            onChange={e => onUpdate({ text_color: e.target.value })}
            className="h-10 w-16 rounded-lg border cursor-pointer p-0.5"
          />
          <Input
            value={page.text_color}
            onChange={e => onUpdate({ text_color: e.target.value })}
            className="h-9 font-mono text-sm"
            maxLength={7}
          />
        </div>
      </div>

      {/* Styl przycisków */}
      <div>
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 block">
          Styl przycisków
        </Label>
        <div className="grid grid-cols-5 gap-1.5">
          {buttonStyles.map(style => (
            <button
              key={style.id}
              onClick={() => onUpdate({ button_style: style.id })}
              className={cn(
                'py-2 px-1 text-[10px] font-medium border-2 transition-all bg-primary/80 text-primary-foreground',
                style.class,
                page.button_style === style.id
                  ? 'border-primary scale-105'
                  : 'border-transparent opacity-60 hover:opacity-100'
              )}
            >
              {style.name}
            </button>
          ))}
        </div>
      </div>

      {/* Font */}
      <div>
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 block">
          Czcionka
        </Label>
        <div className="flex flex-col gap-1.5">
          {fonts.map(font => (
            <button
              key={font.id}
              onClick={() => onUpdate({ font_family: font.id })}
              className={cn(
                'flex items-center p-2.5 rounded-lg border-2 text-sm transition-all text-left',
                font.id === 'serif' ? 'font-serif' : font.id === 'mono' ? 'font-mono' : 'font-sans',
                page.font_family === font.id
                  ? 'border-primary bg-primary/5'
                  : 'border-transparent hover:border-muted-foreground/20'
              )}
            >
              {font.name}
            </button>
          ))}
        </div>
      </div>

      {/* Gradient tła (PRO) */}
      <div className={cn(!isPro && 'opacity-60')}>
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1 flex items-center gap-2">
          Gradient tła
          {!isPro && <Badge className="text-[9px] px-1 bg-amber-500 h-3.5">PRO</Badge>}
        </Label>
        <p className="text-[10px] text-muted-foreground mb-2">CSS gradient, np. linear-gradient(...)</p>
        <Input
          value={page.bg_gradient ?? ''}
          onChange={e => isPro && onUpdate({ bg_gradient: e.target.value || null })}
          placeholder="linear-gradient(135deg, #667eea, #764ba2)"
          className="h-9 text-xs font-mono"
          disabled={!isPro}
        />
      </div>
    </div>
  )
}
