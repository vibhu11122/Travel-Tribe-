// ============================================================
// Meta WhatsApp Business Cloud API (Official Graph API v20.0)
// Server-side helper for webhooks, signature verification & messaging
// ============================================================

import crypto from 'crypto'

const META_GRAPH_VERSION = 'v20.0'
const META_GRAPH_BASE_URL = `https://graph.facebook.com/${META_GRAPH_VERSION}`

export interface WhatsAppInboundMessage {
  messageId: string
  fromPhone: string
  senderName: string
  timestamp: string
  textBody?: string
  messageType: string
  raw: any
}

export interface SendMessageOptions {
  to: string
  body: string
  previewUrl?: boolean
}

/**
 * Verify incoming webhook payload signature using HMAC-SHA256
 * @param rawBody - Exact UTF-8 string payload from request
 * @param signatureHeader - Value of 'x-hub-signature-256' (sha256=...)
 */
export function verifyMetaWebhookSignature(
  rawBody: string,
  signatureHeader: string | null
): boolean {
  const appSecret = process.env.WHATSAPP_APP_SECRET
  if (!appSecret) {
    // If not configured in development, bypass signature check with a warning
    console.warn('[WhatsApp Cloud API] WHATSAPP_APP_SECRET is not configured. Skipping signature verification.')
    return true
  }

  if (!signatureHeader || !signatureHeader.startsWith('sha256=')) {
    return false
  }

  const expectedSignature = signatureHeader.substring(7)
  const hmac = crypto.createHmac('sha256', appSecret)
  const calculatedSignature = hmac.update(rawBody).digest('hex')

  try {
    return crypto.timingSafeEqual(
      Buffer.from(calculatedSignature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    )
  } catch {
    return false
  }
}

/**
 * Extract user messages from Meta Webhook event payload
 */
export function parseMetaWebhookPayload(body: any): WhatsAppInboundMessage[] {
  const messages: WhatsAppInboundMessage[] = []

  try {
    if (body.object !== 'whatsapp_business_account' || !Array.isArray(body.entry)) {
      return messages
    }

    for (const entry of body.entry) {
      if (!Array.isArray(entry.changes)) continue

      for (const change of entry.changes) {
        if (change.field !== 'messages') continue
        const value = change.value
        if (!value || !Array.isArray(value.messages)) continue

        const contacts = Array.isArray(value.contacts) ? value.contacts : []
        const contactMap = new Map<string, string>()
        for (const c of contacts) {
          contactMap.set(c.wa_id, c.profile?.name || 'Traveler')
        }

        for (const msg of value.messages) {
          const fromPhone = msg.from
          const senderName = contactMap.get(fromPhone) || 'Traveler'
          const messageId = msg.id
          const timestamp = msg.timestamp ? new Date(parseInt(msg.timestamp) * 1000).toISOString() : new Date().toISOString()
          const messageType = msg.type

          let textBody = ''
          if (messageType === 'text' && msg.text?.body) {
            textBody = msg.text.body
          } else if (messageType === 'interactive') {
            textBody = msg.interactive?.button_reply?.title || msg.interactive?.list_reply?.title || '[Interactive Response]'
          } else if (messageType === 'button') {
            textBody = msg.button?.text || '[Button Click]'
          } else {
            textBody = `[${messageType} message]`
          }

          messages.push({
            messageId,
            fromPhone,
            senderName,
            timestamp,
            textBody,
            messageType,
            raw: msg,
          })
        }
      }
    }
  } catch (err) {
    console.error('[WhatsApp Cloud API] Error parsing webhook payload:', err)
  }

  return messages
}

/**
 * Send a message to a WhatsApp user using Meta Cloud API
 */
export async function sendWhatsAppMessage(options: SendMessageOptions): Promise<{
  success: boolean
  messageId?: string
  error?: string
  isMock?: boolean
}> {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN

  if (!phoneNumberId || !accessToken) {
    console.warn('[WhatsApp Cloud API] WHATSAPP_PHONE_NUMBER_ID or WHATSAPP_ACCESS_TOKEN missing. Simulating mock message send.')
    return {
      success: true,
      messageId: `mock_wamid_${Date.now()}`,
      isMock: true,
    }
  }

  try {
    const cleanPhone = options.to.replace(/[^0-9]/g, '')
    const url = `${META_GRAPH_BASE_URL}/${phoneNumberId}/messages`

    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: cleanPhone,
      type: 'text',
      text: {
        preview_url: options.previewUrl ?? true,
        body: options.body,
      },
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const data = await res.json()

    if (!res.ok) {
      console.error('[WhatsApp Cloud API Error]', data)
      return {
        success: false,
        error: data.error?.message || 'Meta API returned error',
      }
    }

    const messageId = data.messages?.[0]?.id
    return {
      success: true,
      messageId,
    }
  } catch (err: any) {
    console.error('[WhatsApp Cloud API Exception]', err)
    return {
      success: false,
      error: err.message || 'Network exception while contacting Meta API',
    }
  }
}
