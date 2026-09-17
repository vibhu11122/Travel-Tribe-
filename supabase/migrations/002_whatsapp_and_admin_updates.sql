-- ============================================================
-- Migration: 002_whatsapp_and_admin_updates.sql
-- Description: Adds tables for WhatsApp leads, inquiries, trip FAQs,
--              display ordering, and admin role flags.
-- ============================================================

-- 1. Extend profiles with admin flag
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user';

-- 2. Extend trips table with display_order and faqs
ALTER TABLE public.trips
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS faqs JSONB DEFAULT '[]'::jsonb;

-- 3. Create inquiries / leads table
CREATE TABLE IF NOT EXISTS public.inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  source VARCHAR(30) NOT NULL DEFAULT 'whatsapp', -- 'whatsapp' | 'website' | 'college' | 'custom_builder'
  sender_name VARCHAR(150),
  sender_phone VARCHAR(30),
  sender_email VARCHAR(150),
  trip_id UUID REFERENCES public.trips(id) ON DELETE SET NULL,
  trip_title VARCHAR(200),
  travel_date VARCHAR(50),
  message TEXT NOT NULL,
  raw_payload JSONB DEFAULT '{}'::jsonb,
  status VARCHAR(30) NOT NULL DEFAULT 'new', -- 'new' | 'contacted' | 'quoted' | 'converted' | 'lost'
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  internal_notes TEXT,
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes for inquiries
CREATE INDEX IF NOT EXISTS idx_inquiries_source ON public.inquiries(source);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON public.inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_trip_id ON public.inquiries(trip_id);
CREATE INDEX IF NOT EXISTS idx_trips_display_order ON public.trips(display_order);

-- Enable RLS for inquiries
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (from web forms and webhooks)
CREATE POLICY "Allow public insert to inquiries"
  ON public.inquiries FOR INSERT
  WITH CHECK (true);

-- Allow authenticated admins to view and update inquiries
CREATE POLICY "Admins can view and manage inquiries"
  ON public.inquiries FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );
