'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger
} from '@/components/ui/tooltip'
import {
  Eye, EyeOff, ExternalLink, Save, Loader2, Undo2
} from 'lucide-react'
import type { Page } from '@/types'

interface EditorToolbarProps {
  page: Page
  isSaving: boolean
  hasChanges: boolean
  onSave: () => void
  onTogglePublish: () => void
}

export function EditorToolbar({
  page,
  isSaving,
  hasChanges,
  onSave,
  onTogglePublish,
}: EditorToolbarProps) {
  return (
    <div className="h-14 border-b bg-background/95 backdrop-blur-sm flex items-center justify-between px-4 flex-shrink-0">
      {/* Lewa strona — tytuł + status */}
      <div className="flex items-center gap-3">
        <div>
          <p className="font-semibold text-sm leading-tight">{page.title}</p>
          <p className="text-[11px] text-muted-foreground">/{page.slug}</p>
        </div>
        <Badge
          variant={page.is_published ? 'default' : 'secondary'}
          className="text-[10px] h-5"
        >
          {page.is_published ? '● Opublikowana' : '○ Szkic'}
        </Badge>
        {hasChanges && (
          <Badge variant="outline" className="text-[10px] h-5 text-amber-600 border-amber-300">
            Niezapisane zmiany
          </Badge>
        )}
      </div>

      {/* Prawa strona — akcje */}
      <TooltipProvider>
        <div className="flex items-center gap-2">
          {/* Podgląd */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                asChild
              >
                <a
                  href={`/u/${page.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span className="hidden sm:inline text-xs">Podgląd</span>
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Otwórz stronę publiczną</TooltipContent>
          </Tooltip>

          {/* Publikuj / Ukryj */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={onTogglePublish}
                className="flex items-center gap-1.5"
              >
                {page.is_published
                  ? <><EyeOff className="h-4 w-4" /><span className="hidden sm:inline text-xs">Ukryj</span></>
                  : <><Eye className="h-4 w-4" /><span className="hidden sm:inline text-xs">Opublikuj</span></>
                }
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {page.is_published ? 'Ukryj stronę' : 'Opublikuj stronę'}
            </TooltipContent>
          </Tooltip>

          {/* Zapisz */}
          <Button
            size="sm"
            onClick={onSave}
            disabled={isSaving || !hasChanges}
            className="flex items-center gap-1.5"
          >
            {isSaving
              ? <><Loader2 className="h-4 w-4 animate-spin" /><span className="text-xs">Zapisywanie...</span></>
              : <><Save className="h-4 w-4" /><span className="text-xs">Zapisz</span></>
            }
          </Button>
        </div>
      </TooltipProvider>
    </div>
  )
}
