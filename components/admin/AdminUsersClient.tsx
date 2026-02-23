'use client'

import { useState } from 'react'
import { toast }    from 'sonner'
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Button }    from '@/components/ui/button'
import { Badge }     from '@/components/ui/badge'
import { Input }     from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label }    from '@/components/ui/label'
import {
  Crown, Star, Search, Shield,
  CheckCircle2, Loader2, RotateCcw,
} from 'lucide-react'
import { cn }       from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { pl } from 'date-fns/locale'

interface UserRow {
  id:         string
  username:   string
  full_name:  string | null
  avatar_url: string | null
  plan:       string
  is_admin:   boolean
  created_at: string
  subscriptions: {
    status:                 string
    current_period_end:     string | null
    stripe_subscription_id: string | null
  } | null
}

interface PendingAction {
  user:   UserRow
  action: 'grant' | 'revoke'
}

export function AdminUsersClient({ users: initialUsers }: { users: UserRow[] }) {
  const [users,   setUsers]   = useState<UserRow[]>(initialUsers)
  const [search,  setSearch]  = useState('')
  const [loading, setLoading] = useState<string | null>(null)
  const [pending, setPending] = useState<PendingAction | null>(null)
  const [note,    setNote]    = useState('')

  const filtered = users.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.id.toLowerCase().includes(search.toLowerCase())
  )

  async function handleConfirm() {
    if (!pending) return
    const { user, action } = pending
    const plan = action === 'grant' ? 'pro' : 'free'

    setLoading(user.id)
    setPending(null)

    try {
      const res = await fetch('/api/admin/grant-pro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, plan, note }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      /* Optymistycznie zaktualizuj UI */
      setUsers(prev => prev.map(u =>
        u.id === user.id ? { ...u, plan } : u
      ))

      toast.success(data.message, {
        description: `${user.full_name ?? user.username}`,
      })
    } catch (err) {
      toast.error('Błąd', {
        description: err instanceof Error ? err.message : 'Spróbuj ponownie',
      })
    } finally {
      setLoading(null)
      setNote('')
    }
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Panel Admina
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {users.length} użytkowników ·{' '}
            {users.filter(u => u.plan === 'pro').length} Pro
          </p>
        </div>
        <Badge className="bg-red-500 text-white text-xs gap-1.5">
          <Shield className="h-3 w-3" />
          ADMIN
        </Badge>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Szukaj po nazwie lub ID…"
          className="pl-9"
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Użytkownik</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Status sub.</TableHead>
              <TableHead>Koniec okresu</TableHead>
              <TableHead>Dołączył</TableHead>
              <TableHead className="text-right">Akcja</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(user => {
              const isPro      = user.plan === 'pro'
              const isLoading  = loading === user.id
              const sub        = user.subscriptions
              const isManual   = sub?.stripe_subscription_id?.startsWith('manual_')

              return (
                <TableRow
                  key={user.id}
                  className={cn(isPro && 'bg-amber-50/30 dark:bg-amber-950/10')}
                >
                  {/* User */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src={user.avatar_url ?? ''} />
                        <AvatarFallback className="rounded-lg text-xs bg-primary/10 text-primary">
                          {(user.full_name ?? user.username)[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate flex items-center gap-1.5">
                          {user.full_name ?? user.username}
                          {user.is_admin && (
                            <Badge className="text-[9px] h-4 px-1 bg-red-500 text-white">
                              ADMIN
                            </Badge>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          @{user.username}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Plan */}
                  <TableCell>
                    <Badge className={cn(
                      'gap-1 font-bold text-[10px]',
                      isPro
                        ? 'bg-amber-500 hover:bg-amber-500 text-white'
                        : 'bg-secondary text-secondary-foreground',
                    )}>
                      {isPro
                        ? <><Crown className="h-3 w-3" /> PRO</>
                        : <><Star  className="h-3 w-3" /> FREE</>
                      }
                    </Badge>
                    {isManual && (
                      <Badge variant="outline" className="ml-1 text-[9px] h-4 border-blue-300 text-blue-600">
                        ręczny
                      </Badge>
                    )}
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <span className={cn(
                      'text-xs font-medium',
                      sub?.status === 'active'   && 'text-emerald-600',
                      sub?.status === 'trialing' && 'text-blue-600',
                      sub?.status === 'canceled' && 'text-red-600',
                      sub?.status === 'past_due' && 'text-amber-600',
                      !sub?.status               && 'text-muted-foreground',
                    )}>
                      {sub?.status ?? '—'}
                    </span>
                  </TableCell>

                  {/* Period end */}
                  <TableCell className="text-xs text-muted-foreground">
                    {sub?.current_period_end
                      ? new Date(sub.current_period_end).toLocaleDateString('pl-PL')
                      : '—'}
                  </TableCell>

                  {/* Joined */}
                  <TableCell className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(user.created_at), {
                      addSuffix: true, locale: pl,
                    })}
                  </TableCell>

                  {/* Action */}
                  <TableCell className="text-right">
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin ml-auto text-muted-foreground" />
                    ) : isPro ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive hover:bg-destructive/10 border-destructive/30 h-7 text-xs gap-1.5"
                        onClick={() => { setPending({ user, action: 'revoke' }); setNote('') }}
                      >
                        <RotateCcw className="h-3 w-3" />
                        Cofnij Pro
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        className="h-7 text-xs gap-1.5 bg-amber-500 hover:bg-amber-600 text-white"
                        onClick={() => { setPending({ user, action: 'grant' }); setNote('') }}
                      >
                        <Crown className="h-3 w-3" />
                        Aktywuj Pro
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={!!pending} onOpenChange={open => !open && setPending(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {pending?.action === 'grant'
                ? <><Crown className="h-5 w-5 text-amber-500" /> Aktywuj Plan Pro</>
                : <><RotateCcw className="h-5 w-5 text-destructive" /> Cofnij Plan Pro</>
              }
            </DialogTitle>
            <DialogDescription>
              {pending?.action === 'grant'
                ? <>Użytkownik <strong>{pending.user.full_name ?? pending.user.username}</strong> otrzyma Plan Pro na <strong>1 rok</strong> bez opłat. Subskrypcja zostanie oznaczona jako "ręczna".</>
                : <>Użytkownik <strong>{pending?.user.full_name ?? pending?.user.username}</strong> straci dostęp do funkcji Pro.</>
              }
            </DialogDescription>
          </DialogHeader>

          {/* Optional note */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">
              Notatka (opcjonalna, widoczna w logu)
            </Label>
            <Textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="np. Partner, beta tester, nagroda konkursowa…"
              className="resize-none text-sm"
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setPending(null)}>
              Anuluj
            </Button>
            <Button
              onClick={handleConfirm}
              className={cn(
                'gap-2',
                pending?.action === 'grant'
                  ? 'bg-amber-500 hover:bg-amber-600 text-white'
                  : 'bg-destructive hover:bg-destructive/90 text-white',
              )}
            >
              <CheckCircle2 className="h-4 w-4" />
              {pending?.action === 'grant' ? 'Aktywuj Pro' : 'Cofnij Pro'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
