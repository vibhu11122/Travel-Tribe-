import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/common/Navbar'
import Footer from '@/components/common/Footer'
import { ArrowRight, Target, Users, TrendingUp, Network, GraduationCap, Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Travel Tribe | Student Travel Startup India',
  description: 'Travel Tribe was built by students who were tired of generic travel packages. Learn about our founders, mission, and what makes us different.',
}

const TRACTION = [
  { value: '200+', label: 'Paying Customers', emoji: '👥' },
  { value: '7+', label: 'Successful Trips', emoji: '✈️' },
  { value: '₹5L+', label: 'Revenue', emoji: '💰' },
  { value: '₹90K+', label: 'Profit', emoji: '📈' },
  { value: '58', label: 'Largest Group', emoji: '🏆' },
  { value: '20+', label: 'Avg Group Size', emoji: '🤝' },
]

const FOUNDERS = [
  {
    name: 'Jay Yadav',
    role: 'Trip Captain · Operations · Community Building',
    initials: 'JY',
    education: [
      'BBA Tourism & Travel Management — IITTM Gwalior',
      'BBA Digital Business & Entrepreneurship — IIM Bangalore',
    ],
    quote: 'Jay has been on the ground for every single trip we\'ve executed.',
    color: 'bg-orange',
  },
  {
    name: 'Yug Verma',
    role: 'Business Development · Operations · Strategy',
    initials: 'YV',
    education: [
      'BBA Digital Business & Entrepreneurship — IIM Bangalore',
    ],
    quote: 'Strategy meets execution. Yug makes sure the business side of Travel Tribe never sleeps.',
    color: 'bg-navy',
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      {/* Hero */}
      <div className="pt-20 bg-navy relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <p className="text-orange font-headline font-bold text-sm uppercase tracking-widest mb-4">Our Story</p>
          <h1 className="text-5xl sm:text-6xl font-headline font-black text-white leading-tight mb-6">
            We Don't Just<br />Plan Trips.<br />
            <span className="text-orange">We Travel Them.</span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
            Travel Tribe was built because student travel in India was broken.
            Generic packages, tourist traps, zero personalization, and prices that weren't built for campus budgets.
          </p>
        </div>
      </div>

      {/* Mission */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-3xl font-headline font-black text-navy mb-6">The Mission</h2>
        <p className="text-navy/70 text-lg leading-relaxed mb-4">
          India has 400 million people under 35. They want to travel. But every travel option is either too expensive, too generic, or too complicated to organize.
        </p>
        <p className="text-navy/70 text-lg leading-relaxed mb-4">
          Travel Tribe was built to solve exactly that — one affordable, personalized, community-driven trip at a time.
        </p>
        <div className="mt-8 p-8 bg-navy rounded-lg">
          <p className="text-white text-2xl font-headline font-black italic">
            "A Tribe, Not a Transaction."
          </p>
        </div>
      </div>

      {/* Traction */}
      <div className="bg-cream-dark py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-headline font-black text-navy text-center mb-3">We've Already Been Doing It</h2>
          <p className="text-navy/60 text-center mb-10">Real revenue. Real travelers. Real trips.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {TRACTION.map((item) => (
              <div key={item.label} className="bg-white rounded-lg p-4 text-center shadow-card border border-navy/5">
                <div className="text-3xl mb-2">{item.emoji}</div>
                <div className="text-2xl font-headline font-black text-orange">{item.value}</div>
                <div className="text-xs text-navy/60 font-semibold mt-1 leading-tight">{item.label}</div>
              </div>
            ))}
          </div>
          <p className="text-center text-navy/50 text-sm mt-6 italic">
            Including 52 MBA students + 6 faculty in our largest single trip to date.
          </p>
        </div>
      </div>

      {/* Founders */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-headline font-black text-navy text-center mb-3">The Founders</h2>
        <p className="text-navy/60 text-center mb-10">Founders in the field, not just the deck.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {FOUNDERS.map((f) => (
            <div key={f.name} className="bg-white rounded-lg p-8 shadow-card border border-navy/5">
              {/* Avatar */}
              <div className={`w-20 h-20 rounded-full ${f.color} flex items-center justify-center mb-5`}>
                <span className="text-white font-headline font-black text-2xl">{f.initials}</span>
              </div>
              <h3 className="font-headline font-black text-navy text-xl mb-1">{f.name}</h3>
              <p className="text-orange font-semibold text-sm mb-4">{f.role}</p>
              <div className="space-y-2 mb-5">
                {f.education.map((edu) => (
                  <div key={edu} className="flex items-start gap-2">
                    <GraduationCap className="w-4 h-4 text-orange flex-shrink-0 mt-0.5" />
                    <span className="text-navy/70 text-sm">{edu}</span>
                  </div>
                ))}
              </div>
              <p className="text-navy/50 text-sm italic border-t border-navy/10 pt-4">"{f.quote}"</p>
            </div>
          ))}
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-orange py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-4xl font-headline font-black text-white mb-4">Join the Tribe</h2>
          <p className="text-white/80 text-lg mb-8">200+ travelers have already chosen Travel Tribe. You should too.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/trips" className="bg-white text-orange font-bold px-8 py-3.5 rounded-pill hover:bg-cream transition-colors">
              Explore Trips
            </Link>
            <Link href="/join-the-tribe" className="border-2 border-white text-white font-bold px-8 py-3.5 rounded-pill hover:bg-white/10 transition-colors">
              Join the Waitlist
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
