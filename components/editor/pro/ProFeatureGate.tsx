// components/editor/pro/ProFeatureGate.tsx
'use client'

import { Lock, Sparkles } from 'lucide-react'
import {
  Tooltip, TooltipContent,
  TooltipProvider, TooltipTrigger,
} from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface ProFeatureGateProps {
  isPro:       boolean
  featureName: string
  children:    React.ReactNode
  className?:  string
}

export function ProFeatureGate({
  isPro,
  featureName,
  children,
  className,
}: ProFeatureGateProps) {
  if (isPro) return <>{children}</>

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn('relative group', className)}>
            {/* Blurred preview */}
            <div className="pointer-events-none select-none blur-[2px] opacity-60 saturate-50">
              {children}
            </div>

            {/* Lock overlay */}
            <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-background/60 backdrop-blur-[1px]">
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30">
                <Lock className="h-3 w-3 text-amber-600" />
                <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400">
                  PRO
                </span>
              </div>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="p-3 max-w-[220px]">
          <div className="space-y-2">
            <p className="text-xs font-semibold flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              {featureName}
            </p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Ta funkcja dostępna jest w planie Pro. Odblokuj pełen potencjał swojej strony.
            </p>
            <Button asChild size="sm" className="w-full h-7 text-xs gap-1.5 bg-amber-500 hover:bg-amber-600 text-white">
              <Link href="/dashboard/upgrade">
                Przejdź na Pro →
              </Link>
            </Button>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
