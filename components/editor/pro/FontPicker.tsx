'use client'

import { useState } from 'react'
import { Label }    from '@/components/ui/label'
import { Badge }    from '@/components/ui/badge'
import { Input }    from '@/components/ui/input'
import { cn }       from '@/lib/utils'
import type { Page } from '@/types'

const FONTS = [
  { id: 'inter',        name: 'Inter',         category: 'Sans-serif', preview: 'font-sans'   },
  { id: 'roboto',       name: 'Roboto',         category: 'Sans-serif', preview: 'font-sans'   },
  { id: 'poppins',      name: 'Poppins',        category: 'Sans-serif', preview: 'font-sans'   },
  { id: 'montserrat',   name: 'Montserrat',     category: 'Sans-serif', preview: 'font-sans'   },
  { id: 'nunito',       name: 'Nunito',         category: 'Rounded',    preview: 'font-sans'   },
  { id: 'playfair',     name: 'Playfair Display', category: 'Serif',    preview: 'font-serif'  },
  { id: 'merriweather', name: 'Merriweather',   category: 'Serif',      preview: 'font-serif'  },
  { id: 'lora',         name: 'Lora',           category: 'Serif',      preview: 'font-serif'  },
  { id: 'mono',         name: 'JetBrains Mono', category: 'Monospace',  preview: 'font-mono'   },
  { id: 'space-grotesk', name: 'Space Grotesk', category: 'Sans-serif', preview: 'font-sans', pro: true },
  { id: 'dm-serif',     name: 'DM Serif',       category: 'Serif',      preview: 'font-serif', pro: true },
  { id: 'cabinet',      name: 'Cabinet Grotesk', category: 'Sans-serif', preview: 'font-sans', pro: true },
]

interface FontPickerProps {
  page:     Page
  onUpdate: (updates: Partial<Page>) => void
  isPro:    boolean
}

export function FontPicker({ page, onUpdate, isPro }: FontPickerProps) {
  const [search, setSearch] = useState('')

  const filtered = FONTS.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-3">
      <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground block">
        Czcionka
      </Label>

      <Input
        placeholder="Szukaj czcionki..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="h-8 text-xs"
      />

      <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
        {filtered.map(font => {
          const isLocked = font.pro && !isPro
          return (
            <button
              key={font.id}
              onClick={() => {
                if (isLocked) return
                onUpdate({ font_family: font.id as Page['font_family'] })
              }}
              disabled={isLocked}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2.5 rounded-xl border-2 transition-all text-left',
                page.font_family === font.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-muted-foreground/30',
                isLocked && 'opacity-50 cursor-not-allowed'
              )}
            >
              <div>
                <p className={cn('text-sm font-medium', font.preview)}>
                  {font.name}
                </p>
                <p className="text-[10px] text-muted-foreground">{font.category}</p>
              </div>
              <div className="flex items-center gap-1.5">
                {font.pro && (
                  <Badge className="text-[9px] h-3.5 px-1 bg-amber-500">PRO</Badge>
                )}
                {page.font_family === font.id && (
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
