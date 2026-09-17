import { NextRequest, NextResponse } from 'next/server'
import { getAdminBookings } from '@/lib/data/admin-store'

export async function GET(req: NextRequest) {
  try {
    const bookings = getAdminBookings()

    const headers = [
      'Booking ID',
      'Trip Title',
      'Customer Name',
      'Email',
      'Phone',
      'Travelers Count',
      'Total Amount (INR)',
      'Amount Paid (INR)',
      'Payment Status',
      'Booking Status',
      'Travel Date',
      'Notes',
      'Created At',
    ]

    const rows = bookings.map(b => [
      `"${b.booking_code}"`,
      `"${(b.trip_title || '').replace(/"/g, '""')}"`,
      `"${(b.customer_name || '').replace(/"/g, '""')}"`,
      `"${b.customer_email || ''}"`,
      `"${b.customer_phone || ''}"`,
      b.num_travelers,
      b.total_amount,
      b.amount_paid,
      `"${b.payment_status}"`,
      `"${b.booking_status}"`,
      `"${b.travel_date || ''}"`,
      `"${(b.notes || '').replace(/"/g, '""')}"`,
      `"${b.created_at}"`,
    ])

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="travel_tribe_bookings_${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Export failed' }, { status: 500 })
  }
}
