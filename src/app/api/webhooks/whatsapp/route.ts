import { NextRequest, NextResponse } from 'next/server'
import {
  verifyMetaWebhookSignature,
  parseMetaWebhookPayload,
  sendWhatsAppMessage,
} from '@/lib/whatsapp/cloud-api'
import { MOCK_TRIPS } from '@/lib/data/trips'
import { addInboundLead } from '@/lib/data/admin-store'

// ============================================================
// GET: Meta Webhook Verification Challenge
// ============================================================
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  const expectedToken = process.env.WHATSAPP_VERIFY_TOKEN || 'travel_tribe_verify_token_2026'

  if (mode === 'subscribe' && token === expectedToken) {
    console.log('[WhatsApp Webhook] Verification succeeded!')
    return new NextResponse(challenge, {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    })
  }

  console.warn('[WhatsApp Webhook] Verification token mismatch:', { received: token, expected: expectedToken })
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}

// ============================================================
// POST: Inbound WhatsApp Event Handler
// ============================================================
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get('x-hub-signature-256')

    // 1. Signature Verification
    const isValid = verifyMetaWebhookSignature(rawBody, signature)
    if (!isValid) {
      console.error('[WhatsApp Webhook] Invalid HMAC signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const payload = JSON.parse(rawBody)

    // 2. Parse Messages
    const inboundMessages = parseMetaWebhookPayload(payload)

    for (const msg of inboundMessages) {
      if (!msg.textBody) continue

      console.log(`[WhatsApp Inbound] From: ${msg.senderName} (${msg.fromPhone}) - Message: "${msg.textBody}"`)

      // 3. Detect matched trip from message text
      let matchedTripTitle = ''
      let matchedTripId = null
      const lowerText = msg.textBody.toLowerCase()

      for (const trip of MOCK_TRIPS) {
        if (
          lowerText.includes(trip.title.toLowerCase()) ||
          lowerText.includes(trip.destination.toLowerCase().split(',')[0])
        ) {
          matchedTripTitle = trip.title
          matchedTripId = trip.id
          break
        }
      }

      const newInboundRecord = {
        id: `lead-wa-${Date.now()}`,
        created_at: msg.timestamp || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        source: 'whatsapp' as const,
        sender_name: msg.senderName,
        sender_phone: msg.fromPhone,
        sender_email: null,
        message: msg.textBody,
        trip_id: matchedTripId,
        trip_title: matchedTripTitle || 'General WhatsApp Inquiry',
        travel_date: null,
        status: 'new' as const,
        raw_payload: msg.raw,
        assigned_to: null,
        internal_notes: null,
        tags: matchedTripTitle ? ['whatsapp', 'trip_inquiry'] : ['whatsapp', 'general_query'],
        metadata: {
          message_id: msg.messageId,
          timestamp: msg.timestamp,
        },
      }

      addInboundLead(newInboundRecord)

      // 4. Persist Inquiry into Database (Graceful degradation if DB is offline)
      try {
        const { createClient } = await import('@/lib/supabase/server')
        const supabase = await createClient()

        await supabase.from('inquiries').insert(newInboundRecord as any)
      } catch (dbErr) {
        console.warn('[WhatsApp Webhook] Could not save to DB (using memory fallback):', dbErr)
      }

      // 5. Optional Automated Warm Acknowledgment
      const isAutoReplyEnabled = process.env.WHATSAPP_AUTO_REPLY !== 'false'
      if (isAutoReplyEnabled) {
        let replyText = `Hey ${msg.senderName}! 🎒 Thanks for reaching out to *The Travel Tribe*.\n\n`
        if (matchedTripTitle) {
          replyText += `We received your inquiry regarding *${matchedTripTitle}*! A Trip Captain is reviewing details and will reply right here within a few minutes with full dates, pricing, and available seats.\n\n`
        } else {
          replyText += `A Trip Captain has received your message and will get back to you shortly.\n\n`
        }
        replyText += `Explore all our live trips anytime at: https://traveltribe.in/trips 🌍`

        await sendWhatsAppMessage({
          to: msg.fromPhone,
          body: replyText,
          previewUrl: true,
        })
      }
    }

    // Always respond 200 OK to Meta quickly within 3 seconds
    return NextResponse.json({ success: true, processed: inboundMessages.length })
  } catch (err: any) {
    console.error('[WhatsApp Webhook Exception]', err)
    return NextResponse.json({ error: 'Server error handling webhook' }, { status: 500 })
  }
}
