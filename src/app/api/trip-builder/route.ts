import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { generateItinerary } from '@/lib/ai/itinerary'

// ─── Zod schema ─────────────────────────────────────────────────────────────

const TripBuilderSchema = z.object({
  destination: z.string().min(2, 'Destination is required'),
  startDate: z.string(),
  endDate: z.string(),
  numPeople: z.number().min(1).max(100),
  budget: z.number().min(0),
  numDays: z.number().min(1).max(30),
  experienceTypes: z.array(z.string()).min(1, 'Select at least one experience type'),
  travelerType: z.string(),
})

// ─── POST /api/trip-builder ─────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const parsed = TripBuilderSchema.safeParse(body)
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

    const itinerary = await generateItinerary(parsed.data)

    return NextResponse.json({
      success: true,
      data: itinerary,
    })
  } catch (err) {
    console.error('[POST /api/trip-builder] Error:', err)
    return NextResponse.json({ success: false, error: 'Failed to generate itinerary' }, { status: 500 })
  }
}
