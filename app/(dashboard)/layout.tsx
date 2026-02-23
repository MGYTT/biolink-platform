import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AppSidebar } from '@/components/dashboard/AppSidebar'
import { DashboardTopbar } from '@/components/dashboard/DashboardTopbar'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { Toaster } from 'sonner'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <SidebarProvider>
      <AppSidebar profile={profile} />
      <SidebarInset>
        <DashboardTopbar />
        <main className="flex-1 p-6 bg-neutral-50 dark:bg-neutral-950 min-h-screen">
          {children}
        </main>
      </SidebarInset>
      <Toaster richColors position="bottom-right" />
    </SidebarProvider>
  )
}
