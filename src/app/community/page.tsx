'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Navbar from '@/components/common/Navbar'
import Footer from '@/components/common/Footer'
import TripCard from '@/components/trips/TripCard'
import { COMMUNITY_TRIPS, MOCK_TRIPS } from '@/lib/data/trips'
import { Users, Map, Heart, Mail, ArrowRight, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils/format'

function FadeIn({ children, delay = 0, className = '' }: {
  children: React.ReactNode; delay?: number; className?: string
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px 0px' })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 28 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }} className={className}>
      {children}
    </motion.div>
  )
}

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Browse Community Trips',
    desc: 'Find upcoming group trips — curated by Travel Tribe and open to anyone who wants to join.',
    icon: Map,
  },
  {
    step: '02',
    title: 'Join with Travelers From Across India',
    desc: 'Connect with students and young travelers from different colleges and cities who share your vibe.',
    icon: Users,
  },
  {
    step: '03',
    title: 'Travel Together, Make Friends for Life',
    desc: 'The trip ends. The tribe doesn\'t. Community trips are where long-term travel friendships are built.',
    icon: Heart,
  },
]

export default function CommunityPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  async function handleWaitlist(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    try {
      await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Community Subscriber', email }),
      })
    } catch {}
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      {/* Hero */}
      <div className="pt-20 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 30% 50%, #E36F2C 0%, transparent 60%), radial-gradient(circle at 70% 50%, #4ABDE8 0%, transparent 60%)'
          }} />
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative text-center">
          <FadeIn>
            <p className="text-orange font-headline font-bold text-sm uppercase tracking-widest mb-4">Community</p>
            <h1 className="text-5xl sm:text-6xl font-headline font-black text-white leading-tight mb-6">
              Don't Just Visit.<br />
              <span className="text-orange">Belong Somewhere.</span>
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
              Community trips are group adventures open to any young traveler. No fixed friend group needed.
              Just show up, travel together, and leave with stories and people you'll keep.
            </p>
          </FadeIn>
        </div>
      </div>

      {/* Community trips */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <FadeIn className="text-center mb-10">
          <h2 className="text-3xl font-headline font-black text-navy mb-3">Upcoming Community Trips</h2>
          <p className="text-navy/60">Join a trip. Join a tribe.</p>
        </FadeIn>

        {COMMUNITY_TRIPS.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {COMMUNITY_TRIPS.map((trip, i) => (
              <FadeIn key={trip.id} delay={i * 0.08}>
                <TripCard trip={trip} showSaveButton />
              </FadeIn>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow-card border border-navy/5">
            <div className="text-5xl mb-4">🌍</div>
            <h3 className="text-xl font-headline font-black text-navy mb-2">More community trips coming soon!</h3>
            <p className="text-navy/60 mb-6">Drop your email below to be the first to know.</p>
          </div>
        )}
      </div>

      {/* How it works */}
      <div className="bg-navy py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <h2 className="text-3xl font-headline font-black text-white mb-3">How Community Trips Work</h2>
            <p className="text-white/60">Three simple steps to your next adventure</p>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((step, i) => (
              <FadeIn key={step.step} delay={i * 0.1}>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-orange/10 flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-8 h-8 text-orange" />
                  </div>
                  <div className="text-orange font-headline font-black text-4xl mb-2 opacity-30">{step.step}</div>
                  <h3 className="font-headline font-black text-white text-lg mb-2">{step.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>

      {/* Email waitlist */}
      <div className="bg-cream-dark py-16">
        <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">
          <FadeIn>
            <h2 className="text-3xl font-headline font-black text-navy mb-3">Stay in the Loop</h2>
            <p className="text-navy/60 mb-8">Be the first to know about new community trips, weekend getaways, and tribe events.</p>
            {submitted ? (
              <div className="flex items-center justify-center gap-3 text-forest font-semibold text-lg">
                <CheckCircle className="w-6 h-6" />
                You're in! Watch your inbox. 📬
              </div>
            ) : (
              <form onSubmit={handleWaitlist} className="flex gap-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 px-5 py-3.5 border border-navy/20 rounded-pill focus:outline-none focus:ring-2 focus:ring-orange/30 bg-white"
                />
                <button type="submit"
                  className="flex items-center gap-2 bg-orange text-white font-bold px-6 py-3.5 rounded-pill hover:bg-orange-600 transition-colors flex-shrink-0">
                  Notify Me <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </FadeIn>
        </div>
      </div>

      <Footer />
    </div>
  )
}
