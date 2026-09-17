'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import {
  MapPin, Users, Clock, ChevronRight, ArrowRight, Mountain, Waves, Sun,
  Leaf, Landmark, Backpack, Zap, SlidersHorizontal, Search, X
} from 'lucide-react'
import Navbar from '@/components/common/Navbar'
import Footer from '@/components/common/Footer'
import TripCard from '@/components/trips/TripCard'
import { MOCK_TRIPS, TRIP_CATEGORIES } from '@/lib/data/trips'
import { cn, formatPrice } from '@/lib/utils/format'
import type { Trip } from '@/lib/types'

const BUDGET_OPTIONS = [
  { id: 'all', label: 'Any Budget' },
  { id: 'under5k', label: 'Under ₹5K', max: 5000 },
  { id: '5k-10k', label: '₹5K–₹10K', min: 5000, max: 10000 },
  { id: '10k-plus', label: '₹10K+', min: 10000 },
]

const DURATION_OPTIONS = [
  { id: 'all', label: 'Any Duration' },
  { id: 'weekend', label: 'Weekend (2–3D)', max: 3 },
  { id: 'short', label: '4–5 Days', min: 4, max: 5 },
  { id: 'week', label: '6–8 Days', min: 6, max: 8 },
  { id: 'extended', label: '8+ Days', min: 8 },
]

const DIFFICULTY_OPTIONS = ['all', 'easy', 'moderate', 'challenging', 'extreme']

function FadeIn({ children, delay = 0, className = '' }: {
  children: React.ReactNode; delay?: number; className?: string
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px 0px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

import { useEffect } from 'react'

export default function TripsPage() {
  const [tripsList, setTripsList] = useState<Trip[]>(MOCK_TRIPS)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedBudget, setSelectedBudget] = useState('all')
  const [selectedDuration, setSelectedDuration] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    async function loadLiveTrips() {
      try {
        const res = await fetch('/api/admin/trips')
        const data = await res.json()
        if (data.trips && data.trips.length > 0) {
          setTripsList(data.trips.filter((t: Trip) => t.status === 'active' || t.status === 'full'))
        }
      } catch {}
    }
    loadLiveTrips()
  }, [])

  const filteredTrips = tripsList.filter((trip) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      if (
        !trip.title.toLowerCase().includes(q) &&
        !trip.destination.toLowerCase().includes(q) &&
        !trip.tags.some((t) => t.includes(q))
      ) return false
    }
    if (selectedCategory !== 'all') {
      if (trip.trip_type !== selectedCategory && !trip.tags.includes(selectedCategory)) return false
    }
    const budgetOpt = BUDGET_OPTIONS.find((b) => b.id === selectedBudget)
    if (budgetOpt && selectedBudget !== 'all') {
      if (budgetOpt.min !== undefined && trip.price < budgetOpt.min) return false
      if (budgetOpt.max !== undefined && trip.price > budgetOpt.max) return false
    }
    const durOpt = DURATION_OPTIONS.find((d) => d.id === selectedDuration)
    if (durOpt && selectedDuration !== 'all') {
      if (durOpt.min !== undefined && trip.duration_days < durOpt.min) return false
      if (durOpt.max !== undefined && trip.duration_days > durOpt.max) return false
    }
    if (selectedDifficulty !== 'all' && trip.difficulty !== selectedDifficulty) return false
    return true
  })

  const activeFiltersCount = [
    selectedCategory !== 'all', selectedBudget !== 'all',
    selectedDuration !== 'all', selectedDifficulty !== 'all'
  ].filter(Boolean).length

  function resetFilters() {
    setSelectedCategory('all')
    setSelectedBudget('all')
    setSelectedDuration('all')
    setSelectedDifficulty('all')
    setSearchQuery('')
  }

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      {/* Hero bar */}
      <div className="pt-20 bg-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <FadeIn>
            <p className="text-orange font-headline font-bold text-sm uppercase tracking-widest mb-3">
              All Trips
            </p>
            <h1 className="text-4xl sm:text-5xl font-headline font-black text-white leading-tight mb-4">
              Find Your Next<br />
              <span className="text-orange">Adventure.</span>
            </h1>
            <p className="text-white/70 text-lg max-w-xl">
              Student-friendly trips across India's most beautiful destinations. Filter by vibe, budget, or duration.
            </p>
          </FadeIn>

          {/* Search bar */}
          <FadeIn delay={0.1} className="mt-8 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy/40" />
              <input
                type="text"
                placeholder="Search destinations, trips, activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-pill bg-white text-navy font-body text-base placeholder:text-navy/40 focus:outline-none focus:ring-2 focus:ring-orange/40 shadow-heavy"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-navy/40 hover:text-navy"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </FadeIn>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Category filter chips */}
        <div className="flex gap-3 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {TRIP_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                'flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-pill font-body font-700 text-sm transition-all duration-200',
                selectedCategory === cat.id
                  ? 'bg-navy text-white shadow-card'
                  : 'bg-white text-navy/70 hover:bg-cream-dark border border-navy/10'
              )}
            >
              <span>{cat.emoji}</span>
              <span className="font-semibold">{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Filter toggle + result count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-navy/60 font-body text-sm font-semibold">
            Showing <span className="text-navy font-bold">{filteredTrips.length}</span> trips
          </p>
          <div className="flex items-center gap-3">
            {activeFiltersCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-orange text-sm font-semibold hover:underline"
              >
                Clear filters ({activeFiltersCount})
              </button>
            )}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-pill text-sm font-semibold border transition-all',
                showFilters || activeFiltersCount > 0
                  ? 'bg-navy text-white border-navy'
                  : 'bg-white text-navy border-navy/20 hover:border-navy/40'
              )}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </button>
          </div>
        </div>

        {/* Expanded filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-lg p-6 mb-8 shadow-card grid grid-cols-1 sm:grid-cols-3 gap-6"
          >
            {/* Budget */}
            <div>
              <p className="font-headline font-bold text-navy text-sm mb-3 uppercase tracking-wide">Budget</p>
              <div className="flex flex-wrap gap-2">
                {BUDGET_OPTIONS.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBudget(b.id)}
                    className={cn(
                      'px-4 py-2 rounded-pill text-sm font-semibold transition-all',
                      selectedBudget === b.id
                        ? 'bg-orange text-white'
                        : 'bg-cream-dark text-navy/70 hover:bg-cream-muted'
                    )}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div>
              <p className="font-headline font-bold text-navy text-sm mb-3 uppercase tracking-wide">Duration</p>
              <div className="flex flex-wrap gap-2">
                {DURATION_OPTIONS.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setSelectedDuration(d.id)}
                    className={cn(
                      'px-4 py-2 rounded-pill text-sm font-semibold transition-all',
                      selectedDuration === d.id
                        ? 'bg-orange text-white'
                        : 'bg-cream-dark text-navy/70 hover:bg-cream-muted'
                    )}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <p className="font-headline font-bold text-navy text-sm mb-3 uppercase tracking-wide">Difficulty</p>
              <div className="flex flex-wrap gap-2">
                {DIFFICULTY_OPTIONS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDifficulty(d)}
                    className={cn(
                      'px-4 py-2 rounded-pill text-sm font-semibold capitalize transition-all',
                      selectedDifficulty === d
                        ? 'bg-orange text-white'
                        : 'bg-cream-dark text-navy/70 hover:bg-cream-muted'
                    )}
                  >
                    {d === 'all' ? 'Any Level' : d}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Trip grid */}
        {filteredTrips.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map((trip, i) => (
              <FadeIn key={trip.id} delay={i * 0.05}>
                <TripCard trip={trip} showSaveButton />
              </FadeIn>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🗺️</div>
            <h3 className="font-headline font-black text-2xl text-navy mb-2">
              No trips match your vibe.
            </h3>
            <p className="text-navy/60 mb-6">Try adjusting your filters or search term.</p>
            <button
              onClick={resetFilters}
              className="bg-orange text-white font-semibold px-8 py-3 rounded-pill hover:bg-orange-600 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
