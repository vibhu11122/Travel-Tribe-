import { NextRequest, NextResponse } from 'next/server'
import { getAdminBookings, setAdminBookings } from '@/lib/data/admin-store'
import type { AdminBooking } from '@/lib/types'

// ─── GET /api/admin/bookings/[id] ───────────────────────────────────────────
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const bookings = getAdminBookings()
    const booking = bookings.find(b => b.id === id || b.booking_code === id)

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, booking })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch booking' }, { status: 500 })
  }
}

// ─── PUT /api/admin/bookings/[id] (Update Booking) ───────────────────────────
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const updates = await req.json()
    const bookings = getAdminBookings()
    const index = bookings.findIndex(b => b.id === id || b.booking_code === id)

    if (index === -1) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    const updatedBooking: AdminBooking = {
      ...bookings[index],
      ...updates,
      updated_at: new Date().toISOString(),
    }

    bookings[index] = updatedBooking
    setAdminBookings([...bookings])

    try {
      const { createClient } = await import('@/lib/supabase/server')
      const supabase = await createClient()
      await (supabase as any).from('bookings').update(updates as any).eq('id', updatedBooking.id)
    } catch {}

    return NextResponse.json({
      success: true,
      message: 'Booking updated successfully',
      booking: updatedBooking,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update booking' }, { status: 500 })
  }
}

// ─── DELETE /api/admin/bookings/[id] (Cancel/Delete Booking) ─────────────────
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const bookings = getAdminBookings()
    const filtered = bookings.filter(b => b.id !== id && b.booking_code !== id)

    if (filtered.length === bookings.length) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    setAdminBookings(filtered)

    try {
      const { createClient } = await import('@/lib/supabase/server')
      const supabase = await createClient()
      await (supabase as any).from('bookings').delete().eq('id', id)
    } catch {}

    return NextResponse.json({ success: true, message: 'Booking deleted successfully' })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete booking' }, { status: 500 })
  }
}
