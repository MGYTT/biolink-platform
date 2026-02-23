'use client'

import Link      from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Link2, BarChart2, Settings,
  Sparkles, CreditCard, HelpCircle, ExternalLink,
  Crown,
} from 'lucide-react'
import {
  Sidebar, SidebarContent, SidebarFooter,
  SidebarGroup, SidebarGroupLabel, SidebarHeader,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import { Badge }  from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import type { Profile } from '@/types'

/* ─────────────────────────────────────────
   Helpers (inline, żeby nie zależeć od utils.ts)
───────────────────────────────────────── */
function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map(w => w[0]?.toUpperCase() ?? '')
    .slice(0, 2)
    .join('')
}

function checkIsPro(plan: string): boolean {
  return plan === 'pro'
}

/* ─────────────────────────────────────────
   Nav config
───────────────────────────────────────── */
const NAV_MAIN = [
  { title: 'Dashboard',   href: '/dashboard',           icon: LayoutDashboard },
  { title: 'Moje strony', href: '/dashboard/pages',     icon: Link2           },
  { title: 'Analityka',   href: '/dashboard/analytics', icon: BarChart2       },
  { title: 'Ustawienia',  href: '/dashboard/settings',  icon: Settings        },
] as const

const NAV_ACCOUNT = [
  { title: 'Upgrade do Pro', href: '/dashboard/upgrade', icon: Sparkles,   proOnly: false },
  { title: 'Rozliczenia',    href: '/dashboard/billing', icon: CreditCard, proOnly: false },
] as const

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */
interface AppSidebarProps {
  profile: Profile | null
}

/* ─────────────────────────────────────────
   Component
───────────────────────────────────────── */
export function AppSidebar({ profile }: AppSidebarProps) {
  const pathname = usePathname()
  const pro      = checkIsPro(profile?.plan ?? 'free')

  /* Active check — match exact or sub-paths */
  function isActive(href: string): boolean {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  return (
    <Sidebar collapsible="icon">

      {/* ── Logo ── */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground flex-shrink-0">
                  <Link2 className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none min-w-0">
                  <span className="font-bold text-base">BioLink</span>
                  <span className="text-xs text-muted-foreground">Platform</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>

        {/* ── Główna nawigacja ── */}
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarMenu>
            {NAV_MAIN.map(item => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive(item.href)}
                  tooltip={item.title}
                >
                  <Link href={item.href}>
                    <item.icon className="size-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarSeparator />

        {/* ── Konto / Plan ── */}
        <SidebarGroup>
          <SidebarGroupLabel>Konto</SidebarGroupLabel>
          <SidebarMenu>

            {/* Upgrade — widoczny tylko dla Free, ukryty gdy Pro */}
            {!pro && (
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive('/dashboard/upgrade')}
                  tooltip="Upgrade do Pro"
                  className={cn(
                    'text-amber-600 dark:text-amber-400 font-semibold',
                    'hover:bg-amber-50 dark:hover:bg-amber-950/30',
                    'data-[active=true]:bg-amber-50 dark:data-[active=true]:bg-amber-950/30',
                    'data-[active=true]:text-amber-700 dark:data-[active=true]:text-amber-300',
                  )}
                >
                  <Link href="/dashboard/upgrade">
                    <Sparkles className="size-4" />
                    <span>Upgrade do Pro</span>
                    <Badge
                      variant="outline"
                      className="ml-auto text-[9px] h-4 px-1.5 border-amber-400 text-amber-600 dark:border-amber-700 dark:text-amber-400 font-bold"
                    >
                      14 dni free
                    </Badge>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}

            {/* Rozliczenia — zawsze widoczne */}
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive('/dashboard/billing')}
                tooltip="Rozliczenia"
              >
                <Link href="/dashboard/billing">
                  <CreditCard className="size-4" />
                  <span>Rozliczenia</span>
                  {pro && (
                    <Badge className="ml-auto text-[9px] h-4 px-1.5 bg-amber-500 hover:bg-amber-500 text-white font-bold gap-0.5 flex items-center">
                      <Crown className="h-2.5 w-2.5" />
                      PRO
                    </Badge>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

          </SidebarMenu>
        </SidebarGroup>

      </SidebarContent>

      {/* ── Footer: profil + linki ── */}
      <SidebarFooter>
        <SidebarSeparator />
        <SidebarMenu>

          {/* User profile */}
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              isActive={isActive('/dashboard/settings')}
              tooltip="Ustawienia konta"
            >
              <Link href="/dashboard/settings">
                <div className="relative flex-shrink-0">
                  <Avatar className="size-8 rounded-lg">
                    <AvatarImage src={profile?.avatar_url ?? ''} />
                    <AvatarFallback className="rounded-lg bg-primary/10 text-primary text-xs font-bold">
                      {getInitials(profile?.full_name ?? profile?.username ?? 'U')}
                    </AvatarFallback>
                  </Avatar>
                  {/* Pro indicator dot */}
                  {pro && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-500 border-2 border-background flex items-center justify-center">
                      <Crown className="h-2 w-2 text-white" />
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-0.5 leading-none min-w-0">
                  <span className="font-semibold text-sm truncate">
                    {profile?.full_name ?? profile?.username ?? 'Użytkownik'}
                  </span>
                  <span className={cn(
                    'text-xs truncate flex items-center gap-1',
                    pro
                      ? 'text-amber-600 dark:text-amber-400 font-medium'
                      : 'text-muted-foreground',
                  )}>
                    {pro
                      ? <><Crown className="h-2.5 w-2.5" /> Plan Pro</>
                      : 'Plan Darmowy'
                    }
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Public page preview */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip={`biolink.app/@${profile?.username}`}
            >
              <Link
                href={`/u/${profile?.username}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="size-4" />
                <span>Podgląd strony</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Help */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive('/dashboard/help')}
              tooltip="Centrum pomocy"
            >
              <Link href="/dashboard/help">
                <HelpCircle className="size-4" />
                <span>Pomoc</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
