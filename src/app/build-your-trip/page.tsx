'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/common/Navbar'
import Footer from '@/components/common/Footer'
import {
  MapPin, Calendar, Users, IndianRupee, Clock, Compass, Mountain,
  Waves, Utensils, Camera, Leaf, Backpack, Music, ArrowRight, ArrowLeft,
  Zap, RefreshCw, Share2, CheckCircle, Loader2
} from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils/format'
import type { TripBuilderData, GeneratedItinerary } from '@/lib/types'

// ─── Step config ──────────────────────────────────────────────────────────────

const PRESET_DESTINATIONS = [
  'Manali', 'Kasol', 'Rishikesh', 'Spiti Valley', 'Jaipur', 'Jodhpur',
  'Udaipur', 'Khajuraho', 'Varanasi', 'Coorg', '🎲 Surprise Me'
]

const EXPERIENCE_TYPES = [
  { id: 'adventure', label: 'Adventure', emoji: '🔥' },
  { id: 'mountains', label: 'Mountains', emoji: '🏔' },
  { id: 'beaches', label: 'Beaches', emoji: '🏖' },
  { id: 'culture', label: 'Culture', emoji: '🏛' },
  { id: 'food', label: 'Food', emoji: '🍜' },
  { id: 'nightlife', label: 'Nightlife', emoji: '🎉' },
  { id: 'nature', label: 'Nature', emoji: '🌿' },
  { id: 'photography', label: 'Photography', emoji: '📸' },
  { id: 'relaxation', label: 'Relaxation', emoji: '😌' },
  { id: 'backpacking', label: 'Backpacking', emoji: '🎒' },
]

const TRAVELER_TYPES = [
  { id: 'explorer', label: 'Explorer', emoji: '🧭', desc: 'Off-beaten paths & hidden gems' },
  { id: 'adventurer', label: 'Adventurer', emoji: '⛰️', desc: 'Adrenaline & physical challenges' },
  { id: 'chill-traveler', label: 'Chill Traveler', emoji: '☕', desc: 'Slow travel, cafés & sunsets' },
  { id: 'foodie', label: 'Foodie', emoji: '🍛', desc: 'Local flavors above everything' },
  { id: 'party-traveler', label: 'Party Traveler', emoji: '🎊', desc: 'Nightlife, music & people' },
  { id: 'culture-hunter', label: 'Culture Hunter', emoji: '🎭', desc: 'History, art & traditions' },
  { id: 'backpacker', label: 'Backpacker', emoji: '🎒', desc: 'Lean, budget & spontaneous' },
]

const BUDGET_OPTIONS = [
  { id: 'budget', label: 'Under ₹5,000', value: 4500 },
  { id: 'mid-low', label: '₹5,000–₹8,000', value: 6500 },
  { id: 'mid', label: '₹8,000–₹12,000', value: 10000 },
  { id: 'premium', label: '₹12,000+', value: 15000 },
]

const TOTAL_STEPS = 7

const initialData: TripBuilderData = {
  destination: '', startDate: '', endDate: '',
  numPeople: 2, budget: 8000, numDays: 5,
  experienceTypes: [], travelerType: '',
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="w-full bg-cream-dark rounded-full h-1.5 mb-8">
      <motion.div
        className="bg-orange h-1.5 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />
    </div>
  )
}

// ─── Step wrapper ─────────────────────────────────────────────────────────────

function StepWrap({ children, title, sub }: { children: React.ReactNode; title: string; sub?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl sm:text-3xl font-headline font-black text-navy">{title}</h2>
        {sub && <p className="text-navy/60 mt-1">{sub}</p>}
      </div>
      {children}
    </motion.div>
  )
}

// ─── Generated Itinerary display ──────────────────────────────────────────────

function ItineraryResult({ itinerary, onReset, onRequest }: {
  itinerary: GeneratedItinerary
  onReset: () => void
  onRequest: () => void
}) {
  const shareText = `🔥 Just built my perfect trip to ${itinerary.destination} with Travel Tribe! ${TOTAL_STEPS} days of adventure. Come join? https://traveltribe.in/build-your-trip`
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <div className="bg-navy rounded-lg p-6 text-white">
        <p className="text-orange font-bold text-sm uppercase tracking-widest mb-2">Your Trip</p>
        <h2 className="text-2xl font-headline font-black mb-1">{itinerary.title}</h2>
        <p className="text-white/70 text-sm">{itinerary.duration} days · {itinerary.accommodation}</p>
        <div className="mt-4 flex flex-wrap gap-4">
          <div>
            <p className="text-white/50 text-xs">Estimated Cost</p>
            <p className="text-orange font-headline font-black text-2xl">{formatPrice(itinerary.estimatedCost)}<span className="text-sm text-white/60">/person</span></p>
          </div>
          <div>
            <p className="text-white/50 text-xs">Transport</p>
            <p className="text-white font-semibold text-sm">{itinerary.transport}</p>
          </div>
        </div>
      </div>

      {/* Day-by-day */}
      <div className="space-y-3">
        <h3 className="font-headline font-black text-navy text-lg">Day-by-Day Plan</h3>
        {itinerary.days.map((day) => (
          <div key={day.day} className="bg-white rounded-lg p-4 shadow-card border border-navy/5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-orange/10 flex items-center justify-center flex-shrink-0">
                <span className="text-orange font-black text-sm">{day.day}</span>
              </div>
              <div className="flex-1">
                <h4 className="font-headline font-bold text-navy">{day.title}</h4>
                <ul className="mt-2 space-y-1">
                  {day.activities.map((act, i) => (
                    <li key={i} className="text-sm text-navy/60 flex items-start gap-2">
                      <span className="text-orange mt-0.5">›</span> {act}
                    </li>
                  ))}
                </ul>
                {day.food.length > 0 && (
                  <p className="text-xs text-forest mt-2">🍜 {day.food.join(', ')}</p>
                )}
                {day.notes && <p className="text-xs text-navy/40 italic mt-1">{day.notes}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add-ons */}
      {itinerary.addons.length > 0 && (
        <div>
          <h3 className="font-headline font-black text-navy text-lg mb-3">Optional Add-ons</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {itinerary.addons.map((addon, i) => (
              <div key={i} className="bg-cream-dark rounded-lg p-3 border border-navy/5">
                <p className="font-semibold text-navy text-sm">{addon.name}</p>
                <p className="text-orange font-bold text-sm">+{formatPrice(addon.price)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onRequest}
          className="flex-1 flex items-center justify-center gap-2 bg-orange text-white font-bold py-4 rounded-pill hover:bg-orange-600 transition-colors"
        >
          Request This Trip <ArrowRight className="w-4 h-4" />
        </button>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold py-4 rounded-pill hover:opacity-90 transition-opacity"
        >
          <Share2 className="w-4 h-4" /> Share With My Tribe
        </a>
      </div>
      <button onClick={onReset} className="w-full flex items-center justify-center gap-2 text-navy/60 text-sm hover:text-navy py-2">
        <RefreshCw className="w-4 h-4" /> Start Over
      </button>
    </motion.div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function BuildYourTripPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [data, setData] = useState<TripBuilderData>(initialData)
  const [loading, setLoading] = useState(false)
  const [itinerary, setItinerary] = useState<GeneratedItinerary | null>(null)
  const [showRequestForm, setShowRequestForm] = useState(false)
  const [requestSent, setRequestSent] = useState(false)
  const [reqForm, setReqForm] = useState({ name: '', email: '', phone: '' })

  function next() { setStep((s) => Math.min(s + 1, TOTAL_STEPS)) }
  function back() { setStep((s) => Math.max(s - 1, 1)) }

  async function generate() {
    setLoading(true)
    try {
      const res = await fetch('/api/trip-builder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = await res.json()
      setItinerary(result.itinerary)
    } catch {
      // Fallback mock
      setItinerary({
        destination: data.destination || 'Manali',
        title: `${data.destination || 'Manali'} Adventure — ${data.numDays}D/${data.numDays - 1}N`,
        duration: data.numDays,
        estimatedCost: data.budget * 0.85,
        accommodation: 'Hostel / Mountain Guesthouse',
        transport: 'Volvo from Delhi (overnight)',
        days: Array.from({ length: data.numDays }, (_, i) => ({
          day: i + 1,
          title: ['Arrival + Explore', 'Adventure Day', 'Hidden Local Spots', 'Culture + Food', 'Departure'][i] || `Day ${i + 1}`,
          activities: ['Local area exploration', 'Signature activity', 'Sunset viewpoint'],
          food: ['Regional specialty', 'Street food trail'],
        })),
        addons: [
          { name: 'Travel Insurance', price: 299, description: 'Covered for the whole trip' },
          { name: 'Adventure Pack', price: 1499, description: 'Extra activities bundled' },
        ],
      })
    } finally {
      setLoading(false)
    }
  }

  async function submitRequest(e: React.FormEvent) {
    e.preventDefault()
    await fetch('/api/trip-builder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, ...reqForm, generated_itinerary: itinerary, type: 'request' }),
    })
    setRequestSent(true)
  }

  // If itinerary generated
  if (itinerary) {
    if (requestSent) {
      return (
        <div className="min-h-screen bg-cream flex flex-col">
          <Navbar />
          <div className="flex-1 flex items-center justify-center px-4 py-20">
            <div className="text-center max-w-md">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-headline font-black text-navy mb-3">Trip Request Sent!</h2>
              <p className="text-navy/60 mb-8">We'll get back to you within 24 hours to confirm your trip details and pricing.</p>
              <button onClick={() => router.push('/trips')} className="bg-orange text-white font-bold px-8 py-3 rounded-pill hover:bg-orange-600 transition-colors">
                Explore More Trips
              </button>
            </div>
          </div>
          <Footer />
        </div>
      )
    }

    if (showRequestForm) {
      return (
        <div className="min-h-screen bg-cream flex flex-col">
          <Navbar />
          <div className="flex-1 max-w-lg mx-auto px-4 py-20">
            <h2 className="text-2xl font-headline font-black text-navy mb-2">Let's confirm your trip</h2>
            <p className="text-navy/60 mb-6">Our trip captain will reach out within 24 hours.</p>
            <form onSubmit={submitRequest} className="space-y-4 bg-white rounded-lg p-6 shadow-card">
              <div>
                <label className="block text-sm font-semibold text-navy mb-1">Your Name</label>
                <input required value={reqForm.name} onChange={e => setReqForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-navy/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/30" placeholder="Full name" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy mb-1">Email</label>
                <input required type="email" value={reqForm.email} onChange={e => setReqForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full px-4 py-3 border border-navy/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/30" placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy mb-1">Phone</label>
                <input required value={reqForm.phone} onChange={e => setReqForm(f => ({ ...f, phone: e.target.value }))}
                  className="w-full px-4 py-3 border border-navy/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/30" placeholder="10-digit mobile" />
              </div>
              <button type="submit" className="w-full bg-orange text-white font-bold py-3.5 rounded-pill hover:bg-orange-600 transition-colors">
                Send Trip Request 🚀
              </button>
            </form>
            <button onClick={() => setShowRequestForm(false)} className="mt-4 text-sm text-navy/50 hover:text-navy w-full text-center">← Back to itinerary</button>
          </div>
          <Footer />
        </div>
      )
    }

    return (
      <div className="min-h-screen bg-cream flex flex-col">
        <Navbar />
        <div className="flex-1 max-w-2xl mx-auto px-4 py-12">
          <ItineraryResult
            itinerary={itinerary}
            onReset={() => { setItinerary(null); setStep(1); setData(initialData) }}
            onRequest={() => setShowRequestForm(true)}
          />
        </div>
        <Footer />
      </div>
    )
  }

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-4">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
            <Compass className="w-16 h-16 text-orange" />
          </motion.div>
          <div className="text-center">
            <h2 className="text-2xl font-headline font-black text-navy mb-2">Building your perfect trip...</h2>
            <p className="text-navy/60">Crafting a personalized itinerary just for you ✨</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <p className="text-orange font-headline font-bold text-sm uppercase tracking-widest mb-2">Trip Builder</p>
          <h1 className="text-4xl font-headline font-black text-navy">
            Your Trip.<br /><span className="text-orange">Your Rules.</span>
          </h1>
          <p className="text-navy/60 mt-2">Tell us what you want. We'll build it around you.</p>
        </div>

        <ProgressBar step={step} />
        <p className="text-xs text-navy/40 font-semibold mb-6">Step {step} of {TOTAL_STEPS}</p>

        <AnimatePresence mode="wait">
          {/* Step 1: Destination */}
          {step === 1 && (
            <StepWrap key="s1" title="Where do you want to go?" sub="Pick a destination or type your own">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {PRESET_DESTINATIONS.map((dest) => (
                  <button
                    key={dest}
                    onClick={() => setData(d => ({ ...d, destination: dest.replace('🎲 ', '') }))}
                    className={cn(
                      'px-4 py-3 rounded-lg text-sm font-semibold text-left transition-all border',
                      data.destination === dest.replace('🎲 ', '')
                        ? 'bg-navy text-white border-navy'
                        : 'bg-white text-navy border-navy/10 hover:border-navy/30'
                    )}
                  >
                    {dest}
                  </button>
                ))}
              </div>
              <div>
                <label className="text-sm font-semibold text-navy block mb-1">Or type a destination</label>
                <input
                  value={data.destination}
                  onChange={e => setData(d => ({ ...d, destination: e.target.value }))}
                  placeholder="e.g. Ladakh, Andaman, Goa..."
                  className="w-full px-4 py-3 border border-navy/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/30 bg-white"
                />
              </div>
            </StepWrap>
          )}

          {/* Step 2: Dates */}
          {step === 2 && (
            <StepWrap key="s2" title="When are you travelling?" sub="Even approximate dates help us plan better">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-navy block mb-1">Start Date</label>
                  <input type="date" value={data.startDate} onChange={e => setData(d => ({ ...d, startDate: e.target.value }))}
                    className="w-full px-4 py-3 border border-navy/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/30 bg-white" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-navy block mb-1">End Date</label>
                  <input type="date" value={data.endDate} onChange={e => setData(d => ({ ...d, endDate: e.target.value }))}
                    className="w-full px-4 py-3 border border-navy/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/30 bg-white" />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {['This Weekend', 'Next Month', 'In 2 Months', 'In 3 Months'].map(opt => (
                  <button key={opt} className="px-4 py-2 bg-cream-dark text-navy text-sm font-semibold rounded-pill hover:bg-cream-muted transition-colors">
                    {opt}
                  </button>
                ))}
              </div>
            </StepWrap>
          )}

          {/* Step 3: Group size */}
          {step === 3 && (
            <StepWrap key="s3" title="How many people?" sub="Including yourself">
              <div className="flex items-center gap-6 bg-white rounded-lg p-6 shadow-card border border-navy/5 w-fit">
                <button onClick={() => setData(d => ({ ...d, numPeople: Math.max(1, d.numPeople - 1) }))}
                  className="w-12 h-12 rounded-full bg-cream-dark text-navy font-black text-xl hover:bg-cream-muted transition-colors flex items-center justify-center">−</button>
                <span className="text-4xl font-headline font-black text-navy w-16 text-center">{data.numPeople}</span>
                <button onClick={() => setData(d => ({ ...d, numPeople: Math.min(100, d.numPeople + 1) }))}
                  className="w-12 h-12 rounded-full bg-orange text-white font-black text-xl hover:bg-orange-600 transition-colors flex items-center justify-center">+</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {[['Solo', 1], ['2–5', 3], ['6–10', 8], ['10–20', 15], ['20+', 25]].map(([l, v]) => (
                  <button key={l} onClick={() => setData(d => ({ ...d, numPeople: v as number }))}
                    className={cn('px-4 py-2 rounded-pill text-sm font-semibold transition-all',
                      data.numPeople === v ? 'bg-navy text-white' : 'bg-white text-navy border border-navy/20 hover:border-navy/40')}>
                    {l}
                  </button>
                ))}
              </div>
            </StepWrap>
          )}

          {/* Step 4: Budget */}
          {step === 4 && (
            <StepWrap key="s4" title="What's your budget per person?" sub="We'll design within your range">
              <div className="grid grid-cols-2 gap-3">
                {BUDGET_OPTIONS.map(b => (
                  <button key={b.id} onClick={() => setData(d => ({ ...d, budget: b.value }))}
                    className={cn('px-5 py-4 rounded-lg text-left font-semibold transition-all border',
                      data.budget === b.value ? 'bg-navy text-white border-navy' : 'bg-white text-navy border-navy/10 hover:border-navy/30')}>
                    {b.label}
                  </button>
                ))}
              </div>
            </StepWrap>
          )}

          {/* Step 5: Duration */}
          {step === 5 && (
            <StepWrap key="s5" title="How many days?" sub="Including travel days">
              <div className="flex items-center gap-6 bg-white rounded-lg p-6 shadow-card border border-navy/5 w-fit">
                <button onClick={() => setData(d => ({ ...d, numDays: Math.max(2, d.numDays - 1) }))}
                  className="w-12 h-12 rounded-full bg-cream-dark text-navy font-black text-xl hover:bg-cream-muted transition-colors flex items-center justify-center">−</button>
                <div className="text-center w-20">
                  <span className="text-4xl font-headline font-black text-navy">{data.numDays}</span>
                  <p className="text-navy/50 text-xs">days</p>
                </div>
                <button onClick={() => setData(d => ({ ...d, numDays: Math.min(14, d.numDays + 1) }))}
                  className="w-12 h-12 rounded-full bg-orange text-white font-black text-xl hover:bg-orange-600 transition-colors flex items-center justify-center">+</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {[['Weekend', 3], ['Short (4–5D)', 5], ['Full Week', 7], ['Extended (10D)', 10]].map(([l, v]) => (
                  <button key={l} onClick={() => setData(d => ({ ...d, numDays: v as number }))}
                    className={cn('px-4 py-2 rounded-pill text-sm font-semibold transition-all',
                      data.numDays === v ? 'bg-navy text-white' : 'bg-white text-navy border border-navy/20 hover:border-navy/40')}>
                    {l}
                  </button>
                ))}
              </div>
            </StepWrap>
          )}

          {/* Step 6: Experience types */}
          {step === 6 && (
            <StepWrap key="s6" title="What kind of trip?" sub="Pick as many as you like">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {EXPERIENCE_TYPES.map(exp => {
                  const selected = data.experienceTypes.includes(exp.id)
                  return (
                    <button key={exp.id}
                      onClick={() => setData(d => ({
                        ...d,
                        experienceTypes: selected
                          ? d.experienceTypes.filter(e => e !== exp.id)
                          : [...d.experienceTypes, exp.id]
                      }))}
                      className={cn('flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-sm transition-all border',
                        selected ? 'bg-navy text-white border-navy' : 'bg-white text-navy border-navy/10 hover:border-navy/30')}>
                      <span className="text-xl">{exp.emoji}</span> {exp.label}
                    </button>
                  )
                })}
              </div>
            </StepWrap>
          )}

          {/* Step 7: Traveler type */}
          {step === 7 && (
            <StepWrap key="s7" title="What kind of traveler are you?" sub="Be honest — it helps us personalize better">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {TRAVELER_TYPES.map(t => (
                  <button key={t.id} onClick={() => setData(d => ({ ...d, travelerType: t.id }))}
                    className={cn('flex items-start gap-4 p-4 rounded-lg text-left font-semibold transition-all border',
                      data.travelerType === t.id ? 'bg-navy text-white border-navy' : 'bg-white text-navy border-navy/10 hover:border-navy/30')}>
                    <span className="text-3xl">{t.emoji}</span>
                    <div>
                      <p className="font-bold">{t.label}</p>
                      <p className={cn('text-sm mt-0.5', data.travelerType === t.id ? 'text-white/70' : 'text-navy/50')}>{t.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </StepWrap>
          )}
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-navy/10">
          <button onClick={back} disabled={step === 1}
            className={cn('flex items-center gap-2 px-6 py-3 rounded-pill font-semibold transition-all',
              step === 1 ? 'text-navy/30 cursor-not-allowed' : 'text-navy hover:bg-cream-dark')}>
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          {step < TOTAL_STEPS ? (
            <button
              onClick={next}
              disabled={step === 1 && !data.destination}
              className={cn('flex items-center gap-2 px-8 py-3 rounded-pill font-bold transition-all',
                (step === 1 && !data.destination)
                  ? 'bg-navy/30 text-white cursor-not-allowed'
                  : 'bg-orange text-white hover:bg-orange-600 shadow-orange')}
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={generate}
              disabled={!data.travelerType}
              className={cn('flex items-center gap-2 px-8 py-3 rounded-pill font-bold transition-all',
                !data.travelerType ? 'bg-navy/30 text-white cursor-not-allowed' : 'bg-orange text-white hover:bg-orange-600 shadow-orange')}
            >
              ✨ Build My Trip
            </button>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
