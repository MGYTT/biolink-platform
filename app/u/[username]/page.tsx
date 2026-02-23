import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PagePreview } from '@/components/preview/PagePreview'
import type { Metadata } from 'next'

interface ProfilePageProps {
  params: { username: string }
}

// Dynamiczne meta tagi SEO per użytkownik
export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const supabase = await createClient()

  const { data: page } = await supabase
    .from('pages')
    .select('title, seo_title, seo_desc, meta_image, slug')
    .eq('slug', params.username)
    .eq('is_published', true)
    .single()

  if (!page) return { title: 'Nie znaleziono' }

  return {
    title: page.seo_title ?? page.title,
    description: page.seo_desc ?? undefined,
    openGraph: {
      title: page.seo_title ?? page.title,
      description: page.seo_desc ?? undefined,
      images: page.meta_image ? [page.meta_image] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.seo_title ?? page.title,
    },
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const supabase = await createClient()

  // Pobierz stronę po slug (= username)
  const { data: page } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', params.username)
    .eq('is_published', true)
    .single()

  if (!page) notFound()

  // Pobierz bloki — widoczne i w kolejności
  const { data: blocks } = await supabase
    .from('blocks')
    .select('*')
    .eq('page_id', page.id)
    .eq('is_visible', true)
    .order('position', { ascending: true })

  // Loguj wyświetlenie strony (page view)
  await supabase.from('clicks').insert({
    page_id: page.id,
    block_id: null,
    device: null,
    referrer: null,
  })

  return <PagePreview page={page} blocks={blocks ?? []} />
}
