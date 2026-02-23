import { HeroSection }     from '@/components/landing/HeroSection'
import { FeaturesSection } from '@/components/landing/FeaturesSection'
import { HowItWorks }      from '@/components/landing/HowItWorks'
import { PricingSection }  from '@/components/landing/PricingSection'
import { FaqSection }      from '@/components/landing/FaqSection'
import { CtaSection }      from '@/components/landing/CtaSection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
      <PricingSection />
      <FaqSection />
      <CtaSection />
    </>
  )
}
