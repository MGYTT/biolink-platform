'use client'

import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'

import { createClient } from '@/lib/supabase/client'
import type { Block, Page } from '@/types'

import { EditorToolbar } from './EditorToolbar'
import { BlockList }     from './BlockList'
import { BlockItem }     from './BlockItem'
import { AddBlockMenu }  from './AddBlockMenu'
import { PageSettings }  from './PageSettings'
import { DesignPanel }   from './DesignPanel'
import { PagePreview }   from '../preview/PagePreview'

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'sonner'
import { Layers, Palette, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

/* ─────────────────────────────────────────
   Constants
───────────────────────────────────────── */
const PAGE_FIELDS_TO_SAVE = [
  'title', 'description', 'profile_pic', 'is_published',
  'theme', 'button_style', 'font_family',
  'bg_type', 'bg_color', 'bg_gradient', 'gradient_from', 'gradient_to',
  'text_color', 'button_color', 'button_text_color', 'block_animation',
  'custom_css', 'seo_title', 'seo_desc', 'meta_image',
] as const satisfies ReadonlyArray<keyof Page>

const BLOCK_FIELDS_TO_SAVE = [
  'title', 'label', 'url', 'content', 'image_url', 'icon',
  'thumbnail', 'is_active', 'is_visible', 'position',
  'settings', 'visible_from', 'visible_to',
  'schedule_start', 'schedule_end',
] as const satisfies ReadonlyArray<keyof Block>

/* ─────────────────────────────────────────
   Helpers
───────────────────────────────────────── */
function pickFields<T extends object>(
  obj: T,
  fields: ReadonlyArray<keyof T>,
): Partial<T> {
  return Object.fromEntries(
    fields.map(k => [k, obj[k]])
  ) as Partial<T>
}

/* ─────────────────────────────────────────
   Empty state
───────────────────────────────────────── */
function EmptyBlocks() {
  return (
    <div className="flex flex-col items-center justify-center py-14 px-4 text-center gap-3">
      <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center">
        <Layers className="h-5 w-5 text-muted-foreground" />
      </div>
      <div>
        <p className="text-sm font-medium">Brak bloków</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Kliknij „Dodaj blok" powyżej, aby zacząć
        </p>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */
interface EditorClientProps {
  initialPage:   Page
  initialBlocks: Block[]
  isPro:         boolean
}

type ActiveTab = 'blocks' | 'design' | 'settings'

/* ─────────────────────────────────────────
   Main component
───────────────────────────────────────── */
export function EditorClient({
  initialPage,
  initialBlocks,
  isPro,
}: EditorClientProps) {
  const supabase = createClient()

  /* ── State ── */
  const [pageData,   setPageData]   = useState<Page>(initialPage)
  const [blocks,     setBlocks]     = useState<Block[]>(initialBlocks)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [activeTab,  setActiveTab]  = useState<ActiveTab>('blocks')
  const [isSaving,   setIsSaving]   = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [draggingId, setDraggingId] = useState<string | null>(null)

  /* ── Track changes (skip initial mount) ── */
  const isMounted = useRef(false)
  useEffect(() => {
    if (!isMounted.current) { isMounted.current = true; return }
    setHasChanges(true)
  }, [pageData, blocks])

  /* ── Warn before unload with unsaved changes ── */
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (!hasChanges) return
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [hasChanges])

  /* ── DnD sensors ── */
  const sensors = useSensors(
    useSensor(PointerSensor,  { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  /* ── Sorted blocks (memoised) ── */
  const sortedBlocks = useMemo(
    () => [...blocks].sort((a, b) => a.position - b.position),
    [blocks],
  )

  const draggingBlock = useMemo(
    () => draggingId ? blocks.find(b => b.id === draggingId) ?? null : null,
    [draggingId, blocks],
  )

  /* ─────────────────────────────────────
     Handlers
  ───────────────────────────────────── */

  /* Save page + blocks */
  const handleSave = useCallback(async () => {
    setIsSaving(true)
    try {
      const { error: pageError } = await supabase
        .from('pages')
        .update({
          ...pickFields(pageData, PAGE_FIELDS_TO_SAVE),
          updated_at: new Date().toISOString(),
        })
        .eq('id', pageData.id)

      if (pageError) throw pageError

      /* Batch-update blocks in parallel */
      const blockUpdates = blocks.map(block =>
        supabase
          .from('blocks')
          .update({
            ...pickFields(block, BLOCK_FIELDS_TO_SAVE),
            updated_at: new Date().toISOString(),
          })
          .eq('id', block.id)
      )

      const results = await Promise.all(blockUpdates)
      const blockError = results.find(r => r.error)?.error
      if (blockError) throw blockError

      setHasChanges(false)
      toast.success('Zapisano!', { description: 'Wszystkie zmiany zostały zapisane.' })
    } catch (err) {
      console.error('[EditorClient] save error:', err)
      toast.error('Błąd zapisu', {
        description: 'Sprawdź połączenie z internetem i spróbuj ponownie.',
      })
    } finally {
      setIsSaving(false)
    }
  }, [pageData, blocks, supabase])

  /* Toggle publish with optimistic update */
  const handleTogglePublish = useCallback(async () => {
    const next = !pageData.is_published
    setPageData(p => ({ ...p, is_published: next }))

    const { error } = await supabase
      .from('pages')
      .update({ is_published: next, updated_at: new Date().toISOString() })
      .eq('id', pageData.id)

    if (error) {
      setPageData(p => ({ ...p, is_published: !next }))
      toast.error('Błąd zmiany statusu')
    } else {
      toast.success(next ? '🌐 Strona opublikowana!' : 'Strona ukryta', {
        description: next
          ? `Dostępna pod biolink.app/@${pageData.slug}`
          : 'Nikt nie może jej teraz zobaczyć.',
      })
    }
  }, [pageData.id, pageData.is_published, pageData.slug, supabase])

  /* Add block */
  const handleAddBlock = useCallback(async (type: Block['type']) => {
    const position = blocks.length

    const { data, error } = await supabase
      .from('blocks')
      .insert({
        page_id:      pageData.id,
        type,
        title:        null,
        label:        null,
        url:          null,
        content:      null,
        image_url:    null,
        icon:         null,
        thumbnail:    null,
        is_active:    true,
        is_visible:   true,
        position,
        settings:     null,
        visible_from: null,
        visible_to:   null,
        schedule_start: null,
        schedule_end:   null,
      })
      .select()
      .single()

    if (error) {
      toast.error('Błąd dodawania bloku')
      return
    }

    setBlocks(prev => [...prev, data as Block])
    setSelectedId(data.id)

    /* Auto-switch to blocks tab */
    if (activeTab !== 'blocks') setActiveTab('blocks')

    toast.success('Blok dodany')
  }, [blocks.length, pageData.id, activeTab, supabase])

  /* Update block (local only — saved with handleSave) */
  const handleUpdateBlock = useCallback((id: string, updates: Partial<Block>) => {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b))
  }, [])

  /* Delete block */
  const handleDeleteBlock = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('blocks')
      .delete()
      .eq('id', id)

    if (error) {
      toast.error('Błąd usuwania bloku')
      return
    }

    setBlocks(prev => {
      const filtered = prev.filter(b => b.id !== id)
      return filtered.map((b, i) => ({ ...b, position: i }))
    })

    if (selectedId === id) setSelectedId(null)
    toast.success('Blok usunięty')
  }, [selectedId, supabase])

  /* Update page fields */
  const handleUpdatePage = useCallback((updates: Partial<Page>) => {
    setPageData(p => ({ ...p, ...updates }))
  }, [])

  /* Drag start */
  const handleDragStart = useCallback((event: DragStartEvent) => {
    setDraggingId(event.active.id as string)
  }, [])

  /* Drag end */
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    setDraggingId(null)
    const { active, over } = event
    if (!over || active.id === over.id) return

    setBlocks(prev => {
      const oldIndex = prev.findIndex(b => b.id === active.id)
      const newIndex = prev.findIndex(b => b.id === over.id)
      return arrayMove(prev, oldIndex, newIndex).map((b, i) => ({ ...b, position: i }))
    })
  }, [])

  /* ─────────────────────────────────────
     Render
  ───────────────────────────────────── */
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">

      {/* ── Toolbar ── */}
      <EditorToolbar
        page={pageData}
        isSaving={isSaving}
        hasChanges={hasChanges}
        onSave={handleSave}
        onTogglePublish={handleTogglePublish}
      />

      <div className="flex flex-1 overflow-hidden">

        {/* ════════════════════════════
            LEFT PANEL
        ════════════════════════════ */}
        <aside className="w-80 flex-shrink-0 border-r flex flex-col bg-background overflow-hidden">
          <Tabs
            value={activeTab}
            onValueChange={v => setActiveTab(v as ActiveTab)}
            className="flex flex-col h-full"
          >
            {/* Tab triggers */}
            <TabsList className="grid grid-cols-3 mx-3 mt-3 mb-0 flex-shrink-0">
              <TabsTrigger value="blocks" className="flex items-center gap-1.5 text-xs">
                <Layers className="h-3.5 w-3.5" />
                Bloki
              </TabsTrigger>
              <TabsTrigger value="design" className="flex items-center gap-1.5 text-xs">
                <Palette className="h-3.5 w-3.5" />
                Wygląd
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-1.5 text-xs">
                <Settings className="h-3.5 w-3.5" />
                Ustawienia
              </TabsTrigger>
            </TabsList>

            {/* ── Blocks tab ── */}
            <TabsContent
              value="blocks"
              className="flex flex-col flex-1 overflow-hidden mt-0 data-[state=inactive]:hidden"
              forceMount
            >
              <div className="px-3 pt-3 pb-2 flex-shrink-0">
                <AddBlockMenu onAdd={handleAddBlock} isPro={isPro} />
              </div>

              <ScrollArea className="flex-1">
                <div className="px-3 pb-4">
                  {sortedBlocks.length === 0 ? (
                    <EmptyBlocks />
                  ) : (
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      modifiers={[restrictToVerticalAxis]}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext
                        items={sortedBlocks.map(b => b.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <BlockList
                          blocks={sortedBlocks}
                          selectedBlockId={selectedId}
                          onSelect={setSelectedId}
                          onUpdate={handleUpdateBlock}
                          onDelete={handleDeleteBlock}
                          isPro={isPro}
                        />
                      </SortableContext>

                      {/* Drag overlay — ghost item while dragging */}
                      <DragOverlay>
                        {draggingBlock && (
                          <div className="opacity-90 rotate-1 shadow-2xl rounded-lg">
                            <BlockItem
                              block={draggingBlock}
                              isSelected={false}
                              onSelect={() => {}}
                              onUpdate={() => {}}
                              onDelete={() => {}}
                              isPro={isPro}
                            />
                          </div>
                        )}
                      </DragOverlay>
                    </DndContext>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* ── Design tab ── */}
            <TabsContent
              value="design"
              className="flex flex-col flex-1 overflow-hidden mt-0 data-[state=inactive]:hidden"
              forceMount
            >
              <DesignPanel
                page={pageData}
                onUpdate={handleUpdatePage}
                isPro={isPro}
              />
            </TabsContent>

            {/* ── Settings tab ── */}
            <TabsContent
              value="settings"
              className="flex flex-col flex-1 overflow-hidden mt-0 data-[state=inactive]:hidden"
              forceMount
            >
              <PageSettings
                page={pageData}
                onUpdate={handleUpdatePage}
                isPro={isPro}
              />
            </TabsContent>
          </Tabs>
        </aside>

        {/* ════════════════════════════
            CENTER PREVIEW
        ════════════════════════════ */}
        <main className="flex-1 bg-muted/30 flex items-center justify-center overflow-hidden p-6">
          <div className="relative h-full max-h-[780px] aspect-[9/19.5]">

            {/* Ambient glow */}
            <div
              className="absolute inset-0 rounded-[40px] blur-3xl scale-110 pointer-events-none opacity-60"
              style={{
                background: pageData.bg_gradient
                  ?? pageData.bg_color
                  ?? 'linear-gradient(to bottom, var(--color-primary), oklch(0.627 0.265 303.9))',
                opacity: 0.25,
              }}
            />

            {/* Phone shell */}
            <div className={cn(
              'phone-glow relative w-full h-full rounded-[40px]',
              'border-[6px] border-neutral-800 bg-background',
              'shadow-2xl overflow-hidden flex flex-col',
            )}>
              {/* Notch */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-neutral-800 rounded-full z-10 flex-shrink-0" />

              {/* Home indicator */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-neutral-700 rounded-full z-10" />

              {/* Page preview */}
              <div className="flex-1 overflow-hidden mt-6 mb-4">
                <PagePreview page={pageData} blocks={sortedBlocks} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
