'use client'

import { useState, useCallback, useEffect } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
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

import { EditorToolbar }  from './EditorToolbar'
import { BlockList }      from './BlockList'
import { AddBlockMenu }   from './AddBlockMenu'
import { PageSettings }   from './PageSettings'
import { DesignPanel }    from './DesignPanel'
import { PagePreview }    from '../preview/PagePreview'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'sonner'
import { Layers, Palette, Settings } from 'lucide-react'

interface EditorClientProps {
  initialPage:   Page
  initialBlocks: Block[]
  isPro:         boolean
}

export function EditorClient({
  initialPage,
  initialBlocks,
  isPro,
}: EditorClientProps) {
  const supabase = createClient()

  const [pageData,       setPageData]       = useState<Page>(initialPage)
  const [blocks,         setBlocks]         = useState<Block[]>(initialBlocks)
  const [selectedId,     setSelectedId]     = useState<string | null>(null)
  const [activeTab,      setActiveTab]      = useState<'blocks' | 'design' | 'settings'>('blocks')
  const [isSaving,       setIsSaving]       = useState(false)
  const [hasChanges,     setHasChanges]     = useState(false)

  // Śledź zmiany
  useEffect(() => { setHasChanges(true) }, [pageData, blocks])
  useEffect(() => { setHasChanges(false) }, [])

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor,  { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  // Zapisz stronę + bloki
  const handleSave = useCallback(async () => {
    setIsSaving(true)
    try {
      const { error: pageError } = await supabase
        .from('pages')
        .update({
          title:        pageData.title,
          description:  pageData.description,
          profile_pic:  pageData.profile_pic,
          is_published: pageData.is_published,
          theme:        pageData.theme,
          button_style: pageData.button_style,
          font_family:  pageData.font_family,
          bg_type:      pageData.bg_type,
          bg_color:     pageData.bg_color,
          bg_gradient:  pageData.bg_gradient,
          gradient_from: pageData.gradient_from,
          gradient_to:  pageData.gradient_to,
          text_color:   pageData.text_color,
          seo_title:    pageData.seo_title,
          seo_desc:     pageData.seo_desc,
          meta_image:   pageData.meta_image,
          updated_at:   new Date().toISOString(),
        })
        .eq('id', pageData.id)

      if (pageError) throw pageError

      // Zapisz pozycje bloków
      for (const block of blocks) {
        await supabase
          .from('blocks')
          .update({
            title:         block.title,
            label:         block.label,
            url:           block.url,
            content:       block.content,
            image_url:     block.image_url,
            icon:          block.icon,
            is_active:     block.is_active,
            is_visible:    block.is_visible,
            position:      block.position,
            settings:      block.settings,
            visible_from:  block.visible_from,
            visible_to:    block.visible_to,
            updated_at:    new Date().toISOString(),
          })
          .eq('id', block.id)
      }

      setHasChanges(false)
      toast.success('Zapisano!')
    } catch (err) {
      console.error(err)
      toast.error('Błąd zapisu')
    } finally {
      setIsSaving(false)
    }
  }, [pageData, blocks, supabase])

  // Publikuj / ukryj
  const handleTogglePublish = useCallback(async () => {
    const next = !pageData.is_published
    setPageData(p => ({ ...p, is_published: next }))

    const { error } = await supabase
      .from('pages')
      .update({ is_published: next })
      .eq('id', pageData.id)

    if (error) {
      setPageData(p => ({ ...p, is_published: !next }))
      toast.error('Błąd zmiany statusu')
    } else {
      toast.success(next ? 'Strona opublikowana!' : 'Strona ukryta')
    }
  }, [pageData.id, pageData.is_published, supabase])

  // Dodaj blok
  const handleAddBlock = useCallback(async (type: Block['type']) => {
    const position = blocks.length

    const { data, error } = await supabase
      .from('blocks')
      .insert({
        page_id:    pageData.id,
        type,
        title:      null,
        label:      null,
        url:        null,
        content:    null,
        image_url:  null,
        icon:       null,
        is_active:  true,
        is_visible: true,
        position,
        settings:   null,
        visible_from: null,
        visible_to:   null,
      })
      .select()
      .single()

    if (error) {
      toast.error('Błąd dodawania bloku')
      return
    }

    setBlocks(prev => [...prev, data as Block])
    setSelectedId(data.id)
    toast.success('Blok dodany')
  }, [blocks.length, pageData.id, supabase])

  // Aktualizuj blok
  const handleUpdateBlock = useCallback((id: string, updates: Partial<Block>) => {
    setBlocks(prev =>
      prev.map(b => b.id === id ? { ...b, ...updates } : b)
    )
  }, [])

  // Usuń blok
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

  // Drag & drop
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    setBlocks(prev => {
      const oldIndex = prev.findIndex(b => b.id === active.id)
      const newIndex = prev.findIndex(b => b.id === over.id)
      const reordered = arrayMove(prev, oldIndex, newIndex)
      return reordered.map((b, i) => ({ ...b, position: i }))
    })
  }, [])

  const sortedBlocks = [...blocks].sort((a, b) => a.position - b.position)

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      {/* Toolbar */}
      <EditorToolbar
        page={pageData}
        isSaving={isSaving}
        hasChanges={hasChanges}
        onSave={handleSave}
        onTogglePublish={handleTogglePublish}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* ====== PANEL LEWY ====== */}
        <div className="w-80 flex-shrink-0 border-r flex flex-col bg-background overflow-hidden">
          <Tabs
            value={activeTab}
            onValueChange={v => setActiveTab(v as typeof activeTab)}
            className="flex flex-col h-full"
          >
            {/* Zakładki */}
            <TabsList className="grid grid-cols-3 mx-3 mt-3 flex-shrink-0">
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

            {/* Zakładka: Bloki */}
            {activeTab === 'blocks' && (
              <div className="flex flex-col flex-1 overflow-hidden">
                {/* Dodaj blok */}
                <div className="px-3 pt-3 pb-2 flex-shrink-0">
                  <AddBlockMenu onAdd={handleAddBlock} isPro={isPro} />
                </div>

                {/* Lista bloków */}
                <ScrollArea className="flex-1">
                  <div className="px-3 pb-4">
                    {sortedBlocks.length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-sm text-muted-foreground">
                          Brak bloków — dodaj pierwszy! ↑
                        </p>
                      </div>
                    ) : (
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        modifiers={[restrictToVerticalAxis]}
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
                      </DndContext>
                    )}
                  </div>
                </ScrollArea>
              </div>
            )}

            {/* Zakładka: Wygląd */}
            {activeTab === 'design' && (
              <DesignPanel
                page={pageData}
                onUpdate={(updates: Partial<Page>) => {
                  setPageData(p => ({ ...p, ...updates }))
                  setHasChanges(true)
                }}
                isPro={isPro}
              />
            )}

            {/* Zakładka: Ustawienia */}
            {activeTab === 'settings' && (
              <PageSettings
                page={pageData}
                onUpdate={(updates: Partial<Page>) => {
                  setPageData(p => ({ ...p, ...updates }))
                  setHasChanges(true)
                }}
                isPro={isPro}
              />
            )}
          </Tabs>
        </div>

        {/* ====== PODGLĄD ŚRODKOWY ====== */}
        <div className="flex-1 bg-muted/30 flex items-center justify-center overflow-hidden p-6">
          {/* Ramka telefonu */}
          <div className="relative h-full max-h-[780px] aspect-[9/19.5]">
            {/* Glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-purple-500/20 rounded-[40px] blur-2xl scale-105 pointer-events-none" />

            {/* Telefon */}
            <div className="relative w-full h-full rounded-[40px] border-[6px] border-neutral-800 bg-background shadow-2xl overflow-hidden flex flex-col">
              {/* Notch */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-neutral-800 rounded-full z-10 flex-shrink-0" />

              {/* Preview */}
              <div className="flex-1 overflow-hidden mt-6">
                <PagePreview page={pageData} blocks={sortedBlocks} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
