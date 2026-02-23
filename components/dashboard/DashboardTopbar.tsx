'use client'

import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { UserMenu } from '@/components/shared/UserMenu'
import { usePathname } from 'next/navigation'

const titles: Record<string, string> = {
  '/dashboard':            '👋 Dashboard',
  '/dashboard/pages':      '📄 Moje strony',
  '/dashboard/analytics':  '📊 Analityka',
  '/dashboard/settings':   '⚙️ Ustawienia',
  '/dashboard/upgrade':    '⭐ Upgrade do Pro',
  '/dashboard/billing':    '💳 Rozliczenia',
}

export function DashboardTopbar() {
  const pathname = usePathname()
  const title = titles[pathname] ?? 'Dashboard'

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <h1 className="font-semibold text-sm text-foreground">{title}</h1>
      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  )
}
