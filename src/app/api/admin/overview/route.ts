import { NextRequest, NextResponse } from 'next/server'
import { getAdminTrips, getAdminLeads, getAdminBookings, getAdminUsers, getAdminPartners } from '@/lib/data/admin-store'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(req: NextRequest) {
  try {
    const trips = getAdminTrips()
    const leads = getAdminLeads()
    const bookings = getAdminBookings()
    const users = getAdminUsers()
    const partners = getAdminPartners()

    // Calculate revenue and payments
    const total_revenue = bookings.reduce((sum, b) => sum + (b.total_amount || 0), 0)
    const total_collected = bookings.reduce((sum, b) => sum + (b.amount_paid || 0), 0)
    const total_travelers = bookings.reduce((sum, b) => sum + (b.num_travelers || 0), 0)

    const active_trips = trips.filter(t => t.status === 'active').length
    const pending_inquiries = leads.filter(l => l.status === 'new').length
    const whatsapp_leads_count = leads.filter(l => l.source === 'whatsapp').length
    const active_partners = partners.filter(p => p.status === 'Active').length

    const total_profit = Math.round(total_collected * 0.20)

    return NextResponse.json({
      success: true,
      stats: {
        total_revenue,
        total_collected,
        total_profit,
        total_bookings: bookings.length,
        total_travelers,
        active_trips,
        total_trips: trips.length,
        total_users: users.length,
        total_leads: leads.length,
        pending_inquiries,
        whatsapp_leads_count,
        active_partners,
      },
      recent_leads: leads.slice(0, 5),
      recent_bookings: bookings.slice(0, 5),
      system_health: {
        whatsapp_webhook: 'active',
        database: 'connected',
        payment_gateway: 'simulation_ready',
        timestamp: new Date().toISOString(),
      },
    }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch overview metrics' }, { status: 500 })
  }
}
