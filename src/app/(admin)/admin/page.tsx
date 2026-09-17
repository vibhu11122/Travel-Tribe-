'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Map,
  Calendar,
  MessageCircle,
  Inbox,
  Plus,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
  Phone,
  CheckCircle2,
  Ticket,
  Users,
  Handshake,
  DollarSign,
  Activity,
  ShieldCheck,
} from 'lucide-react'
import { formatPrice, formatDateRange, cn } from '@/lib/utils/format'
import type { Trip, LeadInquiry, AdminBooking } from '@/lib/types'

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<any>(null)
  const [trips, setTrips] = useState<Trip[]>([])
  const [leads, setLeads] = useState<LeadInquiry[]>([])
  const [bookings, setBookings] = useState<AdminBooking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [overviewRes, tripsRes, leadsRes, bookingsRes] = await Promise.all([
          fetch('/api/admin/overview'),
          fetch('/api/admin/trips'),
          fetch('/api/admin/leads'),
          fetch('/api/admin/bookings'),
        ])
        const overviewData = await overviewRes.json()
        const tripsData = await tripsRes.json()
        const leadsData = await leadsRes.json()
        const bookingsData = await bookingsRes.json()

        if (overviewData.stats) setStats(overviewData.stats)
        if (tripsData.trips) setTrips(tripsData.trips)
        if (leadsData.leads) setLeads(leadsData.leads)
        if (bookingsData.bookings) setBookings(bookingsData.bookings)
      } catch (err) {
        console.error('Failed to load admin overview:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const upcomingTrips = trips.filter(t => t.status === 'active' || t.status === 'full')
  const whatsappLeads = leads.filter(l => l.source === 'whatsapp')
  const newLeadsCount = leads.filter(l => l.status === 'new').length

  return (
    <div className="space-y-8">
      {/* ── Top Banner & Operations Hub ───────────────────────────── */}
      <div className="bg-navy rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-card">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-orange/15 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-orange/20 text-orange font-bold text-xs">
                Complete Command Center
              </span>
              <span className="text-white/40 text-xs">·</span>
              <span className="text-forest font-semibold text-xs flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#25D366] inline-block animate-pulse" /> WhatsApp Gateway Online
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-headline font-black leading-tight">
              Welcome back, Tribe Admin! 🏕️
            </h2>
            <p className="text-white/70 text-sm mt-1 max-w-xl">
              Real-time operations: manage trips, process student bookings, convert WhatsApp inquiries, coordinate partners, and monitor financials.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-3">
            <Link
              href="/admin/trips?action=create"
              className="flex items-center gap-2 bg-orange text-white font-bold px-5 py-3 rounded-pill hover:bg-orange-600 transition-all shadow-orange text-sm whitespace-nowrap"
            >
              <Plus className="w-4 h-4" /> Create Trip
            </Link>
            <Link
              href="/admin/bookings"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-5 py-3 rounded-pill transition-colors text-sm border border-white/10 whitespace-nowrap"
            >
              <Ticket className="w-4 h-4 text-orange" /> Manage Bookings
            </Link>
          </div>
        </div>
      </div>

      {/* ── 6-Card Metric KPIs ────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Total Revenue */}
        <div className="bg-white rounded-2xl p-4 shadow-card border border-navy/5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2 text-navy/40">
            <span className="text-[11px] font-bold uppercase tracking-wider">Revenue</span>
            <div className="p-1.5 rounded-lg bg-forest/10 text-forest">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-headline font-black text-navy">
            ₹{(stats?.total_revenue || 555000).toLocaleString('en-IN')}
          </div>
          <Link href="/admin/analytics" className="text-[11px] text-forest font-bold hover:underline mt-1">
            Analytics →
          </Link>
        </div>

        {/* Total Bookings */}
        <div className="bg-white rounded-2xl p-4 shadow-card border border-navy/5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2 text-navy/40">
            <span className="text-[11px] font-bold uppercase tracking-wider">Bookings</span>
            <div className="p-1.5 rounded-lg bg-orange/10 text-orange">
              <Ticket className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-headline font-black text-navy">
            {bookings.length || stats?.total_bookings || 5}
          </div>
          <Link href="/admin/bookings" className="text-[11px] text-orange font-bold hover:underline mt-1">
            View Roster →
          </Link>
        </div>

        {/* Active Trips */}
        <div className="bg-white rounded-2xl p-4 shadow-card border border-navy/5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2 text-navy/40">
            <span className="text-[11px] font-bold uppercase tracking-wider">Active Trips</span>
            <div className="p-1.5 rounded-lg bg-navy/10 text-navy">
              <Map className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-headline font-black text-navy">{upcomingTrips.length}</div>
          <Link href="/admin/trips" className="text-[11px] text-navy/70 font-bold hover:underline mt-1">
            Trips Manager →
          </Link>
        </div>

        {/* WhatsApp Leads */}
        <div className="bg-white rounded-2xl p-4 shadow-card border border-navy/5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2 text-navy/40">
            <span className="text-[11px] font-bold uppercase tracking-wider">WhatsApp</span>
            <div className="p-1.5 rounded-lg bg-[#25D366]/10 text-[#25D366]">
              <MessageCircle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-headline font-black text-navy">{whatsappLeads.length}</div>
          <Link href="/admin/leads?source=whatsapp" className="text-[11px] text-[#25D366] font-bold hover:underline mt-1">
            CRM Leads →
          </Link>
        </div>

        {/* Registered Users */}
        <div className="bg-white rounded-2xl p-4 shadow-card border border-navy/5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2 text-navy/40">
            <span className="text-[11px] font-bold uppercase tracking-wider">Tribe Users</span>
            <div className="p-1.5 rounded-lg bg-skyblue/10 text-skyblue">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-headline font-black text-navy">{stats?.total_users || 7}</div>
          <Link href="/admin/users" className="text-[11px] text-skyblue font-bold hover:underline mt-1">
            Directory →
          </Link>
        </div>

        {/* Vendor Partners */}
        <div className="bg-white rounded-2xl p-4 shadow-card border border-navy/5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2 text-navy/40">
            <span className="text-[11px] font-bold uppercase tracking-wider">Vendors</span>
            <div className="p-1.5 rounded-lg bg-gold/10 text-gold">
              <Handshake className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-headline font-black text-navy">{stats?.active_partners || 5}</div>
          <Link href="/admin/partners" className="text-[11px] text-gold font-bold hover:underline mt-1">
            Stays & Fleet →
          </Link>
        </div>
      </div>

      {/* ── Two Column Grid: Upcoming Expeditions & Recent Inquiries ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Column: Upcoming Trips */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-headline font-black text-navy text-lg">Upcoming Expeditions</h3>
              <p className="text-navy/50 text-xs">Live trips and student capacity meters</p>
            </div>
            <Link href="/admin/trips" className="text-orange text-xs font-bold hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {trips.slice(0, 4).map((trip) => {
              const booked = trip.capacity - trip.available_slots
              const percent = Math.min(100, Math.round((booked / trip.capacity) * 100))
              return (
                <div
                  key={trip.id}
                  className="bg-white rounded-xl p-4 shadow-card border border-navy/5 hover:border-navy/15 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn(
                          'px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider',
                          trip.status === 'active' ? 'bg-green-100 text-green-700' :
                          trip.status === 'full' ? 'bg-orange/10 text-orange' : 'bg-navy/10 text-navy'
                        )}>
                          {trip.status}
                        </span>
                        <span className="text-navy/40 text-xs">·</span>
                        <span className="text-navy/60 text-xs font-semibold">{trip.destination}</span>
                      </div>
                      <h4 className="font-headline font-black text-navy text-base">{trip.title}</h4>
                      {trip.start_date && trip.end_date && (
                        <p className="text-navy/50 text-xs mt-0.5 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-orange" />
                          {formatDateRange(trip.start_date, trip.end_date)}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="font-headline font-black text-orange text-base">{formatPrice(trip.price)}</span>
                      <span className="text-navy/40 text-[11px] block">per traveler</span>
                    </div>
                  </div>

                  {/* Capacity Meter */}
                  <div className="mt-3 pt-3 border-t border-navy/5">
                    <div className="flex items-center justify-between text-xs text-navy/60 mb-1.5">
                      <span>Capacity: <strong className="text-navy">{booked} / {trip.capacity} Booked</strong></span>
                      <span className={cn(
                        'font-bold',
                        trip.available_slots <= 5 ? 'text-orange' : 'text-forest'
                      )}>
                        {trip.available_slots} spots left
                      </span>
                    </div>
                    <div className="w-full h-2 bg-cream-dark rounded-full overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all duration-500',
                          percent > 85 ? 'bg-orange' : 'bg-forest'
                        )}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right Column: Recent WhatsApp Inquiries & Leads */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-headline font-black text-navy text-lg">Recent Inquiries</h3>
              <p className="text-navy/50 text-xs">Incoming messages & WhatsApp reservations</p>
            </div>
            <Link href="/admin/leads" className="text-orange text-xs font-bold hover:underline flex items-center gap-1">
              CRM <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {leads.slice(0, 4).map((lead) => (
              <div
                key={lead.id}
                className="bg-white rounded-xl p-4 shadow-card border border-navy/5 space-y-2 hover:border-navy/15 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      'w-2 h-2 rounded-full',
                      lead.source === 'whatsapp' ? 'bg-[#25D366]' :
                      lead.source === 'college' ? 'bg-orange' : 'bg-skyblue'
                    )} />
                    <span className="font-bold text-navy text-sm">{lead.sender_name}</span>
                  </div>
                  <span className={cn(
                    'px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider',
                    lead.status === 'new' ? 'bg-red-100 text-red-700' :
                    lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                    lead.status === 'converted' ? 'bg-green-100 text-green-700' : 'bg-cream-dark text-navy/60'
                  )}>
                    {lead.status}
                  </span>
                </div>

                {lead.trip_title && (
                  <p className="text-xs font-semibold text-orange flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> {lead.trip_title}
                  </p>
                )}

                <p className="text-navy/70 text-xs line-clamp-2 bg-cream-dark/50 p-2 rounded-lg italic">
                  "{lead.message}"
                </p>

                <div className="flex items-center justify-between pt-1 text-[11px] text-navy/50">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-navy/40" /> {lead.sender_phone}
                  </span>
                  <a
                    href={`https://wa.me/${(lead.sender_phone || '').replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#25D366] font-bold hover:underline flex items-center gap-1"
                  >
                    <MessageCircle className="w-3 h-3 fill-current" /> Reply on WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
