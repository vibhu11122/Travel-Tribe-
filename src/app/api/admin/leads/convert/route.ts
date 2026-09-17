import { NextRequest, NextResponse } from 'next/server'
import { convertLeadToBooking } from '@/lib/data/admin-store'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { lead_id, custom_data } = body

    if (!lead_id) {
      return NextResponse.json({ error: 'Lead ID is required' }, { status: 400 })
    }

    const result = convertLeadToBooking(lead_id, custom_data)
    if (!result) {
      return NextResponse.json({ error: 'Lead not found or conversion failed' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: `Lead converted to booking ${result.booking.booking_code}!`,
      booking: result.booking,
      lead: result.lead,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Conversion failed' }, { status: 500 })
  }
}
