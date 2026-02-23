import { createClient } from '@/lib/supabase/server'
import { redirect }     from 'next/navigation'
import { BillingClient } from '@/components/dashboard/billing/BillingClient'

export const metadata = {
  title: 'Rozliczenia — BioLink',
}

export default async function BillingPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: profile }, { data: subscription }] = await Promise.all([
    supabase
      .from('profiles')
      .select('plan, full_name, username')
      .eq('id', user.id)
      .single(),
    supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single(),
  ])

  return (
    <BillingClient
      user={{ email: user.email ?? '', id: user.id }}
      profile={profile ?? { plan: 'free', full_name: null, username: '' }}
      subscription={subscription ?? null}
    />
  )
}
