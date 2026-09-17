import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Calendar, ArrowRight } from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils/format'
import type { Destination } from '@/lib/types'

interface DestinationCardProps {
  destination: Destination
  variant?: 'default' | 'compact'
  className?: string
}

const CATEGORY_LABELS: Record<string, { label: string; emoji: string }> = {
  mountains:    { label: 'Mountains',    emoji: '🏔' },
  beaches:      { label: 'Beaches',      emoji: '🏖' },
  desert:       { label: 'Desert',       emoji: '🏜' },
  nature:       { label: 'Nature',       emoji: '🌿' },
  culture:      { label: 'Culture',      emoji: '🏛' },
  adventure:    { label: 'Adventure',    emoji: '🔥' },
  backpacking:  { label: 'Backpacking',  emoji: '🎒' },
}

export default function DestinationCard({
  destination,
  variant = 'default',
  className,
}: DestinationCardProps) {
  const {
    name,
    slug,
    state,
    region,
    cover_image,
    category,
    best_time,
    starting_price,
    popular_activities,
  } = destination

  const displayCategories = category.slice(0, 2)
  const displayActivities = popular_activities.slice(0, 3)

  return (
    <div
      className={cn(
        'group relative flex flex-col rounded-2xl overflow-hidden bg-white border border-navy/8 shadow-sm',
        'transition-shadow duration-300 hover:shadow-xl hover:shadow-navy/10',
        className,
      )}
    >
      {/* ── Image Block ── */}
      <div
        className={cn(
          'relative overflow-hidden',
          variant === 'compact' ? 'h-[200px]' : 'h-[260px]',
        )}
      >
        {/* Zoom on hover */}
        <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
          <Image
            src={cover_image || '/placeholder-destination.jpg'}
            alt={`${name}, ${state}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
            className="object-cover"
          />
        </div>

        {/* Deep gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/30 to-transparent" />

        {/* Top: Category badges */}
        {displayCategories.length > 0 && (
          <div className="absolute top-3 left-3 z-10 flex gap-2">
            {displayCategories.map((cat) => {
              const meta = CATEGORY_LABELS[cat]
              if (!meta) return null
              return (
                <span
                  key={cat}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-semibold font-[var(--font-nunito)]"
                >
                  <span>{meta.emoji}</span>
                  {meta.label}
                </span>
              )
            })}
          </div>
        )}

        {/* Starting price badge — top right */}
        <div className="absolute top-3 right-3 z-10">
          <span className="inline-flex flex-col items-center px-3 py-1.5 rounded-xl bg-orange text-white shadow-lg shadow-orange/30">
            <span className="text-[10px] font-medium font-[var(--font-nunito)] leading-none opacity-90">
              from
            </span>
            <span className="text-sm font-bold font-[var(--font-outfit)] leading-tight">
              {formatPrice(starting_price, true)}
            </span>
          </span>
        </div>

        {/* Bottom overlay: Name + location */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
          <h3
            className={cn(
              'font-[var(--font-outfit)] font-bold text-white leading-tight',
              variant === 'compact' ? 'text-xl' : 'text-2xl',
            )}
          >
            {name}
          </h3>

          <div className="flex items-center gap-1.5 mt-1">
            <MapPin className="w-3.5 h-3.5 text-white/70 flex-shrink-0" />
            <span className="text-white/80 text-xs font-[var(--font-nunito)]">
              {state} · {region}
            </span>
          </div>
        </div>
      </div>

      {/* ── Content Block ── */}
      <div className="flex flex-col flex-1 p-4">
        {/* Best time to visit */}
        <div className="flex items-start gap-2 mb-3 pb-3 border-b border-navy/6">
          <Calendar className="w-3.5 h-3.5 text-orange mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-[10px] font-semibold text-navy/50 uppercase tracking-wide font-[var(--font-nunito)]">
              Best time to visit
            </p>
            <p className="text-navy/80 text-xs font-medium font-[var(--font-nunito)] mt-0.5">
              {best_time}
            </p>
          </div>
        </div>

        {/* Popular activities */}
        {displayActivities.length > 0 && (
          <div className="mb-4">
            <p className="text-[10px] font-semibold text-navy/50 uppercase tracking-wide font-[var(--font-nunito)] mb-2">
              Popular activities
            </p>
            <div className="flex flex-wrap gap-1.5">
              {displayActivities.map((activity) => (
                <span
                  key={activity}
                  className="px-2.5 py-1 rounded-full bg-navy/5 text-navy/70 text-xs font-medium font-[var(--font-nunito)]"
                >
                  {activity}
                </span>
              ))}
              {popular_activities.length > 3 && (
                <span className="px-2.5 py-1 rounded-full bg-navy/5 text-navy/50 text-xs font-medium font-[var(--font-nunito)]">
                  +{popular_activities.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex-1" />

        {/* CTA */}
        <Link
          href={`/destinations/${slug}`}
          className="group/btn flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-navy text-white text-sm font-semibold font-[var(--font-nunito)] transition-all duration-200 hover:bg-navy/90 hover:gap-3"
        >
          Explore Trips
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
        </Link>
      </div>
    </div>
  )
}
