import { NextResponse, type NextRequest } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import type Stripe from 'stripe'

// Supabase Admin client (service role) — omija RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  const body      = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const getUserId = (metadata: Stripe.Metadata) =>
    metadata?.supabase_user_id ?? null

  switch (event.type) {

    // ✅ Płatność zakończona sukcesem
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      if (session.mode !== 'subscription') break

      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      )
      const userId = getUserId(subscription.metadata)
      if (!userId) break

      await supabaseAdmin.from('subscriptions').upsert({
        user_id:                userId,
        stripe_customer_id:     session.customer as string,
        stripe_subscription_id: subscription.id,
        plan:                   'pro',
        status:                 subscription.status,
        current_period_start:   new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end:     new Date(subscription.current_period_end   * 1000).toISOString(),
      })

      await supabaseAdmin
        .from('profiles')
        .update({ plan: 'pro' })
        .eq('id', userId)

      break
    }

    // 🔄 Subskrypcja zaktualizowana (odnowienie, zmiana planu)
    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription
      const userId = getUserId(subscription.metadata)
      if (!userId) break

      const isActive = ['active', 'trialing'].includes(subscription.status)

      await supabaseAdmin.from('subscriptions').update({
        plan:                   isActive ? 'pro' : 'free',
        status:                 subscription.status,
        current_period_start:   new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end:     new Date(subscription.current_period_end   * 1000).toISOString(),
      }).eq('stripe_subscription_id', subscription.id)

      await supabaseAdmin
        .from('profiles')
        .update({ plan: isActive ? 'pro' : 'free' })
        .eq('id', userId)

      break
    }

    // ❌ Subskrypcja anulowana
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      const userId = getUserId(subscription.metadata)
      if (!userId) break

      await supabaseAdmin.from('subscriptions').update({
        plan:   'free',
        status: 'canceled',
      }).eq('stripe_subscription_id', subscription.id)

      await supabaseAdmin
        .from('profiles')
        .update({ plan: 'free' })
        .eq('id', userId)

      break
    }
  }

  return NextResponse.json({ received: true })
}
