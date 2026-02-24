import { cn }        from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { BlockRenderer } from '@/components/public/BlockRenderer'
import Link  from 'next/link'
import { Link2 } from 'lucide-react'

interface Profile {
  id:         string
  username:   string
  full_name:  string | null
  bio:        string | null
  avatar_url: string | null
  plan:       string
  theme:      string | null
  custom_css: string | null
}

interface Block {
  id:         string
  type:       string
  content:    Record<string, unknown>
  position:   number
  is_visible: boolean
}

interface PublicProfileProps {
  profile: Profile
  blocks:  Block[]
}

function getInitials(name: string): string {
  return name.split(/\s+/).map(w => w[0]?.toUpperCase() ?? '').slice(0, 2).join('')
}

export function PublicProfile({ profile, blocks }: PublicProfileProps) {
  const isPro = profile.plan === 'pro'

  return (
    <div className="min-h-screen bg-background">

      {/* Custom CSS inject */}
      {isPro && profile.custom_css && (
        <style dangerouslySetInnerHTML={{ __html: profile.custom_css }} />
      )}

      {/* Page */}
      <main className="max-w-[480px] mx-auto px-4 py-12 flex flex-col gap-6">

        {/* ── Avatar + bio ── */}
        <div className="flex flex-col items-center text-center gap-3">
          <Avatar className="w-20 h-20 border-2 border-border shadow-md">
            <AvatarImage src={profile.avatar_url ?? ''} alt={profile.full_name ?? profile.username} />
            <AvatarFallback className="text-lg font-bold bg-primary/10 text-primary">
              {getInitials(profile.full_name ?? profile.username)}
            </AvatarFallback>
          </Avatar>

          <div>
            <h1 className="text-xl font-extrabold tracking-tight">
              {profile.full_name ?? profile.username}
            </h1>
            <p className="text-sm text-muted-foreground">@{profile.username}</p>
          </div>

          {profile.bio && (
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              {profile.bio}
            </p>
          )}
        </div>

        {/* ── Blocks ── */}
        {blocks.length > 0 ? (
          <div className="flex flex-col gap-3 w-full">
            {blocks.map(block => (
              <BlockRenderer key={block.id} block={block} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground text-sm">
            Brak bloków do wyświetlenia.
          </div>
        )}

        {/* ── BioLink branding (Free only) ── */}
        {!isPro && (
          <div className="flex justify-center mt-6">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors"
            >
              <div className="w-4 h-4 rounded bg-primary/80 flex items-center justify-center">
                <Link2 className="h-2.5 w-2.5 text-primary-foreground" />
              </div>
              Stwórz swoją stronę na BioLink
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
