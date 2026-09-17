'use client'

import { useState } from 'react'
import Navbar from '@/components/common/Navbar'
import Footer from '@/components/common/Footer'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Loader2, MapPin, Globe, Zap, Users, Gift, ArrowRight } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { cn } from '@/lib/utils/format'

const DESTINATIONS = ['Himachal Pradesh', 'Uttarakhand', 'Rajasthan', 'Madhya Pradesh', 'Northeast India', 'Not Sure Yet']

const BENEFITS = [
  { icon: Zap, title: 'Early Access', desc: 'Get notified about new trips before anyone else.' },
  { icon: Gift, title: 'Exclusive Deals', desc: 'Community members get exclusive pricing and offers.' },
  { icon: Users, title: 'Community Updates', desc: 'Stay connected with the growing Travel Tribe community.' },
  { icon: Globe, title: 'Trip Planning Support', desc: 'Our team helps you plan even before you book.' },
]

const waitlistSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().optional(),
  college: z.string().optional(),
  city: z.string().optional(),
  interested_destination: z.string().optional(),
})
type WaitlistForm = z.infer<typeof waitlistSchema>

export default function JoinTheTribePage() {
  const [submitted, setSubmitted] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<WaitlistForm>({
    resolver: zodResolver(waitlistSchema),
  })

  async function onSubmit(data: WaitlistForm) {
    try {
      await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
    } catch {}
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      {/* Hero */}
      <div className="pt-20 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {['🌍', '✈️', '🏔', '🎒', '🌊', '🏜'].map((emoji, i) => (
            <motion.div key={i} className="absolute text-4xl opacity-10"
              style={{ top: `${15 + i * 12}%`, left: `${5 + i * 15}%` }}
              animate={{ y: [0, -10, 0] }} transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5 }}>
              {emoji}
            </motion.div>
          ))}
        </div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="text-6xl mb-4">🌍</div>
            <h1 className="text-5xl sm:text-6xl font-headline font-black text-white leading-tight mb-4">
              Join the <span className="text-orange">Tribe.</span>
            </h1>
            <p className="text-white/70 text-lg mb-6 max-w-xl mx-auto leading-relaxed">
              Be the first to know about new trips, exclusive community deals, and adventures from across India.
              200+ travelers have already joined.
            </p>
            <div className="flex items-center justify-center gap-2 text-white/50 text-sm">
              <div className="flex -space-x-2">
                {['JY', 'RK', 'SM', 'AP', 'VG'].map((init) => (
                  <div key={init} className="w-8 h-8 rounded-full bg-orange/50 flex items-center justify-center text-xs font-bold text-white border-2 border-navy">
                    {init}
                  </div>
                ))}
              </div>
              <span>200+ travelers already in the tribe</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Form + Benefits */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Form */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-lg p-12 shadow-card text-center border border-navy/5">
                  <div className="text-7xl mb-4">🌍</div>
                  <h2 className="text-3xl font-headline font-black text-navy mb-3">
                    You're officially on the Tribe list!
                  </h2>
                  <p className="text-navy/60 text-lg mb-6">Welcome to the Travel Tribe family. Get ready for adventures.</p>
                  <div className="space-y-2 text-left max-w-xs mx-auto">
                    {['Watch your inbox for trip launches', "We'll never spam you (ever)", 'Share this with your travel crew'].map((step, i) => (
                      <div key={i} className="flex items-center gap-3 text-navy/70 text-sm">
                        <CheckCircle className="w-4 h-4 text-forest flex-shrink-0" />
                        {step}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h2 className="text-2xl font-headline font-black text-navy mb-2">Join the Waitlist</h2>
                  <p className="text-navy/60 mb-6">Free to join. No commitment. Just good trips ahead.</p>
                  <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg p-6 shadow-card border border-navy/5 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-navy mb-1">Name *</label>
                        <input {...register('name')}
                          className={cn('w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/30',
                            errors.name ? 'border-red-400' : 'border-navy/20')}
                          placeholder="Your name" />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-navy mb-1">Phone</label>
                        <input {...register('phone')} type="tel"
                          className="w-full px-4 py-3 border border-navy/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/30"
                          placeholder="Optional" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-navy mb-1">Email *</label>
                      <input {...register('email')} type="email"
                        className={cn('w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/30',
                          errors.email ? 'border-red-400' : 'border-navy/20')}
                        placeholder="you@email.com" />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-navy mb-1">College</label>
                        <input {...register('college')}
                          className="w-full px-4 py-3 border border-navy/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/30"
                          placeholder="Your college" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-navy mb-1">City</label>
                        <input {...register('city')}
                          className="w-full px-4 py-3 border border-navy/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/30"
                          placeholder="Your city" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-navy mb-2">Interested Destination</label>
                      <div className="flex flex-wrap gap-2">
                        {DESTINATIONS.map(dest => (
                          <label key={dest}
                            className="flex items-center gap-2 px-3 py-1.5 bg-cream-dark rounded-pill text-sm font-semibold text-navy cursor-pointer hover:bg-cream-muted transition-colors">
                            <input {...register('interested_destination')} type="radio" value={dest} className="accent-orange" />
                            {dest}
                          </label>
                        ))}
                      </div>
                    </div>
                    <button type="submit" disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 bg-orange text-white font-bold py-4 rounded-pill hover:bg-orange-600 transition-colors shadow-orange disabled:opacity-70 text-lg">
                      {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                      {isSubmitting ? 'Joining...' : 'Join the Tribe 🌍'}
                    </button>
                    <p className="text-center text-navy/40 text-xs">No spam. Just trips. Unsubscribe anytime.</p>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Benefits */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-headline font-black text-navy text-lg mb-4">What You Get</h3>
            {BENEFITS.map((b) => (
              <div key={b.title} className="flex items-start gap-4 bg-white rounded-lg p-4 shadow-card border border-navy/5">
                <div className="w-10 h-10 rounded-full bg-orange/10 flex items-center justify-center flex-shrink-0">
                  <b.icon className="w-5 h-5 text-orange" />
                </div>
                <div>
                  <p className="font-bold text-navy">{b.title}</p>
                  <p className="text-navy/60 text-sm">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
