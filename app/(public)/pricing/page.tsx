import { PricingSection } from '@/components/landing/PricingSection'
import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        <PricingSection />
      </main>
      <Footer />
    </div>
  )
}
