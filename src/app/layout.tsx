import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://traveltribe.in'),
  title: {
    default: 'Travel Tribe | Student Travel & Group Trips in India',
    template: '%s | Travel Tribe',
  },
  description:
    'Travel Tribe helps students and young travelers discover affordable, personalized and community-driven trips across India. Travel like a local, not like a tourist.',
  keywords: [
    'student travel India',
    'group trips India',
    'affordable travel',
    'college trips',
    'Gen-Z travel',
    'Himachal travel',
    'Manali trip',
    'Rishikesh adventure',
    'Spiti Valley',
    'Rajasthan tour',
    'Travel Tribe',
    'budget travel India',
    'community trips',
  ],
  authors: [{ name: 'Travel Tribe' }],
  creator: 'Travel Tribe',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: '/',
    siteName: 'Travel Tribe',
    title: 'Travel Tribe | Student Travel & Group Trips in India',
    description:
      'Student-first trips, real local experiences, and a community that travels together. Travel like a local, not like a tourist.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Travel Tribe — Travel Like a Local, Not Like a Tourist',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Travel Tribe | Student Travel & Group Trips in India',
    description: 'Student-first trips. Real experiences. A tribe, not a transaction.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

import WhatsAppFloatingButton from '@/components/common/WhatsAppFloatingButton'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,300..900;1,300..900&family=Outfit:wght@100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-cream antialiased font-body">
        {children}
        <WhatsAppFloatingButton />
      </body>
    </html>
  )
}
