import { createClient }      from '@/lib/supabase/server'
import { supabaseAdmin }     from '@/lib/supabase/admin'
import { redirect }          from 'next/navigation'
import { AdminUsersClient }  from '@/components/admin/AdminUsersClient'
import type { UserRow }      from '@/components/admin/AdminUsersClient'

export const metadata = { title: 'Admin — Użytkownicy' }

export default async function AdminUsersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: adminProfile } = await supabaseAdmin
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!adminProfile?.is_admin) redirect('/dashboard')

  const { data: rawUsers } = await supabaseAdmin
    .from('profiles')
    .select(`
      id, username, full_name, avatar_url, plan, is_admin, created_at,
      subscriptions (
        status, current_period_end, stripe_subscription_id
      )
    `)
    .order('created_at', { ascending: false })

  // Supabase zwraca subscriptions jako tablicę — bierzemy pierwszy rekord
  const users: UserRow[] = (rawUsers ?? []).map(u => ({
    ...u,
    subscriptions: Array.isArray(u.subscriptions)
      ? (u.subscriptions[0] ?? null)
      : (u.subscriptions ?? null),
  }))

  return <AdminUsersClient users={users} />
}
