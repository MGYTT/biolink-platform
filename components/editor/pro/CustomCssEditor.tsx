'use client'

import { Label }    from '@/components/ui/label'
import { Badge }    from '@/components/ui/badge'
import { Button }   from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn }       from '@/lib/utils'
import { Code2, RotateCcw } from 'lucide-react'
import type { Page } from '@/types'

const CSS_EXAMPLES = [
  { label: 'Zaokrąglony avatar',  css: '.page-avatar { border-radius: 12px; }'  },
  { label: 'Cień przycisków',     css: '.page-block { box-shadow: 0 8px 30px rgba(0,0,0,0.12); }' },
  { label: 'Większy tytuł',       css: '.page-title { font-size: 2rem; letter-spacing: -0.02em; }' },
]

interface CustomCssEditorProps {
  page:     Page
  onUpdate: (updates: Partial<Page>) => void
  isPro:    boolean
}

export function CustomCssEditor({ page, onUpdate, isPro }: CustomCssEditorProps) {
  return (
    <div className={cn('space-y-3', !isPro && 'opacity-50 pointer-events-none')}>
      <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-2">
        <Code2 className="h-3.5 w-3.5" />
        Własny CSS
        {!isPro && <Badge className="text-[9px] h-3.5 px-1 bg-amber-500">PRO</Badge>}
      </Label>

      {/* Szybkie snippety */}
      <div className="flex flex-wrap gap-1.5">
        {CSS_EXAMPLES.map(ex => (
          <button
            key={ex.label}
            onClick={() => {
              const current = page.custom_css ?? ''
              onUpdate({ custom_css: current ? `${current}\n${ex.css}` : ex.css })
            }}
            className="text-[10px] px-2 py-1 rounded-md bg-muted hover:bg-muted/80 border transition-colors"
          >
            + {ex.label}
          </button>
        ))}
      </div>

      <Textarea
        value={page.custom_css ?? ''}
        onChange={e => onUpdate({ custom_css: e.target.value || null })}
        placeholder={`/* Twój własny CSS */\n.page-title {\n  color: #ff0000;\n}`}
        className="font-mono text-xs resize-none h-40 bg-muted/30"
        spellCheck={false}
      />

      <div className="flex items-center justify-between">
        <p className="text-[10px] text-muted-foreground">
          Klasy: <code className="bg-muted px-1 rounded">.page-title</code>{' '}
          <code className="bg-muted px-1 rounded">.page-block</code>{' '}
          <code className="bg-muted px-1 rounded">.page-avatar</code>
        </p>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs"
          onClick={() => onUpdate({ custom_css: null })}
        >
          <RotateCcw className="h-3 w-3 mr-1" />
          Reset
        </Button>
      </div>
    </div>
  )
}
