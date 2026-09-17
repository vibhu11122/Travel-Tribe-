'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Navbar from '@/components/common/Navbar'
import Footer from '@/components/common/Footer'
import DestinationCard from '@/components/destinations/DestinationCard'
import { MOCK_DESTINATIONS, DESTINATION_CATEGORIES } from '@/lib/data/destinations'
import { cn } from '@/lib/utils/format'

function FadeIn({ children, delay = 0, className = '' }: {
  children: React.ReactNode; delay?: number; className?: string
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px 0px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function DestinationsPage() {
  const [selected, setSelected] = useState('all')

  const filtered = selected === 'all'
    ? MOCK_DESTINATIONS
    : MOCK_DESTINATIONS.filter((d) => d.category.includes(selected as any))

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      {/* Hero */}
      <div className="pt-20 bg-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <FadeIn>
            <p className="text-orange font-headline font-bold text-sm uppercase tracking-widest mb-3">
              Destinations
            </p>
            <h1 className="text-4xl sm:text-5xl font-headline font-black text-white leading-tight mb-4">
              Explore India<br />
              <span className="text-orange">Your Way.</span>
            </h1>
            <p className="text-white/70 text-lg max-w-xl">
              From snow-capped Himalayan peaks to ancient royal forts — pick your next adventure and we'll handle the rest.
            </p>
          </FadeIn>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Category filter */}
        <FadeIn className="flex gap-3 overflow-x-auto pb-2 mb-10">
          {DESTINATION_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelected(cat.id)}
              className={cn(
                'flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-pill text-sm font-semibold transition-all duration-200',
                selected === cat.id
                  ? 'bg-navy text-white shadow-card'
                  : 'bg-white text-navy/70 hover:bg-cream-dark border border-navy/10'
              )}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </FadeIn>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((dest, i) => (
              <FadeIn key={dest.id} delay={i * 0.06}>
                <DestinationCard destination={dest} />
              </FadeIn>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🗺️</div>
            <h3 className="font-headline font-black text-2xl text-navy mb-2">No destinations found.</h3>
            <p className="text-navy/60 mb-6">Try a different category filter.</p>
            <button onClick={() => setSelected('all')} className="bg-orange text-white font-semibold px-8 py-3 rounded-pill">
              Show All
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
