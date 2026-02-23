'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, ArrowRight, Check, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SlugInput } from './SlugInput'
import { TemplateCard } from './TemplateCard'
import type { Theme, ButtonStyle } from '@/types'

export const TEMPLATES: {
  id: string
  name: string
  description: string
  emoji: string
  theme: Theme
  button_style: ButtonStyle
  bg_color: string
  pro?: boolean
}[] = [
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Czysty biały design',
    emoji: '⚪',
    theme: 'default',
    button_style: 'rounded',
    bg_color: '#ffffff',
  },
  {
    id: 'dark',
    name: 'Dark',
    description: 'Elegancki ciemny motyw',
    emoji: '⚫',
    theme: 'dark',
    button_style: 'rounded',
    bg_color: '#0a0a0a',
  },
  {
    id: 'purple',
    name: 'Purple Vibes',
    description: 'Kreatywny fioletowy',
    emoji: '💜',
    theme: 'purple',
    button_style: 'pill',
    bg_color: '#7c3aed',
  },
  {
    id: 'ocean',
    name: 'Ocean',
    description: 'Świeży niebieski',
    emoji: '🌊',
    theme: 'ocean',
    button_style: 'pill',
    bg_color: '#2563eb',
  },
  {
    id: 'sunset',
    name: 'Sunset',
    description: 'Ciepły pomarańczowy',
    emoji: '🌅',
    theme: 'sunset',
    button_style: 'rounded',
    bg_color: '#f97316',
  },
  {
    id: 'forest',
    name: 'Forest',
    description: 'Naturalny zielony',
    emoji: '🌿',
    theme: 'forest',
    button_style: 'rounded',
    bg_color: '#15803d',
    pro: true,
  },
]

interface NewPageClientProps {
  userId: string
  username: string
  isPro: boolean
}

type Step = 1 | 2 | 3

export function NewPageClient({ userId, username, isPro }: NewPageClientProps) {
  const router = useRouter()
  const supabase = createClient()

  const [step,             setStep]             = useState<Step>(1)
  const [title,            setTitle]            = useState('')
  const [slug,             setSlug]             = useState('')
  const [slugAvailable,    setSlugAvailable]    = useState<boolean | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState('minimal')
  const [isCreating,       setIsCreating]       = useState(false)

  // Auto-generuj slug z tytułu
  function handleTitleChange(value: string) {
    setTitle(value)
    const autoSlug = value
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .slice(0, 30)
    setSlug(autoSlug)
    setSlugAvailable(null)
  }

  async function handleCreate() {
    if (!title.trim()) {
      toast.error('Wpisz tytuł strony')
      return
    }
    if (!slug.trim()) {
      toast.error('Wpisz adres URL')
      return
    }
    if (slugAvailable === false) {
      toast.error('Ten adres URL jest zajęty')
      return
    }

    setIsCreating(true)

    try {
      const template = TEMPLATES.find(t => t.id === selectedTemplate) ?? TEMPLATES[0]

      const { data: page, error } = await supabase
        .from('pages')
        .insert({
          user_id:      userId,
          title:        title.trim(),
          slug:         slug.trim(),
          description:  null,
          profile_pic:  null,
          is_published: false,
          theme:        template.theme,
          button_style: template.button_style,
          font_family:  'inter',
          bg_type:      'solid',
          bg_color:     template.bg_color,
          bg_gradient:  null,
          gradient_from: null,
          gradient_to:  null,
          text_color:   null,
          seo_title:    null,
          seo_desc:     null,
          meta_image:   null,
          created_at:   new Date().toISOString(),
          updated_at:   new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error

      toast.success('Strona utworzona! 🎉')
      router.push(`/dashboard/editor/${page.id}`)
    } catch (err: unknown) {
  const error = err as { message?: string; code?: string; details?: string }
  console.error('Szczegóły błędu:', error)
  toast.error(`Błąd: ${error?.message ?? 'Nieznany błąd'}`)
} finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Nowa strona</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Stwórz swoją stronę link-in-bio w kilka sekund
        </p>
      </div>

      {/* Progress steps */}
      <div className="flex items-center gap-2">
        {(['1', '2', '3'] as const).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={cn(
              'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all',
              Number(s) < step
                ? 'bg-primary text-primary-foreground'
                : Number(s) === step
                  ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                  : 'bg-muted text-muted-foreground'
            )}>
              {Number(s) < step ? <Check className="h-3.5 w-3.5" /> : s}
            </div>
            <span className={cn(
              'text-xs font-medium hidden sm:block',
              Number(s) === step ? 'text-foreground' : 'text-muted-foreground'
            )}>
              {s === '1' ? 'Tytuł & URL' : s === '2' ? 'Szablon' : 'Gotowe'}
            </span>
            {i < 2 && <div className="w-8 h-px bg-border mx-1" />}
          </div>
        ))}
      </div>

      {/* ======= KROK 1 — Tytuł & URL ======= */}
      {step === 1 && (
        <Card>
          <CardContent className="pt-6 space-y-6">
            {/* Tytuł */}
            <div className="space-y-2">
              <Label className="font-semibold">
                Nazwa strony <span className="text-red-500">*</span>
              </Label>
              <Input
                value={title}
                onChange={e => handleTitleChange(e.target.value)}
                placeholder="np. Anna Kowalska — Designerka"
                className="h-11 text-base"
                maxLength={60}
                autoFocus
              />
              <p className="text-xs text-muted-foreground">
                Wyświetlana jako tytuł Twojej strony publicznej
              </p>
            </div>

            {/* Slug */}
            <SlugInput
              slug={slug}
              onSlugChange={setSlug}
              onAvailabilityChange={setSlugAvailable}
              isAvailable={slugAvailable}
            />

            <Button
              className="w-full h-11"
              onClick={() => {
                if (!title.trim() || !slug.trim()) {
                  toast.error('Wypełnij tytuł i adres URL')
                  return
                }
                if (slugAvailable === false) {
                  toast.error('Ten adres URL jest zajęty')
                  return
                }
                setStep(2)
              }}
            >
              Dalej — wybierz szablon
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ======= KROK 2 — Szablon ======= */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {TEMPLATES.map(template => (
              <TemplateCard
                key={template.id}
                template={template}
                isSelected={selectedTemplate === template.id}
                isPro={isPro}
                onSelect={() => {
                  if (template.pro && !isPro) {
                    toast.error('Ten szablon wymaga planu Pro ⭐')
                    return
                  }
                  setSelectedTemplate(template.id)
                }}
              />
            ))}
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 h-11"
              onClick={() => setStep(1)}
            >
              ← Wróć
            </Button>
            <Button
              className="flex-1 h-11"
              onClick={() => setStep(3)}
            >
              Dalej — podsumowanie
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* ======= KROK 3 — Podsumowanie ======= */}
      {step === 3 && (
        <Card>
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-base">Podsumowanie</h3>

              {/* Podgląd */}
              <div className="rounded-xl border bg-muted/30 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Tytuł</span>
                  <span className="text-sm font-semibold">{title}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Adres URL</span>
                  <span className="text-sm font-mono font-semibold text-primary">
                    /@{slug}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Szablon</span>
                  <span className="text-sm font-semibold flex items-center gap-1.5">
                    {TEMPLATES.find(t => t.id === selectedTemplate)?.emoji}
                    {TEMPLATES.find(t => t.id === selectedTemplate)?.name}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant="secondary" className="text-xs">Szkic</Badge>
                </div>
              </div>

              <p className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
                💡 Strona zostanie zapisana jako szkic. Możesz ją opublikować
                w edytorze po dodaniu treści.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 h-11"
                onClick={() => setStep(2)}
                disabled={isCreating}
              >
                ← Wróć
              </Button>
              <Button
                className="flex-1 h-11 font-bold"
                onClick={handleCreate}
                disabled={isCreating}
              >
                {isCreating ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Tworzenie...</>
                ) : (
                  <><Sparkles className="h-4 w-4 mr-2" />Utwórz stronę</>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
