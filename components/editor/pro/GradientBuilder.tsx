'use client'

import { useState } from 'react'
import { Label }   from '@/components/ui/label'
import { Badge }   from '@/components/ui/badge'
import { Button }  from '@/components/ui/button'
import { cn }      from '@/lib/utils'
import type { Page } from '@/types'

const GRADIENT_PRESETS = [
  { name: 'Sunset',   from: '#f97316', to: '#ec4899' },
  { name: 'Ocean',    from: '#3b82f6', to: '#06b6d4' },
  { name: 'Forest',   from: '#22c55e', to: '#14b8a6' },
  { name: 'Purple',   from: '#8b5cf6', to: '#6366f1' },
  { name: 'Fire',     from: '#ef4444', to: '#f97316' },
  { name: 'Midnight', from: '#1e1b4b', to: '#4c1d95' },
  { name: 'Rose',     from: '#ec4899', to: '#f43f5e' },
  { name: 'Gold',     from: '#f59e0b', to: '#eab308' },
]

type GradientDirection = '135deg' | '90deg' | '180deg' | '45deg'

interface GradientBuilderProps {
  page:     Page
  onUpdate: (updates: Partial<Page>) => void
  isPro:    boolean
}

export function GradientBuilder({ page, onUpdate, isPro }: GradientBuilderProps) {
  const [direction, setDirection] = useState<GradientDirection>('135deg')

  const from = page.gradient_from ?? '#6366f1'
  const to   = page.gradient_to   ?? '#8b5cf6'

  const gradientStyle = {
    background: `linear-gradient(${direction}, ${from}, ${to})`
  }

  const directions: { value: GradientDirection; label: string }[] = [
    { value: '90deg',  label: '→' },
    { value: '135deg', label: '↘' },
    { value: '180deg', label: '↓' },
    { value: '45deg',  label: '↗' },
  ]

  return (
    <div className={cn('space-y-4', !isPro && 'opacity-50 pointer-events-none')}>
      <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-2">
        Gradient tła
        {!isPro && <Badge className="text-[9px] h-3.5 px-1 bg-amber-500">PRO</Badge>}
      </Label>

      {/* Podgląd gradientu */}
      <div
        className="w-full h-20 rounded-xl border shadow-inner"
        style={gradientStyle}
      />

      {/* Kolory */}
      <div className="flex items-center gap-3">
        <div className="flex-1 space-y-1">
          <p className="text-[10px] text-muted-foreground">Kolor 1</p>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={from}
              onChange={e => onUpdate({ gradient_from: e.target.value, bg_type: 'gradient' })}
              className="w-9 h-9 rounded-lg border cursor-pointer"
            />
            <span className="text-xs font-mono text-muted-foreground">{from}</span>
          </div>
        </div>

        <div className="text-muted-foreground text-lg font-bold">→</div>

        <div className="flex-1 space-y-1">
          <p className="text-[10px] text-muted-foreground">Kolor 2</p>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={to}
              onChange={e => onUpdate({ gradient_to: e.target.value, bg_type: 'gradient' })}
              className="w-9 h-9 rounded-lg border cursor-pointer"
            />
            <span className="text-xs font-mono text-muted-foreground">{to}</span>
          </div>
        </div>
      </div>

      {/* Kierunek */}
      <div className="space-y-1.5">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">Kierunek</p>
        <div className="grid grid-cols-4 gap-1.5">
          {directions.map(d => (
            <button
              key={d.value}
              onClick={() => setDirection(d.value)}
              className={cn(
                'h-8 rounded-lg border text-sm font-bold transition-all',
                direction === d.value
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border hover:border-muted-foreground/40'
              )}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Presety */}
      <div className="space-y-1.5">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">Gotowe presety</p>
        <div className="grid grid-cols-4 gap-2">
          {GRADIENT_PRESETS.map(preset => (
            <button
              key={preset.name}
              onClick={() => onUpdate({
                gradient_from: preset.from,
                gradient_to:   preset.to,
                bg_type:       'gradient',
              })}
              className={cn(
                'h-10 rounded-lg border-2 transition-all hover:scale-105',
                page.gradient_from === preset.from && page.gradient_to === preset.to
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'border-transparent'
              )}
              style={{
                background: `linear-gradient(135deg, ${preset.from}, ${preset.to})`
              }}
              title={preset.name}
            />
          ))}
        </div>
      </div>

      {/* Apply */}
      <Button
        size="sm"
        className="w-full"
        onClick={() => onUpdate({ bg_type: 'gradient' })}
      >
        Zastosuj gradient
      </Button>
    </div>
  )
}
