import { cn } from '@/lib/utils'
import { ExternalLink } from 'lucide-react'

interface Block {
  id:      string
  type:    string
  content: Record<string, unknown>
}

export function BlockRenderer({ block }: { block: Block }) {
  switch (block.type) {

    case 'link':
      return (
        <a
          href={block.content.url as string}
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
            {block.content.icon && (
              <span className="text-lg flex-shrink-0">{block.content.icon as string}</span>
            )}
            <span className="truncate">{block.content.title as string}</span>
          </div>
          <ExternalLink className="h-3.5 w-3.5 text-muted-foreground/40 flex-shrink-0 group-hover:text-muted-foreground transition-colors" />
        </a>
      )

    case 'heading':
      return (
        <h2 className="text-base font-bold text-center py-1 text-muted-foreground uppercase tracking-widest text-xs">
          {block.content.text as string}
        </h2>
      )

    case 'text':
      return (
        <p className="text-sm text-muted-foreground text-center leading-relaxed px-2">
          {block.content.text as string}
        </p>
      )

    case 'image':
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={block.content.url as string}
          alt={(block.content.alt as string) ?? ''}
          className="w-full rounded-xl object-cover max-h-64"
        />
      )

    case 'divider':
      return <hr className="border-border my-1" />

    case 'social':
      return (
        <div className="flex items-center justify-center gap-3 flex-wrap py-1">
          {(block.content.links as Array<{ platform: string; url: string; icon?: string }>)?.map(link => (
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
              {link.icon ?? link.platform[0].toUpperCase()}
            </a>
          ))}
        </div>
      )

    default:
      return null
  }
}
