import Link   from 'next/link'
import { Button } from '@/components/ui/button'
import { UserX }  from 'lucide-react'

export default function UserNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-5 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
        <UserX className="h-8 w-8 text-muted-foreground" />
      </div>
      <div>
        <h1 className="text-2xl font-extrabold mb-2">Nie znaleziono użytkownika</h1>
        <p className="text-muted-foreground text-sm max-w-xs">
          Strona o tym adresie nie istnieje lub została usunięta.
        </p>
      </div>
      <Button asChild>
        <Link href="/">Wróć na stronę główną</Link>
      </Button>
    </div>
  )
}
