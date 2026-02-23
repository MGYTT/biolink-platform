import { createClient } from '@/lib/supabase/server'
import { redirect }     from 'next/navigation'
import Link             from 'next/link'
import { Button }       from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge }        from '@/components/ui/badge'
import { Plus, ExternalLink, Pencil, Globe, EyeOff } from 'lucide-react'

export default async function PagesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: pages } = await supabase
    .from('pages')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Moje strony</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Zarządzaj swoimi stronami link-in-bio
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/pages/new">
            <Plus className="h-4 w-4 mr-2" />
            Nowa strona
          </Link>
        </Button>
      </div>

      {(!pages || pages.length === 0) ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Globe className="h-7 w-7 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Brak stron</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              Utwórz swoją pierwszą stronę link-in-bio i zacznij udostępniać linki
            </p>
            <Button asChild>
              <Link href="/dashboard/pages/new">
                <Plus className="h-4 w-4 mr-2" />
                Utwórz pierwszą stronę
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {pages.map(page => (
            <Card key={page.id} className="hover:shadow-md transition-shadow">
              <CardContent className="flex items-center justify-between p-5">
                <div className="flex items-center gap-4">
                  {/* Kolor motywu */}
                  <div
                    className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center text-xl"
                    style={{ backgroundColor: page.bg_color ?? '#6366f1' }}
                  >
                    🔗
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{page.title}</p>
                      <Badge
                        variant={page.is_published ? 'default' : 'secondary'}
                        className="text-[10px] h-4"
                      >
                        {page.is_published
                          ? <><Globe className="h-2.5 w-2.5 mr-1" />Live</>
                          : <><EyeOff className="h-2.5 w-2.5 mr-1" />Szkic</>
                        }
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground font-mono mt-0.5">
                      /@{page.slug}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {page.is_published && (
                    <Button variant="ghost" size="sm" asChild>
                      <a
                        href={`/u/${page.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/editor/${page.id}`}>
                      <Pencil className="h-4 w-4 mr-1.5" />
                      Edytuj
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
