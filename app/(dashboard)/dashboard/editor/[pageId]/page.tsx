import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { EditorClient } from '@/components/editor/EditorClient'

interface EditorPageProps {
  params: { pageId: string }
}

export default async function EditorPage({ params }: EditorPageProps) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: page } = await supabase
    .from('pages')
    .select('*')
    .eq('id', params.pageId)
    .eq('user_id', user.id)
    .single()

  if (!page) notFound()

  const { data: blocks } = await supabase
    .from('blocks')
    .select('*')
    .eq('page_id', params.pageId)
    .order('position', { ascending: true })

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single()

  return (
    <EditorClient
      page={page}
      initialBlocks={blocks ?? []}
      isPro={profile?.plan === 'pro'}
    />
  )
}
