'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Link2, BarChart2, Settings,
  Sparkles, CreditCard, HelpCircle, ExternalLink
} from 'lucide-react'
import {
  Sidebar, SidebarContent, SidebarFooter,
  SidebarGroup, SidebarGroupLabel, SidebarHeader,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn, getInitials, isPro } from '@/lib/utils'
import type { Profile } from '@/types'

const navMain = [
  { title: 'Dashboard',   href: '/dashboard',           icon: LayoutDashboard },
  { title: 'Moje strony', href: '/dashboard/pages',     icon: Link2 },
  { title: 'Analityka',   href: '/dashboard/analytics', icon: BarChart2 },
  { title: 'Ustawienia',  href: '/dashboard/settings',  icon: Settings },
]

const navPro = [
  { title: 'Upgrade do Pro', href: '/dashboard/upgrade', icon: Sparkles },
  { title: 'Rozliczenia',    href: '/dashboard/billing', icon: CreditCard },
]

interface AppSidebarProps {
  profile: Profile | null
}

export function AppSidebar({ profile }: AppSidebarProps) {
  const pathname = usePathname()
  const pro = isPro(profile?.plan ?? 'free')

  return (
    <Sidebar collapsible="icon">
      {/* Logo */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Link2 className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-bold text-base">BioLink</span>
                  <span className="text-xs text-muted-foreground">Platform</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Główna nawigacja */}
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarMenu>
            {navMain.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
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

        {/* Plan */}
        <SidebarGroup>
          <SidebarGroupLabel>Konto</SidebarGroupLabel>
          <SidebarMenu>
            {navPro.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  className={cn(
                    item.title === 'Upgrade do Pro' && !pro &&
                    'text-amber-600 dark:text-amber-400 font-semibold'
                  )}
                >
                  <Link href={item.href}>
                    <item.icon className="size-4" />
                    <span>{item.title}</span>
                    {item.title === 'Upgrade do Pro' && !pro && (
                      <Badge variant="outline" className="ml-auto text-[10px] border-amber-400 text-amber-600">
                        FREE
                      </Badge>
                    )}
                    {item.title === 'Upgrade do Pro' && pro && (
                      <Badge className="ml-auto text-[10px] bg-amber-500">PRO</Badge>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Profil użytkownika */}
      <SidebarFooter>
        <SidebarSeparator />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard/settings">
                <Avatar className="size-8 rounded-lg">
                  <AvatarImage src={profile?.avatar_url ?? ''} />
                  <AvatarFallback className="rounded-lg bg-primary/10 text-primary">
                    {getInitials(profile?.full_name ?? profile?.username ?? 'U')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold text-sm truncate max-w-[120px]">
                    {profile?.full_name ?? profile?.username}
                  </span>
                  <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                    {pro ? '⭐ Plan Pro' : 'Plan Darmowy'}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Podgląd Twojej strony">
              <Link href={`/@${profile?.username}`} target="_blank">
                <ExternalLink className="size-4" />
                <span>Podgląd strony</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Pomoc">
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
