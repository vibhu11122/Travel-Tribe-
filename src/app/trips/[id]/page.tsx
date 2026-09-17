import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MOCK_TRIPS, getTripBySlug, getTripById } from '@/lib/data/trips'
import TripDetailClient from './TripDetailClient'

// ─── Static Params ────────────────────────────────────────────────────────────

export function generateStaticParams() {
  return MOCK_TRIPS.map((t) => ({ id: t.slug }))
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const trip = getTripBySlug(id) ?? getTripById(id)

  if (!trip) {
    return { title: 'Trip Not Found | Travel Tribe' }
  }

  return {
    title: `${trip.title} | Travel Tribe`,
    description: trip.description,
    openGraph: {
      title: `${trip.title} | Travel Tribe`,
      description: trip.description,
      images: trip.cover_image ? [{ url: trip.cover_image, width: 1200, height: 630 }] : [],
    },
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function TripDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const trip = getTripBySlug(id) ?? getTripById(id)

  if (!trip) notFound()

  // Similar trips: same type or destination, exclude current
  const similarTrips = MOCK_TRIPS.filter(
    (t) => t.id !== trip.id && (t.trip_type === trip.trip_type || t.destination_id === trip.destination_id)
  ).slice(0, 3)

  return <TripDetailClient trip={trip} similarTrips={similarTrips} />
}
