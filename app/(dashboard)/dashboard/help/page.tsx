import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Mail, BookOpen, MessageCircle, Zap } from 'lucide-react'

const FAQ = [
  {
    q: 'Jak dodać nowy blok do strony?',
    a: 'Wejdź do edytora, kliknij przycisk "Dodaj blok" w lewym panelu i wybierz typ bloku — link, tekst, obraz lub inny.',
  },
  {
    q: 'Jak opublikować moją stronę?',
    a: 'W edytorze kliknij przycisk "Opublikuj" w górnym pasku. Strona natychmiast staje się dostępna pod adresem /@twoja-nazwa.',
  },
  {
    q: 'Jaka jest różnica między planem Free a Pro?',
    a: 'Free: 1 strona, podstawowe bloki, standardowe motywy. Pro: nielimitowane strony, zaawansowane bloki, motywy premium, analityka, własna domena.',
  },
  {
    q: 'Jak zmienić adres URL mojej strony?',
    a: 'Adresu URL nie można zmienić po utworzeniu. Możesz jednak usunąć stronę i stworzyć nową z innym adresem.',
  },
  {
    q: 'Czy mogę mieć kilka stron?',
    a: 'Plan Free umożliwia utworzenie 1 strony. Plan Pro daje nielimitowaną liczbę stron.',
  },
  {
    q: 'Jak anulować subskrypcję Pro?',
    a: 'Wejdź w Ustawienia → Plan → Zarządzaj subskrypcją. Zostaniesz przekierowany do portalu Stripe gdzie możesz anulować.',
  },
]

export default function HelpPage() {
  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Pomoc</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Znajdź odpowiedzi na najczęstsze pytania
        </p>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { icon: BookOpen,       label: 'Dokumentacja',    badge: 'Wkrótce', color: 'text-blue-500'   },
          { icon: MessageCircle,  label: 'Live chat',        badge: 'Pro',     color: 'text-purple-500' },
          { icon: Mail,           label: 'Email support',    badge: null,      color: 'text-green-500'  },
          { icon: Zap,            label: 'Status systemu',   badge: '✓ OK',    color: 'text-amber-500'  },
        ].map(item => (
          <Card key={item.label} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 flex flex-col gap-2">
              <item.icon className={`h-5 w-5 ${item.color}`} />
              <p className="text-sm font-semibold">{item.label}</p>
              {item.badge && (
                <Badge variant="secondary" className="text-[10px] w-fit">
                  {item.badge}
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Najczęstsze pytania</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {FAQ.map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-sm text-left">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Kontakt */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Mail className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-sm">Nie znalazłeś odpowiedzi?</p>
            <p className="text-xs text-muted-foreground">
              Napisz na{' '}
              <a
                href="mailto:support@biolink.app"
                className="text-primary underline underline-offset-2"
              >
                support@biolink.app
              </a>
              {' '}— odpowiadamy w ciągu 24h
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
