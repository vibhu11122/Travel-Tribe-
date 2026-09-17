'use client'

import { useState } from 'react'
import Navbar from '@/components/common/Navbar'
import Footer from '@/components/common/Footer'
import { ChevronDown, ChevronUp, Search, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils/format'
import Link from 'next/link'

const FAQ_SECTIONS = [
  {
    category: 'About Travel Tribe',
    questions: [
      {
        q: 'What is Travel Tribe?',
        a: "Travel Tribe is a student-first travel startup that helps young travelers discover, customize, and join affordable group trips across India. We're not a traditional travel agency — we're a community of people who travel together.",
      },
      {
        q: 'Who is Travel Tribe for?',
        a: "Travel Tribe is built for students, college grads, and young professionals aged 18–35 who want to travel affordably, experience destinations like locals, and connect with like-minded people.",
      },
      {
        q: 'Are you a travel agency?',
        a: "We're a travel startup, not a traditional agency. We don't sell fixed packages. We curate community trips, build personalized itineraries, and execute group travel end-to-end with trusted travel partners.",
      },
      {
        q: 'Where does Travel Tribe operate?',
        a: "Currently, we organize trips across Himachal Pradesh, Uttarakhand, Rajasthan, Madhya Pradesh, and Uttar Pradesh — destinations where we've already executed successful trips.",
      },
    ],
  },
  {
    category: 'Booking & Payments',
    questions: [
      {
        q: 'How do I book a trip?',
        a: "Browse trips on our Explore page, click 'Join Trip' on the one you like, and follow the booking steps: select travelers, fill in details, choose add-ons, review, and pay. You'll receive a booking confirmation with your Booking ID.",
      },
      {
        q: 'What is the payment process?',
        a: "For MVP, we support a mock payment flow. A real payment gateway (Razorpay) will be integrated shortly. For now, our team will contact you after booking to confirm payment details.",
      },
      {
        q: "What's the cancellation policy?",
        a: "Cancellation policies vary by trip and how far in advance you cancel. Generally: 30+ days before trip — 80% refund. 15–30 days — 50% refund. Under 15 days — no refund. Trip credits may be offered instead. Your booking confirmation will specify the exact policy.",
      },
      {
        q: 'Is my booking secure?',
        a: "Yes. Your data is protected and bookings are tracked with unique Booking IDs. Our platform is built with security-first principles and Supabase database with row-level security.",
      },
    ],
  },
  {
    category: 'Trip Experience',
    questions: [
      {
        q: "What's included in the price?",
        a: "Inclusions vary per trip and are clearly listed on each trip's detail page. Common inclusions: transport (bus/train), accommodation, daily breakfast + dinner, a trip captain, sightseeing transport, and entry fees. Lunches and personal expenses are typically excluded.",
      },
      {
        q: 'Are trips suitable for solo travelers?',
        a: "Absolutely! Many of our travelers join solo and leave with friends for life. Community trips are especially great for solo travelers looking to connect with like-minded people.",
      },
      {
        q: 'What is a trip captain?',
        a: "A trip captain is a Travel Tribe representative who accompanies the group throughout the trip. They handle logistics, coordinate activities, and ensure the trip runs smoothly. Think of them as your friend who knows the destination inside-out.",
      },
      {
        q: 'How large are the group trips?',
        a: "Group sizes typically range from 10–30 travelers. Our largest trip to date had 58 travelers (52 MBA students + 6 faculty). Group size is always listed on each trip card.",
      },
      {
        q: 'What if I have dietary requirements?',
        a: "Add any dietary requirements or restrictions in the 'Special Requirements' field during booking. Our trip captain will coordinate with accommodations and restaurants accordingly.",
      },
    ],
  },
  {
    category: 'College Trips',
    questions: [
      {
        q: 'Can we organize a college batch trip?',
        a: "Yes! College and group trips are one of our specialties. Fill in the form on our College Trips page and our team will reach out within 24 hours with a customized quote.",
      },
      {
        q: 'What is the minimum group size for a college trip?',
        a: "Minimum 15 students for a dedicated college group trip. For smaller groups, you can join our community trips or request a custom itinerary through the trip builder.",
      },
      {
        q: 'Do you provide invoices/receipts for college groups?',
        a: "Yes. We provide proper invoices, booking confirmations, and receipts for college group trips — suitable for institutional reimbursements and accounts.",
      },
      {
        q: 'Can faculty members join college group trips?',
        a: "Absolutely! Our largest trip had 6 faculty members alongside 52 MBA students. We accommodate faculty requirements (separate rooms, dietary preferences, etc.) as part of the group plan.",
      },
    ],
  },
  {
    category: 'Customization & Planning',
    questions: [
      {
        q: 'Can I build a custom itinerary?',
        a: "Yes! Use our 'Build Your Trip' feature — a 7-step wizard that creates a personalized itinerary based on your destination, budget, duration, experience preferences, and traveler type. Then request it and our team confirms.",
      },
      {
        q: 'Can I join a trip with my friends?',
        a: "Of course! When booking, you can specify how many people are in your group. You can also invite friends via the share button on any trip page.",
      },
      {
        q: 'How far in advance should I book?',
        a: "We recommend booking at least 2–4 weeks in advance, especially for popular destinations like Manali and Spiti. Weekend trips can sometimes be booked a week in advance if slots are available.",
      },
    ],
  },
]

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={cn('border border-navy/10 rounded-lg overflow-hidden transition-all', open && 'shadow-card')}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-cream/50 transition-colors"
      >
        <span className="font-semibold text-navy text-sm sm:text-base pr-4">{question}</span>
        {open ? <ChevronUp className="w-5 h-5 text-orange flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-navy/40 flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-5 bg-white border-t border-navy/5">
          <p className="text-navy/70 text-sm leading-relaxed pt-3">{answer}</p>
        </div>
      )}
    </div>
  )
}

export default function FAQPage() {
  const [search, setSearch] = useState('')

  const filtered = FAQ_SECTIONS.map(section => ({
    ...section,
    questions: section.questions.filter(
      q => q.q.toLowerCase().includes(search.toLowerCase()) ||
        q.a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(s => s.questions.length > 0)

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      {/* Hero */}
      <div className="pt-20 bg-navy">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
          <h1 className="text-5xl font-headline font-black text-white mb-4">
            Got <span className="text-orange">Questions?</span>
          </h1>
          <p className="text-white/70 text-lg mb-8">We've answered the most common ones below.</p>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy/40" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-pill bg-white text-navy focus:outline-none focus:ring-2 focus:ring-orange/40 shadow-heavy"
            />
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 space-y-10">
        {filtered.length > 0 ? filtered.map(section => (
          <div key={section.category}>
            <h2 className="text-lg font-headline font-black text-navy mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-orange rounded-full inline-block" />
              {section.category}
            </h2>
            <div className="space-y-2">
              {section.questions.map(q => (
                <FAQItem key={q.q} question={q.q} answer={q.a} />
              ))}
            </div>
          </div>
        )) : (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🤔</div>
            <h3 className="text-xl font-headline font-black text-navy mb-2">No results found.</h3>
            <p className="text-navy/60">Try a different search term or ask us directly.</p>
          </div>
        )}

        {/* Still have questions */}
        <div className="bg-navy rounded-lg p-8 text-center">
          <MessageSquare className="w-10 h-10 text-orange mx-auto mb-3" />
          <h3 className="font-headline font-black text-white text-xl mb-2">Still have questions?</h3>
          <p className="text-white/70 mb-5">Chat with us on WhatsApp — we usually reply within an hour.</p>
          <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] text-white font-bold px-6 py-3 rounded-pill hover:opacity-90 transition-opacity">
            <MessageSquare className="w-4 h-4" /> Chat on WhatsApp
          </a>
        </div>
      </div>

      <Footer />
    </div>
  )
}
