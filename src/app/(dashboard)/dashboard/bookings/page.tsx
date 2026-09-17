import Link from 'next/link'
import { ArrowRight, Ticket } from 'lucide-react'
import { cn } from '@/lib/utils/format'

const MOCK_BOOKINGS = [
  {
    id: 'TT-DEMO01',
    trip: 'Manali Adventure',
    destination: 'Manali, Himachal Pradesh',
    dates: 'Dec 20–25, 2026',
    travelers: 2,
    amount: '₹9,998',
    status: 'Confirmed' as const,
  },
]

const STATUS_COLORS: Record<string, string> = {
  Confirmed: 'bg-green-100 text-green-700',
  Pending: 'bg-yellow-100 text-yellow-700',
  Completed: 'bg-navy/10 text-navy',
  Cancelled: 'bg-red-100 text-red-600',
}

export default function BookingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-navy/60 text-sm">Your booking history</p>
        <Link href="/trips" className="text-orange text-sm font-semibold hover:underline flex items-center gap-1">
          Find a trip <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {MOCK_BOOKINGS.length > 0 ? (
        <div className="space-y-3">
          {MOCK_BOOKINGS.map(booking => (
            <div key={booking.id} className="bg-white rounded-lg p-5 shadow-card border border-navy/5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <h3 className="font-headline font-black text-navy">{booking.trip}</h3>
                  <p className="text-navy/60 text-sm">{booking.destination} · {booking.dates}</p>
                </div>
                <span className={cn('px-3 py-1 rounded-pill text-xs font-bold', STATUS_COLORS[booking.status])}>
                  {booking.status}
                </span>
              </div>
              <div className="flex flex-wrap gap-4 text-sm border-t border-navy/5 pt-3">
                <span className="text-navy/60">Booking ID: <span className="font-bold text-navy">{booking.id}</span></span>
                <span className="text-navy/60">Travelers: <span className="font-bold text-navy">{booking.travelers}</span></span>
                <span className="text-navy/60">Total: <span className="font-bold text-orange">{booking.amount}</span></span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg p-12 shadow-card border border-navy/5 text-center">
          <Ticket className="w-12 h-12 text-navy/20 mx-auto mb-4" />
          <h3 className="font-headline font-black text-navy text-xl mb-2">No bookings yet.</h3>
          <p className="text-navy/60 mb-6">Your booking history will appear here after your first trip.</p>
          <Link href="/trips"
            className="inline-flex items-center gap-2 bg-orange text-white font-bold px-6 py-3 rounded-pill hover:bg-orange-600 transition-colors">
            Explore Trips <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  )
}
