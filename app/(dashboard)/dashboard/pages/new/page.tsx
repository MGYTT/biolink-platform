import { createClient } from '@/lib/supabase/server'
import { NewPageClient } from '@/components/dashboard/pages/NewPageClient'
import { redirect } from 'next/navigation'

export default async function NewPagePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, username')
    .eq('id', user.id)
    .single()

  // Sprawdź limit stron dla planu Free
  const { count } = await supabase
    .from('pages')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  const isPro = profile?.plan === 'pro'
  const pageCount = count ?? 0

  // Free = max 1 strona
  if (!isPro && pageCount >= 1) {
    redirect('/dashboard/upgrade?reason=page_limit')
  }

  return (
    <NewPageClient
      userId={user.id}
      username={profile?.username ?? ''}
      isPro={isPro}
    />
  )
}
