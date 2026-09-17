export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          full_name: string | null
          avatar_url: string | null
          college: string | null
          city: string | null
          phone: string | null
          travel_interests: string[]
          favorite_destinations: string[]
          budget_preference: 'budget' | 'mid' | 'premium' | null
          referral_code: string | null
          referred_by: string | null
          is_admin: boolean
          role: 'admin' | 'user'
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      trips: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          slug: string
          destination: string
          destination_id: string | null
          description: string
          cover_image: string | null
          gallery: string[]
          start_date: string | null
          end_date: string | null
          duration_days: number
          duration_nights: number
          price: number
          price_original: number | null
          capacity: number
          available_slots: number
          trip_type: TripType
          difficulty: DifficultyLevel
          highlights: string[]
          inclusions: string[]
          exclusions: string[]
          itinerary: ItineraryDay[]
          faqs?: TripFAQ[]
          display_order?: number
          meeting_point: string | null
          transport_from: string | null
          status: TripStatus
          is_featured: boolean
          is_community: boolean
          tags: string[]
          min_age: number | null
          max_age: number | null
          organizer_name: string | null
        }
        Insert: Omit<Database['public']['Tables']['trips']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['trips']['Insert']>
      }
      inquiries: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          source: 'whatsapp' | 'website' | 'college' | 'custom_builder'
          sender_name: string | null
          sender_phone: string | null
          sender_email: string | null
          trip_id: string | null
          trip_title: string | null
          travel_date: string | null
          message: string
          raw_payload: Json
          status: 'new' | 'contacted' | 'quoted' | 'converted' | 'lost'
          assigned_to: string | null
          internal_notes: string | null
          tags: string[]
          metadata: Json
        }
        Insert: Omit<Database['public']['Tables']['inquiries']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['inquiries']['Insert']>
      }
      destinations: {
        Row: {
          id: string
          created_at: string
          name: string
          slug: string
          state: string
          region: string
          description: string
          cover_image: string | null
          gallery: string[]
          category: DestinationCategory[]
          best_time: string
          starting_price: number
          popular_activities: string[]
          highlights: string[]
          is_featured: boolean
        }
        Insert: Omit<Database['public']['Tables']['destinations']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['destinations']['Insert']>
      }
      bookings: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          booking_id: string
          user_id: string
          trip_id: string
          status: BookingStatus
          num_travelers: number
          total_amount: number
          paid_amount: number
          payment_status: PaymentStatus
          payment_id: string | null
          special_requirements: string | null
          addons: BookingAddon[]
        }
        Insert: Omit<Database['public']['Tables']['bookings']['Row'], 'id' | 'created_at' | 'updated_at' | 'booking_id'>
        Update: Partial<Database['public']['Tables']['bookings']['Insert']>
      }
      booking_travelers: {
        Row: {
          id: string
          booking_id: string
          name: string
          age: number | null
          gender: string | null
          id_type: string | null
          id_number: string | null
          phone: string | null
          email: string | null
          emergency_contact: string | null
        }
        Insert: Omit<Database['public']['Tables']['booking_travelers']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['booking_travelers']['Insert']>
      }
      saved_trips: {
        Row: {
          id: string
          user_id: string
          trip_id: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['saved_trips']['Row'], 'id' | 'created_at'>
        Update: never
      }
      trip_requests: {
        Row: {
          id: string
          created_at: string
          user_id: string | null
          name: string
          email: string
          phone: string
          destination: string
          travel_dates: string | null
          num_travelers: number
          budget: number | null
          duration_days: number | null
          experience_types: string[]
          traveler_type: string | null
          special_requirements: string | null
          status: 'new' | 'contacted' | 'converted' | 'closed'
          generated_itinerary: Json | null
        }
        Insert: Omit<Database['public']['Tables']['trip_requests']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['trip_requests']['Insert']>
      }
      college_leads: {
        Row: {
          id: string
          created_at: string
          college_name: string
          contact_person: string
          phone: string
          email: string
          num_students: number
          preferred_destination: string | null
          approximate_budget: string | null
          preferred_dates: string | null
          num_days: number | null
          special_requirements: string | null
          status: 'new' | 'contacted' | 'quoted' | 'converted' | 'closed'
        }
        Insert: Omit<Database['public']['Tables']['college_leads']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['college_leads']['Insert']>
      }
      waitlist: {
        Row: {
          id: string
          created_at: string
          name: string
          email: string
          phone: string | null
          college: string | null
          city: string | null
          interested_destination: string | null
        }
        Insert: Omit<Database['public']['Tables']['waitlist']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['waitlist']['Insert']>
      }
      partners: {
        Row: {
          id: string
          created_at: string
          name: string
          type: 'hotel' | 'transport' | 'activity' | 'guide' | 'other'
          region: string
          contact_name: string | null
          contact_phone: string | null
          contact_email: string | null
          rating: number | null
          is_active: boolean
          notes: string | null
        }
        Insert: Omit<Database['public']['Tables']['partners']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['partners']['Insert']>
      }
      referrals: {
        Row: {
          id: string
          created_at: string
          referrer_id: string
          referred_email: string
          referred_user_id: string | null
          status: 'pending' | 'signed_up' | 'booked'
          reward_given: boolean
        }
        Insert: Omit<Database['public']['Tables']['referrals']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['referrals']['Insert']>
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}

// App-level types
export type TripType =
  | 'adventure'
  | 'mountains'
  | 'beaches'
  | 'culture'
  | 'food'
  | 'nature'
  | 'photography'
  | 'relaxation'
  | 'backpacking'
  | 'nightlife'
  | 'community'
  | 'college'

export type DifficultyLevel = 'easy' | 'moderate' | 'challenging' | 'extreme'

export type TripStatus = 'draft' | 'active' | 'full' | 'completed' | 'cancelled'

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed'

export type PaymentStatus = 'pending' | 'partial' | 'paid' | 'refunded' | 'failed'

export type DestinationCategory =
  | 'mountains'
  | 'beaches'
  | 'desert'
  | 'nature'
  | 'culture'
  | 'backpacking'
  | 'adventure'

export interface ItineraryDay {
  day: number
  title: string
  description: string
  activities: string[]
  accommodation?: string
  meals?: string[]
  travel?: string
  notes?: string
}

export interface BookingAddon {
  id: string
  name: string
  price: number
  selected: boolean
}

export interface TripFAQ {
  question: string
  answer: string
}

export type Inquiry = Database['public']['Tables']['inquiries']['Row']
export type InquiryInsert = Database['public']['Tables']['inquiries']['Insert']

