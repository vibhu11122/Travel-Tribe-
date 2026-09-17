import { NextResponse } from 'next/server'
import { z } from 'zod'
import { addInboundLead } from '@/lib/data/admin-store'

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string(),
  message: z.string().min(10),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = contactSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid form data', details: parsed.error.flatten() }, { status: 400 })
    }

    const d = parsed.data
    const now = new Date().toISOString()

    addInboundLead({
      id: `lead-web-${Date.now()}`,
      created_at: now,
      updated_at: now,
      source: 'website',
      sender_name: d.name,
      sender_phone: d.phone || '+91 95992 33810',
      sender_email: d.email,
      trip_id: null,
      trip_title: `Inquiry: ${d.subject}`,
      travel_date: 'Upcoming',
      message: d.message,
      raw_payload: d,
      status: 'new',
      assigned_to: null,
      internal_notes: `Website contact form inquiry regarding "${d.subject}".`,
      tags: ['website', 'contact_form', d.subject.toLowerCase()],
      metadata: { subject: d.subject },
    })

    return NextResponse.json({
      success: true,
      message: 'Message received! We will reply within 24 hours.',
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
