import Link from 'next/link'
import { Compass, Instagram, Mail, MessageCircle, ArrowUpRight, MapPin } from 'lucide-react'

const FOOTER_LINKS = {
  explore: [
    { label: 'All Trips', href: '/trips' },
    { label: 'Destinations', href: '/destinations' },
    { label: 'Build My Trip', href: '/build-your-trip' },
    { label: 'Community', href: '/community' },
    { label: 'College Trips', href: '/college-trips' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Why Travel Tribe?', href: '/about#why-us' },
    { label: 'Contact', href: '/contact' },
    { label: 'FAQ', href: '/faq' },
  ],
  support: [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Join the Tribe', href: '/trips' },
    { label: 'Become a Partner', href: '/contact#partner' },
  ],
}

const SOCIAL_LINKS = [
  {
    icon: Instagram,
    label: 'Instagram',
    href: '#',
    bg: 'hover:bg-[#E1306C]/15 hover:text-[#E1306C]',
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    href: 'https://wa.me/919599233810',
    bg: 'hover:bg-[#25D366]/15 hover:text-[#25D366]',
  },
  {
    icon: Mail,
    label: 'Email',
    href: '#',
    bg: 'hover:bg-orange/15 hover:text-orange',
  },
]

function FooterLogo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 group select-none w-fit">
      <div className="w-9 h-9 rounded-[10px] bg-orange flex items-center justify-center shadow-orange flex-shrink-0">
        <Compass className="w-[18px] h-[18px] text-white" strokeWidth={2.5} />
      </div>
      <span className="font-headline font-black text-lg tracking-wide leading-none">
        <span className="text-orange">T</span>
        <span className="text-cream">RAVEL</span>
        <span className="mx-[3px] text-cream/30">·</span>
        <span className="text-orange">T</span>
        <span className="text-cream">RIBE</span>
      </span>
    </Link>
  )
}

interface FooterColumnProps {
  title: string
  links: { label: string; href: string }[]
}

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div>
      <h4 className="font-headline font-bold text-cream/90 text-sm uppercase tracking-widest mb-5">
        {title}
      </h4>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="group flex items-center gap-1 text-[14px] text-cream/55 hover:text-cream font-body transition-colors duration-200"
            >
              {link.label}
              <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 transition-all duration-200" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Footer() {
  return (
    <footer className="bg-navy-dark border-t border-cream/8">
      <div className="h-[3px] bg-gradient-to-r from-orange via-gold to-orange opacity-80" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-14 pb-12 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">

          {/* Brand Column */}
          <div className="space-y-6">
            <FooterLogo />

            <p className="text-cream/60 text-[14.5px] font-body leading-relaxed max-w-[280px]">
              India&apos;s favourite student travel community. We make travel safe, affordable, and ridiculously fun — one group trip at a time.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-pill bg-orange/10 border border-orange/20">
              <span className="text-orange text-xs font-bold font-headline tracking-wide">
                ✈ Travel Like a Local, Not Like a Tourist.
              </span>
            </div>

            <div className="flex items-center gap-3 pt-1">
              {SOCIAL_LINKS.map(({ icon: Icon, label, href, bg }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className={`w-10 h-10 rounded-md flex items-center justify-center text-cream/50 bg-cream/5 border border-cream/10 transition-all duration-200 ${bg}`}
                >
                  <Icon className="w-[18px] h-[18px]" strokeWidth={1.75} />
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-1.5 text-cream/40 text-xs font-body">
              <MapPin className="w-3.5 h-3.5 text-orange/60" />
              <span>India — Himachal · Uttarakhand · Rajasthan · MP · UP</span>
            </div>
          </div>

          <FooterColumn title="Explore" links={FOOTER_LINKS.explore} />
          <FooterColumn title="Company" links={FOOTER_LINKS.company} />
          <FooterColumn title="Support" links={FOOTER_LINKS.support} />
        </div>

        <div className="h-px bg-cream/8" />

        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-cream/40 text-[13px] font-body text-center sm:text-left">
            © 2024 Travel Tribe. All rights reserved.
          </p>
          <p className="text-cream/35 text-[13px] font-body text-center">
            Made with ❤️ for India&apos;s Young Travelers
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-cream/35 text-[13px] font-body hover:text-cream/70 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-cream/35 text-[13px] font-body hover:text-cream/70 transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
