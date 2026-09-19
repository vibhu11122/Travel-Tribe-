import { MOCK_TRIPS } from '@/lib/data/trips'
import type { Trip, LeadInquiry, AdminBooking, AdminUser, AdminPartner } from '@/lib/types'

// In-memory store initialized with the real upcoming trips
let dynamicTrips: Trip[] = [...MOCK_TRIPS]

export function getAdminTrips(): Trip[] {
  return dynamicTrips
}

export function setAdminTrips(trips: Trip[]) {
  dynamicTrips = trips
}

// In-memory store for incoming leads (Starts clean with 0 fake leads)
let dynamicLeads: LeadInquiry[] = []

export function getAdminLeads(): LeadInquiry[] {
  return dynamicLeads
}

export function setAdminLeads(leads: LeadInquiry[]) {
  dynamicLeads = leads
}

export function addInboundLead(lead: LeadInquiry) {
  dynamicLeads.unshift(lead)
}

// ─── BOOKINGS STORE (Clean slate with 0 fake bookings) ────────────────────────
let dynamicBookings: AdminBooking[] = []

export function getAdminBookings(): AdminBooking[] {
  return dynamicBookings
}

export function setAdminBookings(bookings: AdminBooking[]) {
  dynamicBookings = bookings
}

export function addAdminBooking(booking: AdminBooking) {
  dynamicBookings.unshift(booking)

  // 1. Interlock with Trip Capacity
  const trip = dynamicTrips.find(t => t.id === booking.trip_id || t.title.toLowerCase() === booking.trip_title.toLowerCase())
  if (trip) {
    const newAvailable = Math.max(0, trip.available_slots - booking.num_travelers)
    trip.available_slots = newAvailable
    if (newAvailable === 0) {
      trip.status = 'full'
    }
    trip.updated_at = new Date().toISOString()
  }

  // 2. Interlock with User Directory
  const user = dynamicUsers.find(u => u.email.toLowerCase() === booking.customer_email.toLowerCase())
  if (user) {
    user.trips_booked = (user.trips_booked || 0) + 1
    user.total_spent = (user.total_spent || 0) + booking.total_amount
    user.last_active = new Date().toISOString()
  } else if (booking.customer_name && booking.customer_email) {
    dynamicUsers.push({
      id: `user_${Date.now()}`,
      email: booking.customer_email,
      full_name: booking.customer_name,
      phone: booking.customer_phone,
      role: 'traveler',
      is_admin: false,
      college: '',
      city: '',
      trips_booked: 1,
      total_spent: booking.total_amount,
      status: 'active',
      created_at: new Date().toISOString(),
      last_active: new Date().toISOString(),
    })
  }
}

export function removeAdminBooking(bookingId: string) {
  const booking = dynamicBookings.find(b => b.id === bookingId || b.booking_code === bookingId)
  if (booking) {
    // Restore trip capacity
    const trip = dynamicTrips.find(t => t.id === booking.trip_id || t.title.toLowerCase() === booking.trip_title.toLowerCase())
    if (trip) {
      trip.available_slots = Math.min(trip.capacity, trip.available_slots + booking.num_travelers)
      if (trip.status === 'full' && trip.available_slots > 0) {
        trip.status = 'active'
      }
    }
    dynamicBookings = dynamicBookings.filter(b => b.id !== bookingId && b.booking_code !== bookingId)
  }
}

export function convertLeadToBooking(leadId: string, customData?: Partial<AdminBooking>): { booking: AdminBooking, lead: LeadInquiry } | null {
  const lead = dynamicLeads.find(l => l.id === leadId)
  if (!lead) return null

  // Find or default trip
  const trip = dynamicTrips.find(t => t.id === lead.trip_id || (lead.trip_title && t.title.toLowerCase().includes(lead.trip_title.toLowerCase()))) || dynamicTrips[0]
  const travelersCount = (lead.metadata as any)?.num_travelers || (lead.metadata as any)?.num_students || 1
  const pricePerPerson = trip ? trip.price : 5999
  const totalAmount = pricePerPerson * travelersCount

  const newBooking: AdminBooking = {
    id: `booking_${Date.now()}`,
    booking_code: `TT-CONV-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
    trip_id: trip ? trip.id : '1',
    trip_title: trip ? trip.title : lead.trip_title || 'Custom Tribe Trip',
    customer_name: lead.sender_name || 'Traveler',
    customer_email: lead.sender_email || `${(lead.sender_phone || '9599233810').replace(/[^0-9]/g, '')}@guest.traveltribe.in`,
    customer_phone: lead.sender_phone || '+91 95992 33810',
    num_travelers: travelersCount,
    travelers: [{ name: lead.sender_name || 'Traveler', phone: lead.sender_phone || '+91 95992 33810' }],
    total_amount: totalAmount,
    amount_paid: totalAmount,
    payment_status: 'paid',
    booking_status: 'confirmed',
    travel_date: lead.travel_date || trip?.start_date || 'Upcoming',
    notes: `Converted from ${lead.source.toUpperCase()} inquiry (${lead.id}). Message: "${lead.message}"`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...customData,
  }

  addAdminBooking(newBooking)

  // Mark lead as converted
  lead.status = 'converted'
  lead.internal_notes = `${lead.internal_notes ? lead.internal_notes + ' | ' : ''}Converted to official booking ${newBooking.booking_code}`
  lead.updated_at = new Date().toISOString()

  return { booking: newBooking, lead }
}

// ─── USERS STORE ────────────────────────────────────────────────────────────
let dynamicUsers: AdminUser[] = [
  {
    id: 'u-001',
    email: 'jay.yadav@traveltribe.in',
    full_name: 'Jay Yadav',
    phone: '+91 95992 33810',
    role: 'admin',
    is_admin: true,
    college: 'IITTM Gwalior / IIM Bangalore',
    city: 'Delhi NCR',
    trips_booked: 7,
    total_spent: 0,
    status: 'active',
    created_at: '2024-01-10T10:00:00.000Z',
    last_active: new Date().toISOString(),
  },
  {
    id: 'u-002',
    email: 'yug.verma@traveltribe.in',
    full_name: 'Yug Verma',
    phone: '+91 98111 88990',
    role: 'admin',
    is_admin: true,
    college: 'IIM Bangalore',
    city: 'Bengaluru',
    trips_booked: 7,
    total_spent: 0,
    status: 'active',
    created_at: '2024-01-10T10:00:00.000Z',
    last_active: new Date().toISOString(),
  },
]

export function getAdminUsers(): AdminUser[] {
  return dynamicUsers
}

export function setAdminUsers(users: AdminUser[]) {
  dynamicUsers = users
}

export function addAdminUser(user: AdminUser) {
  dynamicUsers.unshift(user)
}

// ─── PARTNERS STORE ─────────────────────────────────────────────────────────
let dynamicPartners: AdminPartner[] = [
  {
    id: 'p1',
    name: 'Ganges White Water Rafting & Riverside Camp',
    category: 'Activities',
    location: 'Shivpuri & Tapovan, Rishikesh',
    contact_person: 'Deepak Rawat',
    phone: '+91 94120 98765',
    email: 'deepak@rishikeshrafting.com',
    status: 'Active',
    trips_count: 8,
    is_verified: true,
    commission_rate: '₹650/pax bulk rate',
    notes: 'Certified river guides with complete safety gear, life jackets, cliff jumping, and beach camping.',
    created_at: '2026-05-18T14:30:00.000Z',
  },
  {
    id: 'p2',
    name: 'Mussoorie Queen of Hills Stays & Resorts',
    category: 'Stay',
    location: 'Mussoorie / Picture Palace',
    contact_person: 'Anurag Negi',
    phone: '+91 98370 54321',
    email: 'stays@mussooriehills.in',
    status: 'Active',
    trips_count: 12,
    is_verified: true,
    commission_rate: 'Group discount tier A',
    notes: 'Valley view rooms with buffet breakfast and dinner setup for student batches.',
    created_at: '2026-06-10T11:00:00.000Z',
  },
  {
    id: 'p3',
    name: 'Delhi Northern Express Coaches',
    category: 'Transport',
    location: 'Delhi NCR / Kashmiri Gate',
    contact_person: 'Suraj Verma',
    phone: '+91 98110 33221',
    email: 'suraj@northernexpress.in',
    status: 'Active',
    trips_count: 15,
    is_verified: true,
    commission_rate: 'Fixed batch charter',
    notes: 'Force Urbania, Tempo Travellers, and 2x2 AC Volvo coaches for Uttarakhand & Rajasthan routes.',
    created_at: '2026-03-15T10:00:00.000Z',
  },
]

export function getAdminPartners(): AdminPartner[] {
  return dynamicPartners
}

export function setAdminPartners(partners: AdminPartner[]) {
  dynamicPartners = partners
}

export function addAdminPartner(partner: AdminPartner) {
  dynamicPartners.unshift(partner)
}
