-- ============================================================
-- TRAVEL TRIBE — DATABASE SCHEMA
-- Run in your Supabase SQL editor
-- ============================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES (extends Supabase auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  college TEXT,
  city TEXT,
  phone TEXT,
  travel_interests TEXT[] DEFAULT '{}',
  favorite_destinations TEXT[] DEFAULT '{}',
  budget_preference TEXT CHECK (budget_preference IN ('budget', 'mid', 'premium')),
  referral_code TEXT UNIQUE DEFAULT UPPER(SUBSTRING(gen_random_uuid()::TEXT, 1, 8)),
  referred_by TEXT
);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- DESTINATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS destinations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  state TEXT NOT NULL,
  region TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  cover_image TEXT,
  gallery TEXT[] DEFAULT '{}',
  category TEXT[] DEFAULT '{}',
  best_time TEXT NOT NULL DEFAULT '',
  starting_price INTEGER NOT NULL DEFAULT 0,
  popular_activities TEXT[] DEFAULT '{}',
  highlights TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT FALSE
);

-- ============================================================
-- TRIPS
-- ============================================================
CREATE TABLE IF NOT EXISTS trips (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  destination TEXT NOT NULL,
  destination_id UUID REFERENCES destinations(id) ON DELETE SET NULL,
  description TEXT NOT NULL DEFAULT '',
  cover_image TEXT,
  gallery TEXT[] DEFAULT '{}',
  start_date DATE,
  end_date DATE,
  duration_days INTEGER NOT NULL DEFAULT 1,
  duration_nights INTEGER NOT NULL DEFAULT 0,
  price INTEGER NOT NULL DEFAULT 0,
  price_original INTEGER,
  capacity INTEGER NOT NULL DEFAULT 20,
  available_slots INTEGER NOT NULL DEFAULT 20,
  trip_type TEXT NOT NULL DEFAULT 'adventure',
  difficulty TEXT NOT NULL DEFAULT 'moderate' CHECK (difficulty IN ('easy', 'moderate', 'challenging', 'extreme')),
  highlights TEXT[] DEFAULT '{}',
  inclusions TEXT[] DEFAULT '{}',
  exclusions TEXT[] DEFAULT '{}',
  itinerary JSONB DEFAULT '[]',
  meeting_point TEXT,
  transport_from TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'full', 'completed', 'cancelled')),
  is_featured BOOLEAN DEFAULT FALSE,
  is_community BOOLEAN DEFAULT FALSE,
  tags TEXT[] DEFAULT '{}',
  min_age INTEGER,
  max_age INTEGER,
  organizer_name TEXT DEFAULT 'Travel Tribe'
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trips_updated_at
  BEFORE UPDATE ON trips
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- BOOKINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  booking_id TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  trip_id UUID REFERENCES trips(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  num_travelers INTEGER NOT NULL DEFAULT 1,
  total_amount INTEGER NOT NULL DEFAULT 0,
  paid_amount INTEGER NOT NULL DEFAULT 0,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'partial', 'paid', 'refunded', 'failed')),
  payment_id TEXT,
  special_requirements TEXT,
  addons JSONB DEFAULT '[]'
);

CREATE TRIGGER bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- BOOKING TRAVELERS
-- ============================================================
CREATE TABLE IF NOT EXISTS booking_travelers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  age INTEGER,
  gender TEXT,
  id_type TEXT,
  id_number TEXT,
  phone TEXT,
  email TEXT,
  emergency_contact TEXT
);

-- ============================================================
-- SAVED TRIPS
-- ============================================================
CREATE TABLE IF NOT EXISTS saved_trips (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, trip_id)
);

-- ============================================================
-- TRIP REQUESTS (from Build Your Trip)
-- ============================================================
CREATE TABLE IF NOT EXISTS trip_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  destination TEXT NOT NULL,
  travel_dates TEXT,
  num_travelers INTEGER NOT NULL DEFAULT 1,
  budget INTEGER,
  duration_days INTEGER,
  experience_types TEXT[] DEFAULT '{}',
  traveler_type TEXT,
  special_requirements TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted', 'closed')),
  generated_itinerary JSONB
);

-- ============================================================
-- COLLEGE LEADS
-- ============================================================
CREATE TABLE IF NOT EXISTS college_leads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  college_name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  num_students INTEGER NOT NULL DEFAULT 0,
  preferred_destination TEXT,
  approximate_budget TEXT,
  preferred_dates TEXT,
  num_days INTEGER,
  special_requirements TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'quoted', 'converted', 'closed'))
);

-- ============================================================
-- WAITLIST
-- ============================================================
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  college TEXT,
  city TEXT,
  interested_destination TEXT
);

-- ============================================================
-- PARTNERS
-- ============================================================
CREATE TABLE IF NOT EXISTS partners (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('hotel', 'transport', 'activity', 'guide', 'other')),
  region TEXT NOT NULL,
  contact_name TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  rating NUMERIC(2,1),
  is_active BOOLEAN DEFAULT TRUE,
  notes TEXT
);

-- ============================================================
-- REFERRALS
-- ============================================================
CREATE TABLE IF NOT EXISTS referrals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  referrer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  referred_email TEXT NOT NULL,
  referred_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'signed_up', 'booked')),
  reward_given BOOLEAN DEFAULT FALSE
);

-- ============================================================
-- ADMIN USERS (role-based access)
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin', 'support')),
  is_active BOOLEAN DEFAULT TRUE
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_travelers ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE college_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- PROFILES: Users can read/update their own profile
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Service role can manage profiles" ON profiles FOR ALL USING (true) WITH CHECK (true);

-- TRIPS: Public read for active trips, admin write
CREATE POLICY "Public can read active trips" ON trips FOR SELECT USING (status = 'active' OR status = 'full');
CREATE POLICY "Admins can manage trips" ON trips FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND is_active = TRUE)
);

-- DESTINATIONS: Public read
CREATE POLICY "Public can read destinations" ON destinations FOR SELECT USING (true);
CREATE POLICY "Admins can manage destinations" ON destinations FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND is_active = TRUE)
);

-- BOOKINGS: Users can read/create their own
CREATE POLICY "Users can read own bookings" ON bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create bookings" ON bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage bookings" ON bookings FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND is_active = TRUE)
);

-- SAVED TRIPS: Users own their saves
CREATE POLICY "Users can manage own saved trips" ON saved_trips FOR ALL USING (auth.uid() = user_id);

-- TRIP REQUESTS: Users can create, admins can manage
CREATE POLICY "Anyone can create trip request" ON trip_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can read own requests" ON trip_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage trip requests" ON trip_requests FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND is_active = TRUE)
);

-- COLLEGE LEADS: Anyone can create (lead form), admins read/manage
CREATE POLICY "Anyone can submit college lead" ON college_leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage leads" ON college_leads FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND is_active = TRUE)
);

-- WAITLIST: Anyone can join
CREATE POLICY "Anyone can join waitlist" ON waitlist FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage waitlist" ON waitlist FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND is_active = TRUE)
);

-- PARTNERS: Admin only
CREATE POLICY "Admins can manage partners" ON partners FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND is_active = TRUE)
);

-- REFERRALS: Users own their referrals
CREATE POLICY "Users can read own referrals" ON referrals FOR SELECT USING (auth.uid() = referrer_id);
CREATE POLICY "System can manage referrals" ON referrals FOR ALL USING (true);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS trips_status_idx ON trips(status);
CREATE INDEX IF NOT EXISTS trips_destination_idx ON trips(destination);
CREATE INDEX IF NOT EXISTS trips_is_featured_idx ON trips(is_featured);
CREATE INDEX IF NOT EXISTS trips_is_community_idx ON trips(is_community);
CREATE INDEX IF NOT EXISTS bookings_user_id_idx ON bookings(user_id);
CREATE INDEX IF NOT EXISTS bookings_trip_id_idx ON bookings(trip_id);
CREATE INDEX IF NOT EXISTS saved_trips_user_id_idx ON saved_trips(user_id);
CREATE INDEX IF NOT EXISTS college_leads_status_idx ON college_leads(status);
CREATE INDEX IF NOT EXISTS trip_requests_status_idx ON trip_requests(status);
