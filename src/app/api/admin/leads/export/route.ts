import { NextRequest, NextResponse } from 'next/server'
import { getAdminLeads } from '@/lib/data/admin-store'

export async function GET(req: NextRequest) {
  try {
    const leads = getAdminLeads()

    const headers = [
      'Lead ID',
      'Date Received',
      'Source',
      'Sender Name',
      'Phone Number',
      'Email',
      'Selected Trip',
      'Travel Date',
      'Status',
      'Message',
      'Internal Notes',
    ]

    const rows = leads.map(l => [
      `"${l.id}"`,
      `"${new Date(l.created_at).toLocaleString('en-IN')}"`,
      `"${l.source}"`,
      `"${(l.sender_name || '').replace(/"/g, '""')}"`,
      `"${l.sender_phone || ''}"`,
      `"${l.sender_email || ''}"`,
      `"${(l.trip_title || '').replace(/"/g, '""')}"`,
      `"${l.travel_date || ''}"`,
      `"${l.status}"`,
      `"${(l.message || '').replace(/"/g, '""')}"`,
      `"${(l.internal_notes || '').replace(/"/g, '""')}"`,
    ])

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="travel_tribe_leads_${Date.now()}.csv"`,
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to export CSV' }, { status: 500 })
  }
}
