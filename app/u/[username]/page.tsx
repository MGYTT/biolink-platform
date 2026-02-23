import { createClient } from '@/lib/supabase/server'
import { PagePreview } from '@/components/preview/PagePreview'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, bio, avatar_url')
    .eq('username', username)
    .single()

  if (!profile) return { title: 'Strona nie znaleziona' }

  return {
    title: profile.full_name ?? username,
    description: profile.bio ?? `Strona ${username} na BioLink`,
    openGraph: {
      images: profile.avatar_url ? [profile.avatar_url] : [],
    },
  }
}

export default async function UserPage({ params }: Props) {
  const { username } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .single()

  if (!profile) notFound()

  const { data: page } = await supabase
    .from('pages')
    .select('*')
    .eq('user_id', profile.id)
    .eq('is_published', true)
    .order('created_at', { ascending: true })
    .limit(1)
    .single()

  if (!page) notFound()

  const { data: blocks } = await supabase
    .from('blocks')
    .select('*')
    .eq('page_id', page.id)
    .eq('is_active', true)
    .order('position', { ascending: true })

  return (
    <div className="min-h-screen">
      <PagePreview page={page} blocks={blocks ?? []} />
    </div>
  )
}
