import { NextResponse } from 'next/server'
import { z } from 'zod'

const savedTripSchema = z.object({
  trip_id: z.string(),
  user_id: z.string().optional(),
})

export async function GET() {
  return NextResponse.json({
    saved_trips: [],
  })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = savedTripSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: 'Trip saved to your wishlist',
      trip_id: parsed.data.trip_id,
    })
  } catch {
    return NextResponse.json({ error: 'Failed to save trip' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json()
    const parsed = savedTripSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: 'Trip removed from wishlist',
      trip_id: parsed.data.trip_id,
    })
  } catch {
    return NextResponse.json({ error: 'Failed to remove saved trip' }, { status: 500 })
  }
}
