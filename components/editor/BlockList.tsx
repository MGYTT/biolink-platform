'use client'

import { BlockItem } from './BlockItem'
import type { Block } from '@/types'

interface BlockListProps {
  blocks: Block[]
  selectedBlockId: string | null
  onSelect: (id: string) => void
  onUpdate: (id: string, updates: Partial<Block>) => void
  onDelete: (id: string) => void
  isPro: boolean
}

export function BlockList({
  blocks,
  selectedBlockId,
  onSelect,
  onUpdate,
  onDelete,
  isPro,
}: BlockListProps) {
  return (
    <div className="space-y-1">
      {blocks
        .slice()
        .sort((a, b) => a.position - b.position)
        .map(block => (
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
}
