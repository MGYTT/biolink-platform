import Link from 'next/link'
import { Link2 } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t py-10 bg-background">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <div className="p-1.5 rounded-lg bg-primary text-primary-foreground">
            <Link2 className="h-3.5 w-3.5" />
          </div>
          BioLink
        </Link>

        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <Link href="#features" className="hover:text-foreground transition-colors">Funkcje</Link>
          <Link href="#pricing"  className="hover:text-foreground transition-colors">Cennik</Link>
          <Link href="/login"    className="hover:text-foreground transition-colors">Logowanie</Link>
          <Link href="/register" className="hover:text-foreground transition-colors">Rejestracja</Link>
        </div>

        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} BioLink. Wszystkie prawa zastrzeżone.
        </p>
      </div>
    </footer>
  )
}
