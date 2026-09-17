import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// ─── Zod schema ─────────────────────────────────────────────────────────────

const WaitlistSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number')
    .optional()
    .or(z.literal('')),
  college: z.string().optional(),
  city: z.string().optional(),
  interested_destination: z.string().optional(),
})

// ─── POST /api/waitlist ─────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const parsed = WaitlistSchema.safeParse(body)
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

    // MVP: Try to save to Supabase — graceful degradation
    try {
      const { createClient } = await import('@/lib/supabase/server')
      const supabase = await createClient()

      await supabase.from('waitlist').insert({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        college: data.college || null,
        city: data.city || null,
        interested_destination: data.interested_destination || null,
      } as any)
    } catch (dbErr) {
      console.warn('[POST /api/waitlist] DB save failed (graceful):', dbErr)
    }

    console.log('[POST /api/waitlist] New signup:', data.name, data.email)

    return NextResponse.json({
      success: true,
      message: "You're on the waitlist! We'll notify you when spots open up. 🎒",
    })
  } catch (err) {
    console.error('[POST /api/waitlist] Error:', err)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
