import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Link2, MousePointerClick, Layers, Globe } from 'lucide-react'

interface StatsCardsProps {
  stats: {
    pages: number
    clicks: number
    blocks: number
    published: number
  }
}

const cards = [
  {
    key: 'pages' as const,
    title: 'Strony',
    icon: Link2,
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-950',
    description: 'Łącznie created'
  },
  {
    key: 'clicks' as const,
    title: 'Kliknięcia',
    icon: MousePointerClick,
    color: 'text-green-500',
    bg: 'bg-green-50 dark:bg-green-950',
    description: 'Ostatnie 30 dni'
  },
  {
    key: 'blocks' as const,
    title: 'Bloki',
    icon: Layers,
    color: 'text-purple-500',
    bg: 'bg-purple-50 dark:bg-purple-950',
    description: 'Na wszystkich stronach'
  },
  {
    key: 'published' as const,
    title: 'Opublikowane',
    icon: Globe,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-950',
    description: 'Widoczne publicznie'
  },
]

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.key} className="border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${card.bg}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">
              {stats[card.key].toLocaleString('pl-PL')}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
