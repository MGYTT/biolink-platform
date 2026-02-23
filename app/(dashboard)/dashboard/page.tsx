import { createClient } from '@/lib/supabase/server'
import { StatsCards } from '@/components/dashboard/StatsCards'
import { PagesList } from '@/components/dashboard/PagesList'
import { QuickActions } from '@/components/dashboard/QuickActions'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Pobierz strony użytkownika
  const { data: pages } = await supabase
    .from('pages')
    .select('id, title, slug, is_published, created_at')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  // Statystyki kliknięć z ostatnich 30 dni
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { count: totalClicks } = await supabase
    .from('clicks')
    .select('*', { count: 'exact', head: true })
    .in('page_id', (pages ?? []).map(p => p.id))
    .gte('clicked_at', thirtyDaysAgo.toISOString())

  const { count: totalBlocks } = await supabase
    .from('blocks')
    .select('*', { count: 'exact', head: true })
    .in('page_id', (pages ?? []).map(p => p.id))

  const stats = {
    pages:       pages?.length ?? 0,
    clicks:      totalClicks ?? 0,
    blocks:      totalBlocks ?? 0,
    published:   pages?.filter(p => p.is_published).length ?? 0,
  }

  return (
    <div className="space-y-6">
      <StatsCards stats={stats} />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <PagesList pages={pages ?? []} />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>
    </div>
  )
}
