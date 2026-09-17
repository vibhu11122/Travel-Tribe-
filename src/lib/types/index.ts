export type {
  Database,
  TripType,
  DifficultyLevel,
  TripStatus,
  BookingStatus,
  PaymentStatus,
  DestinationCategory,
  ItineraryDay,
  BookingAddon,
  TripFAQ,
  Inquiry,
} from './database'

import type { Database } from './database'

// Convenient row type aliases
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Trip = Database['public']['Tables']['trips']['Row']
export type Destination = Database['public']['Tables']['destinations']['Row']
export type Booking = Database['public']['Tables']['bookings']['Row']
export type BookingTraveler = Database['public']['Tables']['booking_travelers']['Row']
export type SavedTrip = Database['public']['Tables']['saved_trips']['Row']
export type TripRequest = Database['public']['Tables']['trip_requests']['Row']
export type CollegeLead = Database['public']['Tables']['college_leads']['Row']
export type Partner = Database['public']['Tables']['partners']['Row']
export type Referral = Database['public']['Tables']['referrals']['Row']
export type WaitlistEntry = Database['public']['Tables']['waitlist']['Row']
export type LeadInquiry = Database['public']['Tables']['inquiries']['Row']

// Trip with joined destination
export type TripWithDestination = Trip & {
  destination_details?: Destination | null
}

// Booking with joined trip
export type BookingWithTrip = Booking & {
  trip?: Trip | null
  travelers?: BookingTraveler[]
}

// Nav item
export interface NavItem {
  label: string
  href: string
  icon?: string
}

// Filter options for trip listing
export interface TripFilters {
  destination?: string
  minBudget?: number
  maxBudget?: number
  duration?: number
  startDate?: string
  tripType?: string
  difficulty?: string
  groupSize?: number
}

// Trip builder form data
export interface TripBuilderData {
  destination: string
  startDate: string
  endDate: string
  numPeople: number
  budget: number
  numDays: number
  experienceTypes: string[]
  travelerType: string
}

// Generated itinerary from trip builder
export interface GeneratedItinerary {
  destination: string
  title: string
  duration: number
  estimatedCost: number
  accommodation: string
  transport: string
  days: GeneratedDay[]
  addons: GeneratedAddon[]
}

export interface GeneratedDay {
  day: number
  title: string
  activities: string[]
  food: string[]
  freeTime?: string
  notes?: string
}

export interface GeneratedAddon {
  name: string
  price: number
  description: string
}

// Traction stats
export interface TractionStat {
  value: number
  suffix: string
  prefix?: string
  label: string
  description?: string
}

// Traveler details inside a booking
export interface TravelerInfo {
  name: string
  age?: number
  gender?: string
  phone?: string
  emergency_contact?: string
}

// Admin Booking Model
export interface AdminBooking {
  id: string
  booking_code: string
  trip_id: string
  trip_title: string
  user_id?: string
  customer_name: string
  customer_email: string
  customer_phone: string
  num_travelers: number
  travelers: TravelerInfo[]
  total_amount: number
  amount_paid: number
  payment_status: 'pending' | 'partial' | 'paid' | 'refunded'
  booking_status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  travel_date?: string
  notes?: string
  created_at: string
  updated_at: string
}

// Admin User Model
export interface AdminUser {
  id: string
  email: string
  full_name: string
  phone?: string
  role: 'admin' | 'trip_captain' | 'traveler'
  is_admin: boolean
  college?: string
  city?: string
  trips_booked: number
  total_spent: number
  status: 'active' | 'suspended'
  created_at: string
  last_active?: string
}

// Admin Partner Model
export interface AdminPartner {
  id: string
  name: string
  category: 'Transport' | 'Stay' | 'Activities' | 'Equipment'
  location: string
  contact_person: string
  phone: string
  email: string
  status: 'Active' | 'Under Review' | 'Inactive'
  trips_count: number
  is_verified: boolean
  commission_rate?: string
  notes?: string
  created_at: string
  updated_at?: string
}

// Admin Overview & Analytics Payload
export interface AdminOverviewStats {
  total_revenue: number
  total_profit: number
  active_trips: number
  total_bookings: number
  total_travelers: number
  total_leads: number
  pending_inquiries: number
  whatsapp_leads_count: number
}

