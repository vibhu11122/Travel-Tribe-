'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, Users, Clock, MapPin, Zap, MessageCircle } from 'lucide-react'
import { cn, formatPrice, formatDuration, getTripTypeEmoji, getDifficultyColor, formatDateRange } from '@/lib/utils/format'
import { getTripWhatsAppUrl } from '@/lib/whatsapp/client'
import type { Trip } from '@/lib/types'

interface TripCardProps {
  trip: Trip
  variant?: 'default' | 'compact' | 'featured'
  showSaveButton?: boolean
  className?: string
}

const IMAGE_HEIGHTS: Record<NonNullable<TripCardProps['variant']>, string> = {
  default: 'h-[240px]',
  compact: 'h-[180px]',
  featured: 'h-[300px]',
}

export default function TripCard({
  trip,
  variant = 'default',
  showSaveButton = true,
  className,
}: TripCardProps) {
  const [saved, setSaved] = useState(false)

  const {
    slug,
    title,
    destination,
    description,
    cover_image,
    duration_days,
    duration_nights,
    price,
    price_original,
    capacity,
    available_slots,
    trip_type,
    difficulty,
    tags,
    is_community,
    is_featured,
  } = trip

  const spotsLeft = available_slots
  const isAlmostFull = spotsLeft > 0 && spotsLeft <= 5
  const isFull = spotsLeft === 0

  const tripTypeLabel = trip_type.charAt(0).toUpperCase() + trip_type.slice(1)

  const socialProof = is_community
    ? { label: 'Community favourite', icon: '🤝' }
    : is_featured
    ? { label: 'Popular with students', icon: '⭐' }
    : null

  const discountPercent =
    price_original && price_original > price
      ? Math.round(((price_original - price) / price_original) * 100)
      : 0

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(27,58,66,0.15)' }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={cn(
        'group relative flex flex-col rounded-2xl overflow-hidden bg-white border border-navy/8 shadow-sm',
        variant === 'featured' && 'md:flex-row md:h-[300px]',
        className,
      )}
    >
      {/* ── Image Block ── */}
      <div
        className={cn(
          'relative overflow-hidden flex-shrink-0',
          IMAGE_HEIGHTS[variant],
          variant === 'featured' && 'md:w-[45%] md:h-full',
        )}
      >
        {/* Zoom container */}
        <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
          <Image
            src={cover_image || '/placeholder-trip.jpg'}
            alt={`${destination} — ${title}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
            className="object-cover"
            priority={is_featured}
          />
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent" />

        {/* Top-left: Trip type badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-semibold font-[var(--font-nunito)]">
            <span>{getTripTypeEmoji(trip_type)}</span>
            {tripTypeLabel}
          </span>
        </div>

        {/* Top-right: Save button */}
        {showSaveButton && (
          <button
            onClick={(e) => {
              e.preventDefault()
              setSaved((prev) => !prev)
            }}
            aria-label={saved ? 'Remove from saved' : 'Save trip'}
            className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center transition-all duration-200 hover:scale-110 hover:bg-white/30"
          >
            <Heart
              className={cn(
                'w-4 h-4 transition-colors duration-200',
                saved ? 'fill-orange text-orange' : 'fill-transparent text-white',
              )}
            />
          </button>
        )}

        {/* Bottom overlay: Destination name + meta */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
          {socialProof && variant !== 'compact' && (
            <div className="mb-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wide font-[var(--font-nunito)]">
                <span>{socialProof.icon}</span>
                {socialProof.label}
              </span>
            </div>
          )}

          <h3
            className={cn(
              'font-[var(--font-outfit)] font-bold text-white leading-tight mb-1',
              variant === 'compact' ? 'text-lg' : 'text-xl',
              variant === 'featured' ? 'md:text-2xl' : '',
            )}
          >
            {destination.split(',')[0]}
          </h3>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-white/80 text-xs font-[var(--font-nunito)]">
              <Clock className="w-3 h-3" />
              {formatDuration(duration_days, duration_nights)}
            </span>

            <div className="flex items-center gap-1.5">
              <span className="text-white font-bold text-sm font-[var(--font-outfit)]">
                {formatPrice(price)}
              </span>
              {price_original && discountPercent > 0 && (
                <span className="text-white/60 text-xs line-through font-[var(--font-nunito)]">
                  {formatPrice(price_original)}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="px-1.5 py-0.5 rounded bg-orange text-white text-[10px] font-bold">
                  -{discountPercent}%
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Content Block ── */}
      <div
        className={cn(
          'flex flex-col flex-1 p-4',
          variant === 'featured' && 'md:p-6',
        )}
      >
        {/* Trip title */}
        <p
          className={cn(
            'font-[var(--font-outfit)] font-semibold text-navy leading-snug mb-1',
            variant === 'compact' ? 'text-sm line-clamp-1' : 'text-base',
          )}
        >
          {title}
        </p>

        {/* Location */}
        <div className="flex items-center gap-1 mb-2">
          <MapPin className="w-3 h-3 text-navy/50 flex-shrink-0" />
          <span className="text-navy/60 text-xs font-[var(--font-nunito)] truncate">
            {destination}
          </span>
        </div>

        {/* Description */}
        {variant !== 'compact' && (
          <p className="text-navy/70 text-sm font-[var(--font-nunito)] line-clamp-2 mb-3 leading-relaxed">
            {description}
          </p>
        )}

        {/* Metadata row */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span
            className={cn(
              'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold font-[var(--font-nunito)]',
              getDifficultyColor(difficulty),
            )}
          >
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </span>

          <span className="inline-flex items-center gap-1 text-navy/60 text-xs font-[var(--font-nunito)]">
            <Users className="w-3 h-3" />
            {capacity} travellers
          </span>

          {isFull ? (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-red-50 text-red-600 text-xs font-semibold font-[var(--font-nunito)]">
              Sold out
            </span>
          ) : isAlmostFull ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange/10 text-orange text-xs font-bold font-[var(--font-nunito)]">
              <Zap className="w-3 h-3" />
              {spotsLeft} spot{spotsLeft === 1 ? '' : 's'} left!
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-navy/50 text-xs font-[var(--font-nunito)]">
              {spotsLeft} spots available
            </span>
          )}
        </div>

        {/* Tags */}
        {variant !== 'compact' && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-full bg-navy/5 text-navy/70 text-[11px] font-medium font-[var(--font-nunito)] capitalize"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex-1" />

        {/* CTA Buttons */}
        <div className="flex items-center gap-2 mt-1">
          <Link
            href={`/trips/${slug}`}
            className={cn(
              'flex-1 text-center py-2.5 rounded-xl border-2 border-navy text-navy text-sm font-semibold font-[var(--font-nunito)] transition-all duration-200 hover:bg-navy hover:text-white',
              variant === 'compact' && 'py-2 text-xs',
            )}
          >
            View Trip
          </Link>
          <a
            href={getTripWhatsAppUrl({
              tripTitle: title,
              destination,
              travelDate: trip.start_date && trip.end_date ? formatDateRange(trip.start_date, trip.end_date) : undefined,
              price,
              slug,
              intent: 'inquire',
            })}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-xl border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all flex items-center justify-center flex-shrink-0"
            title="Chat on WhatsApp"
            aria-label="Chat on WhatsApp"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
          </a>
          <Link
            href={`/book/${slug}`}
            className={cn(
              'flex-1 text-center py-2.5 rounded-xl bg-orange text-white text-sm font-semibold font-[var(--font-nunito)] transition-all duration-200 hover:bg-orange/90 shadow-sm shadow-orange/20',
              variant === 'compact' && 'py-2 text-xs',
              isFull && 'opacity-50 pointer-events-none',
            )}
          >
            {isFull ? 'Waitlist' : 'Join Trip'}
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
