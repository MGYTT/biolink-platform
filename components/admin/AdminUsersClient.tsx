'use client'

import { useState, useMemo } from 'react'
import { toast }             from 'sonner'
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Button }   from '@/components/ui/button'
import { Badge }    from '@/components/ui/badge'
import { Input }    from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label }    from '@/components/ui/label'
import {
  Crown, Star, Search, Shield,
  CheckCircle2, Loader2, RotateCcw, X,
  Users, TrendingUp,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { pl } from 'date-fns/locale'

/* ─────────────────────────────────────────
   Types — exported so page.tsx can import
───────────────────────────────────────── */
export interface UserRow {
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

/* ─────────────────────────────────────────
   Helpers
───────────────────────────────────────── */
const STATUS_STYLES: Record<string, string> = {
  active:   'text-emerald-600 dark:text-emerald-400',
  trialing: 'text-blue-600 dark:text-blue-400',
  canceled: 'text-red-500 dark:text-red-400',
  past_due: 'text-amber-600 dark:text-amber-400',
  inactive: 'text-muted-foreground',
}

const STATUS_LABELS: Record<string, string> = {
  active:   'Aktywna',
  trialing: 'Próbna',
  canceled: 'Anulowana',
  past_due: 'Zaległa',
  inactive: 'Nieaktywna',
}

function getInitial(user: UserRow): string {
  return (user.full_name ?? user.username)[0]?.toUpperCase() ?? '?'
}

/* ─────────────────────────────────────────
   Stat card
───────────────────────────────────────── */
function StatCard({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon:       React.ElementType
  label:      string
  value:      string | number
  className?: string
}) {
  return (
    <div className={cn(
      'flex items-center gap-3 px-4 py-3 rounded-xl border bg-card',
      className,
    )}>
      <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Icon className="h-4 w-4 text-primary" />
      </span>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-xl font-bold leading-tight">{value}</p>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   Main component
───────────────────────────────────────── */
export function AdminUsersClient({ users: initialUsers }: { users: UserRow[] }) {
  const [users,   setUsers]   = useState<UserRow[]>(initialUsers)
  const [search,  setSearch]  = useState('')
  const [loading, setLoading] = useState<string | null>(null)
  const [pending, setPending] = useState<PendingAction | null>(null)
  const [note,    setNote]    = useState('')

  /* Stats */
  const proCount  = useMemo(() => users.filter(u => u.plan === 'pro').length,  [users])
  const freeCount = useMemo(() => users.filter(u => u.plan !== 'pro').length, [users])

  /* Filtered list */
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return users
    return users.filter(u =>
      u.username.toLowerCase().includes(q)    ||
      u.full_name?.toLowerCase().includes(q)  ||
      u.id.toLowerCase().includes(q)
    )
  }, [users, search])

  /* Grant / revoke handler */
  async function handleConfirm() {
    if (!pending) return
    const { user, action } = pending
    const plan = action === 'grant' ? 'pro' : 'free'

    setLoading(user.id)
    setPending(null)

    try {
      const res = await fetch('/api/admin/grant-pro', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ userId: user.id, plan, note }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      /* Optimistic update */
      setUsers(prev => prev.map(u =>
        u.id === user.id ? { ...u, plan } : u
      ))

      toast.success(data.message, {
        description: user.full_name ?? `@${user.username}`,
        icon: action === 'grant' ? '👑' : '🔄',
      })
    } catch (err) {
      toast.error('Błąd operacji', {
        description: err instanceof Error ? err.message : 'Spróbuj ponownie',
      })
    } finally {
      setLoading(null)
      setNote('')
    }
  }

  function openDialog(user: UserRow, action: 'grant' | 'revoke') {
    setNote('')
    setPending({ user, action })
  }

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Panel Admina
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Zarządzaj planami użytkowników
          </p>
        </div>
        <Badge className="bg-red-500 hover:bg-red-500 text-white text-xs gap-1.5 px-3 py-1">
          <Shield className="h-3 w-3" />
          ADMIN
        </Badge>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatCard icon={Users}      label="Wszyscy użytkownicy" value={users.length}  />
        <StatCard icon={Crown}      label="Plan Pro"            value={proCount}
          className="border-amber-200 dark:border-amber-900" />
        <StatCard icon={TrendingUp} label="Plan Free"           value={freeCount} />
      </div>

      {/* ── Search ── */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Szukaj po nazwie, username lub ID…"
            className="pl-9"
          />
        </div>
        {search && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSearch('')}
            className="gap-1.5 text-muted-foreground"
          >
            <X className="h-3.5 w-3.5" />
            Wyczyść
          </Button>
        )}
        {search && (
          <p className="text-xs text-muted-foreground">
            {filtered.length} z {users.length}
          </p>
        )}
      </div>

      {/* ── Table ── */}
      <div className="rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="font-semibold">Użytkownik</TableHead>
              <TableHead className="font-semibold">Plan</TableHead>
              <TableHead className="font-semibold">Status sub.</TableHead>
              <TableHead className="font-semibold">Koniec okresu</TableHead>
              <TableHead className="font-semibold">Dołączył</TableHead>
              <TableHead className="text-right font-semibold">Akcja</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground text-sm">
                  Brak wyników dla „{search}"
                </TableCell>
              </TableRow>
            ) : (
              filtered.map(user => {
                const isPro     = user.plan === 'pro'
                const isLoading = loading === user.id
                const sub       = user.subscriptions
                const isManual  = sub?.stripe_subscription_id?.startsWith('manual_')

                return (
                  <TableRow
                    key={user.id}
                    className={cn(
                      'transition-colors',
                      isPro && 'bg-amber-50/40 dark:bg-amber-950/10',
                    )}
                  >
                    {/* User */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 rounded-lg flex-shrink-0">
                          <AvatarImage src={user.avatar_url ?? ''} />
                          <AvatarFallback className="rounded-lg text-xs font-bold bg-primary/10 text-primary">
                            {getInitial(user)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate flex items-center gap-1.5">
                            {user.full_name ?? user.username}
                            {user.is_admin && (
                              <Badge className="text-[9px] h-4 px-1.5 bg-red-500 hover:bg-red-500 text-white font-bold">
                                ADMIN
                              </Badge>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            @{user.username}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Plan */}
                    <TableCell>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Badge className={cn(
                          'gap-1 font-bold text-[10px]',
                          isPro
                            ? 'bg-amber-500 hover:bg-amber-500 text-white'
                            : 'bg-secondary text-secondary-foreground',
                        )}>
                          {isPro
                            ? <><Crown className="h-2.5 w-2.5" /> PRO</>
                            : <><Star  className="h-2.5 w-2.5" /> FREE</>
                          }
                        </Badge>
                        {isManual && (
                          <Badge
                            variant="outline"
                            className="text-[9px] h-4 px-1.5 border-blue-300 text-blue-600 dark:border-blue-800 dark:text-blue-400"
                          >
                            ręczny
                          </Badge>
                        )}
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      {sub?.status ? (
                        <span className={cn(
                          'text-xs font-medium',
                          STATUS_STYLES[sub.status] ?? 'text-muted-foreground',
                        )}>
                          {STATUS_LABELS[sub.status] ?? sub.status}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>

                    {/* Period end */}
                    <TableCell className="text-xs text-muted-foreground">
                      {sub?.current_period_end
                        ? new Date(sub.current_period_end).toLocaleDateString('pl-PL', {
                            day: 'numeric', month: 'short', year: 'numeric',
                          })
                        : '—'
                      }
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
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30 h-7 text-xs gap-1.5"
                          onClick={() => openDialog(user, 'revoke')}
                        >
                          <RotateCcw className="h-3 w-3" />
                          Cofnij Pro
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className="h-7 text-xs gap-1.5 bg-amber-500 hover:bg-amber-600 text-white shadow-sm"
                          onClick={() => openDialog(user, 'grant')}
                        >
                          <Crown className="h-3 w-3" />
                          Aktywuj Pro
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* ── Confirmation Dialog ── */}
      <Dialog open={!!pending} onOpenChange={open => { if (!open) setPending(null) }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {pending?.action === 'grant'
                ? <><Crown className="h-5 w-5 text-amber-500" /> Aktywuj Plan Pro</>
                : <><RotateCcw className="h-5 w-5 text-destructive" /> Cofnij Plan Pro</>
              }
            </DialogTitle>
            <DialogDescription asChild>
              <div className="text-sm text-muted-foreground mt-1 space-y-1">
                {pending?.action === 'grant' ? (
                  <>
                    <p>
                      Użytkownik{' '}
                      <strong className="text-foreground">
                        {pending.user.full_name ?? pending.user.username}
                      </strong>{' '}
                      otrzyma Plan Pro na <strong className="text-foreground">1 rok</strong> bez opłat.
                    </p>
                    <p className="text-xs">
                      Subskrypcja zostanie oznaczona jako „ręczna" (bez Stripe).
                    </p>
                  </>
                ) : (
                  <p>
                    Użytkownik{' '}
                    <strong className="text-foreground">
                      {pending?.user.full_name ?? pending?.user.username}
                    </strong>{' '}
                    straci dostęp do wszystkich funkcji Pro.
                  </p>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>

          {/* Note */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Notatka <span className="font-normal">(opcjonalna, widoczna w logu)</span>
            </Label>
            <Textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="np. Partner, beta tester, nagroda konkursowa…"
              className="resize-none text-sm"
              rows={2}
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setPending(null)}
            >
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
