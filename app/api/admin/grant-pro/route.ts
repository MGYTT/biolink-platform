import { NextResponse }   from 'next/server'
import { supabaseAdmin }  from '@/lib/supabase/admin'
import { requireAdmin, AdminError } from '@/lib/admin-guard'

interface GrantProBody {
  userId:   string
  plan:     'pro' | 'free'
  note?:    string           // opcjonalna notatka do auditu
}

export async function POST(req: Request) {
  try {
    /* 1. Sprawdź czy wywołujący jest adminem */
    const { adminId } = await requireAdmin()

    /* 2. Parsuj body */
    const body = await req.json() as GrantProBody
    const { userId, plan, note } = body

    if (!userId || !['pro', 'free'].includes(plan)) {
      return NextResponse.json({ error: 'Nieprawidłowe dane' }, { status: 400 })
    }

    /* 3. Zaktualizuj plan użytkownika (service role = bypass RLS) */
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({ plan, updated_at: new Date().toISOString() })
      .eq('id', userId)

    if (profileError) throw profileError

    /* 4. Zaktualizuj / utwórz rekord w subscriptions */
    const periodEnd = plan === 'pro'
      ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()  // +1 rok
      : null

    const { error: subError } = await supabaseAdmin
      .from('subscriptions')
      .upsert({
        user_id:               userId,
        plan,
        status:                plan === 'pro' ? 'active' : 'inactive',
        stripe_customer_id:    null,
        stripe_subscription_id: plan === 'pro' ? `manual_${adminId}_${Date.now()}` : null,
        current_period_start:  plan === 'pro' ? new Date().toISOString() : null,
        current_period_end:    periodEnd,
        updated_at:            new Date().toISOString(),
      }, { onConflict: 'user_id' })

    if (subError) throw subError

    /* 5. Zapisz log akcji adminowych */
    await supabaseAdmin
      .from('admin_audit_log')
      .insert({
        admin_id:   adminId,
        target_id:  userId,
        action:     plan === 'pro' ? 'grant_pro' : 'revoke_pro',
        note:       note ?? null,
        created_at: new Date().toISOString(),
      })

    return NextResponse.json({
      success: true,
      message: plan === 'pro'
        ? `Plan Pro aktywowany do ${new Date(periodEnd!).toLocaleDateString('pl-PL')}`
        : 'Plan cofnięty do Free',
    })

  } catch (err) {
    if (err instanceof AdminError) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    console.error('[admin/grant-pro]', err)
    return NextResponse.json({ error: 'Błąd serwera' }, { status: 500 })
  }
}
