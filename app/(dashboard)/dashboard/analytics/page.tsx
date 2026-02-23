import { createClient } from '@/lib/supabase/server'
import { AnalyticsClient } from '@/components/dashboard/analytics/AnalyticsClient'

export default async function AnalyticsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: pages } = await supabase
    .from('pages')
    .select('id, title, slug')
    .eq('user_id', user!.id)

  const pageIds = (pages ?? []).map(p => p.id)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data: clicks } = pageIds.length > 0
    ? await supabase
        .from('clicks')
        .select('clicked_at, device, country, page_id, block_id')
        .in('page_id', pageIds)
        .gte('clicked_at', thirtyDaysAgo.toISOString())
        .order('clicked_at', { ascending: true })
    : { data: [] }

  return <AnalyticsClient pages={pages ?? []} clicks={clicks ?? []} />
}
