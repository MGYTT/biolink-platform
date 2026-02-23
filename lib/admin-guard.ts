import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin }  from '@/lib/supabase/admin'

export class AdminError extends Error {
  constructor(message: string, public status: number) {
    super(message)
  }
}

/** Zwraca profil jeśli zalogowany user jest adminem, rzuca AdminError w przeciwnym razie */
export async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new AdminError('Nie zalogowany', 401)

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('id, is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) throw new AdminError('Brak uprawnień', 403)

  return { adminId: user.id, profile }
}
