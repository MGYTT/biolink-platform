'use client'

import { memo } from 'react'
import { BlockItem } from './BlockItem'
import type { Block } from '@/types'

interface BlockListProps {
  blocks:          Block[]        // przekazywać już posortowane (z EditorClient)
  selectedBlockId: string | null
  onSelect:        (id: string) => void
  onUpdate:        (id: string, updates: Partial<Block>) => void
  onDelete:        (id: string) => void
  isPro:           boolean
}

export const BlockList = memo(function BlockList({
  blocks,
  selectedBlockId,
  onSelect,
  onUpdate,
  onDelete,
  isPro,
}: BlockListProps) {
  return (
    <div className="space-y-1" role="list" aria-label="Lista bloków">
      {blocks.map(block => (
        <BlockItem
          key={block.id}
          block={block}
          isSelected={selectedBlockId === block.id}
          onSelect={onSelect}
          onUpdate={onUpdate}
          onDelete={onDelete}
          isPro={isPro}
        />
      ))}
    </div>
  )
})
