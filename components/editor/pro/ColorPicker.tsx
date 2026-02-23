'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

const PRESETS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#ef4444',
  '#f97316', '#eab308', '#22c55e', '#14b8a6',
  '#3b82f6', '#06b6d4', '#ffffff', '#000000',
]

interface ColorPickerProps {
  label:    string
  value:    string | null
  onChange: (color: string) => void
  isPro:    boolean
}

export function ColorPicker({ label, value, onChange, isPro }: ColorPickerProps) {
  const [open, setOpen]     = useState(false)
  const [hex,  setHex]      = useState(value ?? '#6366f1')
  const ref                 = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleHexChange(v: string) {
    setHex(v)
    if (/^#[0-9A-Fa-f]{6}$/.test(v)) onChange(v)
  }

  return (
    <div className="space-y-1.5" ref={ref}>
      <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-2">
        {label}
        {!isPro && <Badge className="text-[9px] h-3.5 px-1 bg-amber-500">PRO</Badge>}
      </Label>

      <div
        className={cn(
          'relative',
          !isPro && 'opacity-50 pointer-events-none'
        )}
      >
        <button
          onClick={() => setOpen(o => !o)}
          className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg border bg-background hover:bg-muted/50 transition-colors"
        >
          <div
            className="w-6 h-6 rounded-md border shadow-sm flex-shrink-0"
            style={{ backgroundColor: value ?? hex }}
          />
          <span className="text-sm font-mono">{value ?? hex}</span>
        </button>

        {open && (
          <div className="absolute top-full left-0 mt-2 z-50 bg-background border rounded-xl shadow-xl p-3 w-52">
            {/* Native color picker */}
            <div className="flex items-center gap-2 mb-3">
              <input
                type="color"
                value={value ?? hex}
                onChange={e => { setHex(e.target.value); onChange(e.target.value) }}
                className="w-10 h-10 rounded-lg border cursor-pointer flex-shrink-0"
              />
              <Input
                value={hex}
                onChange={e => handleHexChange(e.target.value)}
                className="h-8 font-mono text-xs"
                maxLength={7}
              />
            </div>

            {/* Presets */}
            <p className="text-[10px] text-muted-foreground mb-2 font-medium uppercase tracking-wide">
              Szybki wybór
            </p>
            <div className="grid grid-cols-6 gap-1.5">
              {PRESETS.map(color => (
                <button
                  key={color}
                  onClick={() => { setHex(color); onChange(color); setOpen(false) }}
                  className={cn(
                    'w-6 h-6 rounded-md border-2 transition-transform hover:scale-110',
                    (value ?? hex) === color
                      ? 'border-primary scale-110'
                      : 'border-transparent'
                  )}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
