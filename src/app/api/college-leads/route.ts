import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// ─── Zod schema ─────────────────────────────────────────────────────────────

const CollegeLeadSchema = z.object({
  college_name: z.string().min(2, 'College name is required'),
  contact_person: z.string().min(2, 'Contact person name is required'),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  email: z.string().email('Enter a valid email address'),
  num_students: z.number().min(5, 'Minimum 5 students required'),
  preferred_destination: z.string().optional(),
  approximate_budget: z.string().optional(),
  preferred_dates: z.string().optional(),
  num_days: z.number().min(1).max(30).optional(),
  special_requirements: z.string().max(1000).optional(),
})

// ─── POST /api/college-leads ────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const parsed = CollegeLeadSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const data = parsed.data
    const now = new Date().toISOString()

    // Add directly to in-memory Admin CRM
    const { addInboundLead } = await import('@/lib/data/admin-store')
    addInboundLead({
      id: `lead-cl-${Date.now()}`,
      created_at: now,
      updated_at: now,
      source: 'college',
      sender_name: data.contact_person,
      sender_phone: data.phone,
      sender_email: data.email,
      trip_id: null,
      trip_title: `${data.college_name} (${data.num_students} Students Tour)`,
      travel_date: data.preferred_dates || 'Upcoming',
      message: `College: ${data.college_name} | Destination: ${data.preferred_destination || 'Flexible'} | Budget: ${data.approximate_budget || 'Flexible'}. Special requirements: ${data.special_requirements || 'None'}`,
      raw_payload: data,
      status: 'new',
      assigned_to: null,
      internal_notes: `New group tour quote requested for ${data.num_students} students.`,
      tags: ['college', 'group_quote', data.college_name.toLowerCase()],
      metadata: {
        num_students: data.num_students,
        college: data.college_name,
        destination: data.preferred_destination,
      },
    })

    try {
      const { createClient } = await import('@/lib/supabase/server')
      const supabase = await createClient()
      await (supabase as any).from('college_leads').insert({
        college_name: data.college_name,
        contact_person: data.contact_person,
        phone: data.phone,
        email: data.email,
        num_students: data.num_students,
        preferred_destination: data.preferred_destination ?? null,
        approximate_budget: data.approximate_budget ?? null,
        preferred_dates: data.preferred_dates ?? null,
        num_days: data.num_days ?? null,
        special_requirements: data.special_requirements ?? null,
        status: 'new',
      } as any)
    } catch {}

    return NextResponse.json({
      success: true,
      message: "Your request is in! We'll get back to you within 24 hours.",
    })
  } catch (err) {
    console.error('[POST /api/college-leads] Error:', err)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
