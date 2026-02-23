'use client'

import { memo, useCallback } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  GripVertical, Trash2, Eye, EyeOff,
  ChevronDown, ChevronUp, Clock, Link2,
  AlertCircle,
} from 'lucide-react'
import { Button }   from '@/components/ui/button'
import { Input }    from '@/components/ui/input'
import { Label }    from '@/components/ui/label'
import { Switch }   from '@/components/ui/switch'
import { Badge }    from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { cn } from '@/lib/utils'
import type { Block } from '@/types'

/* ─────────────────────────────────────────
   Constants
───────────────────────────────────────── */
const BLOCK_META: Record<
  string,
  { emoji: string; label: string; color: string }
> = {
  link:      { emoji: '🔗', label: 'Link',       color: 'bg-blue-100 dark:bg-blue-950/50'    },
  header:    { emoji: '📝', label: 'Nagłówek',   color: 'bg-slate-100 dark:bg-slate-800/50'  },
  text:      { emoji: '💬', label: 'Tekst',      color: 'bg-slate-100 dark:bg-slate-800/50'  },
  image:     { emoji: '🖼️', label: 'Obraz',      color: 'bg-emerald-100 dark:bg-emerald-950/50' },
  divider:   { emoji: '➖', label: 'Separator',  color: 'bg-slate-100 dark:bg-slate-800/50'  },
  social:    { emoji: '📱', label: 'Social',     color: 'bg-pink-100 dark:bg-pink-950/50'    },
  video:     { emoji: '🎬', label: 'Wideo',      color: 'bg-red-100 dark:bg-red-950/50'      },
  music:     { emoji: '🎵', label: 'Muzyka',     color: 'bg-purple-100 dark:bg-purple-950/50'},
  countdown: { emoji: '⏱️', label: 'Odliczanie', color: 'bg-orange-100 dark:bg-orange-950/50'},
  form:      { emoji: '📋', label: 'Formularz',  color: 'bg-cyan-100 dark:bg-cyan-950/50'    },
  map:       { emoji: '📍', label: 'Mapa',       color: 'bg-green-100 dark:bg-green-950/50'  },
  pdf:       { emoji: '📄', label: 'PDF',        color: 'bg-amber-100 dark:bg-amber-950/50'  },
  product:   { emoji: '🛍️', label: 'Produkt',   color: 'bg-indigo-100 dark:bg-indigo-950/50'},
  html:      { emoji: '⚡', label: 'HTML',       color: 'bg-yellow-100 dark:bg-yellow-950/50'},
  email:     { emoji: '✉️', label: 'Email',      color: 'bg-sky-100 dark:bg-sky-950/50'      },
}

const FALLBACK_META = { emoji: '📦', label: 'Blok', color: 'bg-muted' }

/* Typy bloków z polem URL */
const URL_BLOCK_TYPES  = new Set(['link', 'video', 'music', 'pdf', 'map', 'social', 'product'])
/* Typy bloków z polem content (textarea) */
const TEXT_BLOCK_TYPES = new Set(['text', 'header', 'html'])

/* ─────────────────────────────────────────
   Helpers
───────────────────────────────────────── */
function formatScheduleDate(iso: string | null): string | null {
  if (!iso) return null
  return new Date(iso).toLocaleDateString('pl-PL', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  })
}

function isScheduleActive(from: string | null, to: string | null): boolean {
  const now = Date.now()
  const start = from ? new Date(from).getTime() : -Infinity
  const end   = to   ? new Date(to).getTime()   : Infinity
  return now >= start && now <= end
}

/* ─────────────────────────────────────────
   Sub-components
───────────────────────────────────────── */
function ScheduleBadge({ from, to }: { from: string | null; to: string | null }) {
  if (!from && !to) return null
  const active = isScheduleActive(from, to)
  return (
    <Badge
      variant="outline"
      className={cn(
        'text-[9px] h-4 px-1.5 gap-1 font-semibold flex-shrink-0',
        active
          ? 'border-emerald-300 text-emerald-700 dark:border-emerald-800 dark:text-emerald-400'
          : 'border-amber-300 text-amber-700 dark:border-amber-800 dark:text-amber-400',
      )}
    >
      <Clock className="h-2.5 w-2.5" />
      {active ? 'Aktywny' : 'Zaplanowany'}
    </Badge>
  )
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
    </div>
  )
}

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */
interface BlockItemProps {
  block:       Block
  isSelected:  boolean
  isDragging?: boolean
  onSelect:    (id: string) => void
  onUpdate:    (id: string, updates: Partial<Block>) => void
  onDelete:    (id: string) => void
  isPro:       boolean
}

/* ─────────────────────────────────────────
   Main component
───────────────────────────────────────── */
export const BlockItem = memo(function BlockItem({
  block,
  isSelected,
  isDragging = false,
  onSelect,
  onUpdate,
  onDelete,
  isPro,
}: BlockItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: block.id })

  const meta = BLOCK_META[block.type] ?? FALLBACK_META

  const handleUpdate = useCallback(
    (updates: Partial<Block>) => onUpdate(block.id, updates),
    [block.id, onUpdate],
  )

  const hasSchedule = !!(block.visible_from || block.visible_to)
  const isInactive  = !block.is_visible || !block.is_active

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={cn(
        'rounded-xl border bg-card overflow-hidden transition-all duration-150 sortable-item',
        isSelected  && 'border-primary ring-2 ring-primary/20 shadow-sm',
        !isSelected && 'hover:border-primary/30 hover:shadow-sm',
        (isSortableDragging || isDragging) && 'sortable-item-dragging',
        isInactive  && 'opacity-60',
      )}
    >
      {/* ── Header ── */}
      <div
        className="flex items-center gap-2 p-2.5 cursor-pointer select-none"
        onClick={() => onSelect(block.id)}
        role="button"
        aria-expanded={isSelected}
        aria-label={`Blok: ${block.label || meta.label}`}
      >
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="touch-none p-1 text-muted-foreground/50 hover:text-muted-foreground cursor-grab active:cursor-grabbing flex-shrink-0 rounded"
          onClick={e => e.stopPropagation()}
          aria-label="Przeciągnij, aby zmienić kolejność"
          tabIndex={-1}
        >
          <GripVertical className="h-4 w-4" />
        </button>

        {/* Type icon */}
        <div className={cn(
          'w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-sm',
          meta.color,
        )}>
          {meta.emoji}
        </div>

        {/* Labels */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate leading-tight">
            {block.label || block.title || meta.label}
          </p>
          {block.url ? (
            <p className="text-[10px] text-muted-foreground truncate flex items-center gap-1 mt-0.5">
              <Link2 className="h-2.5 w-2.5 flex-shrink-0" />
              {block.url}
            </p>
          ) : (
            <p className="text-[10px] text-muted-foreground capitalize">{meta.label}</p>
          )}
        </div>

        {/* Schedule badge */}
        {hasSchedule && (
          <ScheduleBadge from={block.visible_from} to={block.visible_to} />
        )}

        {/* Visibility toggle */}
        <button
          onClick={e => { e.stopPropagation(); handleUpdate({ is_visible: !block.is_visible }) }}
          className="p-1 text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 rounded"
          aria-label={block.is_visible ? 'Ukryj blok' : 'Pokaż blok'}
        >
          {block.is_visible
            ? <Eye className="h-3.5 w-3.5" />
            : <EyeOff className="h-3.5 w-3.5 opacity-40" />
          }
        </button>

        {/* Expand chevron */}
        <span className="text-muted-foreground flex-shrink-0" aria-hidden>
          {isSelected
            ? <ChevronUp className="h-3.5 w-3.5" />
            : <ChevronDown className="h-3.5 w-3.5" />
          }
        </span>
      </div>

      {/* ── Expanded editor ── */}
      {isSelected && (
        <div className="px-3 pb-3 pt-2 border-t bg-muted/20 space-y-3 animate-fade-in">

          {/* Label */}
          <FieldRow label="Etykieta / Tytuł">
            <Input
              value={block.label ?? ''}
              onChange={e => handleUpdate({ label: e.target.value })}
              placeholder="Wpisz tekst przycisku…"
              className="h-8 text-sm"
            />
          </FieldRow>

          {/* URL */}
          {URL_BLOCK_TYPES.has(block.type) && (
            <FieldRow label="URL">
              <div className="relative">
                <Link2 className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  value={block.url ?? ''}
                  onChange={e => handleUpdate({ url: e.target.value })}
                  placeholder="https://…"
                  className="h-8 text-sm pl-8 font-mono"
                  type="url"
                />
              </div>
            </FieldRow>
          )}

          {/* Content / HTML textarea */}
          {TEXT_BLOCK_TYPES.has(block.type) && (
            <FieldRow label={block.type === 'html' ? 'Kod HTML' : 'Treść'}>
              <Textarea
                value={block.content ?? ''}
                onChange={e => handleUpdate({ content: e.target.value })}
                placeholder={block.type === 'html' ? '<p>Twój HTML…</p>' : 'Treść bloku…'}
                className={cn(
                  'text-sm resize-none min-h-[72px]',
                  block.type === 'html' && 'font-mono text-xs',
                )}
                rows={3}
              />
            </FieldRow>
          )}

          {/* Image URL */}
          {block.type === 'image' && (
            <FieldRow label="URL obrazu">
              <Input
                value={block.image_url ?? ''}
                onChange={e => handleUpdate({ image_url: e.target.value })}
                placeholder="https://…"
                className="h-8 text-sm font-mono"
              />
              {block.image_url && (
                <img
                  src={block.image_url}
                  alt="Podgląd"
                  className="mt-1.5 w-full max-h-28 object-cover rounded-lg border"
                  onError={e => (e.currentTarget.style.display = 'none')}
                />
              )}
            </FieldRow>
          )}

          {/* Schedule — Pro only */}
          {isPro && (
            <div className="rounded-lg border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 p-2.5 space-y-2.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                <Clock className="h-3 w-3" /> Harmonogram widoczności
              </p>
              <div className="grid grid-cols-2 gap-2">
                <FieldRow label="Widoczny od">
                  <Input
                    type="datetime-local"
                    value={block.visible_from?.slice(0, 16) ?? ''}
                    onChange={e => handleUpdate({ visible_from: e.target.value || null })}
                    className="h-8 text-xs"
                  />
                </FieldRow>
                <FieldRow label="Widoczny do">
                  <Input
                    type="datetime-local"
                    value={block.visible_to?.slice(0, 16) ?? ''}
                    onChange={e => handleUpdate({ visible_to: e.target.value || null })}
                    className="h-8 text-xs"
                  />
                </FieldRow>
              </div>
              {hasSchedule && (
                <p className="text-[10px] text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3 flex-shrink-0" />
                  {formatScheduleDate(block.visible_from)} →{' '}
                  {formatScheduleDate(block.visible_to) ?? '∞'}
                </p>
              )}
            </div>
          )}

          {/* Footer: visibility switch + delete */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <Switch
                checked={block.is_visible}
                onCheckedChange={v => handleUpdate({ is_visible: v })}
                id={`vis-${block.id}`}
              />
              <Label
                htmlFor={`vis-${block.id}`}
                className="text-xs cursor-pointer text-muted-foreground"
              >
                Widoczny
              </Label>
            </div>

            {/* Delete with confirmation dialog */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 h-7 text-xs gap-1.5"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Usuń
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-destructive" />
                    Usuń blok?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Blok <strong>{block.label || meta.label}</strong> zostanie trwale usunięty.
                    Tej operacji nie można cofnąć.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Anuluj</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(block.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Usuń blok
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      )}
    </div>
  )
})
