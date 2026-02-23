'use client'

import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { cn }    from '@/lib/utils'
import type { Page, AnimationStyle } from '@/types'

const ANIMATIONS: {
  id: AnimationStyle
  label: string
  emoji: string
  preview: string
  pro?: boolean
}[] = [
  { id: 'none',       label: 'Brak',       emoji: '⊘',  preview: 'Bez animacji'      },
  { id: 'fade',       label: 'Fade In',    emoji: '✨',  preview: 'Stopniowe pojawienie' },
  { id: 'slide-up',   label: 'Slide Up',   emoji: '⬆️', preview: 'Wjeżdża z dołu',  pro: true },
  { id: 'slide-down', label: 'Slide Down', emoji: '⬇️', preview: 'Wjeżdża z góry',  pro: true },
  { id: 'bounce',     label: 'Bounce',     emoji: '🎾', preview: 'Efekt odbicia',    pro: true },
  { id: 'zoom',       label: 'Zoom In',    emoji: '🔍', preview: 'Powiększa się',    pro: true },
]

interface AnimationPickerProps {
  page:     Page
  onUpdate: (updates: Partial<Page>) => void
  isPro:    boolean
}

export function AnimationPicker({ page, onUpdate, isPro }: AnimationPickerProps) {
  return (
    <div className="space-y-3">
      <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground block">
        Animacja bloków
      </Label>

      <div className="space-y-1.5">
        {ANIMATIONS.map(anim => {
          const isLocked = anim.pro && !isPro
          return (
            <button
              key={anim.id}
              onClick={() => {
                if (isLocked) return
                onUpdate({ block_animation: anim.id })
              }}
              disabled={isLocked}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border-2 transition-all text-left',
                page.block_animation === anim.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-muted-foreground/30',
                isLocked && 'opacity-50 cursor-not-allowed'
              )}
            >
              <span className="text-base">{anim.emoji}</span>
              <div className="flex-1">
                <p className="text-xs font-semibold">{anim.label}</p>
                <p className="text-[10px] text-muted-foreground">{anim.preview}</p>
              </div>
              <div className="flex items-center gap-1.5">
                {anim.pro && (
                  <Badge className="text-[9px] h-3.5 px-1 bg-amber-500">PRO</Badge>
                )}
                {page.block_animation === anim.id && (
                  <div className="w-2 h-2 rounded-full bg-primary" />
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
