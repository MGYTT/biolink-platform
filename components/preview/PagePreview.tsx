'use client'

import type { Block, Page } from '@/types'
import { cn } from '@/lib/utils'
import { ExternalLink } from 'lucide-react'

interface PagePreviewProps {
  page: Page
  blocks: Block[]
}

const fontMap: Record<string, string> = {
  inter:    'font-sans',
  serif:    'font-serif',
  mono:     'font-mono',
}

const buttonStyleMap: Record<string, string> = {
  rounded: 'rounded-lg',
  pill:    'rounded-full',
  square:  'rounded-none',
  outline: 'rounded-lg border-2 bg-transparent',
  shadow:  'rounded-lg shadow-lg',
}

const themeMap: Record<string, string> = {
  minimal:        'bg-white text-gray-900',
  dark:           'bg-gray-950 text-gray-100',
  gradient:       'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 text-white',
  glassmorphism:  'bg-gradient-to-br from-blue-400 to-purple-600 text-white',
  neon:           'bg-black text-green-400',
  retro:          'bg-yellow-50 text-gray-800',
}

export function PagePreview({ page, blocks }: PagePreviewProps) {
  const themeClass = themeMap[page.theme] ?? themeMap.minimal
  const fontClass  = fontMap[page.font_family] ?? fontMap.inter
  const btnClass   = buttonStyleMap[page.button_style] ?? buttonStyleMap.rounded

  const visibleBlocks = blocks
    .filter(b => b.is_visible)
    .sort((a, b) => a.position - b.position)

  return (
    <div
      className={cn('min-h-full w-full', themeClass, fontClass)}
      style={page.bg_gradient
        ? { background: page.bg_gradient }
        : { backgroundColor: page.bg_color }
      }
    >
      <div className="max-w-md mx-auto px-4 py-10 flex flex-col items-center gap-3">
        {/* Avatar */}
        {page.profile_pic && (
          <img
            src={page.profile_pic}
            alt={page.title}
            className="w-24 h-24 rounded-full object-cover border-4 border-white/30 shadow-xl"
          />
        )}

        {/* Tytuł */}
        <h1 className="text-xl font-bold text-center">{page.title}</h1>

        {/* Opis */}
        {page.description && (
          <p className="text-sm text-center opacity-80 max-w-xs">{page.description}</p>
        )}

        {/* Bloki */}
        <div className="w-full mt-2 flex flex-col gap-2.5">
          {visibleBlocks.map(block => (
            <PreviewBlock
              key={block.id}
              block={block}
              btnClass={btnClass}
              page={page}
            />
          ))}
        </div>

        {/* Branding */}
        <p className="text-[10px] opacity-40 mt-6">
          Stwórz swoją stronę na BioLink.app
        </p>
      </div>
    </div>
  )
}

function PreviewBlock({
  block, btnClass, page
}: { block: Block; btnClass: string; page: Page }) {
  switch (block.type) {
    case 'link':
      return (
        <a
          href={block.url ?? '#'}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'w-full flex items-center justify-center gap-2 px-4 py-3',
            'font-semibold text-sm transition-all hover:scale-[1.02] active:scale-95',
            'bg-white/20 backdrop-blur-sm border border-white/20',
            btnClass
          )}
          style={{ color: page.text_color }}
        >
          {block.icon && <span>{block.icon}</span>}
          {block.label}
          <ExternalLink className="h-3.5 w-3.5 opacity-60 ml-auto" />
        </a>
      )

    case 'header':
      return (
        <h2 className="text-lg font-bold text-center mt-2 mb-1 w-full">
          {block.label}
        </h2>
      )

    case 'text':
      return (
        <p className="text-sm text-center opacity-75 w-full px-2">
          {block.label}
        </p>
      )

    case 'divider':
      return <hr className="w-full border-current opacity-20" />

    case 'image':
      return block.image_url ? (
        <img
          src={block.image_url}
          alt={block.label ?? ''}
          className={cn('w-full object-cover max-h-48', btnClass)}
        />
      ) : null

    case 'video':
      if (!block.url) return null
      const videoId = block.url.includes('youtu')
        ? block.url.split('v=')[1]?.split('&')[0] ?? block.url.split('/').pop()
        : null
      return videoId ? (
        <div className={cn('w-full aspect-video overflow-hidden', btnClass)}>
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            className="w-full h-full"
            allowFullScreen
          />
        </div>
      ) : null

    case 'countdown':
      return (
        <div className={cn(
          'w-full p-4 text-center bg-white/10 backdrop-blur-sm border border-white/20',
          btnClass
        )}>
          <p className="text-xs opacity-60 mb-1">{block.label}</p>
          <CountdownTimer targetDate={block.settings?.target_date as string} />
        </div>
      )

    default:
      return null
  }
}

function CountdownTimer({ targetDate }: { targetDate?: string }) {
  if (!targetDate) return <p className="text-lg font-mono font-bold">00:00:00:00</p>
  const target = new Date(targetDate).getTime()
  const now = Date.now()
  const diff = Math.max(0, target - now)
  const d = Math.floor(diff / 86400000)
  const h = Math.floor((diff % 86400000) / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  const s = Math.floor((diff % 60000) / 1000)
  return (
    <p className="text-xl font-mono font-bold">
      {String(d).padStart(2,'0')}:{String(h).padStart(2,'0')}:{String(m).padStart(2,'0')}:{String(s).padStart(2,'0')}
    </p>
  )
}
