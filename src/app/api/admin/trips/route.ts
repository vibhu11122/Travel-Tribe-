import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getAdminTrips, setAdminTrips } from '@/lib/data/admin-store'
import { slugify } from '@/lib/utils/format'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import type { Trip } from '@/lib/types'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const tripSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  destination: z.string().min(2, 'Destination is required'),
  description: z.string().min(10, 'Description is required'),
  cover_image: z.string().optional().nullable(),
  gallery: z.array(z.string()).default([]),
  start_date: z.string().optional().nullable(),
  end_date: z.string().optional().nullable(),
  duration_days: z.number().min(1),
  duration_nights: z.number().min(0),
  price: z.number().min(0),
  price_original: z.number().optional().nullable(),
  capacity: z.number().min(1),
  available_slots: z.number().min(0),
  trip_type: z.enum([
    'adventure', 'mountains', 'beaches', 'culture', 'food', 'nature',
    'photography', 'relaxation', 'backpacking', 'nightlife', 'community', 'college',
  ]).default('adventure'),
  difficulty: z.enum(['easy', 'moderate', 'challenging', 'extreme']).default('moderate'),
  highlights: z.array(z.string()).default([]),
  inclusions: z.array(z.string()).default([]),
  exclusions: z.array(z.string()).default([]),
  meeting_point: z.string().optional().nullable(),
  transport_from: z.string().optional().nullable(),
  status: z.enum(['draft', 'active', 'full', 'completed', 'cancelled']).default('active'),
  is_featured: z.boolean().default(false),
  is_community: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  display_order: z.number().default(0),
  faqs: z.array(z.object({
    question: z.string(),
    answer: z.string(),
  })).default([]),
  itinerary: z.array(z.object({
    day: z.number(),
    title: z.string(),
    description: z.string(),
    activities: z.array(z.string()),
    accommodation: z.string().optional(),
    meals: z.array(z.string()).optional(),
  })).default([]),
})

// ─── GET /api/admin/trips ───────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    if (isSupabaseConfigured()) {
      try {
        const { createClient } = await import('@/lib/supabase/server')
        const supabase = await createClient()
        const { data, error } = await (supabase as any)
          .from('trips')
          .select('*')
          .order('display_order', { ascending: true })

        if (!error && data && data.length > 0) {
          return NextResponse.json({ success: true, trips: data })
        }
      } catch {}
    }

    const dynamicTrips = getAdminTrips()
    return NextResponse.json({
      success: true,
      trips: [...dynamicTrips].sort((a, b) => (a.display_order || 0) - (b.display_order || 0)),
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch trips' }, { status: 500 })
  }
}

// ─── POST /api/admin/trips (Create Trip) ────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = tripSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const d = parsed.data
    const generatedSlug = slugify(d.title) + '-' + Math.random().toString(36).substring(2, 6)
    const dynamicTrips = getAdminTrips()

    const newTrip: Trip = {
      id: `trip_${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      slug: generatedSlug,
      title: d.title,
      destination: d.destination,
      destination_id: null,
      description: d.description,
      cover_image: d.cover_image || '/spiti.jpg',
      gallery: d.gallery.length > 0 ? d.gallery : ['/spiti.jpg'],
      start_date: d.start_date || null,
      end_date: d.end_date || null,
      duration_days: d.duration_days,
      duration_nights: d.duration_nights,
      price: d.price,
      price_original: d.price_original || null,
      capacity: d.capacity,
      available_slots: d.available_slots,
      trip_type: d.trip_type,
      difficulty: d.difficulty,
      highlights: d.highlights,
      inclusions: d.inclusions,
      exclusions: d.exclusions,
      itinerary: d.itinerary,
      faqs: d.faqs,
      display_order: d.display_order || dynamicTrips.length + 1,
      meeting_point: d.meeting_point || null,
      transport_from: d.transport_from || null,
      status: d.status,
      is_featured: d.is_featured,
      is_community: d.is_community,
      tags: d.tags,
      min_age: null,
      max_age: null,
      organizer_name: 'Travel Tribe',
    }

    try {
      const { createClient } = await import('@/lib/supabase/server')
      const supabase = await createClient()
      await (supabase as any).from('trips').insert(newTrip as any)
    } catch {}

    setAdminTrips([newTrip, ...dynamicTrips])

    return NextResponse.json({
      success: true,
      message: 'Trip created successfully',
      trip: newTrip,
    }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create trip' }, { status: 500 })
  }
}

// ─── PUT /api/admin/trips (Reorder Trips) ───────────────────────────────────
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { orders } = body

    if (Array.isArray(orders)) {
      const orderMap = new Map<string, number>()
      for (const item of orders) {
        orderMap.set(item.id, item.display_order)
      }

      const updated = getAdminTrips().map(trip => {
        if (orderMap.has(trip.id)) {
          return { ...trip, display_order: orderMap.get(trip.id)! }
        }
        return trip
      })

      setAdminTrips(updated)

      try {
        const { createClient } = await import('@/lib/supabase/server')
        const supabase = await createClient()
        for (const item of orders) {
          await (supabase as any).from('trips').update({ display_order: item.display_order } as any).eq('id', item.id)
        }
      } catch {}
    }

    return NextResponse.json({ success: true, message: 'Trips reordered successfully' })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to reorder trips' }, { status: 500 })
  }
}
