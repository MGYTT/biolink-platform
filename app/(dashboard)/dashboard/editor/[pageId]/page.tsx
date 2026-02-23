import { createClient } from '@/lib/supabase/server'
import { EditorClient } from '@/components/editor/EditorClient'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ pageId: string }>
}

export default async function EditorPage({ params }: Props) {
  const { pageId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: page } = await supabase
    .from('pages')
    .select('*')
    .eq('id', pageId)
    .eq('user_id', user!.id)
    .single()

  if (!page) notFound()

  const { data: blocks } = await supabase
    .from('blocks')
    .select('*')
    .eq('page_id', pageId)
    .order('position', { ascending: true })

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user!.id)
    .single()

  return (
    <EditorClient
      initialPage={page}
      initialBlocks={blocks ?? []}
      isPro={profile?.plan === 'pro'}
    />
  )
}
