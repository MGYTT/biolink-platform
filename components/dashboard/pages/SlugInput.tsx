'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SlugInputProps {
  slug: string
  onSlugChange: (slug: string) => void
  onAvailabilityChange: (available: boolean | null) => void
  isAvailable: boolean | null
}

export function SlugInput({
  slug,
  onSlugChange,
  onAvailabilityChange,
  isAvailable,
}: SlugInputProps) {
  const supabase = createClient()
  const [checking, setChecking] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!slug || slug.length < 3) {
      onAvailabilityChange(null)
      return
    }

    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(async () => {
      setChecking(true)
      const { data } = await supabase
        .from('pages')
        .select('id')
        .eq('slug', slug)
        .single()
      setChecking(false)
      onAvailabilityChange(!data)
    }, 500)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [slug])

  function handleChange(value: string) {
    const clean = value
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .slice(0, 30)
    onSlugChange(clean)
    onAvailabilityChange(null)
  }

  return (
    <div className="space-y-2">
      <Label className="font-semibold">
        Adres URL <span className="text-red-500">*</span>
      </Label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
          /@
        </div>
        <Input
          value={slug}
          onChange={e => handleChange(e.target.value)}
          placeholder="twoja-nazwa"
          className={cn(
            'pl-9 pr-10 h-11 font-mono',
            isAvailable === true  && 'border-green-500 focus-visible:ring-green-500',
            isAvailable === false && 'border-red-500 focus-visible:ring-red-500'
          )}
          maxLength={30}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {checking && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
          {!checking && isAvailable === true && (
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          )}
          {!checking && isAvailable === false && (
            <XCircle className="h-4 w-4 text-red-500" />
          )}
        </div>
      </div>

      <p className={cn(
        'text-xs',
        isAvailable === true  && 'text-green-600 dark:text-green-400',
        isAvailable === false && 'text-red-500',
        isAvailable === null  && 'text-muted-foreground',
      )}>
        {checking          && 'Sprawdzanie dostępności...'}
        {!checking && isAvailable === true  && '✓ Adres jest dostępny!'}
        {!checking && isAvailable === false && '✗ Ten adres jest już zajęty'}
        {!checking && isAvailable === null  && 'Tylko małe litery, cyfry i myślniki'}
      </p>
    </div>
  )
}
