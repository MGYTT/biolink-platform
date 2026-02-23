// app/page.tsx
import { Navbar }          from '@/components/landing/Navbar'
import { HeroSection }     from '@/components/landing/HeroSection'
import { FeaturesSection } from '@/components/landing/FeaturesSection'
import { HowItWorks }      from '@/components/landing/HowItWorks'
import { PricingSection }  from '@/components/landing/PricingSection'
import { FaqSection }      from '@/components/landing/FaqSection'
import { CtaSection }      from '@/components/landing/CtaSection'
import { Footer }          from '@/components/landing/Footer'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <HowItWorks />
        <PricingSection />
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  )
}
