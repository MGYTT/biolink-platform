'use client'

import { useState, useCallback, useTransition } from 'react'
import {
  DndContext, closestCenter, KeyboardSensor,
  PointerSensor, useSensor, useSensors, DragOverlay,
  type DragEndEvent, type DragStartEvent
} from '@dnd-kit/core'
import {
  SortableContext, sortableKeyboardCoordinates,
  verticalListSortingStrategy, arrayMove
} from '@dnd-kit/sortable'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'

import { createClient } from '@/lib/supabase/client'
import type { Block, Page } from '@/types'

import { EditorToolbar } from './EditorToolbar'
import { BlockList } from './BlockList'
import { BlockItem } from './BlockItem'
import { AddBlockMenu } from './AddBlockMenu'
import { PageSettings } from './PageSettings'
import { PagePreview } from '../preview/PagePreview'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Eye, EyeOff, Save, Monitor, Smartphone } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EditorClientProps {
  page: Page
  initialBlocks: Block[]
  isPro: boolean
}

export type EditorTab = 'blocks' | 'settings' | 'design'
export type PreviewMode = 'desktop' | 'mobile'

export function EditorClient({ page, initialBlocks, isPro }: EditorClientProps) {
  const supabase = createClient()
  const [isPending, startTransition] = useTransition()

  // Stan edytora
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks)
  const [pageData, setPageData] = useState<Page>(page)
  const [activeTab, setActiveTab] = useState<EditorTab>('blocks')
  const [previewMode, setPreviewMode] = useState<PreviewMode>('mobile')
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null)
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [hasUnsaved, setHasUnsaved] = useState(false)

  // Sensory dla dnd-kit
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  // Obsługa drag start
  function handleDragStart(event: DragStartEvent) {
    setActiveBlockId(event.active.id as string)
  }

  // Obsługa drag end — aktualizacja kolejności
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveBlockId(null)

    if (!over || active.id === over.id) return

    setBlocks(prev => {
      const oldIndex = prev.findIndex(b => b.id === active.id)
      const newIndex = prev.findIndex(b => b.id === over.id)
      const reordered = arrayMove(prev, oldIndex, newIndex)

      // Aktualizuj pozycje
      return reordered.map((block, index) => ({ ...block, position: index }))
    })
    setHasUnsaved(true)
  }

  // Aktualizacja pojedynczego bloku
  const updateBlock = useCallback((blockId: string, updates: Partial<Block>) => {
    setBlocks(prev => prev.map(b => b.id === blockId ? { ...b, ...updates } : b))
    setHasUnsaved(true)
  }, [])

  // Usunięcie bloku
  const deleteBlock = useCallback((blockId: string) => {
    setBlocks(prev => prev.filter(b => b.id !== blockId))
    setHasUnsaved(true)
  }, [])

  // Dodanie nowego bloku
  const addBlock = useCallback((type: Block['type']) => {
    const newBlock: Block = {
      id: crypto.randomUUID(),
      page_id: page.id,
      type,
      label: type === 'link' ? 'Mój link' : type === 'header' ? 'Nagłówek' : '',
      url: type === 'link' ? 'https://' : null,
      icon: null,
      image_url: null,
      position: blocks.length,
      is_visible: true,
      settings: {},
      visible_from: null,
      visible_to: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    setBlocks(prev => [...prev, newBlock])
    setSelectedBlockId(newBlock.id)
    setHasUnsaved(true)
  }, [blocks.length, page.id])

  // Zapis do Supabase
  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Zapisz dane strony
      const { error: pageError } = await supabase
        .from('pages')
        .update({
          title:        pageData.title,
          description:  pageData.description,
          theme:        pageData.theme,
          bg_color:     pageData.bg_color,
          bg_gradient:  pageData.bg_gradient,
          font_family:  pageData.font_family,
          text_color:   pageData.text_color,
          button_style: pageData.button_style,
          profile_pic:  pageData.profile_pic,
          is_published: pageData.is_published,
          seo_title:    pageData.seo_title,
          seo_desc:     pageData.seo_desc,
          updated_at:   new Date().toISOString(),
        })
        .eq('id', page.id)

      if (pageError) throw pageError

      // Usuń stare bloki i wstaw nowe (upsert)
      await supabase.from('blocks').delete().eq('page_id', page.id)
      if (blocks.length > 0) {
        const { error: blocksError } = await supabase
          .from('blocks')
          .insert(blocks.map((b, i) => ({ ...b, position: i, updated_at: new Date().toISOString() })))
        if (blocksError) throw blocksError
      }

      setHasUnsaved(false)
      toast.success('Strona zapisana!', { description: 'Zmiany są widoczne publicznie.' })
    } catch {
      toast.error('Błąd zapisu', { description: 'Spróbuj ponownie.' })
    } finally {
      setIsSaving(false)
    }
  }

  const activeBlock = blocks.find(b => b.id === activeBlockId)

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      {/* Topbar edytora */}
      <EditorToolbar
        page={pageData}
        isSaving={isSaving}
        hasUnsaved={hasUnsaved}
        onSave={handleSave}
        onPublishToggle={() => {
          setPageData(p => ({ ...p, is_published: !p.is_published }))
          setHasUnsaved(true)
        }}
      />

      {/* Główny layout split-screen */}
      <div className="flex flex-1 overflow-hidden">

        {/* === LEWY PANEL: Kontrolki === */}
        <div className="w-[380px] flex-shrink-0 border-r bg-background flex flex-col overflow-hidden">
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as EditorTab)}
            className="flex flex-col h-full"
          >
            <TabsList className="grid w-full grid-cols-3 rounded-none border-b h-11 bg-muted/40">
              <TabsTrigger value="blocks"  className="text-xs">🧱 Bloki</TabsTrigger>
              <TabsTrigger value="design"  className="text-xs">🎨 Wygląd</TabsTrigger>
              <TabsTrigger value="settings" className="text-xs">⚙️ Ustawienia</TabsTrigger>
            </TabsList>

            {/* Zakładka: Bloki */}
            {activeTab === 'blocks' && (
              <div className="flex flex-col flex-1 overflow-hidden">
                <AddBlockMenu onAdd={addBlock} isPro={isPro} />
                <div className="flex-1 overflow-y-auto p-3">
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    modifiers={[restrictToVerticalAxis]}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={blocks.map(b => b.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <BlockList
                        blocks={blocks}
                        selectedBlockId={selectedBlockId}
                        onSelect={setSelectedBlockId}
                        onUpdate={updateBlock}
                        onDelete={deleteBlock}
                        isPro={isPro}
                      />
                    </SortableContext>
                    <DragOverlay>
                      {activeBlock && (
                        <div className="opacity-80 rotate-1 shadow-2xl">
                          <BlockItem
                            block={activeBlock}
                            isSelected={false}
                            isDragging={true}
                            onSelect={() => {}}
                            onUpdate={() => {}}
                            onDelete={() => {}}
                            isPro={isPro}
                          />
                        </div>
                      )}
                    </DragOverlay>
                  </DndContext>

                  {blocks.length === 0 && (
                    <div className="text-center py-16 text-muted-foreground">
                      <p className="text-4xl mb-3">🧱</p>
                      <p className="font-medium text-sm">Brak bloków</p>
                      <p className="text-xs mt-1">Dodaj pierwszy blok powyżej</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Zakładka: Wygląd */}
            {activeTab === 'design' && (
              <DesignPanel
                page={pageData}
                onUpdate={(updates) => {
                  setPageData(p => ({ ...p, ...updates }))
                  setHasUnsaved(true)
                }}
                isPro={isPro}
              />
            )}

            {/* Zakładka: Ustawienia */}
            {activeTab === 'settings' && (
              <PageSettings
                page={pageData}
                onUpdate={(updates) => {
                  setPageData(p => ({ ...p, ...updates }))
                  setHasUnsaved(true)
                }}
                isPro={isPro}
              />
            )}
          </Tabs>
        </div>

        {/* === PRAWY PANEL: Live Preview === */}
        <div className="flex-1 bg-neutral-100 dark:bg-neutral-900 flex flex-col overflow-hidden">
          {/* Przełącznik desktop/mobile */}
          <div className="flex items-center justify-center gap-2 py-3 border-b bg-background">
            <Button
              variant={previewMode === 'mobile' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setPreviewMode('mobile')}
            >
              <Smartphone className="h-4 w-4 mr-1.5" />
              Mobile
            </Button>
            <Button
              variant={previewMode === 'desktop' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setPreviewMode('desktop')}
            >
              <Monitor className="h-4 w-4 mr-1.5" />
              Desktop
            </Button>
          </div>

          {/* Preview frame */}
          <div className="flex-1 overflow-auto flex items-start justify-center p-6">
            <div className={cn(
              'transition-all duration-300',
              previewMode === 'mobile'
                ? 'w-[390px] min-h-[844px] rounded-[40px] overflow-hidden shadow-2xl border-[8px] border-neutral-800'
                : 'w-full max-w-2xl min-h-[600px] rounded-xl overflow-hidden shadow-xl border'
            )}>
              <PagePreview page={pageData} blocks={blocks} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
