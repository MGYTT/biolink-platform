import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function CtaSection() {
  return (
    <section className="py-24 bg-primary text-primary-foreground">
      <div className="max-w-3xl mx-auto px-4 text-center flex flex-col items-center gap-6">
        <h2 className="text-4xl font-extrabold tracking-tight">
          Gotowy na swoją stronę? 🚀
        </h2>
        <p className="text-primary-foreground/80 text-lg max-w-xl">
          Dołącz do tysięcy twórców już teraz. Rejestracja zajmuje 30 sekund.
          Żadnej karty, żadnych zobowiązań.
        </p>
        <Button size="lg" variant="secondary" className="text-base px-10 font-bold" asChild>
          <Link href="/register">
            Stwórz konto za darmo
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </section>
  )
}
