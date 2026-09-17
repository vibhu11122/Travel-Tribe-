'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, ArrowRight, Compass, GraduationCap, Sparkles } from 'lucide-react'
import { getGeneralWhatsAppUrl, getCollegeWhatsAppUrl } from '@/lib/whatsapp/client'

export default function WhatsAppFloatingButton() {
  const [isOpen, setIsOpen] = useState(false)

  const defaultUrl = getGeneralWhatsAppUrl()
  const collegeUrl = getCollegeWhatsAppUrl()

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Quick Menu Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-4 w-72 bg-white rounded-2xl p-4 shadow-heavy border border-navy/10 overflow-hidden"
          >
            <div className="flex items-center justify-between pb-3 border-b border-navy/5 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center text-white">
                  <MessageCircle className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <p className="font-headline font-black text-navy text-sm leading-tight">Travel Tribe Support</p>
                  <p className="text-forest text-[11px] font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" /> Online on WhatsApp
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-navy/40 hover:text-navy p-1 rounded-lg transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-navy/70 text-xs mb-3">
              Hey there! 👋 Ready for an adventure? Chat directly with a Trip Captain:
            </p>

            <div className="space-y-2 text-xs">
              <a
                href={defaultUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-xl bg-cream-dark hover:bg-cream-muted text-navy font-semibold transition-colors group"
              >
                <span className="flex items-center gap-2">
                  <Compass className="w-3.5 h-3.5 text-orange" /> Inquire about a trip
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-navy/40 group-hover:translate-x-0.5 group-hover:text-navy transition-all" />
              </a>

              <a
                href={collegeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-xl bg-cream-dark hover:bg-cream-muted text-navy font-semibold transition-colors group"
              >
                <span className="flex items-center gap-2">
                  <GraduationCap className="w-3.5 h-3.5 text-orange" /> Plan a College Tour
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-navy/40 group-hover:translate-x-0.5 group-hover:text-navy transition-all" />
              </a>

              <a
                href={`https://wa.me/919599233810?text=${encodeURIComponent('Hey Travel Tribe! 🌟 Can you help me find the best weekend trip for my budget?')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-xl bg-cream-dark hover:bg-cream-muted text-navy font-semibold transition-colors group"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-orange" /> Best budget recommendations
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-navy/40 group-hover:translate-x-0.5 group-hover:text-navy transition-all" />
              </a>
            </div>

            <a
              href={defaultUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center justify-center gap-2 w-full bg-[#25D366] text-white font-bold py-2.5 rounded-pill hover:bg-[#20ba5a] transition-colors shadow-sm text-xs"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" /> Open WhatsApp Chat
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Main Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 bg-[#25D366] text-white px-4 py-3 rounded-full shadow-heavy hover:shadow-xl transition-all"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 fill-current" />
        <span className="font-bold text-sm hidden sm:inline-block">Chat with Tribe</span>
      </motion.button>
    </div>
  )
}
