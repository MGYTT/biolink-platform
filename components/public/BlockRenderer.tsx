import { cn } from '@/lib/utils'
import { ExternalLink } from 'lucide-react'

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */
interface Block {
  id:      string
  type:    string
  content: Record<string, unknown>
}

/* ─────────────────────────────────────────
   Safe content helpers
───────────────────────────────────────── */
function str(val: unknown): string {
  return typeof val === 'string' ? val : ''
}

function strOrNull(val: unknown): string | null {
  return typeof val === 'string' ? val : null
}

interface SocialLink {
  platform: string
  url:      string
  icon?:    string
}

function toSocialLinks(val: unknown): SocialLink[] {
  if (!Array.isArray(val)) return []
  return val.filter(
    (item): item is SocialLink =>
      typeof item === 'object' &&
      item !== null &&
      typeof (item as SocialLink).platform === 'string' &&
      typeof (item as SocialLink).url === 'string',
  )
}

/* ─────────────────────────────────────────
   Block renderers
───────────────────────────────────────── */
function LinkBlock({ content }: { content: Record<string, unknown> }) {
  const url   = str(content.url)
  const title = str(content.title)
  const icon  = strOrNull(content.icon)

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'flex items-center justify-between gap-3',
        'w-full px-5 py-3.5 rounded-xl border bg-card',
        'text-sm font-semibold',
        'hover:bg-accent hover:border-primary/30',
        'transition-all duration-200 hover:shadow-sm hover:-translate-y-px',
        'group',
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        {icon && (
          <span className="text-lg flex-shrink-0">{icon}</span>
        )}
        <span className="truncate">{title}</span>
      </div>
      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground/40 flex-shrink-0 group-hover:text-muted-foreground transition-colors" />
    </a>
  )
}

function HeadingBlock({ content }: { content: Record<string, unknown> }) {
  return (
    <h2 className="text-xs font-bold text-center py-1 text-muted-foreground uppercase tracking-widest">
      {str(content.text)}
    </h2>
  )
}

function TextBlock({ content }: { content: Record<string, unknown> }) {
  return (
    <p className="text-sm text-muted-foreground text-center leading-relaxed px-2">
      {str(content.text)}
    </p>
  )
}

function ImageBlock({ content }: { content: Record<string, unknown> }) {
  const url = str(content.url)
  const alt = str(content.alt)

  if (!url) return null

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={alt}
      className="w-full rounded-xl object-cover max-h-64"
    />
  )
}

function DividerBlock() {
  return <hr className="border-border my-1" />
}

function SocialBlock({ content }: { content: Record<string, unknown> }) {
  const links = toSocialLinks(content.links)

  return (
    <div className="flex items-center justify-center gap-3 flex-wrap py-1">
      {links.map(link => (
        <a
          key={link.platform}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.platform}
          className={cn(
            'w-10 h-10 rounded-full border flex items-center justify-center',
            'bg-card hover:bg-accent hover:border-primary/30',
            'transition-all duration-200 hover:scale-105 text-sm',
          )}
        >
          {link.icon ?? link.platform[0]?.toUpperCase() ?? '?'}
        </a>
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────
   Main renderer
───────────────────────────────────────── */
export function BlockRenderer({ block }: { block: Block }) {
  const { type, content } = block

  switch (type) {
    case 'link':    return <LinkBlock    content={content} />
    case 'heading': return <HeadingBlock content={content} />
    case 'text':    return <TextBlock    content={content} />
    case 'image':   return <ImageBlock   content={content} />
    case 'divider': return <DividerBlock />
    case 'social':  return <SocialBlock  content={content} />
    default:        return null
  }
}
