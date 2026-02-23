import { createClient } from '@supabase/supabase-js'

// NIGDY nie używaj NEXT_PUBLIC_ — ten klucz musi być tylko server-side
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken:   false,
      persistSession:     false,
      detectSessionInUrl: false,
    },
  }
)
