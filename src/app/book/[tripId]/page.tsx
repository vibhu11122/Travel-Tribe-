'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { MOCK_TRIPS, getTripBySlug } from '@/lib/data/trips'
import { formatPrice, formatDateRange, generateBookingId, getWhatsAppShareUrl } from '@/lib/utils/format'
import {
  Check, ChevronRight, Loader2, Copy, Share2, ArrowRight,
  Users, Calendar, MapPin, CreditCard, Shield, CheckCircle
} from 'lucide-react'
import { cn } from '@/lib/utils/format'

const ADDONS = [
  { id: 'insurance', name: 'Travel Insurance', price: 299, desc: 'Covered for the entire trip' },
  { id: 'adventure', name: 'Adventure Activity Pack', price: 1499, desc: 'Extra activities bundled in' },
  { id: 'private-room', name: 'Private Room Upgrade', price: 2500, desc: 'Your own room instead of shared' },
]

const STEPS = ['Travelers', 'Details', 'Add-ons', 'Review', 'Payment', 'Confirmation']

export default function BookTripPage() {
  const params = useParams()
  const router = useRouter()
  const tripId = params.tripId as string
  const trip = getTripBySlug(tripId) || MOCK_TRIPS.find(t => t.id === tripId) || MOCK_TRIPS[0]

  const [step, setStep] = useState(1)
  const [numTravelers, setNumTravelers] = useState(1)
  const [travelers, setTravelers] = useState([{ name: '', phone: '', emergencyContact: '' }])
  const [selectedAddons, setSelectedAddons] = useState<string[]>([])
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [bookingId] = useState(() => generateBookingId())
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setTravelers(Array.from({ length: numTravelers }, (_, i) =>
      travelers[i] || { name: '', phone: '', emergencyContact: '' }
    ))
  }, [numTravelers])

  const addonTotal = ADDONS.filter(a => selectedAddons.includes(a.id)).reduce((s, a) => s + a.price * numTravelers, 0)
  const tripTotal = (trip?.price || 0) * numTravelers + addonTotal

  async function simulatePayment() {
    setLoading(true)
    await new Promise(r => setTimeout(r, 2000))
    setLoading(false)
    setStep(6)
  }

  function copyBookingId() {
    navigator.clipboard.writeText(bookingId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!trip) {
    return <div className="min-h-screen flex items-center justify-center"><p>Trip not found.</p></div>
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-white border-b border-navy/10 px-4 sm:px-6 py-4 flex items-center gap-4">
        <Link href={`/trips/${trip.slug}`} className="text-navy/60 hover:text-navy font-semibold text-sm">← Back</Link>
        <span className="text-navy/20">/</span>
        <span className="font-bold text-navy text-sm truncate">{trip.title}</span>
      </header>

      {/* Progress */}
      <div className="bg-white border-b border-navy/10 px-4 sm:px-6 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-1">
              <div className={cn('w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0',
                step > i + 1 ? 'bg-forest text-white' : step === i + 1 ? 'bg-orange text-white' : 'bg-cream-dark text-navy/40')}>
                {step > i + 1 ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <span className={cn('text-xs font-semibold hidden sm:block', step === i + 1 ? 'text-navy' : 'text-navy/40')}>
                {s}
              </span>
              {i < STEPS.length - 1 && <ChevronRight className="w-3 h-3 text-navy/20 hidden sm:block" />}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Step 1: Travelers count */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="bg-white rounded-lg p-5 shadow-card border border-navy/5">
              <div className="flex items-start gap-4">
                <div className="relative w-20 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <Image src={trip.cover_image || '/spiti.jpg'} alt={trip.title} fill className="object-cover" />
                </div>
                <div>
                  <h3 className="font-headline font-black text-navy">{trip.title}</h3>
                  <p className="text-navy/60 text-sm">{trip.destination}</p>
                  <p className="text-orange font-bold mt-1">{formatPrice(trip.price)}/person</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-5 shadow-card border border-navy/5">
              <h2 className="font-headline font-black text-navy text-lg mb-4">How many travelers?</h2>
              <div className="flex items-center gap-6 mb-5">
                <button onClick={() => setNumTravelers(n => Math.max(1, n - 1))}
                  className="w-12 h-12 rounded-full bg-cream-dark text-navy font-black text-xl hover:bg-cream-muted transition-colors flex items-center justify-center">−</button>
                <span className="text-4xl font-headline font-black text-navy w-16 text-center">{numTravelers}</span>
                <button onClick={() => setNumTravelers(n => Math.min(trip.available_slots, n + 1))}
                  className="w-12 h-12 rounded-full bg-orange text-white font-black text-xl hover:bg-orange-600 transition-colors flex items-center justify-center">+</button>
              </div>
              <div className="flex items-center justify-between bg-cream-dark rounded-lg px-4 py-3">
                <span className="text-navy/60 text-sm">{numTravelers} × {formatPrice(trip.price)}</span>
                <span className="font-headline font-black text-navy text-lg">{formatPrice(trip.price * numTravelers)}</span>
              </div>
              <p className="text-xs text-navy/40 mt-2">{trip.available_slots} spots remaining</p>
            </div>

            <button onClick={() => setStep(2)}
              className="w-full flex items-center justify-center gap-2 bg-orange text-white font-bold py-4 rounded-pill hover:bg-orange-600 transition-colors shadow-orange">
              Continue <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Step 2: Traveler details */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="font-headline font-black text-navy text-xl">Traveler Details</h2>
            {travelers.map((t, i) => (
              <div key={i} className="bg-white rounded-lg p-5 shadow-card border border-navy/5">
                <h3 className="font-bold text-navy mb-3">Traveler {i + 1} {i === 0 && '(Primary)'}</h3>
                <div className="space-y-3">
                  <input value={t.name} onChange={e => setTravelers(prev => prev.map((p, j) => j === i ? { ...p, name: e.target.value } : p))}
                    placeholder="Full Name *" className="w-full px-4 py-3 border border-navy/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/30" />
                  <input value={t.phone} onChange={e => setTravelers(prev => prev.map((p, j) => j === i ? { ...p, phone: e.target.value } : p))}
                    placeholder="Phone *" type="tel" className="w-full px-4 py-3 border border-navy/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/30" />
                  <input value={t.emergencyContact} onChange={e => setTravelers(prev => prev.map((p, j) => j === i ? { ...p, emergencyContact: e.target.value } : p))}
                    placeholder="Emergency Contact Name & Number" className="w-full px-4 py-3 border border-navy/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/30" />
                </div>
              </div>
            ))}
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="px-6 py-3 rounded-pill border border-navy/20 text-navy font-semibold hover:bg-cream-dark transition-colors">Back</button>
              <button onClick={() => setStep(3)} className="flex-1 flex items-center justify-center gap-2 bg-orange text-white font-bold py-3 rounded-pill hover:bg-orange-600 transition-colors">
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Add-ons */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="font-headline font-black text-navy text-xl">Optional Add-ons</h2>
            {ADDONS.map(addon => {
              const sel = selectedAddons.includes(addon.id)
              return (
                <div key={addon.id}
                  onClick={() => setSelectedAddons(prev => sel ? prev.filter(a => a !== addon.id) : [...prev, addon.id])}
                  className={cn('flex items-center gap-4 bg-white rounded-lg p-5 shadow-card border cursor-pointer transition-all',
                    sel ? 'border-orange' : 'border-navy/5 hover:border-navy/20')}>
                  <div className={cn('w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                    sel ? 'border-orange bg-orange' : 'border-navy/30')}>
                    {sel && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-navy">{addon.name}</p>
                    <p className="text-navy/50 text-sm">{addon.desc}</p>
                  </div>
                  <p className="text-orange font-bold flex-shrink-0">+{formatPrice(addon.price)}<span className="text-xs text-navy/40">/person</span></p>
                </div>
              )
            })}
            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="px-6 py-3 rounded-pill border border-navy/20 text-navy font-semibold hover:bg-cream-dark transition-colors">Back</button>
              <button onClick={() => setStep(4)} className="flex-1 flex items-center justify-center gap-2 bg-orange text-white font-bold py-3 rounded-pill hover:bg-orange-600 transition-colors">
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div className="space-y-4">
            <h2 className="font-headline font-black text-navy text-xl">Review Your Booking</h2>
            <div className="bg-white rounded-lg p-5 shadow-card border border-navy/5 space-y-3">
              <h3 className="font-bold text-navy border-b border-navy/5 pb-3">{trip.title}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-navy/60">Travelers</span><span className="font-bold">{numTravelers}</span></div>
                <div className="flex justify-between"><span className="text-navy/60">Trip cost</span><span className="font-bold">{formatPrice(trip.price * numTravelers)}</span></div>
                {ADDONS.filter(a => selectedAddons.includes(a.id)).map(a => (
                  <div key={a.id} className="flex justify-between text-orange">
                    <span>{a.name}</span><span>+{formatPrice(a.price * numTravelers)}</span>
                  </div>
                ))}
                <div className="flex justify-between border-t border-navy/10 pt-2">
                  <span className="font-bold text-navy">Total</span>
                  <span className="font-headline font-black text-orange text-xl">{formatPrice(tripTotal)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <input type="checkbox" id="agree" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-orange cursor-pointer" />
              <label htmlFor="agree" className="text-sm text-navy/70 cursor-pointer">
                I agree to the booking terms, cancellation policy, and Travel Tribe's terms of service.
              </label>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(3)} className="px-6 py-3 rounded-pill border border-navy/20 text-navy font-semibold hover:bg-cream-dark transition-colors">Back</button>
              <button onClick={() => setStep(5)} disabled={!agreed}
                className={cn('flex-1 flex items-center justify-center gap-2 font-bold py-3 rounded-pill transition-colors',
                  agreed ? 'bg-orange text-white hover:bg-orange-600' : 'bg-navy/20 text-white cursor-not-allowed')}>
                Confirm & Pay <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Payment */}
        {step === 5 && (
          <div className="space-y-5">
            <h2 className="font-headline font-black text-navy text-xl">Payment</h2>
            <div className="bg-white rounded-lg p-6 shadow-card border border-navy/5 text-center">
              <CreditCard className="w-12 h-12 text-navy/20 mx-auto mb-4" />
              <p className="text-navy/60 mb-1">Amount to pay</p>
              <p className="text-4xl font-headline font-black text-orange mb-6">{formatPrice(tripTotal)}</p>
              <div className="flex items-center justify-center gap-2 text-navy/40 text-xs mb-6">
                <Shield className="w-4 h-4" /> Secure payment · 256-bit SSL encrypted
              </div>
              <p className="text-navy/50 text-sm mb-4 bg-cream-dark rounded-lg px-4 py-3">
                💡 Full payment gateway integration coming soon. For MVP, simulate payment to proceed.
              </p>
              <button onClick={simulatePayment} disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-orange text-white font-bold py-4 rounded-pill hover:bg-orange-600 transition-colors shadow-orange disabled:opacity-70">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                {loading ? 'Processing payment...' : 'Simulate Payment Success'}
              </button>
            </div>
          </div>
        )}

        {/* Step 6: Confirmation */}
        {step === 6 && (
          <div className="space-y-5 text-center">
            <div className="bg-white rounded-lg p-8 shadow-card border border-navy/5">
              <CheckCircle className="w-16 h-16 text-forest mx-auto mb-4" />
              <h2 className="text-3xl font-headline font-black text-navy mb-2">You're booked! 🎉</h2>
              <p className="text-navy/60 mb-5">Your adventure is confirmed. See you on the road!</p>
              <div className="bg-cream-dark rounded-lg px-5 py-3 mb-5 inline-block">
                <p className="text-navy/50 text-xs">Booking ID</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono font-black text-navy text-xl">{bookingId}</span>
                  <button onClick={copyBookingId} className="text-orange hover:text-orange-600 transition-colors">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                {copied && <p className="text-forest text-xs mt-1">Copied!</p>}
              </div>
              <div className="space-y-2 text-left mb-6">
                {[
                  'Check your email for booking confirmation',
                  'Your trip captain will reach out within 24 hours',
                  'Pay the balance amount before departure',
                  'Pack your bags and join the tribe!',
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3 text-navy/70 text-sm">
                    <span className="w-5 h-5 rounded-full bg-orange text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                    {step}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href={`https://wa.me/?text=${encodeURIComponent(`🎉 Just booked ${trip.title} with Travel Tribe! Booking ID: ${bookingId}. Join me! https://traveltribe.in/trips/${trip.slug}`)}`}
                target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold py-3.5 rounded-pill hover:opacity-90 transition-opacity">
                <Share2 className="w-4 h-4" /> Share With Tribe
              </a>
              <Link href="/dashboard/bookings"
                className="flex-1 flex items-center justify-center gap-2 bg-navy text-white font-bold py-3.5 rounded-pill hover:bg-navy-700 transition-colors">
                View My Bookings
              </Link>
            </div>
            <Link href="/trips" className="text-orange font-semibold hover:underline text-sm">
              Explore More Trips →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
