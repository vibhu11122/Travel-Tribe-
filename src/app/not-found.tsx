import Link from 'next/link'
import { Compass, ArrowRight, Map } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4 text-center">
      <div className="max-w-lg">
        <div className="text-8xl mb-6">🗺️</div>
        <div className="mb-2">
          <span className="text-orange font-headline font-black text-8xl opacity-20">404</span>
        </div>
        <h1 className="text-3xl font-headline font-black text-navy mb-4">
          Looks like you've gone off the trail.
        </h1>
        <p className="text-navy/60 text-lg mb-10 leading-relaxed">
          The page you're looking for doesn't exist, or it may have moved. Don't worry — the tribe is still here.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/"
            className="flex items-center justify-center gap-2 bg-orange text-white font-bold px-8 py-3.5 rounded-pill hover:bg-orange-600 transition-colors shadow-orange">
            <Compass className="w-4 h-4" /> Back to Home
          </Link>
          <Link href="/trips"
            className="flex items-center justify-center gap-2 bg-navy text-white font-bold px-8 py-3.5 rounded-pill hover:bg-navy-700 transition-colors">
            <Map className="w-4 h-4" /> Explore Trips
          </Link>
        </div>
      </div>
    </div>
  )
}
