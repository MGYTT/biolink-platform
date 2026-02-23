'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Page } from '@/types'

interface PageSettingsProps {
  page: Page
  onUpdate: (updates: Partial<Page>) => void
  isPro: boolean
}

export function PageSettings({ page, onUpdate, isPro }: PageSettingsProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">

      {/* Podstawowe info */}
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Tytuł strony
          </Label>
          <Input
            value={page.title}
            onChange={e => onUpdate({ title: e.target.value })}
            placeholder="Moja strona"
            className="h-9"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Opis / Podtytuł
          </Label>
          <Input
            value={page.description ?? ''}
            onChange={e => onUpdate({ description: e.target.value || null })}
            placeholder="Krótki opis..."
            className="h-9"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            URL zdjęcia profilowego
          </Label>
          <Input
            value={page.profile_pic ?? ''}
            onChange={e => onUpdate({ profile_pic: e.target.value || null })}
            placeholder="https://..."
            className="h-9"
          />
          {page.profile_pic && (
            <img
              src={page.profile_pic}
              alt="preview"
              className="w-14 h-14 rounded-full object-cover border mt-2"
            />
          )}
        </div>
      </div>

      {/* Publikacja */}
      <div className="space-y-3">
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground block">
          Publikacja
        </Label>
        <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
          <div>
            <p className="text-sm font-medium">Strona publiczna</p>
            <p className="text-xs text-muted-foreground">
              Widoczna pod adresem /{page.slug}
            </p>
          </div>
          <Switch
            checked={page.is_published}
            onCheckedChange={v => onUpdate({ is_published: v })}
          />
        </div>
      </div>

      {/* SEO */}
      <div className="space-y-4">
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground block">
          SEO & Social
        </Label>

        <div className="space-y-1.5">
          <Label className="text-xs">Meta tytuł</Label>
          <Input
            value={page.seo_title ?? ''}
            onChange={e => onUpdate({ seo_title: e.target.value || null })}
            placeholder={page.title}
            className="h-9 text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Meta opis</Label>
          <Input
            value={page.seo_desc ?? ''}
            onChange={e => onUpdate({ seo_desc: e.target.value || null })}
            placeholder="Opis strony dla Google..."
            className="h-9 text-sm"
          />
        </div>

        <div className={cn('space-y-1.5', !isPro && 'opacity-60')}>
          <Label className="text-xs flex items-center gap-2">
            Social media obraz (OG Image)
            {!isPro && (
              <Badge className="text-[9px] px-1 bg-amber-500 h-3.5">PRO</Badge>
            )}
          </Label>
          <Input
            value={page.meta_image ?? ''}
            onChange={e => isPro && onUpdate({ meta_image: e.target.value || null })}
            placeholder="https://..."
            className="h-9 text-sm"
            disabled={!isPro}
          />
        </div>
      </div>

      {/* URL */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground block">
          Adres URL
        </Label>
        <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border">
          <span className="text-xs text-muted-foreground">biolink.app/@</span>
          <span className="text-xs font-mono font-semibold">{page.slug}</span>
        </div>
        <p className="text-[10px] text-muted-foreground">
          Zmiana adresu URL dostępna w ustawieniach konta.
        </p>
      </div>
    </div>
  )
}
