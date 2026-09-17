import { NextRequest, NextResponse } from 'next/server'
import { sendWhatsAppMessage } from '@/lib/whatsapp/cloud-api'

export async function POST(req: NextRequest) {
  try {
    const { to, message } = await req.json()

    if (!to) {
      return NextResponse.json({ error: 'Recipient phone number is required' }, { status: 400 })
    }

    const testBody = message || `👋 Travel Tribe Meta Cloud API Test: Your WhatsApp Business integration is active & working properly!`

    const result = await sendWhatsAppMessage({
      to,
      body: testBody,
      previewUrl: true,
    })

    return NextResponse.json({
      success: result.success,
      messageId: result.messageId,
      isMock: result.isMock,
      error: result.error,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Test message failed' }, { status: 500 })
  }
}
