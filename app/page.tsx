/**
 * RitualOS Landing Page
 * 
 * A beautiful, animated landing page that explains the unique value proposition
 * of RitualOS and converts visitors into users.
 */

import Hero from '@/components/landing/Hero'
import Problem from '@/components/landing/Problem'
import Solution from '@/components/landing/Solution'
import HowItWorks from '@/components/landing/HowItWorks'
import WhyDifferent from '@/components/landing/WhyDifferent'
import CTA from '@/components/landing/CTA'
import Footer from '@/components/landing/Footer'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-900">
      <Hero />
      <Problem />
      <Solution />
      <HowItWorks />
      <WhyDifferent />
      <CTA />
      <Footer />
      </main>
  )
}
