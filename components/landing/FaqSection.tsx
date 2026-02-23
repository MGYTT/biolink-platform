import {
  Accordion, AccordionContent,
  AccordionItem, AccordionTrigger
} from '@/components/ui/accordion'

const faqs = [
  {
    q: 'Czy plan darmowy jest naprawdę darmowy na zawsze?',
    a: 'Tak. Plan Free nie ma limitu czasu ani ukrytych opłat. Możesz korzystać z 1 strony, 15 bloków i podstawowych statystyk bezterminowo.',
  },
  {
    q: 'Czy potrzebuję karty kredytowej do rejestracji?',
    a: 'Nie. Rejestracja jest bezpłatna i nie wymaga żadnych danych płatniczych. Kartę podajesz dopiero gdy chcesz przejść na plan Pro.',
  },
  {
    q: 'Jak podłączyć własną domenę?',
    a: 'W planie Pro wejdź w Ustawienia → Własna domena, wpisz swój adres i dodaj rekord CNAME wskazujący na nasz serwer. Gotowe w 5 minut.',
  },
  {
    q: 'Czy mogę przejść z Free na Pro w dowolnym momencie?',
    a: 'Oczywiście. Upgrade działa natychmiast — wszystkie bloki i ustawienia zostają zachowane, a nowe funkcje Pro są dostępne od razu.',
  },
  {
    q: 'Czy moje dane są bezpieczne?',
    a: 'Tak. Używamy Supabase z Row Level Security — każdy użytkownik widzi tylko swoje dane. Serwery w EU (Frankfurt) zgodnie z RODO.',
  },
  {
    q: 'Ile stron mogę mieć w planie Pro?',
    a: 'W planie Pro liczba stron jest nieograniczona. Możesz tworzyć osobne strony dla różnych projektów, marek lub kampanii.',
  },
]

export function FaqSection() {
  return (
    <section id="faq" className="py-24">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">FAQ</p>
          <h2 className="text-4xl font-extrabold tracking-tight mb-4">
            Często zadawane pytania
          </h2>
        </div>
        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="border rounded-xl px-6 bg-background"
            >
              <AccordionTrigger className="text-left font-semibold text-sm hover:no-underline py-5">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
