'use client'

import { useState } from 'react'
import { Plus, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Popover, PopoverContent, PopoverTrigger
} from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Block } from '@/types'

const BLOCK_TYPES: {
  type: Block['type']
  label: string
  icon: string
  pro?: boolean
  description: string
}[] = [
  { type: 'link',      label: 'Link',        icon: '🔗', description: 'Przycisk z linkiem' },
  { type: 'header',    label: 'Nagłówek',    icon: '📝', description: 'Tytuł lub sekcja' },
  { type: 'text',      label: 'Tekst',       icon: '💬', description: 'Akapit z opisem' },
  { type: 'image',     label: 'Obraz',       icon: '🖼️', description: 'Zdjęcie lub baner' },
  { type: 'divider',   label: 'Separator',   icon: '➖', description: 'Linia podziału' },
  { type: 'social',    label: 'Social',      icon: '📱', description: 'Ikony social media' },
  { type: 'video',     label: 'Wideo',       icon: '🎬', description: 'YouTube / Vimeo', pro: true },
  { type: 'music',     label: 'Muzyka',      icon: '🎵', description: 'Spotify / SoundCloud', pro: true },
  { type: 'countdown', label: 'Odliczanie',  icon: '⏱️', description: 'Timer do wydarzenia', pro: true },
  { type: 'form',      label: 'Formularz',   icon: '📋', description: 'Zbieranie emaili', pro: true },
  { type: 'map',       label: 'Mapa',        icon: '📍', description: 'Google Maps embed', pro: true },
  { type: 'pdf',       label: 'PDF',         icon: '📄', description: 'Wyświetl dokument', pro: true },
  { type: 'product',   label: 'Produkt',     icon: '🛍️', description: 'Karta produktu', pro: true },
  { type: 'html',      label: 'HTML',        icon: '⚡', description: 'Własny kod HTML', pro: true },
]

interface AddBlockMenuProps {
  onAdd: (type: Block['type']) => void
  isPro: boolean
}

export function AddBlockMenu({ onAdd, isPro }: AddBlockMenuProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="p-3 border-b">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button className="w-full" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Dodaj blok
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[340px] p-3" align="start" side="bottom">
          <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
            Wybierz typ bloku
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {BLOCK_TYPES.map(({ type, label, icon, pro, description }) => {
              const locked = pro && !isPro
              return (
                <button
                  key={type}
                  onClick={() => {
                    if (locked) return
                    onAdd(type)
                    setOpen(false)
                  }}
                  className={cn(
                    'flex items-center gap-2 p-2.5 rounded-lg border text-left transition-all text-sm',
                    locked
                      ? 'opacity-50 cursor-not-allowed bg-muted'
                      : 'hover:bg-accent hover:border-primary/30 cursor-pointer'
                  )}
                >
                  <span className="text-xl leading-none">{icon}</span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-xs">{label}</span>
                      {pro && (
                        <Badge className="text-[9px] px-1 py-0 bg-amber-500 h-3.5">
                          {locked ? <Lock className="h-2.5 w-2.5" /> : 'PRO'}
                        </Badge>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground truncate">{description}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
