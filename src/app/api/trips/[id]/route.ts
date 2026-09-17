import { NextRequest, NextResponse } from 'next/server'
import { MOCK_TRIPS, getTripById, getTripBySlug } from '@/lib/data/trips'

// ─── GET /api/trips/[id] ────────────────────────────────────────────────────

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json({ success: false, error: 'Trip ID is required' }, { status: 400 })
    }

    // Try by slug first, then by id
    const trip = getTripBySlug(id) ?? getTripById(id)

    if (!trip) {
      return NextResponse.json({ success: false, error: 'Trip not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: trip })
  } catch (err) {
    console.error('[GET /api/trips/[id]] Error:', err)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

// ─── PUT /api/trips/[id] (admin only, mock) ─────────────────────────────────

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await req.json()

    const trip = getTripBySlug(id) ?? getTripById(id)
    if (!trip) {
      return NextResponse.json({ success: false, error: 'Trip not found' }, { status: 404 })
    }

    const updatedTrip = { ...trip, ...body, updated_at: new Date().toISOString() }
    console.log('[PUT /api/trips/[id]] Updated (mock):', updatedTrip.title)

    return NextResponse.json({ success: true, message: 'Trip updated (mock)', data: updatedTrip })
  } catch (err) {
    console.error('[PUT /api/trips/[id]] Error:', err)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

// ─── DELETE /api/trips/[id] (admin only, mock) ──────────────────────────────

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const trip = getTripBySlug(id) ?? getTripById(id)
    if (!trip) {
      return NextResponse.json({ success: false, error: 'Trip not found' }, { status: 404 })
    }

    console.log('[DELETE /api/trips/[id]] Deleted (mock):', trip.title)
    return NextResponse.json({ success: true, message: 'Trip deleted (mock)' })
  } catch (err) {
    console.error('[DELETE /api/trips/[id]] Error:', err)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
