import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/common/Navbar'
import Footer from '@/components/common/Footer'
import { Check, X, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Why Travel Tribe? | Student Group Trips India',
  description: 'Find out why Travel Tribe is different from traditional travel agencies — real execution, student pricing, personalization, and community.',
}

const PROBLEMS = [
  { title: 'Fixed Itineraries', desc: 'Little flexibility once a package is booked.' },
  { title: 'Not Student-Priced', desc: "Travel packages weren't designed for campus budgets." },
  { title: 'Generic Experiences', desc: "Tourist-trap circuits instead of experiencing the destination." },
  { title: 'Zero Personalization', desc: "One itinerary shouldn't be sold to everyone." },
  { title: 'Hard to Organize', desc: "College groups struggle to coordinate reliable trips." },
]

const REASONS = [
  {
    icon: '🎓',
    title: 'Tourism Education Background',
    desc: "Our founders come from formal tourism management education at IITTM Gwalior and IIM Bangalore — not just passion projects.",
  },
  {
    icon: '✅',
    title: 'Real Execution Experience',
    desc: '7+ trips executed. 200+ happy travelers. Real operations, real accountability.',
  },
  {
    icon: '🏫',
    title: 'Student Community Access',
    desc: 'Direct access to college networks, batch groups, and campus communities across India.',
  },
  {
    icon: '💰',
    title: 'Proven Revenue',
    desc: '₹5,00,000+ in revenue with ₹90,000+ profit margin on early trips — this is a real business, not a side project.',
  },
  {
    icon: '📊',
    title: 'Proven Demand',
    desc: '58 travelers on a single trip. 200+ paying customers. The demand was always there — we just needed to organize it.',
  },
  {
    icon: '🤝',
    title: 'Strong Industry Network',
    desc: 'Vetted travel partners across Himachal Pradesh, Uttarakhand, Rajasthan, Madhya Pradesh, and Uttar Pradesh.',
  },
]

const JOURNEY_STEPS = [
  { label: 'DISCOVER', desc: 'Find your trip', icon: '🔍' },
  { label: 'CUSTOMIZE', desc: 'Build your itinerary', icon: '✏️' },
  { label: 'BOOK', desc: 'Secure your spot', icon: '✅' },
  { label: 'TRAVEL', desc: 'Trip captain guides you', icon: '✈️' },
  { label: 'EXPERIENCE', desc: 'Local, real, unforgettable', icon: '🌟' },
  { label: 'SHARE', desc: 'Grow the tribe', icon: '📣' },
]

export default function WhyTravelTribePage() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      {/* Hero */}
      <div className="pt-20 bg-navy">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <p className="text-orange font-headline font-bold text-sm uppercase tracking-widest mb-4">Why Us</p>
          <h1 className="text-5xl sm:text-6xl font-headline font-black text-white leading-tight mb-6">
            Why <span className="text-orange">Travel Tribe?</span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Because generic travel packages were never built for you. We were.
          </p>
        </div>
      </div>

      {/* Problems */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-headline font-black text-navy text-center mb-3">Student Travel Is Broken.</h2>
        <p className="text-navy/60 text-center mb-10">Here's what the current market looks like for young travelers:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {PROBLEMS.map((p) => (
            <div key={p.title} className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-lg p-4">
              <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-navy">{p.title}</p>
                <p className="text-navy/60 text-sm mt-0.5">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center py-8">
          <h3 className="text-4xl font-headline font-black text-navy mb-2">So We Built Travel Tribe.</h3>
          <div className="w-16 h-1 bg-orange mx-auto rounded-full" />
        </div>
      </div>

      {/* Reasons */}
      <div className="bg-cream-dark py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-headline font-black text-navy text-center mb-10">Six Reasons to Choose Travel Tribe</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {REASONS.map((r) => (
              <div key={r.title} className="bg-white rounded-lg p-6 shadow-card border border-navy/5 hover:shadow-card-hover transition-shadow">
                <div className="text-4xl mb-3">{r.icon}</div>
                <h3 className="font-headline font-black text-navy text-lg mb-2">{r.title}</h3>
                <p className="text-navy/60 text-sm leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trust journey */}
      <div className="bg-navy py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-headline font-black text-white text-center mb-3">Your Trip Is Handled End-to-End</h2>
          <p className="text-white/60 text-center mb-12">Travel Tribe works with vetted travel partners across India.</p>
          <div className="flex flex-wrap justify-center items-center gap-4">
            {JOURNEY_STEPS.map((step, i) => (
              <div key={step.label} className="flex items-center gap-4">
                <div className="text-center">
                  <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-2 text-2xl">
                    {step.icon}
                  </div>
                  <p className="text-orange font-headline font-black text-xs tracking-wider">{step.label}</p>
                  <p className="text-white/50 text-xs">{step.desc}</p>
                </div>
                {i < JOURNEY_STEPS.length - 1 && (
                  <ArrowRight className="w-5 h-5 text-white/30 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
        <h2 className="text-3xl font-headline font-black text-navy mb-4">Ready to travel differently?</h2>
        <p className="text-navy/60 mb-8">Stop travelling like a tourist. Start travelling with your tribe.</p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/trips" className="bg-orange text-white font-bold px-8 py-3.5 rounded-pill hover:bg-orange-600 transition-colors shadow-orange">
            Explore Trips
          </Link>
          <Link href="/build-your-trip" className="bg-navy text-white font-bold px-8 py-3.5 rounded-pill hover:bg-navy-700 transition-colors">
            Build My Trip
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  )
}
