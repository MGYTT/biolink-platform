import { createClient } from '@/lib/supabase/server'
import { UpgradeClient } from '@/components/dashboard/upgrade/UpgradeClient'

export default async function UpgradePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user!.id)
    .single()

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('status, current_period_end, plan')
    .eq('user_id', user!.id)
    .single()

  return (
    <UpgradeClient
      currentPlan={profile?.plan ?? 'free'}
      subscription={subscription}
    />
  )
}
