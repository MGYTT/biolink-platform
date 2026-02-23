'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Trash2, Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import type { Block } from '@/types'

interface BlockItemProps {
  block: Block
  isSelected: boolean
  isDragging?: boolean
  onSelect: (id: string) => void
  onUpdate: (id: string, updates: Partial<Block>) => void
  onDelete: (id: string) => void
  isPro: boolean
}

const blockIcons: Record<string, string> = {
  link: '🔗', header: '📝', text: '💬', image: '🖼️',
  divider: '➖', social: '📱', video: '🎬', music: '🎵',
  countdown: '⏱️', form: '📋', map: '📍', pdf: '📄',
  product: '🛍️', html: '⚡'
}

export function BlockItem({
  block, isSelected, isDragging = false,
  onSelect, onUpdate, onDelete, isPro
}: BlockItemProps) {
  const {
    attributes, listeners, setNodeRef,
    transform, transition, isDragging: isSortableDragging
  } = useSortable({ id: block.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'rounded-lg border bg-card mb-2 overflow-hidden transition-all',
        isSelected && 'border-primary ring-1 ring-primary/20',
        (isSortableDragging || isDragging) && 'opacity-50 shadow-lg scale-[1.02]',
        !block.is_visible && 'opacity-60'
      )}
    >
      {/* Header bloku */}
      <div
        className="flex items-center gap-2 p-2.5 cursor-pointer"
        onClick={() => onSelect(block.id)}
      >
        {/* Uchwyt drag */}
        <button
          {...attributes}
          {...listeners}
          className="touch-none p-1 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing"
          onClick={e => e.stopPropagation()}
        >
          <GripVertical className="h-4 w-4" />
        </button>

        <span className="text-base leading-none">{blockIcons[block.type] ?? '📦'}</span>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">
            {block.label || block.type}
          </p>
          {block.url && (
            <p className="text-[10px] text-muted-foreground truncate">{block.url}</p>
          )}
        </div>

        {/* Toggle widoczność */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onUpdate(block.id, { is_visible: !block.is_visible })
          }}
          className="p-1 text-muted-foreground hover:text-foreground"
        >
          {block.is_visible
            ? <Eye className="h-3.5 w-3.5" />
            : <EyeOff className="h-3.5 w-3.5 text-muted-foreground/40" />
          }
        </button>

        {/* Rozwiń/zwiń */}
        <span className="text-muted-foreground">
          {isSelected
            ? <ChevronUp className="h-3.5 w-3.5" />
            : <ChevronDown className="h-3.5 w-3.5" />
          }
        </span>
      </div>

      {/* Edycja rozwinięta (inline) */}
      {isSelected && (
        <div className="px-3 pb-3 pt-1 border-t space-y-3 bg-muted/20">
          {/* Label */}
          <div className="space-y-1">
            <Label className="text-xs">Etykieta / Tytuł</Label>
            <Input
              value={block.label ?? ''}
              onChange={e => onUpdate(block.id, { label: e.target.value })}
              placeholder="Wpisz tekst..."
              className="h-8 text-sm"
            />
          </div>

          {/* URL (dla bloków link/video/music) */}
          {['link', 'video', 'music', 'pdf', 'map'].includes(block.type) && (
            <div className="space-y-1">
              <Label className="text-xs">URL</Label>
              <Input
                value={block.url ?? ''}
                onChange={e => onUpdate(block.id, { url: e.target.value })}
                placeholder="https://..."
                className="h-8 text-sm"
                type="url"
              />
            </div>
          )}

          {/* Image URL */}
          {block.type === 'image' && (
            <div className="space-y-1">
              <Label className="text-xs">URL obrazu</Label>
              <Input
                value={block.image_url ?? ''}
                onChange={e => onUpdate(block.id, { image_url: e.target.value })}
                placeholder="https://..."
                className="h-8 text-sm"
              />
            </div>
          )}

          {/* Harmonogram (PRO) */}
          {isPro && (
            <div className="space-y-2 p-2 rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
              <p className="text-[10px] font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wide">
                ⭐ Harmonogram PRO
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Widoczny od</Label>
                  <Input
                    type="datetime-local"
                    value={block.visible_from?.slice(0, 16) ?? ''}
                    onChange={e => onUpdate(block.id, { visible_from: e.target.value })}
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Widoczny do</Label>
                  <Input
                    type="datetime-local"
                    value={block.visible_to?.slice(0, 16) ?? ''}
                    onChange={e => onUpdate(block.id, { visible_to: e.target.value })}
                    className="h-8 text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Akcje */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <Switch
                checked={block.is_visible}
                onCheckedChange={v => onUpdate(block.id, { is_visible: v })}
                id={`vis-${block.id}`}
              />
              <Label htmlFor={`vis-${block.id}`} className="text-xs cursor-pointer">
                Widoczny
              </Label>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 h-7 text-xs"
              onClick={() => onDelete(block.id)}
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Usuń
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
