import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Map, Ticket, Heart, Send, Compass, ArrowRight } from 'lucide-react'

const QUICK_ACTIONS = [
  { label: 'Explore Trips', href: '/trips', icon: Compass, color: 'bg-orange', desc: 'Find your next adventure' },
  { label: 'Build My Trip', href: '/build-your-trip', icon: Map, color: 'bg-navy', desc: 'Create a custom itinerary' },
  { label: 'College Trip', href: '/college-trips', icon: Send, color: 'bg-forest', desc: 'Plan a group trip' },
]

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }))

  const name = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Traveler'

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div>
        <h2 className="text-2xl font-headline font-black text-navy">
          Hey, {name}! 👋
        </h2>
        <p className="text-navy/60 mt-1">Ready for your next adventure?</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Upcoming Trips', value: '0', icon: '✈️' },
          { label: 'Past Trips', value: '0', icon: '📍' },
          { label: 'Saved Trips', value: '0', icon: '❤️' },
          { label: 'Trip Requests', value: '0', icon: '📋' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg p-4 shadow-card border border-navy/5 text-center">
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="text-2xl font-headline font-black text-navy">{stat.value}</div>
            <div className="text-xs text-navy/50 font-semibold mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h3 className="font-headline font-black text-navy mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {QUICK_ACTIONS.map((action) => (
            <Link key={action.label} href={action.href}
              className="flex items-center gap-4 bg-white rounded-lg p-5 shadow-card border border-navy/5 hover:shadow-card-hover transition-all group">
              <div className={`w-12 h-12 rounded-full ${action.color} flex items-center justify-center flex-shrink-0`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-navy">{action.label}</p>
                <p className="text-navy/50 text-xs">{action.desc}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-navy/30 group-hover:text-orange transition-colors" />
            </Link>
          ))}
        </div>
      </div>

      {/* Upcoming trips — empty state */}
      <div>
        <h3 className="font-headline font-black text-navy mb-4">Upcoming Trips</h3>
        <div className="bg-white rounded-lg p-10 shadow-card border border-navy/5 text-center">
          <div className="text-5xl mb-3">🗓️</div>
          <h4 className="font-headline font-black text-navy text-lg mb-2">
            Your calendar looks suspiciously empty.
          </h4>
          <p className="text-navy/60 text-sm mb-6">
            You haven't joined any upcoming trips yet. Let's fix that.
          </p>
          <Link href="/trips"
            className="inline-flex items-center gap-2 bg-orange text-white font-bold px-6 py-3 rounded-pill hover:bg-orange-600 transition-colors">
            Find an Adventure <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Saved trips — empty state */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-headline font-black text-navy">Saved Trips</h3>
          <Link href="/dashboard/saved" className="text-orange text-sm font-semibold hover:underline">View all</Link>
        </div>
        <div className="bg-white rounded-lg p-8 shadow-card border border-navy/5 text-center">
          <div className="text-4xl mb-3">❤️</div>
          <p className="text-navy/60 text-sm mb-4">Your next adventure hasn't been saved yet.</p>
          <Link href="/trips" className="text-orange font-bold text-sm hover:underline">Explore Trips →</Link>
        </div>
      </div>

      {/* Referral card */}
      <div className="bg-navy rounded-lg p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-headline font-black text-white text-lg mb-1">Invite Your Tribe 🌍</h3>
          <p className="text-white/60 text-sm">Share Travel Tribe with friends and grow the community.</p>
        </div>
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({ title: 'Travel Tribe', text: 'Check out Travel Tribe — student-first travel in India!', url: 'https://traveltribe.in' })
            } else {
              navigator.clipboard.writeText('https://traveltribe.in')
              alert('Link copied!')
            }
          }}
          className="flex-shrink-0 flex items-center gap-2 bg-orange text-white font-bold px-6 py-3 rounded-pill hover:bg-orange-600 transition-colors"
        >
          Share Invite Link
        </button>
      </div>
    </div>
  )
}
