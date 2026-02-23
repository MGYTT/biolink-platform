'use client'

import { useEffect, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Eye, EyeOff, ExternalLink, Save, Loader2,
  CheckCheck, Globe, FileText,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Page } from '@/types'

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */
interface EditorToolbarProps {
  page: Page
  isSaving: boolean
  hasChanges: boolean
  onSave: () => void
  onTogglePublish: () => void
}

/* ─────────────────────────────────────────
   Save status indicator
───────────────────────────────────────── */
type SaveStatus = 'idle' | 'saving' | 'saved' | 'unsaved'

function SaveIndicator({ status }: { status: SaveStatus }) {
  const config: Record<SaveStatus, { label: string; className: string }> = {
    idle:    { label: '',                  className: '' },
    saving:  { label: 'Zapisywanie…',     className: 'text-muted-foreground' },
    saved:   { label: 'Zapisano',         className: 'text-emerald-600 dark:text-emerald-400' },
    unsaved: { label: 'Niezapisane zmiany', className: 'text-amber-600 dark:text-amber-400' },
  }

  const { label, className } = config[status]
  if (!label) return null

  return (
    <span className={cn('hidden sm:flex items-center gap-1.5 text-[11px] font-medium transition-all', className)}>
      {status === 'saving'  && <Loader2    className="h-3 w-3 animate-spin" />}
      {status === 'saved'   && <CheckCheck className="h-3 w-3" />}
      {status === 'unsaved' && (
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
      )}
      {label}
    </span>
  )
}

/* ─────────────────────────────────────────
   Main component
───────────────────────────────────────── */
export function EditorToolbar({
  page,
  isSaving,
  hasChanges,
  onSave,
  onTogglePublish,
}: EditorToolbarProps) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')

  /* Sync save status z props */
  useEffect(() => {
    if (isSaving) {
      setSaveStatus('saving')
      return
    }
    if (hasChanges) {
      setSaveStatus('unsaved')
      return
    }
    /* Po zakończeniu zapisu — pokaż "Zapisano" przez 2.5s */
    if (saveStatus === 'saving') {
      setSaveStatus('saved')
      const t = setTimeout(() => setSaveStatus('idle'), 2500)
      return () => clearTimeout(t)
    }
  }, [isSaving, hasChanges])

  /* Ctrl/Cmd + S */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        if (hasChanges && !isSaving) onSave()
      }
    },
    [hasChanges, isSaving, onSave],
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <TooltipProvider delayDuration={300}>
      <div className="h-14 border-b bg-background/95 backdrop-blur-sm flex items-center justify-between px-4 gap-3 flex-shrink-0">

        {/* ── Left: title + status ── */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="min-w-0">
            <p className="font-semibold text-sm leading-tight truncate max-w-[160px] sm:max-w-xs">
              {page.title}
            </p>
            <p className="text-[11px] text-muted-foreground truncate">
              /{page.slug}
            </p>
          </div>

          {/* Published / draft badge */}
          <Badge
            className={cn(
              'text-[10px] h-5 gap-1 flex-shrink-0 font-semibold transition-colors',
              page.is_published
                ? 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-900'
                : 'bg-secondary text-secondary-foreground',
            )}
            variant="outline"
          >
            {page.is_published
              ? <><Globe className="h-2.5 w-2.5" /> Opublikowana</>
              : <><FileText className="h-2.5 w-2.5" /> Szkic</>
            }
          </Badge>

          {/* Save status */}
          <SaveIndicator status={saveStatus} />
        </div>

        {/* ── Right: actions ── */}
        <div className="flex items-center gap-1.5 flex-shrink-0">

          {/* Preview */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" asChild className="gap-1.5">
                <a
                  href={`/u/${page.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span className="hidden md:inline text-xs">Podgląd</span>
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              Otwórz stronę publiczną
            </TooltipContent>
          </Tooltip>

          {/* Publish / Unpublish */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={onTogglePublish}
                className={cn(
                  'gap-1.5 transition-colors',
                  page.is_published
                    ? 'border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 dark:border-emerald-900 dark:text-emerald-400 dark:hover:bg-emerald-950/40'
                    : '',
                )}
              >
                {page.is_published ? (
                  <>
                    <EyeOff className="h-4 w-4" />
                    <span className="hidden sm:inline text-xs">Ukryj</span>
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4" />
                    <span className="hidden sm:inline text-xs">Opublikuj</span>
                  </>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {page.is_published ? 'Zmień na szkic' : 'Opublikuj stronę'}
            </TooltipContent>
          </Tooltip>

          {/* Save */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                onClick={onSave}
                disabled={isSaving || !hasChanges}
                className={cn(
                  'gap-1.5 transition-all',
                  hasChanges && !isSaving && 'shadow-md shadow-primary/20',
                )}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="hidden sm:inline text-xs">Zapisywanie…</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span className="hidden sm:inline text-xs">Zapisz</span>
                  </>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {hasChanges ? (
                <span className="flex items-center gap-1.5">
                  Zapisz zmiany
                  <kbd className="px-1.5 py-0.5 text-[10px] bg-muted text-muted-foreground rounded border">
                    ⌘S
                  </kbd>
                </span>
              ) : (
                'Brak niezapisanych zmian'
              )}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  )
}
