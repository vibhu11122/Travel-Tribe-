import { NextResponse } from 'next/server'
import { initiatePayment } from '@/lib/payments'
import { z } from 'zod'

const initiateSchema = z.object({
  amount: z.number().positive(),
  tripId: z.string().optional(),
  bookingId: z.string(),
  description: z.string().optional(),
  customerName: z.string().optional(),
  travelerName: z.string().optional(),
  customerEmail: z.string().email().optional(),
  travelerEmail: z.string().email().optional(),
  customerPhone: z.string().optional(),
  travelerPhone: z.string().optional(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = initiateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid data', details: parsed.error.flatten() }, { status: 400 })
    }

    const d = parsed.data
    const result = await initiatePayment({
      bookingId: d.bookingId,
      amount: d.amount,
      description: d.description || 'Travel Tribe Trip Booking',
      customerName: d.customerName || d.travelerName || 'Traveler',
      customerEmail: d.customerEmail || d.travelerEmail || 'traveler@traveltribe.in',
      customerPhone: d.customerPhone || d.travelerPhone || '9999999999',
    })

    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: 'Payment initiation failed' }, { status: 500 })
  }
}
