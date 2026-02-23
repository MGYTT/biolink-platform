'use client'

import type { Page, Block } from '@/types'
import { cn } from '@/lib/utils'

interface PagePreviewProps {
  page: Page
  blocks: Block[]
}

const themeStyles: Record<string, { bg: string; text: string; subtext: string; button: string }> = {
  default: {
    bg:      'bg-white',
    text:    'text-gray-900',
    subtext: 'text-gray-500',
    button:  'bg-gray-900 text-white hover:bg-gray-700',
  },
  dark: {
    bg:      'bg-gray-950',
    text:    'text-white',
    subtext: 'text-gray-400',
    button:  'bg-white text-gray-900 hover:bg-gray-100',
  },
  purple: {
    bg:      'bg-purple-600',
    text:    'text-white',
    subtext: 'text-purple-200',
    button:  'bg-white text-purple-600 hover:bg-purple-50',
  },
  ocean: {
    bg:      'bg-blue-600',
    text:    'text-white',
    subtext: 'text-blue-200',
    button:  'bg-white text-blue-600 hover:bg-blue-50',
  },
  sunset: {
    bg:      'bg-orange-500',
    text:    'text-white',
    subtext: 'text-orange-100',
    button:  'bg-white text-orange-500 hover:bg-orange-50',
  },
  forest: {
    bg:      'bg-green-700',
    text:    'text-white',
    subtext: 'text-green-200',
    button:  'bg-white text-green-700 hover:bg-green-50',
  },
}

const buttonRadiusMap: Record<string, string> = {
  rounded:     'rounded-lg',
  pill:        'rounded-full',
  square:      'rounded-none',
  outline:     'rounded-lg',
  'soft-shadow': 'rounded-lg shadow-md',
}

export function PagePreview({ page, blocks }: PagePreviewProps) {
  const theme   = themeStyles[page.theme] ?? themeStyles.default
  const btnBase = buttonRadiusMap[page.button_style] ?? 'rounded-lg'
  const isOutline = page.button_style === 'outline'

  // Oblicz tło
  const bgStyle: React.CSSProperties = {}
  if (page.bg_type === 'gradient' && page.gradient_from && page.gradient_to) {
    bgStyle.background = `linear-gradient(135deg, ${page.gradient_from}, ${page.gradient_to})`
  } else if (page.bg_type === 'solid' && page.bg_color) {
    bgStyle.backgroundColor = page.bg_color
  }

  const textStyle: React.CSSProperties = page.text_color
    ? { color: page.text_color }
    : {}

  const visibleBlocks = blocks
    .filter(b => b.is_active && b.is_visible !== false)
    .sort((a, b) => a.position - b.position)

  return (
    <div
      className={cn(
        'w-full h-full overflow-y-auto',
        !page.bg_color && !page.bg_gradient && theme.bg
      )}
      style={bgStyle}
    >
      <div className="max-w-sm mx-auto px-4 py-10 flex flex-col items-center gap-4">

        {/* Avatar */}
        {page.profile_pic && (
          <img
            src={page.profile_pic}
            alt={page.title}
            className="w-20 h-20 rounded-full object-cover border-4 border-white/30 shadow-lg"
          />
        )}

        {/* Tytuł */}
        <div className="text-center">
          <h1
            className={cn('font-bold text-xl', theme.text)}
            style={textStyle}
          >
            {page.title}
          </h1>
          {page.description && (
            <p
              className={cn('text-sm mt-1', theme.subtext)}
              style={textStyle}
            >
              {page.description}
            </p>
          )}
        </div>

        {/* Bloki */}
        <div className="w-full flex flex-col gap-2.5 mt-2">
          {visibleBlocks.length === 0 ? (
            <div className="text-center py-10 opacity-50">
              <p className={cn('text-sm', theme.subtext)}>
                Dodaj bloki w edytorze →
              </p>
            </div>
          ) : (
            visibleBlocks.map(block => (
              <BlockPreviewItem
                key={block.id}
                block={block}
                btnBase={btnBase}
                isOutline={isOutline}
                theme={theme}
                textStyle={textStyle}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function BlockPreviewItem({
  block,
  btnBase,
  isOutline,
  theme,
  textStyle,
}: {
  block: Block
  btnBase: string
  isOutline: boolean
  theme: { bg: string; text: string; subtext: string; button: string }
  textStyle: React.CSSProperties
}) {
  if (block.type === 'divider') {
    return <hr className="w-full border-current opacity-20" />
  }

  if (block.type === 'header') {
    return (
      <p
        className={cn('text-center font-bold text-base', theme.text)}
        style={textStyle}
      >
        {block.label ?? block.title}
      </p>
    )
  }

  if (block.type === 'text') {
    return (
      <p
        className={cn('text-center text-sm', theme.subtext)}
        style={textStyle}
      >
        {block.content ?? block.label ?? block.title}
      </p>
    )
  }

  if (block.type === 'image') {
    const src = block.image_url ?? block.url
    if (!src) return null
    return (
      <img
        src={src}
        alt={block.label ?? block.title ?? ''}
        className="w-full rounded-xl object-cover max-h-48"
      />
    )
  }

  if (block.type === 'video') {
    if (!block.url) return null
    const embedUrl = block.url
      .replace('watch?v=', 'embed/')
      .replace('youtu.be/', 'www.youtube.com/embed/')
    return (
      <div className="w-full aspect-video rounded-xl overflow-hidden">
        <iframe
          src={embedUrl}
          className="w-full h-full"
          allowFullScreen
          title={block.label ?? block.title ?? 'Video'}
        />
      </div>
    )
  }

  // Domyślnie — przycisk (link, social, email, music, product itp.)
  return (
    <a
      href={block.url ?? '#'}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'w-full py-3 px-5 text-center text-sm font-semibold transition-all',
        btnBase,
        isOutline
          ? 'border-2 border-current bg-transparent'
          : theme.button
      )}
      style={isOutline ? textStyle : undefined}
    >
      {block.icon && <span className="mr-2">{block.icon}</span>}
      {block.label ?? block.title ?? block.url ?? 'Link'}
    </a>
  )
}
