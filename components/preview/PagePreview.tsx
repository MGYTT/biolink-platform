'use client'

import { useEffect, useRef }  from 'react'
import type { Page, Block }   from '@/types'
import { cn }                 from '@/lib/utils'

interface PagePreviewProps {
  page:   Page
  blocks: Block[]
}

/* ── Mapy motywów ── */
const themeStyles: Record<string, {
  bg: string; text: string; subtext: string; button: string
}> = {
  default: { bg: 'bg-white',      text: 'text-gray-900', subtext: 'text-gray-500',   button: 'bg-gray-900 text-white hover:bg-gray-700'       },
  dark:    { bg: 'bg-gray-950',   text: 'text-white',    subtext: 'text-gray-400',   button: 'bg-white text-gray-900 hover:bg-gray-100'       },
  purple:  { bg: 'bg-purple-600', text: 'text-white',    subtext: 'text-purple-200', button: 'bg-white text-purple-600 hover:bg-purple-50'    },
  ocean:   { bg: 'bg-blue-600',   text: 'text-white',    subtext: 'text-blue-200',   button: 'bg-white text-blue-600 hover:bg-blue-50'        },
  sunset:  { bg: 'bg-orange-500', text: 'text-white',    subtext: 'text-orange-100', button: 'bg-white text-orange-500 hover:bg-orange-50'    },
  forest:  { bg: 'bg-green-700',  text: 'text-white',    subtext: 'text-green-200',  button: 'bg-white text-green-700 hover:bg-green-50'      },
}

const buttonRadiusMap: Record<string, string> = {
  'rounded':     'rounded-lg',
  'pill':        'rounded-full',
  'square':      'rounded-none',
  'outline':     'rounded-lg',
  'soft-shadow': 'rounded-lg shadow-lg',
}

const animationClass: Record<string, string> = {
  'none':       '',
  'fade':       'anim-fade-in',
  'slide-up':   'anim-slide-up',
  'slide-down': 'anim-slide-down',
  'bounce':     'anim-bounce-in',
  'zoom':       'anim-zoom-in',
}

export function PagePreview({ page, blocks }: PagePreviewProps) {
  const theme      = themeStyles[page.theme] ?? themeStyles.default
  const btnRadius  = buttonRadiusMap[page.button_style] ?? 'rounded-lg'
  const isOutline  = page.button_style === 'outline'
  const animClass  = animationClass[page.block_animation ?? 'none'] ?? ''
  const cssRef     = useRef<HTMLStyleElement | null>(null)

  /* ── Inject custom CSS ── */
  useEffect(() => {
    if (!page.custom_css) {
      cssRef.current?.remove()
      cssRef.current = null
      return
    }
    if (!cssRef.current) {
      cssRef.current = document.createElement('style')
      cssRef.current.setAttribute('data-custom-page-css', page.id)
      document.head.appendChild(cssRef.current)
    }
    cssRef.current.textContent = page.custom_css
    return () => { cssRef.current?.remove(); cssRef.current = null }
  }, [page.custom_css, page.id])

  /* ── Background style ── */
  const bgStyle: React.CSSProperties = {}
  if (page.bg_type === 'gradient' && page.gradient_from && page.gradient_to) {
    bgStyle.background = `linear-gradient(135deg, ${page.gradient_from}, ${page.gradient_to})`
  } else if (page.bg_type === 'solid' && page.bg_color) {
    bgStyle.backgroundColor = page.bg_color
  }

  /* ── Text color override ── */
  const textOverride: React.CSSProperties = page.text_color
    ? { color: page.text_color }
    : {}

  /* ── Button color override ── */
  const btnStyle: React.CSSProperties = {}
  if (page.button_color)      btnStyle.backgroundColor = page.button_color
  if (page.button_text_color) btnStyle.color           = page.button_text_color

  /* ── Font family ── */
  const fontMap: Record<string, string> = {
    inter:          'Inter, sans-serif',
    roboto:         'Roboto, sans-serif',
    poppins:        'Poppins, sans-serif',
    montserrat:     'Montserrat, sans-serif',
    nunito:         'Nunito, sans-serif',
    playfair:       '"Playfair Display", serif',
    merriweather:   'Merriweather, serif',
    lora:           'Lora, serif',
    mono:           '"JetBrains Mono", monospace',
    'space-grotesk': '"Space Grotesk", sans-serif',
    'dm-serif':     '"DM Serif Display", serif',
    serif:          'Georgia, serif',
  }
  const fontStyle: React.CSSProperties = {
    fontFamily: fontMap[page.font_family ?? 'inter'] ?? 'Inter, sans-serif',
  }

  const visibleBlocks = blocks
    .filter(b => {
      if (!b.is_active)  return false
      if (b.is_visible === false) return false
      const now = Date.now()
      if (b.visible_from && new Date(b.visible_from).getTime() > now) return false
      if (b.visible_to   && new Date(b.visible_to).getTime()   < now) return false
      return true
    })
    .sort((a, b) => a.position - b.position)

  return (
    <div
      className={cn(
        'w-full h-full overflow-y-auto page-root',
        !page.bg_color && !page.bg_gradient && !page.gradient_from && theme.bg
      )}
      style={{ ...bgStyle, ...fontStyle }}
    >
      <div className="max-w-sm mx-auto px-4 py-10 flex flex-col items-center gap-4">

        {/* ── Avatar ── */}
        {page.profile_pic && (
          <img
            src={page.profile_pic}
            alt={page.title}
            className="page-avatar w-20 h-20 rounded-full object-cover border-4 border-white/30 shadow-xl"
          />
        )}

        {/* ── Tytuł & opis ── */}
        <div className="text-center">
          <h1
            className={cn('page-title font-bold text-xl', theme.text)}
            style={textOverride}
          >
            {page.title}
          </h1>
          {page.description && (
            <p
              className={cn('page-description text-sm mt-1.5 leading-relaxed', theme.subtext)}
              style={textOverride}
            >
              {page.description}
            </p>
          )}
        </div>

        {/* ── Bloki ── */}
        <div className="w-full flex flex-col gap-2.5 mt-2">
          {visibleBlocks.length === 0 ? (
            <div className="text-center py-12 opacity-40">
              <p className={cn('text-sm', theme.subtext)}>
                Dodaj bloki w edytorze →
              </p>
            </div>
          ) : (
            visibleBlocks.map((block, index) => (
              <div
                key={block.id}
                className={animClass}
                style={animClass
                  ? { animationDelay: `${index * 80}ms`, animationFillMode: 'both' }
                  : undefined
                }
              >
                <BlockPreviewItem
                  block={block}
                  btnRadius={btnRadius}
                  isOutline={isOutline}
                  theme={theme}
                  textOverride={textOverride}
                  btnStyle={btnStyle}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────
   Block renderer
───────────────────────────────────── */
function BlockPreviewItem({
  block,
  btnRadius,
  isOutline,
  theme,
  textOverride,
  btnStyle,
}: {
  block:       Block
  btnRadius:   string
  isOutline:   boolean
  theme:       { bg: string; text: string; subtext: string; button: string }
  textOverride: React.CSSProperties
  btnStyle:    React.CSSProperties
}) {

  /* Divider */
  if (block.type === 'divider') {
    return <hr className="w-full border-current opacity-20 my-1" />
  }

  /* Header */
  if (block.type === 'header') {
    return (
      <p
        className={cn('page-block text-center font-bold text-base py-1', theme.text)}
        style={textOverride}
      >
        {block.label ?? block.title}
      </p>
    )
  }

  /* Text */
  if (block.type === 'text') {
    return (
      <p
        className={cn('page-block text-center text-sm leading-relaxed', theme.subtext)}
        style={textOverride}
      >
        {block.content ?? block.label ?? block.title}
      </p>
    )
  }

  /* HTML */
  if (block.type === 'html') {
    return (
      <div
        className="page-block w-full"
        dangerouslySetInnerHTML={{ __html: block.content ?? '' }}
      />
    )
  }

  /* Image */
  if (block.type === 'image') {
    const src = block.image_url ?? block.url
    if (!src) return null
    return (
      <img
        src={src}
        alt={block.label ?? block.title ?? ''}
        className="page-block w-full rounded-2xl object-cover max-h-56 shadow-sm"
      />
    )
  }

  /* Video */
  if (block.type === 'video') {
    if (!block.url) return null
    const embedUrl = block.url
      .replace('watch?v=', 'embed/')
      .replace('youtu.be/', 'www.youtube.com/embed/')
    return (
      <div className="page-block w-full aspect-video rounded-2xl overflow-hidden shadow-sm">
        <iframe
          src={embedUrl}
          className="w-full h-full"
          allowFullScreen
          title={block.label ?? block.title ?? 'Video'}
        />
      </div>
    )
  }

  /* Music / Spotify */
  if (block.type === 'music' && block.url?.includes('spotify')) {
    const spotifyEmbed = block.url
      .replace('spotify.com/track/', 'spotify.com/embed/track/')
      .replace('spotify.com/playlist/', 'spotify.com/embed/playlist/')
    return (
      <div className="page-block w-full rounded-2xl overflow-hidden shadow-sm">
        <iframe
          src={spotifyEmbed}
          width="100%"
          height="80"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          className="rounded-2xl"
          title="Spotify"
        />
      </div>
    )
  }

  /* Default — przycisk (link, social, email, product, music itp.) */
  const finalBtnStyle: React.CSSProperties = {
    ...(Object.keys(btnStyle).length > 0 ? btnStyle : {}),
  }

  return (
    <a
      href={block.url ?? '#'}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'page-block w-full flex items-center justify-center gap-2 py-3.5 px-5',
        'text-sm font-semibold transition-all duration-200 active:scale-95',
        btnRadius,
        !Object.keys(btnStyle).length && (
          isOutline
            ? 'border-2 border-current bg-transparent'
            : theme.button
        )
      )}
      style={finalBtnStyle}
    >
      {block.icon && <span className="text-base">{block.icon}</span>}
      {block.label ?? block.title ?? block.url ?? 'Link'}
    </a>
  )
}
