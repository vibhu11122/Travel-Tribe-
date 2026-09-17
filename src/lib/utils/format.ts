/**
 * Format a price in INR (Indian Rupees) with ₹ symbol
 */
export function formatPrice(amount: number, compact = false): string {
  if (compact) {
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`
  }
  return `₹${amount.toLocaleString('en-IN')}`
}

/**
 * Format a date range for trip display
 */
export function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const startMonth = start.toLocaleDateString('en-IN', { month: 'short' })
  const endMonth = end.toLocaleDateString('en-IN', { month: 'short' })
  const startDay = start.getDate()
  const endDay = end.getDate()
  const year = end.getFullYear()

  if (startMonth === endMonth) {
    return `${startDay}–${endDay} ${startMonth} ${year}`
  }
  return `${startDay} ${startMonth} – ${endDay} ${endMonth} ${year}`
}

/**
 * Format duration as "X Days · Y Nights"
 */
export function formatDuration(days: number, nights: number): string {
  return `${days} Days · ${nights} Nights`
}

/**
 * Generate a booking ID
 */
export function generateBookingId(): string {
  const prefix = 'TT'
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}${timestamp}${random}`
}

/**
 * Calculate discounted price
 */
export function getDiscountPercent(original: number, current: number): number {
  if (!original || original <= current) return 0
  return Math.round(((original - current) / original) * 100)
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trimEnd() + '...'
}

/**
 * Get WhatsApp share URL
 */
export function getWhatsAppShareUrl(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`
}

/**
 * Get trip share text
 */
export function getTripShareText(tripTitle: string, destination: string, url: string): string {
  return `🔥 I'm checking out this Travel Tribe trip to ${destination}: "${tripTitle}". Want to join? ${url}`
}

/**
 * Slugify a string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

/**
 * Capitalize first letter
 */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/**
 * Get difficulty color
 */
export function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'easy': return 'text-forest bg-forest/10'
    case 'moderate': return 'text-gold bg-gold/10'
    case 'challenging': return 'text-orange bg-orange/10'
    case 'extreme': return 'text-red-600 bg-red-50'
    default: return 'text-navy bg-navy/10'
  }
}

/**
 * Get trip type emoji
 */
export function getTripTypeEmoji(type: string): string {
  const map: Record<string, string> = {
    adventure: '🔥',
    mountains: '🏔',
    beaches: '🏖',
    culture: '🏛',
    food: '🍜',
    nature: '🌿',
    photography: '📸',
    relaxation: '😌',
    backpacking: '🎒',
    nightlife: '🎉',
    community: '🤝',
    college: '🎓',
  }
  return map[type] ?? '✈️'
}

/**
 * Format number with Indian number system commas
 */
export function formatIndianNumber(num: number): string {
  return num.toLocaleString('en-IN')
}

/**
 * cn utility for conditional class names
 */
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
