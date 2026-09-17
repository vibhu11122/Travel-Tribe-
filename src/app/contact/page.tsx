'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/common/Navbar'
import Footer from '@/components/common/Footer'
import { MessageSquare, Mail, Instagram, Phone, Send, Loader2, CheckCircle, ArrowRight } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { cn } from '@/lib/utils/format'

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().optional(),
  subject: z.enum(['General Inquiry', 'Trip Planning', 'College Trip', 'Partnership', 'Other']),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})
type ContactForm = z.infer<typeof contactSchema>

const CONTACT_OPTIONS = [
  {
    icon: MessageSquare,
    title: 'WhatsApp',
    desc: 'Fastest way to reach us. Usually reply within an hour.',
    action: 'Chat on WhatsApp',
    href: 'https://wa.me/919599233810?text=Hey%20Travel%20Tribe!%20%F0%9F%91%8B%20I%20have%20an%20inquiry.',
    color: 'bg-[#25D366]',
    iconColor: 'text-white',
  },
  {
    icon: Mail,
    title: 'Email',
    desc: 'For detailed queries, partnerships, and formal requests.',
    action: 'hello@traveltribe.in',
    href: 'mailto:hello@traveltribe.in',
    color: 'bg-navy',
    iconColor: 'text-white',
  },
  {
    icon: Instagram,
    title: 'Instagram',
    desc: 'Follow us for trip updates, reels, and community stories.',
    action: '@traveltribe',
    href: 'https://instagram.com/traveltribe',
    color: 'bg-gradient-to-br from-purple-500 to-pink-500',
    iconColor: 'text-white',
  },
]

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: { subject: 'General Inquiry' },
  })

  async function onSubmit(data: ContactForm) {
    try {
      await fetch('/api/contact', {
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
      <div className="pt-20 bg-navy">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <p className="text-orange font-headline font-bold text-sm uppercase tracking-widest mb-4">Get in Touch</p>
          <h1 className="text-5xl font-headline font-black text-white mb-4">
            Let's <span className="text-orange">Plan It.</span>
          </h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto">
            Whether it's a quick question, a trip idea, or a college group inquiry — we're here and we reply fast.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Contact option cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-14">
          {CONTACT_OPTIONS.map((opt) => (
            <a key={opt.title} href={opt.href} target="_blank" rel="noopener noreferrer"
              className="bg-white rounded-lg p-6 shadow-card border border-navy/5 hover:shadow-card-hover transition-all group text-center">
              <div className={cn('w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4', opt.color)}>
                <opt.icon className={cn('w-7 h-7', opt.iconColor)} />
              </div>
              <h3 className="font-headline font-black text-navy text-lg mb-1">{opt.title}</h3>
              <p className="text-navy/60 text-sm mb-3">{opt.desc}</p>
              <span className="text-orange font-semibold text-sm group-hover:underline">{opt.action} →</span>
            </a>
          ))}
        </div>

        {/* Contact form */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-headline font-black text-navy mb-2">Send a Message</h2>
            <p className="text-navy/60 mb-6">We read every message and reply within 24 hours.</p>

            {submitted ? (
              <div className="bg-white rounded-lg p-10 shadow-card text-center">
                <CheckCircle className="w-12 h-12 text-forest mx-auto mb-4" />
                <h3 className="text-xl font-headline font-black text-navy mb-2">Message received!</h3>
                <p className="text-navy/60">We'll reply within 24 hours. 📬</p>
              </div>
            ) : (
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
                    placeholder="you@example.com" />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-navy mb-1">Subject *</label>
                  <select {...register('subject')} className="w-full px-4 py-3 border border-navy/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/30 bg-white">
                    {['General Inquiry', 'Trip Planning', 'College Trip', 'Partnership', 'Other'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-navy mb-1">Message *</label>
                  <textarea {...register('message')} rows={4}
                    className={cn('w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/30 resize-none',
                      errors.message ? 'border-red-400' : 'border-navy/20')}
                    placeholder="Tell us what you need..." />
                  {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                </div>
                <button type="submit" disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-orange text-white font-bold py-3.5 rounded-pill hover:bg-orange-600 transition-colors disabled:opacity-70">
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-navy rounded-lg p-6 text-white">
              <h3 className="font-headline font-black text-lg mb-2">Planning a College Trip?</h3>
              <p className="text-white/70 text-sm mb-4">Get a dedicated group quote from our team. We specialize in batch trips, department outings, and society trips.</p>
              <Link href="/college-trips"
                className="flex items-center gap-2 bg-orange text-white font-bold px-5 py-2.5 rounded-pill hover:bg-orange-600 transition-colors text-sm">
                Get a Group Quote <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="bg-cream-dark rounded-lg p-6">
              <h3 className="font-headline font-black text-navy text-lg mb-2">Response Time</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2 text-navy/70">
                  <span className="text-[#25D366]">●</span> WhatsApp: Usually within 1 hour
                </li>
                <li className="flex items-center gap-2 text-navy/70">
                  <span className="text-orange">●</span> Email: Within 24 hours
                </li>
                <li className="flex items-center gap-2 text-navy/70">
                  <span className="text-navy/30">●</span> College queries: Within 24 hours
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
