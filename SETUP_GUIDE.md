# Travel Tribe — WhatsApp Cloud API & Admin Setup Guide

This guide walks you through setting up the official **Meta WhatsApp Business Cloud API**, configuring incoming **Webhooks**, executing **Supabase Migrations**, and creating an **Authorized Administrator Account**.

---

## 1. Quick Start & Local Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment Variables:**
   ```bash
   cp .env.example .env.local
   ```

3. **Run Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) for the public website or [http://localhost:3000/admin](http://localhost:3000/admin) for the Admin & Operations suite.

---

## 2. Meta WhatsApp Business Cloud API Integration

The platform uses the **Official Meta WhatsApp Cloud API** (Graph API v20.0), which requires no third-party proxies or unofficial libraries.

### Step 1: Create a Meta Developer App
1. Go to the [Meta for Developers Portal](https://developers.facebook.com/apps).
2. Click **Create App** → Select **Other** → Select **Business** as the app type.
3. Name your app (e.g. `Travel Tribe WhatsApp Gateway`) and link your Meta Business Account.

### Step 2: Add WhatsApp Product
1. Under **Add products to your app**, locate **WhatsApp** and click **Set Up**.
2. Go to **WhatsApp → API Setup**:
   - Copy the temporary/permanent **Access Token**.
   - Copy the **Phone Number ID**.
   - Copy the **WhatsApp Business Account ID**.
3. Add these to your `.env.local`:
   ```env
   WHATSAPP_ACCESS_TOKEN=EAAG...
   WHATSAPP_PHONE_NUMBER_ID=123456789012345
   WHATSAPP_BUSINESS_ACCOUNT_ID=987654321098765
   NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER=919876543210
   ```

### Step 3: Configure Incoming Webhooks
1. In your Meta App Dashboard, navigate to **WhatsApp → Configuration**.
2. Under **Webhook**, click **Edit**:
   - **Callback URL**: `https://your-domain.com/api/webhooks/whatsapp`
     *(For local testing with ngrok: `https://your-ngrok-subdomain.ngrok-free.app/api/webhooks/whatsapp`)*
   - **Verify Token**: `travel_tribe_verify_token_2026` (or the custom value set in `WHATSAPP_VERIFY_TOKEN`)
3. Click **Verify and Save**.
4. In the **Webhook fields** table below, find the **`messages`** row and click **Subscribe**.
5. Copy your **App Secret** from **App Settings → Basic → App Secret** and save it as:
   ```env
   WHATSAPP_APP_SECRET=your_app_secret_here
   ```

### Step 4: Test Incoming & Outgoing Messages
- Go to `/admin/whatsapp` in your Travel Tribe dashboard:
  - Use the **Send WhatsApp Test Message** form to send a live message to your phone.
  - Use the **Simulate Inbound Webhook Event** tool to test message parsing and lead extraction without needing ngrok.

---

## 3. Database Schema & Admin User Setup

### Step 1: Apply SQL Migrations
Run the SQL scripts in your Supabase SQL Editor:
1. `supabase/migrations/001_initial_schema.sql` (Core tables: trips, destinations, bookings, profiles)
2. `supabase/migrations/002_whatsapp_and_admin_updates.sql` (Inquiries, WhatsApp leads, display orders, trip FAQs, admin roles)

### Step 2: Create an Admin User
1. Register a new user account through the `/signup` page or Supabase Auth dashboard.
2. In the Supabase SQL Editor, promote the user to administrator by executing:
   ```sql
   UPDATE public.profiles
   SET is_admin = true, role = 'admin'
   WHERE id = (SELECT id FROM auth.users WHERE email = 'your-admin-email@traveltribe.in');
   ```
3. Log in at `/login` and navigate to `/admin`.

---

## 4. Admin Dashboard Capabilities

| Section | Route | Features |
|---|---|---|
| **Overview** | `/admin` | Summary KPIs (Total Trips, Upcoming Trips, Inquiries, WhatsApp Leads), recent inquiries feed, trip capacity meters. |
| **Trips Manager** | `/admin/trips` | List view, interactive Calendar view, Create/Edit trip modal with Day-by-Day Itinerary builder, FAQs editor, One-click Publish/Unpublish, Duplicate, Delete, and Reorder featured trips. |
| **Inquiries & Leads** | `/admin/leads` | Channel filtering (WhatsApp, Website, College), status workflow (`new` → `contacted` → `quoted` → `converted` → `lost`), internal notes editor, direct Call & WhatsApp reply triggers, and CSV export. |
| **WhatsApp Console** | `/admin/whatsapp` | Webhook URL & token helper, live message sender test suite, and inbound webhook event simulator. |
| **Bookings & Partners** | `/admin/bookings`, `/admin/partners` | Traveler booking log, payments, and vendor stays directory. |

---

## 5. Production Deployment

When deploying to Vercel, AWS, or Railway, configure the environment variables:
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER`
- `WHATSAPP_ACCESS_TOKEN`
- `WHATSAPP_PHONE_NUMBER_ID`
- `WHATSAPP_BUSINESS_ACCOUNT_ID`
- `WHATSAPP_APP_SECRET`
- `WHATSAPP_VERIFY_TOKEN`
- `WHATSAPP_AUTO_REPLY=true`
