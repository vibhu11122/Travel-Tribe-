import { NextRequest, NextResponse } from 'next/server'
import { getAdminTrips, setAdminTrips } from '@/lib/data/admin-store'
import type { Trip } from '@/lib/types'

// ─── GET /api/admin/trips/[id] ───────────────────────────────────────────────
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id
  const trips = getAdminTrips()
  const trip = trips.find(t => t.id === id || t.slug === id)

  if (!trip) {
    return NextResponse.json({ error: 'Trip not found' }, { status: 404 })
  }

  return NextResponse.json({ success: true, trip })
}

// ─── PUT /api/admin/trips/[id] (Update Trip / Toggle Status) ─────────────────
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const updates = await req.json()
    const trips = getAdminTrips()
    const index = trips.findIndex(t => t.id === id || t.slug === id)

    if (index === -1) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 })
    }

    const updatedTrip: Trip = {
      ...trips[index],
      ...updates,
      updated_at: new Date().toISOString(),
    }

    trips[index] = updatedTrip
    setAdminTrips([...trips])

    try {
      const { createClient } = await import('@/lib/supabase/server')
      const supabase = await createClient()
      await (supabase as any).from('trips').update(updates as any).eq('id', updatedTrip.id)
    } catch {}

    return NextResponse.json({
      success: true,
      message: 'Trip updated successfully',
      trip: updatedTrip,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Update failed' }, { status: 500 })
  }
}

// ─── DELETE /api/admin/trips/[id] (Delete Trip) ──────────────────────────────
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const trips = getAdminTrips()
    const filtered = trips.filter(t => t.id !== id && t.slug !== id)

    if (filtered.length === trips.length) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 })
    }

    setAdminTrips(filtered)

    try {
      const { createClient } = await import('@/lib/supabase/server')
      const supabase = await createClient()
      await (supabase as any).from('trips').delete().eq('id', id)
    } catch {}

    return NextResponse.json({ success: true, message: 'Trip deleted successfully' })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Delete failed' }, { status: 500 })
  }
}

// ─── POST /api/admin/trips/[id] (Duplicate Trip) ─────────────────────────────
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const trips = getAdminTrips()
    const tripToDuplicate = trips.find(t => t.id === id || t.slug === id)

    if (!tripToDuplicate) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 })
    }

    const randomSuffix = Math.random().toString(36).substring(2, 6)
    const duplicatedTrip: Trip = {
      ...tripToDuplicate,
      id: `trip_${Date.now()}`,
      title: `${tripToDuplicate.title} (Copy)`,
      slug: `${tripToDuplicate.slug}-copy-${randomSuffix}`,
      status: 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    setAdminTrips([duplicatedTrip, ...trips])

    try {
      const { createClient } = await import('@/lib/supabase/server')
      const supabase = await createClient()
      await (supabase as any).from('trips').insert(duplicatedTrip as any)
    } catch {}

    return NextResponse.json({
      success: true,
      message: 'Trip duplicated successfully as draft',
      trip: duplicatedTrip,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Duplication failed' }, { status: 500 })
  }
}
