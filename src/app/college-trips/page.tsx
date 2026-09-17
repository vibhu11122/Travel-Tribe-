'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Navbar from '@/components/common/Navbar'
import Footer from '@/components/common/Footer'
import {
  GraduationCap, Users, Star, ArrowRight, CheckCircle, Loader2,
  Calendar, MapPin, Phone, Mail, Building2, IndianRupee, MessageSquare
} from 'lucide-react'
import { cn } from '@/lib/utils/format'

function FadeIn({ children, delay = 0, className = '' }: {
  children: React.ReactNode; delay?: number; className?: string
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px 0px' })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 28 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }} className={className}>
      {children}
    </motion.div>
  )
}

const TRIP_TYPES = [
  'College Batch Trip', 'Student Group Trip', 'Department Trip',
  'Society / Club Trip', 'MBA / College Tour', 'Alumni Trip', 'Faculty Trip',
]

const DESTINATIONS = [
  'Himachal Pradesh', 'Uttarakhand', 'Rajasthan', 'Madhya Pradesh',
  'Uttar Pradesh', 'Goa', 'Kerala', 'Northeast India', 'Other',
]

const BUDGET_RANGES = [
  'Under ₹3,000/person', '₹3,000–₹5,000/person',
  '₹5,000–₹8,000/person', '₹8,000–₹12,000/person', '₹12,000+/person',
]

const WHY_TRAVEL_TRIBE = [
  { icon: '✅', title: 'End-to-End Management', desc: 'Transport, stay, food, activities — we handle everything.' },
  { icon: '💰', title: 'Budget Customization', desc: 'We work within your group\'s actual budget, not a preset package.' },
  { icon: '🧭', title: 'Dedicated Trip Captain', desc: 'A Travel Tribe representative with your group throughout the trip.' },
  { icon: '🗺', title: 'Flexible Itineraries', desc: 'Every college group is different. Your trip should reflect that.' },
  { icon: '🎓', title: 'College-Verified Pricing', desc: 'Pricing structures designed for student groups and batch trips.' },
]

const collegeLeadSchema = z.object({
  college_name: z.string().min(2, 'College name is required'),
  contact_person: z.string().min(2, 'Contact name is required'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  email: z.string().email('Enter a valid email address'),
  num_students: z.coerce.number().min(5, 'Minimum 5 students'),
  preferred_destination: z.string().optional(),
  approximate_budget: z.string().optional(),
  preferred_dates: z.string().optional(),
  num_days: z.coerce.number().optional(),
  special_requirements: z.string().optional(),
})

type CollegeLeadForm = z.infer<typeof collegeLeadSchema>

export default function CollegeTripsPage() {
  const [submitted, setSubmitted] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CollegeLeadForm>({
    resolver: zodResolver(collegeLeadSchema),
  })

  async function onSubmit(formData: CollegeLeadForm) {
    try {
      await fetch('/api/college-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
    } catch {}
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      {/* Hero */}
      <div className="pt-20 bg-navy relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <FadeIn>
              <p className="text-orange font-headline font-bold text-sm uppercase tracking-widest mb-4">College & Group Trips</p>
              <h1 className="text-5xl sm:text-6xl font-headline font-black text-white leading-tight mb-6">
                Your College.<br />Your Tribe.<br />
                <span className="text-orange">Your Trip.</span>
              </h1>
              <p className="text-white/70 text-lg leading-relaxed mb-8">
                Travel Tribe specializes in organizing college batch trips, society trips, department tours, and group adventures — designed around your group's budget, dates, and vibe.
              </p>
              <a href="#get-quote"
                className="inline-flex items-center gap-2 bg-orange text-white font-bold px-8 py-4 rounded-pill hover:bg-orange-600 transition-colors shadow-orange">
                Get a Group Quote <ArrowRight className="w-5 h-5" />
              </a>
            </FadeIn>

            {/* Stats */}
            <FadeIn delay={0.2}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: '58', label: 'Travelers in one trip', emoji: '✈️' },
                  { value: '52+', label: 'MBA students on one batch trip', emoji: '🎓' },
                  { value: '20+', label: 'Average group size', emoji: '👥' },
                  { value: '7+', label: 'College trips executed', emoji: '🏆' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-lg p-5 border border-white/10">
                    <div className="text-3xl mb-1">{stat.emoji}</div>
                    <div className="text-3xl font-headline font-black text-orange">{stat.value}</div>
                    <div className="text-white/70 text-sm mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* Trip types */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <FadeIn className="text-center mb-10">
          <h2 className="text-3xl font-headline font-black text-navy mb-3">What We Organize</h2>
          <p className="text-navy/60">From intimate department outings to 60-person batch trips</p>
        </FadeIn>
        <FadeIn>
          <div className="flex flex-wrap justify-center gap-3">
            {TRIP_TYPES.map((t) => (
              <span key={t} className="flex items-center gap-2 px-5 py-2.5 bg-white rounded-pill border border-navy/10 shadow-card text-navy font-semibold text-sm">
                <GraduationCap className="w-4 h-4 text-orange" /> {t}
              </span>
            ))}
          </div>
        </FadeIn>
      </div>

      {/* Why Travel Tribe */}
      <div className="bg-cream-dark py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-10">
            <h2 className="text-3xl font-headline font-black text-navy mb-3">Why Travel Tribe for Your Group?</h2>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {WHY_TRAVEL_TRIBE.map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.08}>
                <div className="bg-white rounded-lg p-5 shadow-card border border-navy/5 hover:shadow-card-hover transition-shadow">
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h3 className="font-headline font-black text-navy mb-1">{item.title}</h3>
                  <p className="text-navy/60 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>

      {/* The 58-traveler story */}
      <div className="bg-navy py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <FadeIn>
            <div className="text-6xl mb-6">🏆</div>
            <h2 className="text-3xl font-headline font-black text-white mb-4">Our Biggest Trip Yet</h2>
            <p className="text-white/80 text-lg leading-relaxed mb-6">
              <span className="text-orange font-black">58 travelers. 1 trip.</span> Including 52 MBA students
              and 6 faculty members — one of the largest group trips Travel Tribe has executed.
              End-to-end planning, zero chaos, 100% memories.
            </p>
            <p className="text-white/50 text-sm italic">
              "Founders in the field, not just the deck." — Jay Yadav, Trip Captain
            </p>
          </FadeIn>
        </div>
      </div>

      {/* Lead form */}
      <div id="get-quote" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <FadeIn className="text-center mb-10">
          <h2 className="text-3xl font-headline font-black text-navy mb-3">Plan Your College Trip</h2>
          <p className="text-navy/60">Fill this form and our team will get back to you within 24 hours with a customized quote.</p>
        </FadeIn>

        {submitted ? (
          <FadeIn>
            <div className="bg-white rounded-lg p-12 shadow-card border border-navy/5 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-headline font-black text-navy mb-3">Your request is in!</h3>
              <p className="text-navy/60 text-lg">We'll get back to you within 24 hours with a customized group quote. 📞</p>
              <p className="text-navy/40 text-sm mt-4">In the meantime, explore our existing trips for inspiration.</p>
            </div>
          </FadeIn>
        ) : (
          <FadeIn>
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg p-8 shadow-card border border-navy/5 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* College Name */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold text-navy mb-1.5 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-orange" /> College / Institution Name *
                  </label>
                  <input {...register('college_name')}
                    className={cn('w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/30 bg-cream/50',
                      errors.college_name ? 'border-red-400' : 'border-navy/20')}
                    placeholder="e.g. IIM Bangalore, Delhi University" />
                  {errors.college_name && <p className="text-red-500 text-xs mt-1">{errors.college_name.message}</p>}
                </div>

                {/* Contact Person */}
                <div>
                  <label className="block text-sm font-bold text-navy mb-1.5">Contact Person *</label>
                  <input {...register('contact_person')}
                    className={cn('w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/30 bg-cream/50',
                      errors.contact_person ? 'border-red-400' : 'border-navy/20')}
                    placeholder="Your name" />
                  {errors.contact_person && <p className="text-red-500 text-xs mt-1">{errors.contact_person.message}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-bold text-navy mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-orange" /> Phone *
                  </label>
                  <input {...register('phone')} type="tel"
                    className={cn('w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/30 bg-cream/50',
                      errors.phone ? 'border-red-400' : 'border-navy/20')}
                    placeholder="10-digit mobile number" />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-bold text-navy mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-orange" /> Email *
                  </label>
                  <input {...register('email')} type="email"
                    className={cn('w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/30 bg-cream/50',
                      errors.email ? 'border-red-400' : 'border-navy/20')}
                    placeholder="you@college.edu" />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>

                {/* Students */}
                <div>
                  <label className="block text-sm font-bold text-navy mb-1.5 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-orange" /> Number of Students *
                  </label>
                  <input {...register('num_students')} type="number" min="5"
                    className={cn('w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/30 bg-cream/50',
                      errors.num_students ? 'border-red-400' : 'border-navy/20')}
                    placeholder="Min. 5" />
                  {errors.num_students && <p className="text-red-500 text-xs mt-1">{errors.num_students.message}</p>}
                </div>

                {/* Destination */}
                <div>
                  <label className="block text-sm font-bold text-navy mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-orange" /> Preferred Destination
                  </label>
                  <select {...register('preferred_destination')}
                    className="w-full px-4 py-3 border border-navy/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/30 bg-cream/50">
                    <option value="">Select destination...</option>
                    {DESTINATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                {/* Budget */}
                <div>
                  <label className="block text-sm font-bold text-navy mb-1.5 flex items-center gap-1.5">
                    <IndianRupee className="w-4 h-4 text-orange" /> Approximate Budget
                  </label>
                  <select {...register('approximate_budget')}
                    className="w-full px-4 py-3 border border-navy/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/30 bg-cream/50">
                    <option value="">Select budget range...</option>
                    {BUDGET_RANGES.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>

                {/* Dates */}
                <div>
                  <label className="block text-sm font-bold text-navy mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-orange" /> Preferred Dates
                  </label>
                  <input {...register('preferred_dates')} type="text"
                    className="w-full px-4 py-3 border border-navy/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/30 bg-cream/50"
                    placeholder="e.g. Dec 20–25, or flexible" />
                </div>

                {/* Days */}
                <div>
                  <label className="block text-sm font-bold text-navy mb-1.5">Number of Days</label>
                  <input {...register('num_days')} type="number" min="1"
                    className="w-full px-4 py-3 border border-navy/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/30 bg-cream/50"
                    placeholder="e.g. 4" />
                </div>

                {/* Special requirements */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold text-navy mb-1.5 flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-orange" /> Special Requirements
                  </label>
                  <textarea {...register('special_requirements')} rows={3}
                    className="w-full px-4 py-3 border border-navy/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/30 bg-cream/50 resize-none"
                    placeholder="Dietary restrictions, accessibility needs, specific activities, or anything else..." />
                </div>
              </div>

              <button type="submit" disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-orange text-white font-bold py-4 px-8 rounded-pill hover:bg-orange-600 transition-colors shadow-orange disabled:opacity-70">
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                {isSubmitting ? 'Sending...' : 'Get My Group Quote 🚀'}
              </button>
              <p className="text-center text-navy/40 text-xs">We reply within 24 hours. No spam, ever.</p>
            </form>
          </FadeIn>
        )}
      </div>

      <Footer />
    </div>
  )
}
