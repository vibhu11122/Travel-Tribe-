import Link from 'next/link'
import { Compass } from 'lucide-react'

const STATS = [
  { value: '200+', label: 'Paying Travelers' },
  { value: '7+', label: 'Successful Trips' },
  { value: '₹5L+', label: 'Revenue Generated' },
]

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left panel — Brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-navy flex-col justify-between p-12 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 20% 80%, #E36F2C 0%, transparent 50%), radial-gradient(circle at 80% 20%, #4ABDE8 0%, transparent 50%)'
          }} />
        </div>

        <div className="relative">
          <Link href="/" className="flex items-center gap-2.5 mb-16">
            <div className="w-10 h-10 rounded-[10px] bg-orange flex items-center justify-center shadow-orange">
              <Compass className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-headline font-black text-xl text-white tracking-wide">
              <span className="text-orange">T</span>RAVEL·<span className="text-orange">T</span>RIBE
            </span>
          </Link>

          <div className="mb-8">
            <h2 className="text-4xl font-headline font-black text-white leading-tight mb-4">
              Travel Like a Local.<br />
              <span className="text-orange">Not Like a Tourist.</span>
            </h2>
            <p className="text-white/70 text-lg leading-relaxed">
              Student-first trips, real local experiences, and a community that travels together.
            </p>
          </div>

          <div className="space-y-3">
            {[
              '✈️ Personalized itineraries built around you',
              '💰 Student-friendly pricing — always',
              '🤝 Community trips with like-minded travelers',
              '🧭 Trip captain with you throughout',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-white/80 text-sm font-semibold">
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="relative">
          <div className="grid grid-cols-3 gap-4">
            {STATS.map((s) => (
              <div key={s.label} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <div className="text-2xl font-headline font-black text-orange">{s.value}</div>
                <div className="text-white/60 text-xs mt-1">{s.label}</div>
              </div>
            ))}
          </div>
          <p className="text-white/30 text-xs mt-4 text-center">
            Real revenue. Real travelers. Real trips.
          </p>
        </div>
      </div>

      {/* Right panel — Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 bg-cream">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8 justify-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-[10px] bg-orange flex items-center justify-center">
                <Compass className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-headline font-black text-lg text-navy tracking-wide">
                <span className="text-orange">T</span>RAVEL·<span className="text-orange">T</span>RIBE
              </span>
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
