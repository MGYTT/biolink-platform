'use client'

import Link from 'next/link'
import { ArrowLeft, Save, Globe, EyeOff, ExternalLink, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import type { Page } from '@/types'
import { cn } from '@/lib/utils'

interface EditorToolbarProps {
  page: Page
  isSaving: boolean
  hasUnsaved: boolean
  onSave: () => void
  onPublishToggle: () => void
}

export function EditorToolbar({
  page, isSaving, hasUnsaved, onSave, onPublishToggle
}: EditorToolbarProps) {
  return (
    <div className="h-14 border-b bg-background flex items-center px-4 gap-3 flex-shrink-0">
      {/* Powrót */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/pages">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Wróć do dashboard</TooltipContent>
      </Tooltip>

      {/* Nazwa strony */}
      <div className="flex items-center gap-2">
        <span className="font-semibold text-sm truncate max-w-[200px]">{page.title}</span>
        <span className="text-xs text-muted-foreground">/{page.slug}</span>
        {hasUnsaved && (
          <Badge variant="outline" className="text-[10px] border-amber-400 text-amber-600">
            Niezapisane
          </Badge>
        )}
      </div>

      <div className="ml-auto flex items-center gap-3">
        {/* Toggle publikacja */}
        <div className="flex items-center gap-2">
          <Switch
            id="publish"
            checked={page.is_published}
            onCheckedChange={onPublishToggle}
          />
          <Label htmlFor="publish" className="text-sm cursor-pointer flex items-center gap-1">
            {page.is_published
              ? <><Globe className="h-3.5 w-3.5 text-green-500" /> Online</>
              : <><EyeOff className="h-3.5 w-3.5 text-muted-foreground" /> Ukryta</>
            }
          </Label>
        </div>

        {/* Podgląd na żywo */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/@${page.slug}`} target="_blank">
                <ExternalLink className="h-4 w-4 mr-1.5" />
                Podgląd
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Otwórz stronę publiczną</TooltipContent>
        </Tooltip>

        {/* Zapisz */}
        <Button
          onClick={onSave}
          disabled={isSaving || !hasUnsaved}
          size="sm"
          className={cn(hasUnsaved && 'animate-pulse')}
        >
          {isSaving
            ? <><Loader2 className="h-4 w-4 mr-1.5 animate-spin" />Zapisywanie...</>
            : <><Save className="h-4 w-4 mr-1.5" />Zapisz</>
          }
        </Button>
      </div>
    </div>
  )
}
