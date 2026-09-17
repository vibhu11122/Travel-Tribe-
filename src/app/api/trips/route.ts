import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { MOCK_TRIPS, getFilteredTrips } from '@/lib/data/trips'
import { getAdminTrips } from '@/lib/data/admin-store'

// ─── Zod schemas ────────────────────────────────────────────────────────────

const TripQuerySchema = z.object({
  type: z.string().optional(),
  destination: z.string().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  minDays: z.coerce.number().positive().optional(),
  maxDays: z.coerce.number().positive().optional(),
})

const CreateTripSchema = z.object({
  title: z.string().min(3, 'Title too short'),
  slug: z.string().min(3, 'Slug too short').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens'),
  destination: z.string().min(2),
  description: z.string().min(20),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  duration_days: z.number().min(1),
  duration_nights: z.number().min(0),
  price: z.number().min(0),
  price_original: z.number().optional().nullable(),
  capacity: z.number().min(1),
  available_slots: z.number().min(0),
  trip_type: z.enum([
    'adventure', 'mountains', 'beaches', 'culture', 'food', 'nature',
    'photography', 'relaxation', 'backpacking', 'nightlife', 'community', 'college',
  ]),
  difficulty: z.enum(['easy', 'moderate', 'challenging', 'extreme']),
  status: z.enum(['draft', 'active', 'full', 'completed', 'cancelled']).default('draft'),
  cover_image: z.string().optional().nullable(),
  highlights: z.array(z.string()).default([]),
  inclusions: z.array(z.string()).default([]),
  exclusions: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  is_featured: z.boolean().default(false),
  is_community: z.boolean().default(false),
  meeting_point: z.string().optional().nullable(),
  transport_from: z.string().optional().nullable(),
  min_age: z.number().optional().nullable(),
  max_age: z.number().optional().nullable(),
})

// ─── GET /api/trips ─────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const parsed = TripQuerySchema.safeParse({
      type: searchParams.get('type') ?? undefined,
      destination: searchParams.get('destination') ?? undefined,
      maxPrice: searchParams.get('maxPrice') ?? undefined,
      minDays: searchParams.get('minDays') ?? undefined,
      maxDays: searchParams.get('maxDays') ?? undefined,
    })

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid query parameters', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const dynamicTrips = getAdminTrips()
    let trips = [...dynamicTrips]

    if (parsed.data.type && parsed.data.type !== 'all') {
      trips = trips.filter(t => t.trip_type.toLowerCase() === parsed.data.type?.toLowerCase())
    }
    if (parsed.data.destination) {
      trips = trips.filter(t => t.destination.toLowerCase().includes(parsed.data.destination!.toLowerCase()))
    }
    if (parsed.data.maxPrice) {
      trips = trips.filter(t => t.price <= parsed.data.maxPrice!)
    }

    return NextResponse.json({
      success: true,
      data: trips,
      total: trips.length,
    })
  } catch (err) {
    console.error('[GET /api/trips] Error:', err)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

// ─── POST /api/trips (admin only) ───────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const parsed = CreateTripSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    // MVP: Log and return mock success
    // Future: Insert into Supabase trips table
    const mockTrip = {
      ...parsed.data,
      id: `mock_${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      gallery: [],
      itinerary: [],
      destination_id: null,
      organizer_name: 'Travel Tribe',
    }

    console.log('[POST /api/trips] New trip (mock):', mockTrip.title)

    return NextResponse.json(
      { success: true, message: 'Trip created successfully (mock)', data: mockTrip },
      { status: 201 }
    )
  } catch (err) {
    console.error('[POST /api/trips] Error:', err)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
