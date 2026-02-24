import { createClient }   from '@/lib/supabase/server'
import { notFound }       from 'next/navigation'
import { PublicProfile }  from '@/components/public/PublicProfile'
import type { Metadata }  from 'next'

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */
interface Props {
  params: Promise<{ username: string }>
}

/* ─────────────────────────────────────────
   Dynamic metadata
───────────────────────────────────────── */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, username, bio, avatar_url')
    .eq('username', username)
    .single()

  if (!profile) {
    return {
      title: 'Nie znaleziono użytkownika',
    }
  }

  return {
    title:       `${profile.full_name ?? profile.username} — BioLink`,
    description: profile.bio ?? `Sprawdź stronę ${profile.username} na BioLink`,
    openGraph: {
      title:       profile.full_name ?? profile.username,
      description: profile.bio ?? '',
      images:      profile.avatar_url ? [profile.avatar_url] : [],
      type:        'profile',
    },
    twitter: {
      card:        'summary',
      title:       profile.full_name ?? profile.username,
      description: profile.bio ?? '',
      images:      profile.avatar_url ? [profile.avatar_url] : [],
    },
  }
}

/* ─────────────────────────────────────────
   Page
───────────────────────────────────────── */
export default async function PublicProfilePage({ params }: Props) {
  const { username } = await params
  const supabase     = await createClient()

  /* Pobierz profil */
  const { data: profile } = await supabase
    .from('profiles')
    .select(`
      id,
      username,
      full_name,
      bio,
      avatar_url,
      plan,
      theme,
      custom_css
    `)
    .eq('username', username)
    .single()

  if (!profile) notFound()

  /* Pobierz aktywne bloki (posortowane, widoczne teraz) */
  const now = new Date().toISOString()

  const { data: blocks } = await supabase
    .from('blocks')
    .select('*')
    .eq('profile_id', profile.id)
    .eq('is_visible', true)
    .or(`scheduled_end.is.null,scheduled_end.gte.${now}`)
    .or(`scheduled_start.is.null,scheduled_start.lte.${now}`)
    .order('position', { ascending: true })

  /* Zlicz wyświetlenie (fire & forget) */
  supabase
    .from('page_views')
    .insert({ profile_id: profile.id })
    .then(() => {})

  return (
    <PublicProfile
      profile={profile}
      blocks={blocks ?? []}
    />
  )
}
