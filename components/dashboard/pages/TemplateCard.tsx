'use client'

import { Badge } from '@/components/ui/badge'
import { Check, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Template {
  id: string
  name: string
  description: string
  emoji: string
  bg_color: string
  pro?: boolean
}

interface TemplateCardProps {
  template: Template
  isSelected: boolean
  isPro: boolean
  onSelect: () => void
}

export function TemplateCard({
  template,
  isSelected,
  isPro,
  onSelect,
}: TemplateCardProps) {
  const isLocked = template.pro && !isPro

  return (
    <button
      onClick={onSelect}
      className={cn(
        'relative rounded-2xl border-2 overflow-hidden transition-all text-left group',
        isSelected
          ? 'border-primary ring-4 ring-primary/20 scale-[1.02]'
          : 'border-border hover:border-muted-foreground/40',
        isLocked && 'opacity-70 cursor-not-allowed'
      )}
    >
      {/* Preview */}
      <div
        className="h-28 w-full flex flex-col items-center justify-center gap-2 p-3"
        style={{ backgroundColor: template.bg_color }}
      >
        <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center text-lg">
          {template.emoji}
        </div>
        <div className="w-16 h-2 rounded-full bg-white/40" />
        <div className="w-12 h-1.5 rounded-full bg-white/25" />
        <div className="w-20 h-5 rounded-lg bg-white/30" />
        <div className="w-20 h-5 rounded-lg bg-white/20" />
      </div>

      {/* Info */}
      <div className="p-3 bg-background">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold">{template.name}</p>
          {template.pro && (
            <Badge className="text-[9px] h-4 px-1.5 bg-amber-500">PRO</Badge>
          )}
        </div>
        <p className="text-[10px] text-muted-foreground mt-0.5">
          {template.description}
        </p>
      </div>

      {/* Zaznaczony */}
      {isSelected && (
        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
          <Check className="h-3 w-3 text-primary-foreground" />
        </div>
      )}

      {/* Zablokowany */}
      {isLocked && (
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
          <div className="bg-background border rounded-lg px-3 py-1.5 flex items-center gap-1.5 shadow-sm">
            <Lock className="h-3 w-3 text-amber-500" />
            <span className="text-xs font-semibold">Plan Pro</span>
          </div>
        </div>
      )}
    </button>
  )
}
