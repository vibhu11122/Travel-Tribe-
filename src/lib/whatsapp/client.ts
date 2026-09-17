// ============================================================
// WhatsApp Client Utilities
// Generates pre-filled, contextual WhatsApp click-to-chat links
// for trips, custom requests, college groups, and spot reservations
// ============================================================

const DEFAULT_WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER || '919599233810'

export interface TripWhatsAppContext {
  tripTitle: string
  destination?: string
  travelDate?: string
  price?: number
  slug?: string
  url?: string
  intent?: 'inquire' | 'reserve' | 'itinerary' | 'discount' | 'custom'
}

/**
 * Clean and format phone number (removes +, spaces, dashes)
 */
export function formatWhatsAppNumber(phone?: string): string {
  const raw = phone || DEFAULT_WHATSAPP_NUMBER
  return raw.replace(/[^0-9]/g, '')
}

/**
 * Generate a pre-filled WhatsApp click-to-chat URL for a specific trip
 */
export function getTripWhatsAppUrl(context: TripWhatsAppContext, customPhone?: string): string {
  const phone = formatWhatsAppNumber(customPhone)
  const appBaseUrl = typeof window !== 'undefined' ? window.location.origin : (process.env.NEXT_PUBLIC_APP_URL || 'https://traveltribe.in')
  const tripUrl = context.url || (context.slug ? `${appBaseUrl}/trips/${context.slug}` : appBaseUrl)
  
  let message = ''

  switch (context.intent) {
    case 'reserve':
      message = `Hey Travel Tribe! 🎒 I'd like to reserve a spot for the *${context.tripTitle}* trip.`
      if (context.travelDate) message += `\n📅 Travel Date: ${context.travelDate}`
      if (context.price) message += `\n💰 Price: ₹${context.price.toLocaleString('en-IN')}/person`
      message += `\n🔗 Link: ${tripUrl}\n\nPlease share the booking procedure and remaining slots!`
      break

    case 'itinerary':
      message = `Hi Travel Tribe! 👋 Could you share the detailed PDF itinerary and inclusions for *${context.tripTitle}*?`
      if (context.travelDate) message += `\n📅 Dates: ${context.travelDate}`
      message += `\n🔗 Trip URL: ${tripUrl}`
      break

    case 'custom':
      message = `Hey Tribe! 🏕️ We're planning a trip to *${context.destination || context.tripTitle}* for a group and want to customize our dates and itinerary.`
      message += `\n🔗 Reference: ${tripUrl}`
      break

    case 'inquire':
    default:
      message = `Hey Travel Tribe! ✈️ I'm interested in the *${context.tripTitle}*`
      if (context.destination) message += ` (${context.destination})`
      message += '.'
      if (context.travelDate) message += `\n📅 Travel Date: ${context.travelDate}`
      if (context.price) message += `\n💰 Starting: ₹${context.price.toLocaleString('en-IN')}/person`
      message += `\n🔗 Page: ${tripUrl}\n\nCould you give me more details?`
      break
  }

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}

/**
 * Pre-filled WhatsApp link for College & Group Trips
 */
export function getCollegeWhatsAppUrl(details?: {
  collegeName?: string
  numStudents?: number
  destination?: string
}): string {
  const phone = formatWhatsAppNumber()
  let text = `Hey Travel Tribe! 🎓 We want to organize a college/group trip.`
  if (details?.collegeName) text += `\n🏛️ College: ${details.collegeName}`
  if (details?.numStudents) text += `\n👥 Group Size: ${details.numStudents} students`
  if (details?.destination) text += `\n📍 Preferred Destination: ${details.destination}`
  text += `\n\nCould we get a custom group quote?`
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
}

/**
 * General support / inquiry chat URL
 */
export function getGeneralWhatsAppUrl(prompt?: string): string {
  const phone = formatWhatsAppNumber()
  const defaultText = `Hey Travel Tribe! 👋 I'm on your website and would love some help planning my next trip.`
  return `https://wa.me/${phone}?text=${encodeURIComponent(prompt || defaultText)}`
}
