'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils/format'

const TABS = ['Upcoming', 'Past']

export default function MyTripsPage() {
  const [activeTab, setActiveTab] = useState('Upcoming')

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 bg-white rounded-lg p-1 shadow-card border border-navy/5 w-fit">
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={cn('px-5 py-2.5 rounded-md text-sm font-bold transition-all',
              activeTab === tab ? 'bg-navy text-white' : 'text-navy/60 hover:text-navy')}>
            {tab}
          </button>
        ))}
      </div>

      {/* Empty state */}
      <div className="bg-white rounded-lg p-12 shadow-card border border-navy/5 text-center">
        <div className="text-6xl mb-4">{activeTab === 'Upcoming' ? '✈️' : '📍'}</div>
        <h3 className="font-headline font-black text-navy text-xl mb-2">
          {activeTab === 'Upcoming' ? "No upcoming trips yet." : "No past trips recorded."}
        </h3>
        <p className="text-navy/60 mb-6 max-w-xs mx-auto">
          {activeTab === 'Upcoming'
            ? "Your calendar is wide open. Let's get something on it."
            : "Your adventure history will show up here after your first trip."}
        </p>
        {activeTab === 'Upcoming' && (
          <Link href="/trips"
            className="inline-flex items-center gap-2 bg-orange text-white font-bold px-6 py-3 rounded-pill hover:bg-orange-600 transition-colors">
            Browse Trips <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  )
}
