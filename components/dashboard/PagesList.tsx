import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Pencil, Globe, EyeOff } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Page {
  id: string
  title: string
  slug: string
  is_published: boolean
  created_at: string
}

export function PagesList({ pages }: { pages: Page[] }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold">Twoje strony</CardTitle>
        <Button size="sm" asChild>
          <Link href="/dashboard/pages/new">
            <Plus className="h-4 w-4 mr-1" />
            Nowa strona
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {pages.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Globe className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">Nie masz jeszcze żadnej strony</p>
            <p className="text-sm mt-1">Kliknij "Nowa strona" aby zacząć</p>
          </div>
        ) : (
          <div className="space-y-2">
            {pages.map((page) => (
              <div
                key={page.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/40 transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-md bg-primary/10">
                    {page.is_published
                      ? <Globe className="h-4 w-4 text-primary" />
                      : <EyeOff className="h-4 w-4 text-muted-foreground" />
                    }
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{page.title}</p>
                    <p className="text-xs text-muted-foreground">
                      /{page.slug} · {formatDate(page.created_at)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                  <Badge variant={page.is_published ? 'default' : 'secondary'} className="text-[10px]">
                    {page.is_published ? 'Online' : 'Ukryta'}
                  </Badge>
                  <Button size="icon" variant="ghost" className="h-8 w-8" asChild>
                    <Link href={`/dashboard/editor/${page.id}`}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
