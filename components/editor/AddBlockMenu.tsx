'use client'

import { useState, useMemo } from 'react'
import { Plus, Lock, Search, Sparkles } from 'lucide-react'
import { Button }   from '@/components/ui/button'
import { Input }    from '@/components/ui/input'
import { Badge }    from '@/components/ui/badge'
import {
  Popover, PopoverContent, PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import type { Block } from '@/types'

/* ─────────────────────────────────────────
   Data
───────────────────────────────────────── */
interface BlockTypeDef {
  type:        Block['type']
  label:       string
  icon:        string
  description: string
  pro?:        boolean
}

const BLOCK_TYPES: BlockTypeDef[] = [
  // Free
  { type: 'link',    label: 'Link',      icon: '🔗', description: 'Przycisk z linkiem'   },
  { type: 'header',  label: 'Nagłówek',  icon: '📝', description: 'Tytuł lub sekcja'     },
  { type: 'text',    label: 'Tekst',     icon: '💬', description: 'Akapit z opisem'      },
  { type: 'image',   label: 'Obraz',     icon: '🖼️', description: 'Zdjęcie lub baner'   },
  { type: 'social',  label: 'Social',    icon: '📱', description: 'Ikony social media'   },
  { type: 'divider', label: 'Separator', icon: '➖', description: 'Linia podziału'       },
  // Pro
  { type: 'video',     label: 'Wideo',      icon: '🎬', description: 'YouTube / Vimeo',      pro: true },
  { type: 'music',     label: 'Muzyka',     icon: '🎵', description: 'Spotify / SoundCloud',  pro: true },
  { type: 'product',   label: 'Produkt',    icon: '🛍️', description: 'Karta produktu',        pro: true },
  { type: 'form',      label: 'Formularz',  icon: '📋', description: 'Zbieranie emaili',       pro: true },
  { type: 'countdown', label: 'Odliczanie', icon: '⏱️', description: 'Timer do wydarzenia',   pro: true },
  { type: 'map',       label: 'Mapa',       icon: '📍', description: 'Google Maps embed',      pro: true },
  { type: 'pdf',       label: 'PDF',        icon: '📄', description: 'Wyświetl dokument',      pro: true },
  { type: 'html',      label: 'HTML',       icon: '⚡', description: 'Własny kod HTML',        pro: true },
]

const FREE_TYPES = BLOCK_TYPES.filter(b => !b.pro)
const PRO_TYPES  = BLOCK_TYPES.filter(b => b.pro)

/* ─────────────────────────────────────────
   Sub-component: single block type tile
───────────────────────────────────────── */
function BlockTypeTile({
  def,
  locked,
  onAdd,
}: {
  def:    BlockTypeDef
  locked: boolean
  onAdd:  (type: Block['type']) => void
}) {
  return (
    <button
      type="button"
      disabled={locked}
      onClick={() => !locked && onAdd(def.type)}
      className={cn(
        'relative flex items-center gap-2.5 p-2.5 rounded-xl border text-left',
        'transition-all duration-150 group w-full',
        locked
          ? 'opacity-50 cursor-not-allowed bg-muted/50 border-border'
          : 'hover:bg-accent hover:border-primary/40 hover:shadow-sm cursor-pointer active:scale-[0.98]',
      )}
    >
      {/* Icon */}
      <span className={cn(
        'w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0',
        'bg-background border transition-colors',
        !locked && 'group-hover:border-primary/30',
      )}>
        {def.icon}
      </span>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold leading-tight">{def.label}</span>
          {def.pro && (
            <Badge className={cn(
              'text-[8px] px-1 h-3.5 font-bold flex items-center gap-0.5',
              locked
                ? 'bg-muted-foreground/30 text-muted-foreground'
                : 'bg-amber-500 hover:bg-amber-500 text-white',
            )}>
              {locked
                ? <><Lock className="h-2 w-2" /> PRO</>
                : <><Sparkles className="h-2 w-2" /> PRO</>
              }
            </Badge>
          )}
        </div>
        <p className="text-[10px] text-muted-foreground truncate mt-0.5">
          {def.description}
        </p>
      </div>
    </button>
  )
}

/* ─────────────────────────────────────────
   Main component
───────────────────────────────────────── */
interface AddBlockMenuProps {
  onAdd:  (type: Block['type']) => void
  isPro:  boolean
}

export function AddBlockMenu({ onAdd, isPro }: AddBlockMenuProps) {
  const [open,   setOpen]   = useState(false)
  const [query,  setQuery]  = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return null
    return BLOCK_TYPES.filter(b =>
      b.label.toLowerCase().includes(q) ||
      b.description.toLowerCase().includes(q),
    )
  }, [query])

  function handleAdd(type: Block['type']) {
    onAdd(type)
    setOpen(false)
    setQuery('')
  }

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) setQuery('')
  }

  const proUnlocked  = isPro
  const proLockedCount = PRO_TYPES.length

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button className="w-full gap-2" size="sm">
          <Plus className="h-4 w-4" />
          Dodaj blok
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[360px] p-0 overflow-hidden"
        align="start"
        side="bottom"
        sideOffset={6}
      >
        {/* Header */}
        <div className="px-3 pt-3 pb-2">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
            Wybierz typ bloku
          </p>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <Input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Szukaj bloku…"
              className="h-8 pl-8 text-sm"
              autoComplete="off"
            />
          </div>
        </div>

        {/* Results */}
        <div className="max-h-[420px] overflow-y-auto px-3 pb-3">
          {filtered !== null ? (
            /* ── Search results ── */
            filtered.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-muted-foreground">Nie znaleziono bloku</p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  Spróbuj innej frazy
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                {filtered.map(def => (
                  <BlockTypeTile
                    key={def.type}
                    def={def}
                    locked={!!def.pro && !isPro}
                    onAdd={handleAdd}
                  />
                ))}
              </div>
            )
          ) : (
            /* ── Default grouped view ── */
            <>
              {/* Free blocks */}
              <div className="mb-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Podstawowe
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {FREE_TYPES.map(def => (
                    <BlockTypeTile
                      key={def.type}
                      def={def}
                      locked={false}
                      onAdd={handleAdd}
                    />
                  ))}
                </div>
              </div>

              <Separator className="mb-3" />

              {/* Pro blocks */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Pro
                  </p>
                  {!proUnlocked && (
                    <Badge
                      variant="outline"
                      className="text-[9px] h-4 px-1.5 border-amber-300 text-amber-600 dark:border-amber-800 dark:text-amber-400"
                    >
                      {proLockedCount} zablokowanych
                    </Badge>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {PRO_TYPES.map(def => (
                    <BlockTypeTile
                      key={def.type}
                      def={def}
                      locked={!isPro}
                      onAdd={handleAdd}
                    />
                  ))}
                </div>

                {/* Upsell for free users */}
                {!isPro && (
                  <div className="mt-3 p-3 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20 border border-amber-200 dark:border-amber-900/60">
                    <p className="text-xs font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5" />
                      Odblokuj wszystkie bloki Pro
                    </p>
                    <p className="text-[10px] text-amber-700/80 dark:text-amber-400/80 mt-0.5">
                      Wideo, formularze, odliczanie i więcej — 14 dni za darmo.
                    </p>
                    <a
                      href="/dashboard/upgrade"
                      className="inline-block mt-2 text-[10px] font-bold text-amber-700 dark:text-amber-400 hover:underline"
                      onClick={() => setOpen(false)}
                    >
                      Przejdź na Pro →
                    </a>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
