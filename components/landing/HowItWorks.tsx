const steps = [
  {
    step: '01',
    title: 'Zarejestruj się za darmo',
    description: 'Konto w 30 sekund — email i hasło lub Google OAuth. Bez karty kredytowej.',
    emoji: '✉️',
  },
  {
    step: '02',
    title: 'Dodaj swoje bloki',
    description: 'Przeciągaj i upuszczaj linki, obrazy, wideo i social media. Live preview na bieżąco.',
    emoji: '🧱',
  },
  {
    step: '03',
    title: 'Dobierz wygląd',
    description: 'Wybierz motyw, kolory, czcionkę i styl przycisków — Twoja strona, Twoje zasady.',
    emoji: '🎨',
  },
  {
    step: '04',
    title: 'Opublikuj i udostępnij',
    description: 'Jeden klik — Twoja strona jest online pod adresem biolink.app/@twojanazwa.',
    emoji: '🚀',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Jak to działa</p>
          <h2 className="text-4xl font-extrabold tracking-tight mb-4">
            Od zera do online w 2 minuty
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Linia łącząca */}
          <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          {steps.map((s, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-4 relative">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-3xl z-10 relative">
                  {s.emoji}
                </div>
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                  {i + 1}
                </span>
              </div>
              <h3 className="font-bold text-base">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
