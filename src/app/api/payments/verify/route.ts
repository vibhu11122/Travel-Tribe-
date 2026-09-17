import { NextResponse } from 'next/server'
import { verifyPayment } from '@/lib/payments'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const result = await verifyPayment(body)
    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: 'Payment verification failed' }, { status: 500 })
  }
}
