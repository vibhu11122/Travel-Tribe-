import type { TripBuilderData, GeneratedItinerary } from '@/lib/types'

// ============================================================
// AI Service Abstraction Layer
// Replace the mock implementation below with a real AI API call
// when ready (OpenAI, Gemini, etc.)
// ============================================================

export interface AIItineraryRequest {
  prompt?: string
  builderData?: TripBuilderData
}

export interface AIItineraryResponse {
  success: boolean
  itinerary?: GeneratedItinerary
  error?: string
}

// ============================================================
// MOCK / RULES-BASED ENGINE
// This is the MVP implementation. Replace generateWithAI() with
// a real API call when integrating an AI provider.
// ============================================================

const DESTINATION_PRESETS: Record<string, {
  title: string
  accommodation: string
  transport: string
  highlights: string[]
  localFood: string[]
}> = {
  manali: {
    title: 'Manali Adventure',
    accommodation: 'Hostel / Mountain Guesthouse',
    transport: 'Volvo from Delhi (overnight)',
    highlights: ['Rohtang Pass', 'Old Manali café trail', 'Solang Valley', 'Hidden waterfall trek'],
    localFood: ['Siddu (local bread)', 'Trout fish', 'Sidu with ghee', 'Tibetan thukpa'],
  },
  kasol: {
    title: 'Kasol Backpack',
    accommodation: 'Riverside Hostel / Camping',
    transport: 'Volvo to Bhuntar, then local bus',
    highlights: ['Kheerganga trek', 'Parvati River walk', 'Chalal trail', 'Manikaran Sahib'],
    localFood: ['Israeli falafel', 'Maggi with chai', 'Local trout', 'Apple pie (yes, really)'],
  },
  rishikesh: {
    title: 'Rishikesh Adventure',
    accommodation: 'Beach Camp / River-facing Guesthouse',
    transport: 'AC bus from Delhi',
    highlights: ['White water rafting', 'Cliff jumping', 'Ganga aarti', 'Laxman Jhula'],
    localFood: ['Chole bhature', 'Masala chai', 'Ashram thali', 'Local street chaat'],
  },
  spiti: {
    title: 'Spiti Valley Expedition',
    accommodation: 'Homestay with local family',
    transport: 'SUV convoy via Manali',
    highlights: ['Key Monastery', 'Chandratal Lake', 'Kibber Village', 'Hikkim Post Office'],
    localFood: ['Thukpa', 'Tsampa', 'Butter tea', 'Momos (local style)'],
  },
  jaipur: {
    title: 'Jaipur Royal Escape',
    accommodation: 'Boutique Heritage Guesthouse',
    transport: 'AC train from Delhi',
    highlights: ['Amber Fort', 'Hawa Mahal sunrise', 'Old City bazaar', 'Nahargarh Fort'],
    localFood: ['Dal baati churma', 'Pyaaz ki kachori', 'Ghewar', 'Laal maas (if non-veg)'],
  },
  default: {
    title: 'Custom Adventure',
    accommodation: 'Mix of guesthouses and camps',
    transport: 'Bus/train based on destination',
    highlights: ['Local exploration', 'Hidden gems', 'Cultural experiences', 'Adventure activities'],
    localFood: ['Regional specialties', 'Street food trail', 'Local market food walk'],
  },
}

const EXPERIENCE_ACTIVITIES: Record<string, string[]> = {
  adventure: ['White water rafting', 'Rock climbing', 'Zip-lining', 'Trekking to viewpoint', 'Cliff jumping'],
  mountains: ['Summit trek', 'Valley walk', 'Glacier viewpoint', 'Alpine lake visit', 'High altitude camp'],
  culture: ['Heritage walk', 'Museum visit', 'Local market exploration', 'Temple circuit', 'Cultural performance'],
  food: ['Street food trail', 'Local restaurant hunt', 'Market visit', 'Cooking class', 'Farm-to-table experience'],
  photography: ['Golden hour shoot', 'Landscape photography', 'Street photography walk', 'Night sky photography'],
  relaxation: ['Yoga & meditation', 'Spa session', 'Riverside sit', 'Café hopping', 'Hammock time'],
  nature: ['Forest trail', 'Bird watching', 'Wildlife safari', 'Waterfall visit', 'Botanical garden'],
  backpacking: ['Hostel social mixer', 'Budget street food', 'Local transport experience', 'Hitchhike segment'],
  nightlife: ['Night market', 'Rooftop bar', 'Live music venue', 'Street party'],
}

const TRAVELER_TYPE_ADDONS: Record<string, string[]> = {
  explorer: ['Off-beat village visit', 'Unexplored trail hike', 'Local home visit'],
  adventurer: ['Paragliding', 'Snow scooter', 'Bungee jumping', 'Kayaking'],
  'chill-traveler': ['Spa treatment', 'Hammock afternoon', 'Café work session'],
  foodie: ['Street food masterclass', 'Local market cooking session', 'Regional cuisine tour'],
  'party-traveler': ['Sunset drinks', 'Night market crawl', 'Live music night'],
  'culture-hunter': ['Museum guided tour', 'Historical lecture walk', 'Artisan workshop visit'],
  backpacker: ['Hitchhike adventure', 'Hostel social night', 'Dorm experience'],
}

function matchDestinationPreset(destination: string) {
  const dest = destination.toLowerCase()
  for (const key of Object.keys(DESTINATION_PRESETS)) {
    if (dest.includes(key)) return DESTINATION_PRESETS[key]
  }
  return DESTINATION_PRESETS.default
}

function buildDayItinerary(
  day: number,
  totalDays: number,
  preset: typeof DESTINATION_PRESETS[string],
  experienceTypes: string[]
): GeneratedItinerary['days'][0] {
  const activities: string[] = []

  if (day === 1) {
    activities.push(
      'Travel day — settle in and explore the neighbourhood',
      'Check-in and freshen up',
      ...preset.highlights.slice(0, 1),
      'Welcome dinner with the tribe'
    )
    return {
      day,
      title: 'Arrival + First Impressions',
      activities,
      food: [preset.localFood[0] || 'Local welcome meal'],
      notes: 'Take it easy today — the adventure starts tomorrow.',
    }
  }

  if (day === totalDays) {
    return {
      day,
      title: 'Last Morning — Carry It With You',
      activities: [
        'Free morning at leisure',
        'Last café / street food run',
        'Group photo session',
        'Departure',
      ],
      food: [preset.localFood[1] || 'Quick local breakfast'],
      notes: 'Until next time. The tribe always comes back.',
    }
  }

  // Middle days — use experience types
  const dayExp = experienceTypes[day % experienceTypes.length] || 'adventure'
  const expActivities = EXPERIENCE_ACTIVITIES[dayExp] || EXPERIENCE_ACTIVITIES.adventure
  activities.push(
    ...expActivities.slice(0, 2),
    preset.highlights[(day - 1) % preset.highlights.length] || 'Local exploration',
    'Sunset at a viewpoint'
  )

  const dayTitles: Record<number, string> = {
    2: 'Adventure Day',
    3: 'Hidden Local Spots',
    4: 'Culture + Food',
    5: 'Free Day Your Way',
    6: 'Deep Dive',
    7: 'Slow Travel Day',
  }

  return {
    day,
    title: dayTitles[day] || `Day ${day} — Explore`,
    activities,
    food: [preset.localFood[day % preset.localFood.length] || 'Regional cuisine'],
    freeTime: '2-3 hours free in afternoon',
    notes: 'Remember — the best experiences aren\'t in the itinerary.',
  }
}

function buildAddons(travelerType: string, budget: number): GeneratedItinerary['addons'] {
  const typeAddons = TRAVELER_TYPE_ADDONS[travelerType] || TRAVELER_TYPE_ADDONS.explorer
  return typeAddons.map((name, i) => ({
    name,
    price: [500, 800, 1200, 300, 600][i] || 500,
    description: `Add ${name.toLowerCase()} to your trip`,
  }))
}

// ============================================================
// MAIN GENERATOR (Rules-based MVP)
// Replace this function body with a real AI API call
// ============================================================
export async function generateItinerary(
  data: TripBuilderData
): Promise<GeneratedItinerary> {
  // Simulate network delay for MVP
  await new Promise((r) => setTimeout(r, 1200))

  const preset = matchDestinationPreset(data.destination)
  const days = Array.from({ length: data.numDays }, (_, i) =>
    buildDayItinerary(i + 1, data.numDays, preset, data.experienceTypes)
  )

  const basePerPerson = data.budget > 0 ? Math.min(data.budget, 15000) : 8000
  const estimatedCost = Math.round(basePerPerson * 0.85) // ~15% under budget is ideal

  return {
    destination: data.destination,
    title: `${preset.title} — ${data.numDays}D/${data.numDays - 1}N`,
    duration: data.numDays,
    estimatedCost,
    accommodation: preset.accommodation,
    transport: preset.transport,
    days,
    addons: buildAddons(data.travelerType, data.budget),
  }
}

// ============================================================
// FUTURE: Replace with real AI call
// ============================================================
// async function generateWithAI(prompt: string): Promise<GeneratedItinerary> {
//   const response = await fetch('https://api.openai.com/v1/chat/completions', {
//     method: 'POST',
//     headers: {
//       Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       model: 'gpt-4o',
//       messages: [
//         { role: 'system', content: SYSTEM_PROMPT },
//         { role: 'user', content: prompt },
//       ],
//     }),
//   })
//   const data = await response.json()
//   return JSON.parse(data.choices[0].message.content)
// }
