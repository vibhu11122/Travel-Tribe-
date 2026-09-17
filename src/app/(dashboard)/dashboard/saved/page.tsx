import Link from 'next/link'
import { ArrowRight, Heart } from 'lucide-react'

export default function SavedPage() {
  return (
    <div>
      <div className="bg-white rounded-lg p-12 shadow-card border border-navy/5 text-center">
        <Heart className="w-12 h-12 text-navy/20 mx-auto mb-4" />
        <h3 className="font-headline font-black text-navy text-xl mb-2">
          Nothing saved yet.
        </h3>
        <p className="text-navy/60 mb-6 max-w-sm mx-auto">
          Hit the heart icon on any trip to save it here for later. Start exploring!
        </p>
        <Link href="/trips"
          className="inline-flex items-center gap-2 bg-orange text-white font-bold px-6 py-3 rounded-pill hover:bg-orange-600 transition-colors">
          Explore Trips <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
