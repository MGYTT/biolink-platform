import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, BarChart2, Settings, Sparkles, ExternalLink } from 'lucide-react'

const actions = [
  { label: 'Utwórz nową stronę', href: '/dashboard/pages/new',    icon: Plus,       variant: 'default'  as const },
  { label: 'Zobacz analitykę',   href: '/dashboard/analytics',    icon: BarChart2,  variant: 'outline'  as const },
  { label: 'Ustawienia konta',   href: '/dashboard/settings',     icon: Settings,   variant: 'outline'  as const },
  { label: 'Upgrade do Pro ⭐',  href: '/dashboard/upgrade',      icon: Sparkles,   variant: 'outline'  as const },
]

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Szybkie akcje</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {actions.map((action) => (
          <Button
            key={action.href}
            variant={action.variant}
            className="w-full justify-start"
            asChild
          >
            <Link href={action.href}>
              <action.icon className="mr-2 h-4 w-4" />
              {action.label}
            </Link>
          </Button>
        ))}
        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground mb-2">Twój publiczny profil:</p>
          <Button variant="secondary" className="w-full justify-start text-xs" asChild>
            <Link href="/" target="_blank">
              <ExternalLink className="mr-2 h-3.5 w-3.5" />
              biolink.app/@twój-username
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
