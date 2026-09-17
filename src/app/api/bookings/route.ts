import { NextResponse } from 'next/server'
import { z } from 'zod'
import { generateBookingId } from '@/lib/utils/format'
import { getAdminBookings, addAdminBooking, getAdminTrips } from '@/lib/data/admin-store'
import type { AdminBooking } from '@/lib/types'

const bookingSchema = z.object({
  trip_id: z.string(),
  traveler_name: z.string().min(2),
  traveler_email: z.string().email(),
  traveler_phone: z.string(),
  num_travelers: z.number().int().min(1),
  total_amount: z.number().positive(),
  addons: z.array(z.string()).optional(),
  emergency_contact: z.string().optional(),
})

export async function GET() {
  const bookings = getAdminBookings()
  return NextResponse.json({ success: true, bookings })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = bookingSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid booking data', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const d = parsed.data
    const bookingCode = generateBookingId()
    const trip = getAdminTrips().find(t => t.id === d.trip_id || t.slug === d.trip_id)

    const newBooking: AdminBooking = {
      id: `book_${Date.now()}`,
      booking_code: bookingCode,
      trip_id: d.trip_id,
      trip_title: trip ? trip.title : 'Custom Tribe Adventure',
      customer_name: d.traveler_name,
      customer_email: d.traveler_email,
      customer_phone: d.traveler_phone,
      num_travelers: d.num_travelers,
      travelers: [
        {
          name: d.traveler_name,
          phone: d.traveler_phone,
          emergency_contact: d.emergency_contact,
        },
      ],
      total_amount: d.total_amount,
      amount_paid: d.total_amount,
      payment_status: 'paid',
      booking_status: 'confirmed',
      travel_date: trip?.start_date || 'Upcoming',
      notes: d.addons && d.addons.length > 0 ? `Selected add-ons: ${d.addons.join(', ')}` : '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    addAdminBooking(newBooking)

    return NextResponse.json({
      success: true,
      booking_id: bookingCode,
      message: 'Booking confirmed and added to Tribe Roster!',
      booking: newBooking,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}
