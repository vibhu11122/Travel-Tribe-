import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { MOCK_DESTINATIONS, getDestinationBySlug } from '@/lib/data/destinations'
import { MOCK_TRIPS } from '@/lib/data/trips'
import { formatPrice, getTripTypeEmoji } from '@/lib/utils/format'
import Navbar from '@/components/common/Navbar'
import Footer from '@/components/common/Footer'
import TripCard from '@/components/trips/TripCard'
import { MapPin, Clock, IndianRupee, ArrowRight, Check } from 'lucide-react'

export function generateStaticParams() {
  return MOCK_DESTINATIONS.map((d) => ({ id: d.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const dest = getDestinationBySlug(id)
  if (!dest) return { title: 'Destination Not Found | Travel Tribe' }
  return {
    title: `${dest.name} Travel | Travel Tribe`,
    description: dest.description,
    openGraph: {
      title: `${dest.name} | Travel Tribe`,
      description: dest.description,
      images: dest.cover_image ? [{ url: dest.cover_image }] : [],
    },
  }
}

export default async function DestinationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const dest = getDestinationBySlug(id)
  if (!dest) notFound()

  const relatedTrips = MOCK_TRIPS.filter((t) =>
    t.destination.toLowerCase().includes(dest.state.toLowerCase()) ||
    t.destination_id === dest.id
  ).slice(0, 3)

  const ACTIVITY_EMOJIS: Record<string, string> = {
    Trekking: '🥾', Camping: '⛺', 'River rafting': '🚣', Paragliding: '🪂',
    'Monastery visits': '🏯', Yoga: '🧘', Safari: '🦁', Photography: '📸',
    'Fort walks': '🏰', 'Camel safari': '🐪', 'Hot air balloon': '🎈',
    'Bungee jumping': '🦅', Kayaking: '🛶',
  }

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      {/* Hero */}
      <div className="relative h-[70vh] min-h-[480px] pt-16">
        <Image
          src={dest.cover_image || '/spiti.jpg'}
          alt={dest.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-4">
            {dest.category.map((cat) => (
              <span key={cat} className="px-3 py-1 bg-orange/90 text-white text-xs font-bold uppercase tracking-wider rounded-pill">
                {cat}
              </span>
            ))}
          </div>
          <h1 className="text-5xl sm:text-6xl font-headline font-black text-white leading-tight mb-2">
            {dest.name}
          </h1>
          <p className="text-white/80 text-lg font-body">{dest.state}, India</p>
        </div>
      </div>

      {/* Stats bar */}
      <div className="bg-white border-b border-navy/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap gap-6">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-orange" />
            <span className="text-navy/60">Best Time:</span>
            <span className="font-semibold text-navy">{dest.best_time}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <IndianRupee className="w-4 h-4 text-orange" />
            <span className="text-navy/60">Starting from:</span>
            <span className="font-semibold text-orange">{formatPrice(dest.starting_price)}/person</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-orange" />
            <span className="font-semibold text-navy">{dest.region}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Description */}
            <div>
              <h2 className="text-2xl font-headline font-black text-navy mb-4">About {dest.name}</h2>
              <p className="text-navy/70 text-lg leading-relaxed font-body">{dest.description}</p>
            </div>

            {/* Activities */}
            <div>
              <h2 className="text-2xl font-headline font-black text-navy mb-4">Popular Activities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {dest.popular_activities.map((activity) => (
                  <div
                    key={activity}
                    className="flex items-center gap-3 bg-white rounded-lg p-3 shadow-card border border-navy/5"
                  >
                    <span className="text-2xl">{ACTIVITY_EMOJIS[activity] || '✈️'}</span>
                    <span className="font-semibold text-navy text-sm">{activity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Highlights */}
            <div>
              <h2 className="text-2xl font-headline font-black text-navy mb-4">Must-See Highlights</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {dest.highlights.map((h) => (
                  <div key={h} className="flex items-center gap-3 bg-cream-dark rounded-lg px-4 py-3">
                    <Check className="w-5 h-5 text-orange flex-shrink-0" />
                    <span className="font-semibold text-navy">{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Related trips */}
            {relatedTrips.length > 0 && (
              <div>
                <h2 className="text-2xl font-headline font-black text-navy mb-6">
                  Travel Tribe Trips in {dest.name}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedTrips.map((trip) => (
                    <TripCard key={trip.id} trip={trip} variant="compact" />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-lg shadow-card p-6 border border-navy/5">
              <h3 className="font-headline font-black text-navy text-xl mb-2">Plan Your Trip to {dest.name}</h3>
              <p className="text-navy/60 text-sm mb-6">Tell us what you want and we'll build the perfect itinerary.</p>
              <Link
                href={`/build-your-trip?destination=${encodeURIComponent(dest.name)}`}
                className="flex items-center justify-center gap-2 w-full bg-orange text-white font-bold py-3.5 px-6 rounded-pill hover:bg-orange-600 transition-colors mb-3"
              >
                Build My {dest.name} Trip
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/trips"
                className="flex items-center justify-center gap-2 w-full bg-cream-dark text-navy font-semibold py-3 px-6 rounded-pill hover:bg-cream-muted transition-colors"
              >
                Browse All Trips
              </Link>

              <div className="mt-6 pt-6 border-t border-navy/10">
                <p className="text-xs text-navy/50 font-semibold uppercase tracking-wider mb-3">Quick Facts</p>
                <ul className="space-y-2 text-sm text-navy/70">
                  <li className="flex items-center gap-2"><span className="text-orange">📅</span> Best time: {dest.best_time}</li>
                  <li className="flex items-center gap-2"><span className="text-orange">💰</span> From {formatPrice(dest.starting_price)}/person</li>
                  <li className="flex items-center gap-2"><span className="text-orange">📍</span> {dest.state}, India</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
