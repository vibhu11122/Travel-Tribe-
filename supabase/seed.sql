-- ============================================================
-- TRAVEL TRIBE — SEED DATA
-- Run AFTER 001_initial_schema.sql
-- ============================================================

-- Destinations
INSERT INTO destinations (name, slug, state, region, description, cover_image, gallery, category, best_time, starting_price, popular_activities, highlights, is_featured)
VALUES
  (
    'Himachal Pradesh', 'himachal-pradesh', 'Himachal Pradesh', 'North India',
    'Snow-capped peaks, ancient monasteries, dramatic valleys, and the kind of silence that resets your brain.',
    '/spiti.jpg', ARRAY['/spiti.jpg', '/khaliya top.jpeg'],
    ARRAY['mountains', 'adventure', 'backpacking'],
    'March–June, Oct–Nov (Summer); Dec–Feb (Snow)', 6499,
    ARRAY['Trekking', 'Snow activities', 'Monastery visits', 'Camping', 'Paragliding'],
    ARRAY['Spiti Valley', 'Kullu Manali', 'Kasol', 'Kheerganga'],
    TRUE
  ),
  (
    'Uttarakhand', 'uttarakhand', 'Uttarakhand', 'North India',
    'Ganga, Himalayas, and a thousand trails. Rishikesh, rafting, temples — Uttarakhand delivers every time.',
    '/kedarnath.jpg', ARRAY['/kedarnath.jpg'],
    ARRAY['mountains', 'adventure', 'nature'],
    'March–June, Sept–Nov', 4999,
    ARRAY['River rafting', 'Trekking', 'Bungee jumping', 'Yoga & meditation', 'Camping'],
    ARRAY['Rishikesh', 'Haridwar', 'Valley of Flowers', 'Kedarnath'],
    TRUE
  ),
  (
    'Rajasthan', 'rajasthan', 'Rajasthan', 'North India',
    'Royal forts, camel safaris, midnight markets, and colours so vivid they look edited.',
    '/rajasthan.jpg', ARRAY['/rajasthan.jpg'],
    ARRAY['culture', 'desert', 'adventure'],
    'Oct–Feb (Winter)', 4999,
    ARRAY['Fort walks', 'Camel safari', 'Heritage walks', 'Food trails', 'Hot air balloon'],
    ARRAY['Jaipur', 'Jodhpur', 'Jaisalmer', 'Udaipur'],
    TRUE
  ),
  (
    'Madhya Pradesh', 'madhya-pradesh', 'Madhya Pradesh', 'Central India',
    'UNESCO temples, tiger country, Narmada ghats, and street food that competes with anyone.',
    '/andaman.jpg', ARRAY['/andaman.jpg'],
    ARRAY['culture', 'nature', 'adventure'],
    'Oct–March', 7999,
    ARRAY['Tiger safari', 'Temple visits', 'River ghats', 'Trekking'],
    ARRAY['Khajuraho', 'Bandhavgarh', 'Orchha', 'Maheshwar'],
    TRUE
  ),
  (
    'Uttar Pradesh', 'uttar-pradesh', 'Uttar Pradesh', 'North India',
    'The Taj at sunrise. Ghats of Varanasi at dusk. Ancient temples and street food that ruines all other food.',
    '/meghalaya.jpg', ARRAY['/meghalaya.jpg'],
    ARRAY['culture', 'backpacking'],
    'Oct–March', 3999,
    ARRAY['Ganga aarti', 'Taj Mahal visit', 'Boat rides', 'Temple circuits', 'Food walks'],
    ARRAY['Agra', 'Varanasi', 'Mathura-Vrindavan', 'Lucknow'],
    FALSE
  );

-- Note: Trips seed data is intentionally left for admin to add via dashboard.
-- The app uses MOCK_TRIPS from src/lib/data/trips.ts as static data for MVP.

-- ============================================================
-- To make yourself an admin:
-- 1. Sign up with your email at /signup
-- 2. Run this SQL replacing YOUR_USER_UUID with your actual user id from auth.users:
--
-- INSERT INTO admin_users (id, role) VALUES ('YOUR_USER_UUID', 'super_admin');
-- ============================================================
