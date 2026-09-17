'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MapPin,
  Clock,
  Users,
  Calendar,
  ChevronRight,
  ChevronDown,
  Check,
  X,
  Share2,
  MessageCircle,
  Copy,
  CheckCircle2,
  ArrowRight,
  Flame,
  Bus,
  Plus,
  Minus,
} from 'lucide-react'
import type { Trip } from '@/lib/types'
import {
  formatPrice,
  formatDateRange,
  formatDuration,
  getDifficultyColor,
  getTripTypeEmoji,
  getWhatsAppShareUrl,
  getTripShareText,
  cn,
} from '@/lib/utils/format'
import { getTripWhatsAppUrl } from '@/lib/whatsapp/client'

// ─── Types ───────────────────────────────────────────────────────────────────

interface Props {
  trip: Trip
  similarTrips: Trip[]
}

// ─── Image Gallery ────────────────────────────────────────────────────────────

function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const [selected, setSelected] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const all = images.length > 0 ? images : ['/spiti.jpg']
  const main = all[selected]

  return (
    <>
      <div className="space-y-2">
        {/* Main image */}
        <button
          onClick={() => setLightboxOpen(true)}
          className="relative w-full h-72 lg:h-[480px] rounded-lg overflow-hidden group cursor-zoom-in"
        >
          <Image
            src={main}
            alt={alt}
            fill
            className="object-cover group-hover:scale-102 transition-transform duration-500"
            priority
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          <div className="absolute bottom-3 right-3 bg-navy/70 backdrop-blur-sm text-cream text-xs font-body px-2 py-1 rounded-pill opacity-0 group-hover:opacity-100 transition-opacity">
            Click to expand
          </div>
        </button>

        {/* Thumbnails */}
        {all.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {all.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                className={cn(
                  'relative flex-shrink-0 w-20 h-16 rounded-sm overflow-hidden border-2 transition-all',
                  selected === i ? 'border-orange' : 'border-transparent opacity-60 hover:opacity-90'
                )}
              >
                <Image src={img} alt={`${alt} ${i + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 text-white/80 hover:text-white p-2 rounded-full bg-white/10"
            >
              <X size={20} />
            </button>
            <div className="relative w-full max-w-4xl aspect-[4/3]" onClick={(e) => e.stopPropagation()}>
              <Image src={main} alt={alt} fill className="object-contain" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ─── Itinerary Accordion ──────────────────────────────────────────────────────

function ItineraryAccordion({ itinerary }: { itinerary: Trip['itinerary'] }) {
  const [openDay, setOpenDay] = useState<number | null>(0)

  return (
    <div className="space-y-2">
      {itinerary.map((day, idx) => {
        const isOpen = openDay === idx
        return (
          <div
            key={day.day}
            className={cn(
              'border rounded-lg overflow-hidden transition-all',
              isOpen ? 'border-orange/40 shadow-sm' : 'border-navy/10'
            )}
          >
            <button
              onClick={() => setOpenDay(isOpen ? null : idx)}
              className="w-full flex items-center gap-4 p-4 text-left hover:bg-navy/2 transition-colors"
            >
              <div className={cn(
                'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-headline font-bold transition-colors',
                isOpen ? 'bg-orange text-white' : 'bg-navy/10 text-navy/60'
              )}>
                {day.day}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-body text-xs text-navy/50 mb-0.5">Day {day.day}</div>
                <div className="font-headline font-semibold text-navy text-sm truncate pr-4">
                  {day.title}
                </div>
              </div>
              <ChevronDown
                size={16}
                className={cn('text-navy/40 flex-shrink-0 transition-transform', isOpen && 'rotate-180')}
              />
            </button>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="px-4 pb-4 ml-12 space-y-4">
                    <p className="font-body text-navy/70 text-sm leading-relaxed">
                      {day.description}
                    </p>
                    {/* Activities */}
                    <div>
                      <div className="text-xs font-body font-semibold text-navy/50 uppercase tracking-wider mb-2">
                        Activities
                      </div>
                      <ul className="space-y-1.5">
                        {day.activities.map((act, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm font-body text-navy/80">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange mt-2 flex-shrink-0" />
                            {act}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {/* Meals */}
                    {day.meals && day.meals.length > 0 && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-body text-navy/50">🍽 Meals:</span>
                        {day.meals.map((m, i) => (
                          <span key={i} className="text-xs font-body bg-forest/10 text-forest px-2 py-0.5 rounded-pill">
                            {m}
                          </span>
                        ))}
                      </div>
                    )}
                    {/* Accommodation */}
                    {day.accommodation && (
                      <div className="text-xs font-body text-navy/60 flex items-center gap-1.5">
                        <span>🏨</span> {day.accommodation}
                      </div>
                    )}
                    {/* Travel */}
                    {day.travel && (
                      <div className="text-xs font-body text-navy/60 flex items-center gap-1.5">
                        <Bus size={12} /> {day.travel}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}

// ─── Similar Trip Card ────────────────────────────────────────────────────────

function SimilarTripCard({ trip }: { trip: Trip }) {
  return (
    <Link
      href={`/trips/${trip.slug}`}
      className="group flex gap-3 bg-white rounded-lg overflow-hidden shadow-card hover:shadow-card-hover transition-all hover:-translate-y-0.5 p-3"
    >
      <div className="relative w-20 h-16 rounded-sm overflow-hidden flex-shrink-0">
        <Image
          src={trip.cover_image ?? '/spiti.jpg'}
          alt={trip.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-body text-xs text-navy/50 flex items-center gap-1 mb-0.5">
          <MapPin size={10} /> {trip.destination.split(',')[0]}
        </div>
        <div className="font-headline font-bold text-navy text-sm leading-tight group-hover:text-orange transition-colors line-clamp-2">
          {trip.title}
        </div>
        <div className="font-headline font-bold text-orange text-sm mt-1">
          {formatPrice(trip.price)}
        </div>
      </div>
    </Link>
  )
}

// ─── Main Client Component ────────────────────────────────────────────────────

export default function TripDetailClient({ trip, similarTrips }: Props) {
  const [copied, setCopied] = useState(false)

  const tripUrl =
    typeof window !== 'undefined'
      ? window.location.href
      : `https://traveltribe.in/trips/${trip.slug}`

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(tripUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // fallback: do nothing
    }
  }, [tripUrl])

  const whatsappUrl = getWhatsAppShareUrl(
    getTripShareText(trip.title, trip.destination, tripUrl)
  )

  const discountPct =
    trip.price_original && trip.price_original > trip.price
      ? Math.round(((trip.price_original - trip.price) / trip.price_original) * 100)
      : null

  const spotsLeft = trip.available_slots
  const isFilling = spotsLeft <= 5

  const allImages = trip.gallery && trip.gallery.length > 0 ? trip.gallery : [trip.cover_image ?? '/spiti.jpg']

  // Add-ons mock
  const addons = [
    { id: 'solo-tent', name: 'Private Tent', price: 1500, description: 'Upgrade from twin sharing to a private tent' },
    { id: 'travel-insurance', name: 'Travel Insurance', price: 499, description: 'Comprehensive travel + medical coverage' },
    { id: 'photography', name: 'Trip Photography Pack', price: 999, description: 'Professional photos & reels from the trip' },
  ]

  return (
    <div className="min-h-screen bg-cream pb-28 lg:pb-0">
      {/* ── Breadcrumb ──────────────────────────────────────────── */}
      <div className="bg-navy px-4 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-cream/60 text-sm font-body flex-wrap">
          <Link href="/" className="hover:text-cream transition-colors">Home</Link>
          <ChevronRight size={14} />
          <Link href="/trips" className="hover:text-cream transition-colors">Trips</Link>
          <ChevronRight size={14} />
          <span className="text-cream font-semibold truncate max-w-[180px]">{trip.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-[1fr_360px] lg:gap-10">
          {/* ── LEFT COLUMN ───────────────────────────────────────── */}
          <div className="space-y-8">
            {/* Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Gallery images={allImages} alt={trip.title} />
            </motion.div>

            {/* Trip Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="bg-navy/10 text-navy text-xs font-body font-semibold px-3 py-1 rounded-pill">
                  {getTripTypeEmoji(trip.trip_type)} {trip.trip_type}
                </span>
                <span className={cn('text-xs font-body font-semibold px-3 py-1 rounded-pill', getDifficultyColor(trip.difficulty))}>
                  {trip.difficulty}
                </span>
                {trip.is_community && (
                  <span className="bg-orange/15 text-orange text-xs font-body font-semibold px-3 py-1 rounded-pill">
                    🤝 Community Trip
                  </span>
                )}
              </div>

              <h1 className="font-headline font-black text-navy text-2xl lg:text-4xl mb-2 leading-tight">
                {trip.title}
              </h1>

              <div className="flex items-center gap-1.5 text-navy/60 font-body text-sm mb-4">
                <MapPin size={14} className="text-orange" />
                <span>{trip.destination}</span>
              </div>

              <p className="font-body text-navy/70 text-base leading-relaxed">
                {trip.description}
              </p>
            </motion.div>

            {/* Quick Info Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-3"
            >
              {[
                {
                  icon: <Clock size={16} className="text-orange" />,
                  label: 'Duration',
                  value: formatDuration(trip.duration_days, trip.duration_nights),
                },
                {
                  icon: <Users size={16} className="text-orange" />,
                  label: 'Travelers',
                  value: `${trip.available_slots} of ${trip.capacity} left`,
                },
                {
                  icon: <MapPin size={16} className="text-orange" />,
                  label: 'Meeting Point',
                  value: trip.meeting_point ?? 'TBD',
                },
                {
                  icon: <Bus size={16} className="text-orange" />,
                  label: 'Transport From',
                  value: trip.transport_from ?? 'Delhi',
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-white rounded-lg p-4 shadow-card"
                >
                  <div className="flex items-center gap-2 mb-1">
                    {item.icon}
                    <span className="text-xs font-body text-navy/50">{item.label}</span>
                  </div>
                  <div className="font-body font-semibold text-navy text-sm">{item.value}</div>
                </div>
              ))}
            </motion.div>

            {/* Highlights */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="font-headline font-bold text-navy text-xl mb-4">
                ✨ Trip Highlights
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {trip.highlights.map((h, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 bg-white rounded-lg px-4 py-3 shadow-card"
                  >
                    <CheckCircle2 size={16} className="text-forest mt-0.5 flex-shrink-0" />
                    <span className="font-body text-navy/80 text-sm">{h}</span>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Itinerary */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
            >
              <h2 className="font-headline font-bold text-navy text-xl mb-4">
                🗓 Day-by-Day Itinerary
              </h2>
              <ItineraryAccordion itinerary={trip.itinerary} />
            </motion.section>

            {/* Inclusions / Exclusions */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="font-headline font-bold text-navy text-xl mb-4">
                📋 What's Included
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Inclusions */}
                <div className="bg-white rounded-lg p-5 shadow-card">
                  <h3 className="font-body font-bold text-forest text-sm mb-3 flex items-center gap-2">
                    <Check size={14} /> Included
                  </h3>
                  <ul className="space-y-2">
                    {trip.inclusions.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm font-body text-navy/80">
                        <Check size={14} className="text-forest mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Exclusions */}
                <div className="bg-white rounded-lg p-5 shadow-card">
                  <h3 className="font-body font-bold text-red-500 text-sm mb-3 flex items-center gap-2">
                    <X size={14} /> Not Included
                  </h3>
                  <ul className="space-y-2">
                    {trip.exclusions.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm font-body text-navy/80">
                        <X size={14} className="text-red-400 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.section>

            {/* Add-ons */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
            >
              <h2 className="font-headline font-bold text-navy text-xl mb-4">
                ⚡ Optional Add-ons
              </h2>
              <div className="space-y-3">
                {addons.map((addon) => (
                  <div
                    key={addon.id}
                    className="flex items-center justify-between bg-white rounded-lg px-4 py-4 shadow-card"
                  >
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="font-body font-bold text-navy text-sm">{addon.name}</div>
                      <div className="font-body text-navy/60 text-xs mt-0.5">{addon.description}</div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="font-headline font-bold text-orange text-sm">
                        +{formatPrice(addon.price)}
                      </span>
                      <button className="w-7 h-7 rounded-full bg-navy/10 hover:bg-orange hover:text-white flex items-center justify-center transition-colors">
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Share section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-navy/5 rounded-lg p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <Share2 size={18} className="text-orange" />
                <h2 className="font-headline font-bold text-navy text-lg">
                  Share with your tribe
                </h2>
              </div>
              <p className="font-body text-navy/60 text-sm mb-4">
                Travel is better together. Tag your squad!
              </p>
              <div className="flex gap-3 flex-wrap">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-[#25D366] text-white font-body font-semibold text-sm px-4 py-2.5 rounded-pill hover:opacity-90 transition-opacity shadow-sm"
                >
                  <MessageCircle size={15} />
                  WhatsApp
                </a>
                <button
                  onClick={handleCopy}
                  className={cn(
                    'flex items-center gap-2 font-body font-semibold text-sm px-4 py-2.5 rounded-pill transition-all shadow-sm',
                    copied
                      ? 'bg-forest text-white'
                      : 'bg-white text-navy border border-navy/15 hover:border-orange/40'
                  )}
                >
                  {copied ? <CheckCircle2 size={15} /> : <Copy size={15} />}
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
            </motion.section>

            {/* Similar Trips */}
            {similarTrips.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.45 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-headline font-bold text-navy text-xl">
                    Similar Trips
                  </h2>
                  <Link
                    href="/trips"
                    className="text-orange font-body font-semibold text-sm flex items-center gap-1 hover:underline"
                  >
                    View all <ArrowRight size={13} />
                  </Link>
                </div>
                <div className="space-y-3">
                  {similarTrips.map((t) => (
                    <SimilarTripCard key={t.id} trip={t} />
                  ))}
                </div>
              </motion.section>
            )}
          </div>

          {/* ── RIGHT COLUMN — Price / Booking Card ──────────────── */}
          <aside className="hidden lg:block">
            <div className="sticky top-6">
              <BookingCard trip={trip} discountPct={discountPct} isFilling={isFilling} spotsLeft={spotsLeft} />
            </div>
          </aside>
        </div>
      </div>

      {/* ── Sticky Mobile CTA ────────────────────────────────────────────── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-navy/10 px-4 py-4 shadow-heavy">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-headline font-black text-orange text-2xl">
                {formatPrice(trip.price)}
              </span>
              {trip.price_original && (
                <span className="text-navy/40 text-xs font-body line-through">
                  {formatPrice(trip.price_original)}
                </span>
              )}
            </div>
            <div className="text-navy/50 text-xs font-body">per person · all-inclusive</div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={getTripWhatsAppUrl({
                tripTitle: trip.title,
                destination: trip.destination,
                travelDate: trip.start_date && trip.end_date ? formatDateRange(trip.start_date, trip.end_date) : undefined,
                price: trip.price,
                slug: trip.slug,
                intent: 'inquire',
              })}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-[#25D366] text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center"
              aria-label="Chat on WhatsApp"
            >
              <MessageCircle size={18} />
            </a>
            <Link
              href={`/book/${trip.slug}`}
              className="bg-orange text-white font-headline font-bold text-sm py-3.5 px-5 rounded-lg text-center hover:bg-orange-600 transition-colors shadow-orange flex-1 whitespace-nowrap"
            >
              Join Trip 🔥
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Booking Card (Desktop Sidebar) ──────────────────────────────────────────

function BookingCard({
  trip,
  discountPct,
  isFilling,
  spotsLeft,
}: {
  trip: Trip
  discountPct: number | null
  isFilling: boolean
  spotsLeft: number
}) {
  const [travelers, setTravelers] = useState(1)

  const total = trip.price * travelers

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-lg shadow-heavy p-6 border border-navy/5"
    >
      {/* Price */}
      <div className="mb-4">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="font-headline font-black text-orange text-3xl">
            {formatPrice(trip.price)}
          </span>
          {trip.price_original && (
            <span className="text-navy/40 text-sm font-body line-through">
              {formatPrice(trip.price_original)}
            </span>
          )}
          {discountPct && (
            <span className="bg-orange/10 text-orange text-xs font-body font-bold px-2 py-0.5 rounded-pill">
              {discountPct}% OFF
            </span>
          )}
        </div>
        <div className="text-navy/50 text-sm font-body">per person · all-inclusive</div>
      </div>

      {/* Spots */}
      {isFilling ? (
        <div className="flex items-center gap-2 bg-orange/10 text-orange text-sm font-body font-semibold px-3 py-2 rounded-sm mb-4">
          <Flame size={14} /> Only {spotsLeft} spots remaining!
        </div>
      ) : (
        <div className="text-navy/60 text-sm font-body mb-4">
          {spotsLeft} of {trip.capacity} spots available
        </div>
      )}

      {/* Progress bar */}
      <div className="mb-5">
        <div className="h-1.5 bg-navy/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-orange rounded-full transition-all"
            style={{ width: `${Math.max(10, ((trip.capacity - spotsLeft) / trip.capacity) * 100)}%` }}
          />
        </div>
      </div>

      {/* Dates */}
      {trip.start_date && trip.end_date && (
        <div className="flex items-center gap-2 text-sm font-body text-navy/70 mb-4">
          <Calendar size={14} className="text-orange" />
          {formatDateRange(trip.start_date, trip.end_date)}
        </div>
      )}

      {/* Duration */}
      <div className="flex items-center gap-2 text-sm font-body text-navy/70 mb-5">
        <Clock size={14} className="text-orange" />
        {formatDuration(trip.duration_days, trip.duration_nights)}
      </div>

      {/* Travelers selector */}
      <div className="border border-navy/10 rounded-sm p-3 mb-5">
        <div className="text-xs font-body text-navy/50 mb-2">Number of Travelers</div>
        <div className="flex items-center justify-between">
          <button
            onClick={() => setTravelers(Math.max(1, travelers - 1))}
            className="w-8 h-8 rounded-full bg-navy/10 hover:bg-navy/20 flex items-center justify-center transition-colors"
          >
            <Minus size={14} />
          </button>
          <span className="font-headline font-bold text-navy text-lg">{travelers}</span>
          <button
            onClick={() => setTravelers(Math.min(spotsLeft, travelers + 1))}
            className="w-8 h-8 rounded-full bg-navy/10 hover:bg-navy/20 flex items-center justify-center transition-colors"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Total */}
      <div className="flex justify-between items-center mb-5 bg-navy/3 rounded-sm px-3 py-2">
        <span className="font-body text-navy/70 text-sm">Total ({travelers} traveler{travelers > 1 ? 's' : ''})</span>
        <span className="font-headline font-bold text-navy text-lg">{formatPrice(total)}</span>
      </div>

      {/* CTA Buttons */}
      <div className="space-y-2.5">
        <Link
          href={`/book/${trip.slug}`}
          className="block w-full bg-orange text-white text-center font-headline font-bold py-3.5 rounded-lg hover:bg-orange-600 transition-colors shadow-orange text-base"
        >
          Book Online Now 🚀
        </Link>
        <a
          href={getTripWhatsAppUrl({
            tripTitle: trip.title,
            destination: trip.destination,
            travelDate: trip.start_date && trip.end_date ? formatDateRange(trip.start_date, trip.end_date) : undefined,
            price: total,
            slug: trip.slug,
            intent: 'reserve',
          })}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white text-center font-headline font-bold py-3 rounded-lg transition-colors text-sm"
        >
          <MessageCircle size={16} className="fill-current" /> Reserve via WhatsApp
        </a>
      </div>
      <p className="text-center text-xs font-body text-navy/40 mt-3">
        Instant confirmation · 100% Student verified
      </p>

      {/* Trust signals */}
      <div className="mt-5 pt-4 border-t border-navy/10 space-y-2">
        {[
          '✅ 200+ happy travelers',
          '✅ Trip captain throughout',
          '✅ Transparent pricing',
        ].map((item) => (
          <div key={item} className="text-xs font-body text-navy/60">{item}</div>
        ))}
      </div>
    </motion.div>
  )
}
