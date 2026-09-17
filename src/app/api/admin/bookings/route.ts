import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getAdminBookings, setAdminBookings, addAdminBooking } from '@/lib/data/admin-store'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import type { AdminBooking } from '@/lib/types'

const bookingSchema = z.object({
  trip_id: z.string().min(1, 'Trip ID is required'),
  trip_title: z.string().min(1, 'Trip title is required'),
  customer_name: z.string().min(2, 'Customer name is required'),
  customer_email: z.string().email('Invalid email address'),
  customer_phone: z.string().min(10, 'Valid 10-digit phone number is required'),
  num_travelers: z.number().min(1, 'At least 1 traveler is required'),
  travelers: z.array(z.object({
    name: z.string(),
    age: z.number().optional(),
    gender: z.string().optional(),
    phone: z.string().optional(),
    emergency_contact: z.string().optional(),
  })).default([]),
  total_amount: z.number().min(0),
  amount_paid: z.number().min(0).default(0),
  payment_status: z.enum(['pending', 'partial', 'paid', 'refunded']).default('pending'),
  booking_status: z.enum(['pending', 'confirmed', 'completed', 'cancelled']).default('pending'),
  travel_date: z.string().optional(),
  notes: z.string().optional(),
})

// ─── GET /api/admin/bookings ────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const payment = searchParams.get('payment')
    const query = searchParams.get('q')?.toLowerCase()

    if (isSupabaseConfigured()) {
      try {
        const { createClient } = await import('@/lib/supabase/server')
        const supabase = await createClient()
        let dbQuery = (supabase as any).from('bookings').select('*').order('created_at', { ascending: false })

        if (status && status !== 'all') dbQuery = dbQuery.eq('booking_status', status)
        if (payment && payment !== 'all') dbQuery = dbQuery.eq('payment_status', payment)

        const { data, error } = await dbQuery
        if (!error && data && data.length > 0) {
          return NextResponse.json({ success: true, bookings: data })
        }
      } catch {}
    }

    let bookings = getAdminBookings()

    if (status && status !== 'all') {
      bookings = bookings.filter(b => b.booking_status.toLowerCase() === status.toLowerCase())
    }

    if (payment && payment !== 'all') {
      bookings = bookings.filter(b => b.payment_status.toLowerCase() === payment.toLowerCase())
    }

    if (query) {
      bookings = bookings.filter(b =>
        b.booking_code.toLowerCase().includes(query) ||
        b.customer_name.toLowerCase().includes(query) ||
        b.customer_email.toLowerCase().includes(query) ||
        b.customer_phone.includes(query) ||
        b.trip_title.toLowerCase().includes(query)
      )
    }

    return NextResponse.json({
      success: true,
      bookings,
      total: bookings.length,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch bookings' }, { status: 500 })
  }
}

// ─── POST /api/admin/bookings (Create New Booking) ──────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = bookingSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const d = parsed.data
    const randomCode = 'TT-' + Math.random().toString(36).substring(2, 8).toUpperCase()
    const now = new Date().toISOString()

    const newBooking: AdminBooking = {
      id: `booking_${Date.now()}`,
      booking_code: randomCode,
      trip_id: d.trip_id,
      trip_title: d.trip_title,
      customer_name: d.customer_name,
      customer_email: d.customer_email,
      customer_phone: d.customer_phone,
      num_travelers: d.num_travelers,
      travelers: d.travelers.length > 0 ? d.travelers : [{ name: d.customer_name, phone: d.customer_phone }],
      total_amount: d.total_amount,
      amount_paid: d.amount_paid,
      payment_status: d.payment_status,
      booking_status: d.booking_status,
      travel_date: d.travel_date || 'Upcoming',
      notes: d.notes || '',
      created_at: now,
      updated_at: now,
    }

    try {
      const { createClient } = await import('@/lib/supabase/server')
      const supabase = await createClient()
      await (supabase as any).from('bookings').insert(newBooking as any)
    } catch {}

    addAdminBooking(newBooking)

    return NextResponse.json({
      success: true,
      message: 'Booking created successfully',
      booking: newBooking,
    }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create booking' }, { status: 500 })
  }
}
