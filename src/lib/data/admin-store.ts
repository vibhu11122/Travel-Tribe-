import { MOCK_TRIPS } from '@/lib/data/trips'
import type { Trip, LeadInquiry } from '@/lib/types'

// In-memory store for newly created or updated trips during local run
let dynamicTrips: Trip[] = [...MOCK_TRIPS]

export function getAdminTrips(): Trip[] {
  return dynamicTrips
}

export function setAdminTrips(trips: Trip[]) {
  dynamicTrips = trips
}

// Mock seed leads so admin dashboard is fully interactive
let dynamicLeads: LeadInquiry[] = [
  {
    id: 'lead-wa-001',
    created_at: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    source: 'whatsapp',
    sender_name: 'Aditya Mehta',
    sender_phone: '+91 98201 23456',
    sender_email: 'aditya.m@gmail.com',
    trip_id: '1',
    trip_title: 'Manali Adventure Tribe',
    travel_date: 'Dec 20–25, 2026',
    message: "Hey Travel Tribe! 🎒 I'd like to reserve 3 spots for the Manali Adventure Tribe trip on Dec 20–25. Could you share details?",
    raw_payload: {},
    status: 'new',
    assigned_to: null,
    internal_notes: 'Urgent: Traveling with 2 college friends from IIT Delhi.',
    tags: ['whatsapp', 'spot_reservation', 'manali'],
    metadata: { num_travelers: 3 },
  },
  {
    id: 'lead-wa-002',
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    source: 'whatsapp',
    sender_name: 'Simran Kaur',
    sender_phone: '+91 98765 99881',
    sender_email: 'simran.k@yahoo.com',
    trip_id: '2',
    trip_title: 'Spiti Valley Expedition',
    travel_date: 'Jan 5–12, 2027',
    message: "Hi! Can you share the detailed PDF itinerary and inclusions for the Spiti Valley Expedition?",
    raw_payload: {},
    status: 'contacted',
    assigned_to: null,
    internal_notes: 'Sent PDF itinerary via WhatsApp at 16:30.',
    tags: ['whatsapp', 'itinerary_request', 'spiti'],
    metadata: {},
  },
  {
    id: 'lead-cl-003',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    source: 'college',
    sender_name: 'Prof. Anish Saxena',
    sender_phone: '+91 94140 55667',
    sender_email: 'anish.saxena@iimb.ac.in',
    trip_id: null,
    trip_title: 'IIM Bangalore MBA Tour (45 Students)',
    travel_date: 'Feb 15–20, 2027',
    message: 'Planning annual batch tour for 45 students + 3 faculty members to Himachal Pradesh. Need AC Volvo coaches and 3-star stay.',
    raw_payload: {},
    status: 'quoted',
    assigned_to: null,
    internal_notes: 'Sent quotation for ₹8,500/student. Follow-up meeting scheduled for Friday.',
    tags: ['college', 'iim', 'batch_tour'],
    metadata: { num_students: 45 },
  },
  {
    id: 'lead-web-004',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    source: 'website',
    sender_name: 'Rohan Deshmukh',
    sender_phone: '+91 97110 44332',
    sender_email: 'rohan.d@gmail.com',
    trip_id: '3',
    trip_title: 'Jaipur Culture & Forts Escape',
    travel_date: 'Dec 28–31, 2026',
    message: 'Looking for a New Year getaway with friends. Is this trip suitable for a group of 5?',
    raw_payload: {},
    status: 'converted',
    assigned_to: null,
    internal_notes: 'Booked 5 seats! Booking ID: TT-DEC28-JP',
    tags: ['website', 'new_year', 'jaipur'],
    metadata: {},
  },
]

export function getAdminLeads(): LeadInquiry[] {
  return dynamicLeads
}

export function setAdminLeads(leads: LeadInquiry[]) {
  dynamicLeads = leads
}

export function addInboundLead(lead: LeadInquiry) {
  dynamicLeads.unshift(lead)
}

// ─── BOOKINGS STORE ─────────────────────────────────────────────────────────
import type { AdminBooking, AdminUser, AdminPartner } from '@/lib/types'

let dynamicBookings: AdminBooking[] = [
  {
    id: 'b-001',
    booking_code: 'TT-MAN20-001',
    trip_id: '1',
    trip_title: 'Manali Adventure Tribe',
    customer_name: 'Riya Sharma',
    customer_email: 'riya.sharma@iimb.ac.in',
    customer_phone: '+91 95992 33810',
    num_travelers: 2,
    travelers: [
      { name: 'Riya Sharma', age: 22, gender: 'Female', phone: '+91 95992 33810', emergency_contact: 'Sunil Sharma (+91 98111 22334)' },
      { name: 'Ananya Verma', age: 22, gender: 'Female', phone: '+91 98102 33445', emergency_contact: 'Kavita Verma (+91 98222 33445)' },
    ],
    total_amount: 15998,
    amount_paid: 15998,
    payment_status: 'paid',
    booking_status: 'confirmed',
    travel_date: 'Dec 20–25, 2026',
    notes: 'Requested front seats in Volvo bus. Vegetarian meals for both.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
  {
    id: 'b-002',
    booking_code: 'TT-SPI05-002',
    trip_id: '2',
    trip_title: 'Spiti Valley Expedition',
    customer_name: 'Aryan Gupta',
    customer_email: 'aryan.g@bitspilani.ac.in',
    customer_phone: '+91 98190 88776',
    num_travelers: 1,
    travelers: [
      { name: 'Aryan Gupta', age: 21, gender: 'Male', phone: '+91 98190 88776', emergency_contact: 'Rajesh Gupta (+91 98200 11223)' },
    ],
    total_amount: 12499,
    amount_paid: 5000,
    payment_status: 'partial',
    booking_status: 'pending',
    travel_date: 'Jan 5–12, 2027',
    notes: 'Advance paid. Balance ₹7,499 due 5 days before trip departure.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    id: 'b-003',
    booking_code: 'TT-JAI28-003',
    trip_id: '3',
    trip_title: 'Jaipur Culture & Forts Escape',
    customer_name: 'Priya Singh',
    customer_email: 'priyasingh@du.ac.in',
    customer_phone: '+91 99100 44556',
    num_travelers: 3,
    travelers: [
      { name: 'Priya Singh', age: 20, gender: 'Female', phone: '+91 99100 44556' },
      { name: 'Megha Roy', age: 21, gender: 'Female' },
      { name: 'Tanvi Jain', age: 20, gender: 'Female' },
    ],
    total_amount: 14997,
    amount_paid: 14997,
    payment_status: 'paid',
    booking_status: 'confirmed',
    travel_date: 'Dec 28–31, 2026',
    notes: 'New Year Eve batch. Room upgrade add-on selected.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: 'b-004',
    booking_code: 'TT-RISH15-004',
    trip_id: '4',
    trip_title: 'Rishikesh Adventure & Rafting',
    customer_name: 'Vikram Nair',
    customer_email: 'vikram.nair@iitb.ac.in',
    customer_phone: '+91 98220 77665',
    num_travelers: 2,
    travelers: [
      { name: 'Vikram Nair', age: 23, gender: 'Male' },
      { name: 'Siddharth Rao', age: 23, gender: 'Male' },
    ],
    total_amount: 11998,
    amount_paid: 11998,
    payment_status: 'paid',
    booking_status: 'completed',
    travel_date: 'Nov 15–18, 2026',
    notes: 'Completed successfully! 5-star rating given.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25).toISOString(),
  },
  {
    id: 'b-005',
    booking_code: 'TT-KAS22-005',
    trip_id: '5',
    trip_title: 'Kasol & Kheerganga Trek',
    customer_name: 'Sneha Patel',
    customer_email: 'sneha.patel@iima.ac.in',
    customer_phone: '+91 97240 11990',
    num_travelers: 4,
    travelers: [
      { name: 'Sneha Patel', age: 23, gender: 'Female' },
      { name: 'Rahul Joshi', age: 24, gender: 'Male' },
      { name: 'Dhruv Shah', age: 23, gender: 'Male' },
      { name: 'Kavita Dave', age: 23, gender: 'Female' },
    ],
    total_amount: 25996,
    amount_paid: 12998,
    payment_status: 'partial',
    booking_status: 'confirmed',
    travel_date: 'Dec 22–26, 2026',
    notes: '50% advance received. Remainder to be collected at Kasol campsite.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
  },
]

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
  const pricePerPerson = trip ? trip.price : 7999
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
  {
    id: 'u-003',
    email: 'riya.sharma@iimb.ac.in',
    full_name: 'Riya Sharma',
    phone: '+91 95992 33810',
    role: 'traveler',
    is_admin: false,
    college: 'IIM Bangalore',
    city: 'Bengaluru',
    trips_booked: 2,
    total_spent: 23997,
    status: 'active',
    created_at: '2024-10-15T12:00:00.000Z',
    last_active: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: 'u-004',
    email: 'aryan.g@bitspilani.ac.in',
    full_name: 'Aryan Gupta',
    phone: '+91 98190 88776',
    role: 'traveler',
    is_admin: false,
    college: 'BITS Pilani',
    city: 'Pilani',
    trips_booked: 1,
    total_spent: 12499,
    status: 'active',
    created_at: '2024-11-02T14:30:00.000Z',
    last_active: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    id: 'u-005',
    email: 'priyasingh@du.ac.in',
    full_name: 'Priya Singh',
    phone: '+91 99100 44556',
    role: 'trip_captain',
    is_admin: false,
    college: 'Delhi University',
    city: 'New Delhi',
    trips_booked: 3,
    total_spent: 38990,
    status: 'active',
    created_at: '2024-08-20T09:15:00.000Z',
    last_active: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
  },
  {
    id: 'u-006',
    email: 'vikram.nair@iitb.ac.in',
    full_name: 'Vikram Nair',
    phone: '+91 98220 77665',
    role: 'traveler',
    is_admin: false,
    college: 'IIT Bombay',
    city: 'Mumbai',
    trips_booked: 1,
    total_spent: 11998,
    status: 'active',
    created_at: '2024-11-10T16:00:00.000Z',
    last_active: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: 'u-007',
    email: 'sneha.patel@iima.ac.in',
    full_name: 'Sneha Patel',
    phone: '+91 97240 11990',
    role: 'traveler',
    is_admin: false,
    college: 'IIM Ahmedabad',
    city: 'Ahmedabad',
    trips_booked: 4,
    total_spent: 42990,
    status: 'active',
    created_at: '2024-09-05T11:20:00.000Z',
    last_active: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
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
    name: 'Himalayan Wheels Transport Co.',
    category: 'Transport',
    location: 'Manali, Himachal Pradesh',
    contact_person: 'Suraj Negi',
    phone: '+91 98160 12345',
    email: 'suraj@himalayanwheels.com',
    status: 'Active',
    trips_count: 14,
    is_verified: true,
    commission_rate: '10% net',
    notes: 'Owns 4 Tempo Travellers and 2 Volvo 45-seater coaches. Primary partner for Manali/Kasol circuits.',
    created_at: '2024-03-15T10:00:00.000Z',
  },
  {
    id: 'p2',
    name: 'Zostel & Backpacker Stays Network',
    category: 'Stay',
    location: 'Himachal & Uttarakhand',
    contact_person: 'Anjali Sharma',
    phone: '+91 98200 54321',
    email: 'partnerships@zostelnetwork.in',
    status: 'Active',
    trips_count: 22,
    is_verified: true,
    commission_rate: 'Group discount tier A',
    notes: 'Dorm & private room allotments across Manali, Kasol, and Rishikesh.',
    created_at: '2024-02-10T11:00:00.000Z',
  },
  {
    id: 'p3',
    name: 'Ganges White Water Rafting & Camp',
    category: 'Activities',
    location: 'Rishikesh, Uttarakhand',
    contact_person: 'Deepak Rawat',
    phone: '+91 94120 98765',
    email: 'deepak@rishikeshrafting.com',
    status: 'Active',
    trips_count: 8,
    is_verified: true,
    commission_rate: '₹650/pax bulk rate',
    notes: 'Certified river guides with full safety gear and cliff jumping inclusion.',
    created_at: '2024-05-18T14:30:00.000Z',
  },
  {
    id: 'p4',
    name: 'Desert Safari & Camping Guild',
    category: 'Activities',
    location: 'Jaisalmer, Rajasthan',
    contact_person: 'Manish Bhati',
    phone: '+91 94141 11223',
    email: 'manish@desertcampings.in',
    status: 'Under Review',
    trips_count: 2,
    is_verified: false,
    commission_rate: '₹1,200/tent',
    notes: 'Sam Sand Dunes tented camps with Rajasthani folk dance and camel safari.',
    created_at: '2024-10-01T09:00:00.000Z',
  },
  {
    id: 'p5',
    name: 'Spiti High Altitude 4x4 Fleet',
    category: 'Transport',
    location: 'Kaza / Shimla',
    contact_person: 'Tenzin Norbu',
    phone: '+91 98050 33441',
    email: 'tenzin@spiti4x4.com',
    status: 'Active',
    trips_count: 6,
    is_verified: true,
    commission_rate: '₹4,500/day per Force Gurkha',
    notes: 'Experienced mountain drivers specializing in Kunzum Pass and winter Spiti expeditions.',
    created_at: '2024-06-20T13:00:00.000Z',
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

