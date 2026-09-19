'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Plus,
  Calendar as CalendarIcon,
  List,
  Pencil,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  ArrowUpDown,
  Check,
  X,
  MapPin,
  Clock,
  Users,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Sparkles,
  Loader2,
  ExternalLink,
} from 'lucide-react'
import { formatPrice, formatDateRange, cn, slugify } from '@/lib/utils/format'
import type { Trip, ItineraryDay, TripFAQ } from '@/lib/types'

const TRIP_TYPES = [
  'adventure', 'mountains', 'beaches', 'culture', 'food', 'nature',
  'photography', 'relaxation', 'backpacking', 'nightlife', 'community', 'college',
]

const DIFFICULTIES = ['easy', 'moderate', 'challenging', 'extreme']

const STATUS_BADGES: Record<string, { label: string; color: string }> = {
  active: { label: 'Active', color: 'bg-green-100 text-green-700' },
  draft: { label: 'Draft', color: 'bg-yellow-100 text-yellow-700' },
  full: { label: 'Sold Out', color: 'bg-orange/15 text-orange' },
  completed: { label: 'Completed', color: 'bg-navy/10 text-navy' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-600' },
}

export default function AdminTripsManager() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')
  const [reorderMode, setReorderMode] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Modal State
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null)
  const [activeTab, setActiveTab] = useState<'basic' | 'dates' | 'itinerary' | 'faqs'>('basic')
  const [saving, setSaving] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  // Form State
  const [formTitle, setFormTitle] = useState('')
  const [formDestination, setFormDestination] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formCoverImage, setFormCoverImage] = useState('/spiti.jpg')
  const [formGallery, setFormGallery] = useState<string[]>([])
  const [formStartDate, setFormStartDate] = useState('')
  const [formEndDate, setFormEndDate] = useState('')
  const [formDays, setFormDays] = useState(5)
  const [formNights, setFormNights] = useState(4)
  const [formPrice, setFormPrice] = useState(7999)
  const [formOriginalPrice, setFormOriginalPrice] = useState(9999)
  const [formCapacity, setFormCapacity] = useState(20)
  const [formSlots, setFormSlots] = useState(8)
  const [formType, setFormType] = useState('adventure')
  const [formDifficulty, setFormDifficulty] = useState('moderate')
  const [formStatus, setFormStatus] = useState<'draft' | 'active' | 'full' | 'completed' | 'cancelled'>('active')
  const [formMeetingPoint, setFormMeetingPoint] = useState('Majnu Ka Tilla, Delhi')
  const [formHighlights, setFormHighlights] = useState<string[]>([])
  const [formInclusions, setFormInclusions] = useState<string[]>([])
  const [formExclusions, setFormExclusions] = useState<string[]>([])
  const [formItinerary, setFormItinerary] = useState<ItineraryDay[]>([])
  const [formFAQs, setFormFAQs] = useState<TripFAQ[]>([])

  async function loadTrips() {
    try {
      const res = await fetch('/api/admin/trips', { cache: 'no-store' })
      const data = await res.json()
      if (data.trips) setTrips(data.trips)
    } catch (err) {
      console.error('Failed to load trips:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTrips()
  }, [])

  function openCreateModal() {
    setEditingTrip(null)
    setFormTitle('')
    setFormDestination('')
    setFormDescription('')
    setFormCoverImage('/spiti.jpg')
    setFormGallery(['/spiti.jpg', '/khaliya-top.jpeg'])
    setFormStartDate('2026-12-20')
    setFormEndDate('2026-12-25')
    setFormDays(5)
    setFormNights(4)
    setFormPrice(7999)
    setFormOriginalPrice(9999)
    setFormCapacity(20)
    setFormSlots(12)
    setFormType('adventure')
    setFormDifficulty('moderate')
    setFormStatus('active')
    setFormMeetingPoint('Majnu Ka Tilla, Delhi')
    setFormHighlights(['Rohtang Pass excursion', 'Local cafe hopping', 'Night bonfire & music', 'Solang Valley snow point'])
    setFormInclusions(['Volvo transport from Delhi', 'Hotel/Hostel stay (twin sharing)', 'Daily breakfast & dinner', 'Dedicated Trip Captain'])
    setFormExclusions(['Personal expenses', 'Lunches on the road', 'Activity gear rentals'])
    setFormItinerary([
      { day: 1, title: 'Overnight Journey', description: 'Meet the tribe at the pickup point and board our private AC Volvo.', activities: ['Evening departure', 'Ice-breaker games'] },
      { day: 2, title: 'Arrival & Cafe Trail', description: 'Check-in, relax, and head out to explore the scenic old town.', activities: ['Check-in', 'Old town exploration', 'Welcome dinner'] },
      { day: 3, title: 'Adventure & Snow Point', description: 'Scenic drive to the snow pass followed by nature walks.', activities: ['Snow activities', 'Viewpoint photography', 'Night bonfire'] },
    ])
    setFormFAQs([
      { question: 'Is this trip suitable for solo travelers?', answer: 'Yes! Over 60% of our travelers join solo and make friends for life.' },
      { question: 'What is included in the package price?', answer: 'All transport from meeting point, stay, breakfast & dinners, and trip captain coordination are included.' },
    ])
    setActiveTab('basic')
    setModalOpen(true)
  }

  function openEditModal(trip: Trip) {
    setEditingTrip(trip)
    setFormTitle(trip.title)
    setFormDestination(trip.destination)
    setFormDescription(trip.description)
    setFormCoverImage(trip.cover_image || '/spiti.jpg')
    setFormGallery(trip.gallery || ['/spiti.jpg'])
    setFormStartDate(trip.start_date || '')
    setFormEndDate(trip.end_date || '')
    setFormDays(trip.duration_days)
    setFormNights(trip.duration_nights)
    setFormPrice(trip.price)
    setFormOriginalPrice(trip.price_original || trip.price)
    setFormCapacity(trip.capacity)
    setFormSlots(trip.available_slots)
    setFormType(trip.trip_type)
    setFormDifficulty(trip.difficulty)
    setFormStatus(trip.status as any)
    setFormMeetingPoint(trip.meeting_point || '')
    setFormHighlights(trip.highlights || [])
    setFormInclusions(trip.inclusions || [])
    setFormExclusions(trip.exclusions || [])
    setFormItinerary(trip.itinerary || [])
    setFormFAQs(trip.faqs || [])
    setActiveTab('basic')
    setModalOpen(true)
  }

  async function handleSaveTrip(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    const payload = {
      title: formTitle,
      destination: formDestination,
      description: formDescription,
      cover_image: formCoverImage,
      gallery: formGallery,
      start_date: formStartDate || null,
      end_date: formEndDate || null,
      duration_days: Number(formDays),
      duration_nights: Number(formNights),
      price: Number(formPrice),
      price_original: Number(formOriginalPrice),
      capacity: Number(formCapacity),
      available_slots: Number(formSlots),
      trip_type: formType,
      difficulty: formDifficulty,
      status: formStatus,
      meeting_point: formMeetingPoint,
      highlights: formHighlights,
      inclusions: formInclusions,
      exclusions: formExclusions,
      itinerary: formItinerary,
      faqs: formFAQs,
      is_featured: true,
      tags: [formType, formDifficulty],
    }

    try {
      if (editingTrip) {
        // Update
        const res = await fetch(`/api/admin/trips/${editingTrip.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (res.ok) await loadTrips()
      } else {
        // Create
        const res = await fetch('/api/admin/trips', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (res.ok) await loadTrips()
      }
      setModalOpen(false)
    } catch (err) {
      console.error('Failed to save trip:', err)
    } finally {
      setSaving(false)
    }
  }

  async function handleToggleStatus(trip: Trip) {
    const nextStatus = trip.status === 'active' ? 'draft' : 'active'
    try {
      await fetch(`/api/admin/trips/${trip.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      })
      await loadTrips()
    } catch (err) {
      console.error('Failed to toggle status:', err)
    }
  }

  async function handleDuplicateTrip(trip: Trip) {
    try {
      await fetch(`/api/admin/trips/${trip.id}`, { method: 'POST' })
      await loadTrips()
    } catch (err) {
      console.error('Failed to duplicate:', err)
    }
  }

  async function handleDeleteTrip(id: string) {
    try {
      await fetch(`/api/admin/trips/${id}`, { method: 'DELETE' })
      setDeleteConfirmId(null)
      await loadTrips()
    } catch (err) {
      console.error('Failed to delete:', err)
    }
  }

  function moveTripOrder(index: number, direction: 'up' | 'down') {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= trips.length) return
    const reordered = [...trips]
    const temp = reordered[index]
    reordered[index] = reordered[targetIndex]
    reordered[targetIndex] = temp
    setTrips(reordered)
  }

  async function saveReorder() {
    try {
      const orders = trips.map((t, idx) => ({ id: t.id, display_order: idx + 1 }))
      await fetch('/api/admin/trips', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orders }),
      })
      setReorderMode(false)
    } catch (err) {
      console.error('Failed to save order:', err)
    }
  }

  // Filtered trips
  const filteredTrips = trips.filter((t) => {
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter
    const matchesQuery = !searchQuery ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.destination.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesQuery
  })

  return (
    <div className="space-y-6">
      {/* ── Page Header ───────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-headline font-black text-navy text-2xl">Trip Management</h2>
          <p className="text-navy/60 text-sm">Create, edit, schedule, and reorder public expeditions.</p>
        </div>

        <div className="flex items-center gap-3">
          {reorderMode ? (
            <button
              onClick={saveReorder}
              className="flex items-center gap-2 bg-forest text-white font-bold px-4 py-2.5 rounded-pill text-sm hover:opacity-90 transition-all shadow-sm"
            >
              <Check className="w-4 h-4" /> Save Display Order
            </button>
          ) : (
            <button
              onClick={() => setReorderMode(true)}
              className="flex items-center gap-1.5 bg-white border border-navy/15 text-navy font-semibold px-4 py-2.5 rounded-pill text-sm hover:bg-cream-dark transition-colors"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-orange" /> Reorder Trips
            </button>
          )}

          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-orange text-white font-bold px-5 py-2.5 rounded-pill hover:bg-orange-600 transition-colors text-sm shadow-orange"
          >
            <Plus className="w-4 h-4" /> Create Trip
          </button>
        </div>
      </div>

      {/* ── View Switcher & Filters ───────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl shadow-card border border-navy/5">
        <div className="flex items-center gap-1 bg-cream-dark p-1 rounded-xl w-fit">
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              'flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all',
              viewMode === 'list' ? 'bg-navy text-white shadow-sm' : 'text-navy/60 hover:text-navy'
            )}
          >
            <List className="w-3.5 h-3.5" /> List View
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={cn(
              'flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all',
              viewMode === 'calendar' ? 'bg-navy text-white shadow-sm' : 'text-navy/60 hover:text-navy'
            )}
          >
            <CalendarIcon className="w-3.5 h-3.5" /> Calendar View
          </button>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search trip title or destination..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3.5 py-1.5 border border-navy/15 rounded-xl text-xs bg-cream/40 focus:outline-none focus:ring-2 focus:ring-orange/30 text-navy w-full sm:w-64"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 border border-navy/15 rounded-xl text-xs bg-white text-navy font-semibold focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active (Published)</option>
            <option value="draft">Drafts</option>
            <option value="full">Sold Out</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* ── 1. LIST VIEW ──────────────────────────────────────────── */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-2xl shadow-card border border-navy/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[750px]">
              <thead className="bg-cream-dark border-b border-navy/5 text-navy/60 text-xs uppercase tracking-wider font-bold">
                <tr>
                  {reorderMode && <th className="px-4 py-3 text-left w-12">Rank</th>}
                  <th className="px-5 py-3 text-left">Trip & Destination</th>
                  <th className="px-4 py-3 text-left">Dates & Duration</th>
                  <th className="px-4 py-3 text-left">Pricing</th>
                  <th className="px-4 py-3 text-left">Seats</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy/5">
                {filteredTrips.map((trip, idx) => {
                  const statusInfo = STATUS_BADGES[trip.status] || { label: trip.status, color: 'bg-navy/10 text-navy' }
                  return (
                    <tr key={trip.id} className="hover:bg-cream/40 transition-colors">
                      {reorderMode && (
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-navy/40 text-xs w-4">{idx + 1}</span>
                            <div className="flex flex-col">
                              <button
                                onClick={() => moveTripOrder(idx, 'up')}
                                disabled={idx === 0}
                                className="p-0.5 hover:text-orange disabled:opacity-20"
                              >
                                ▲
                              </button>
                              <button
                                onClick={() => moveTripOrder(idx, 'down')}
                                disabled={idx === trips.length - 1}
                                className="p-0.5 hover:text-orange disabled:opacity-20"
                              >
                                ▼
                              </button>
                            </div>
                          </div>
                        </td>
                      )}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-10 rounded-lg overflow-hidden bg-navy/10 flex-shrink-0">
                            <Image src={trip.cover_image || '/spiti.jpg'} alt={trip.title} fill className="object-cover" />
                          </div>
                          <div>
                            <p className="font-headline font-black text-navy text-sm">{trip.title}</p>
                            <p className="text-navy/50 text-xs flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-orange" /> {trip.destination}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-navy/70">
                        <p className="font-semibold text-navy">
                          {trip.start_date && trip.end_date ? formatDateRange(trip.start_date, trip.end_date) : 'Flexible dates'}
                        </p>
                        <p className="text-navy/40">{trip.duration_days}D · {trip.duration_nights}N</p>
                      </td>
                      <td className="px-4 py-3.5 text-xs">
                        <p className="font-bold text-orange text-sm">{formatPrice(trip.price)}</p>
                        {trip.price_original && (
                          <p className="text-navy/40 line-through text-[11px]">{formatPrice(trip.price_original)}</p>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-xs">
                        <p className="font-bold text-navy">{trip.capacity - trip.available_slots} / {trip.capacity}</p>
                        <p className="text-navy/50 text-[11px]">{trip.available_slots} remaining</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <button
                          onClick={() => handleToggleStatus(trip)}
                          className={cn('px-2.5 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1', statusInfo.color)}
                          title="Click to toggle publish status"
                        >
                          {trip.status === 'active' ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          {statusInfo.label}
                        </button>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/trips/${trip.slug}`}
                            target="_blank"
                            className="p-1.5 text-navy/40 hover:text-navy hover:bg-cream-dark rounded-lg transition-colors"
                            title="Preview Public Page"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => openEditModal(trip)}
                            className="p-1.5 text-navy/40 hover:text-navy hover:bg-cream-dark rounded-lg transition-colors"
                            title="Edit Trip"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDuplicateTrip(trip)}
                            className="p-1.5 text-navy/40 hover:text-orange hover:bg-orange/10 rounded-lg transition-colors"
                            title="Duplicate Trip"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          {deleteConfirmId === trip.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleDeleteTrip(trip.id)}
                                className="px-2 py-1 bg-red-600 text-white rounded text-xs font-bold hover:bg-red-700"
                              >
                                Delete
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="p-1 text-navy/40 hover:text-navy"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirmId(trip.id)}
                              className="p-1.5 text-navy/40 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Trip"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── 2. CALENDAR VIEW ──────────────────────────────────────── */}
      {viewMode === 'calendar' && (
        <div className="bg-white rounded-2xl p-6 shadow-card border border-navy/5 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-headline font-black text-navy text-lg">Upcoming Trip Schedule</h3>
            <span className="text-xs font-semibold text-navy/50">Sorted chronologically by departure date</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trips
              .filter(t => t.start_date)
              .sort((a, b) => new Date(a.start_date!).getTime() - new Date(b.start_date!).getTime())
              .map((trip) => (
                <div
                  key={trip.id}
                  className="bg-cream/40 rounded-xl p-4 border border-navy/10 space-y-3 hover:border-orange transition-all"
                >
                  <div className="flex items-start justify-between">
                    <span className="px-2 py-0.5 rounded-full bg-orange text-white text-[10px] font-bold">
                      {trip.duration_days} Days Trip
                    </span>
                    <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-bold', STATUS_BADGES[trip.status]?.color)}>
                      {trip.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-headline font-black text-navy text-base">{trip.title}</h4>
                    <p className="text-xs text-navy/60 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-orange" /> {trip.destination}
                    </p>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg text-xs space-y-1 border border-navy/5">
                    <div className="flex items-center justify-between text-navy/70">
                      <span>Departure:</span>
                      <strong className="text-navy">{trip.start_date}</strong>
                    </div>
                    <div className="flex items-center justify-between text-navy/70">
                      <span>Return:</span>
                      <strong className="text-navy">{trip.end_date}</strong>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-navy/5">
                      <span>Slots left:</span>
                      <strong className="text-orange">{trip.available_slots} / {trip.capacity}</strong>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(trip)}
                      className="flex-1 py-1.5 bg-white border border-navy/20 rounded-lg text-xs font-bold text-navy hover:bg-cream-dark transition-colors text-center"
                    >
                      Edit Details
                    </button>
                    <Link
                      href={`/trips/${trip.slug}`}
                      target="_blank"
                      className="p-1.5 bg-orange text-white rounded-lg flex items-center justify-center hover:bg-orange-600 transition-colors"
                      title="View public page"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ── CREATE / EDIT MODAL ────────────────────────────────────── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-6">
            {/* Modal Header */}
            <div className="p-5 border-b border-navy/10 flex items-center justify-between bg-cream-dark">
              <div>
                <h3 className="font-headline font-black text-navy text-lg">
                  {editingTrip ? `Edit Trip: ${editingTrip.title}` : 'Create New Adventure Trip'}
                </h3>
                <p className="text-navy/50 text-xs">All fields directly sync with the live website & booking flow.</p>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-navy/40 hover:text-navy">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex border-b border-navy/10 bg-white px-5 pt-2 gap-2 text-xs font-bold">
              {[
                { id: 'basic', label: '1. Basic Info' },
                { id: 'dates', label: '2. Dates & Pricing' },
                { id: 'itinerary', label: '3. Day-by-Day Itinerary' },
                { id: 'faqs', label: '4. Inclusions & FAQs' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    'px-4 py-2.5 border-b-2 transition-all',
                    activeTab === tab.id
                      ? 'border-orange text-orange'
                      : 'border-transparent text-navy/50 hover:text-navy'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Form Body */}
            <form onSubmit={handleSaveTrip} className="p-6 overflow-y-auto flex-1 space-y-4 text-sm">
              {/* TAB 1: BASIC INFO */}
              {activeTab === 'basic' && (
                <div className="space-y-4">
                  <div>
                    <label className="block font-bold text-navy mb-1">Trip Title *</label>
                    <input
                      type="text"
                      required
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="e.g. Spiti Valley Winter Expedition"
                      className="w-full px-3.5 py-2.5 border rounded-xl text-navy"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-navy mb-1">Destination *</label>
                      <input
                        type="text"
                        required
                        value={formDestination}
                        onChange={(e) => setFormDestination(e.target.value)}
                        placeholder="e.g. Spiti, Himachal Pradesh"
                        className="w-full px-3.5 py-2.5 border rounded-xl text-navy"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-navy mb-1">Trip Type</label>
                      <select
                        value={formType}
                        onChange={(e) => setFormType(e.target.value)}
                        className="w-full px-3.5 py-2.5 border rounded-xl bg-white text-navy capitalize"
                      >
                        {TRIP_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-navy mb-1">Trip Description *</label>
                    <textarea
                      rows={3}
                      required
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      placeholder="Exciting overview of this adventure..."
                      className="w-full px-3.5 py-2.5 border rounded-xl text-navy resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-navy mb-1">Cover Image Path/URL</label>
                      <input
                        type="text"
                        value={formCoverImage}
                        onChange={(e) => setFormCoverImage(e.target.value)}
                        placeholder="/spiti.jpg"
                        className="w-full px-3.5 py-2.5 border rounded-xl text-navy"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-navy mb-1">Difficulty</label>
                      <select
                        value={formDifficulty}
                        onChange={(e) => setFormDifficulty(e.target.value)}
                        className="w-full px-3.5 py-2.5 border rounded-xl bg-white text-navy capitalize"
                      >
                        {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: DATES & PRICING */}
              {activeTab === 'dates' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-navy mb-1">Start Departure Date</label>
                      <input
                        type="date"
                        value={formStartDate}
                        onChange={(e) => setFormStartDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 border rounded-xl text-navy"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-navy mb-1">End Return Date</label>
                      <input
                        type="date"
                        value={formEndDate}
                        onChange={(e) => setFormEndDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 border rounded-xl text-navy"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-navy mb-1">Duration Days</label>
                      <input
                        type="number"
                        min="1"
                        value={formDays}
                        onChange={(e) => setFormDays(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 border rounded-xl text-navy"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-navy mb-1">Duration Nights</label>
                      <input
                        type="number"
                        min="0"
                        value={formNights}
                        onChange={(e) => setFormNights(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 border rounded-xl text-navy"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-navy mb-1">Price per person (₹) *</label>
                      <input
                        type="number"
                        required
                        value={formPrice}
                        onChange={(e) => setFormPrice(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 border rounded-xl text-navy font-bold text-orange"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-navy mb-1">Original Price / Strike (₹)</label>
                      <input
                        type="number"
                        value={formOriginalPrice}
                        onChange={(e) => setFormOriginalPrice(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 border rounded-xl text-navy"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-navy mb-1">Total Capacity</label>
                      <input
                        type="number"
                        min="1"
                        value={formCapacity}
                        onChange={(e) => setFormCapacity(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 border rounded-xl text-navy"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-navy mb-1">Available Slots</label>
                      <input
                        type="number"
                        min="0"
                        value={formSlots}
                        onChange={(e) => setFormSlots(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 border rounded-xl text-navy"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-navy mb-1">Status</label>
                      <select
                        value={formStatus}
                        onChange={(e) => setFormStatus(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 border rounded-xl bg-white text-navy font-bold"
                      >
                        <option value="active">Active (Published)</option>
                        <option value="draft">Draft</option>
                        <option value="full">Sold Out</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-navy mb-1">Meeting / Departure Point</label>
                    <input
                      type="text"
                      value={formMeetingPoint}
                      onChange={(e) => setFormMeetingPoint(e.target.value)}
                      placeholder="e.g. Majnu Ka Tilla, Delhi / Kashmere Gate ISBT"
                      className="w-full px-3.5 py-2.5 border rounded-xl text-navy"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: ITINERARY BUILDER */}
              {activeTab === 'itinerary' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-navy text-xs">Day-by-Day Schedule</p>
                    <button
                      type="button"
                      onClick={() => setFormItinerary([...formItinerary, { day: formItinerary.length + 1, title: `Day ${formItinerary.length + 1} Activity`, description: '', activities: [] }])}
                      className="text-xs bg-orange text-white font-bold px-3 py-1.5 rounded-pill hover:bg-orange-600"
                    >
                      + Add Day
                    </button>
                  </div>

                  {formItinerary.map((day, idx) => (
                    <div key={idx} className="p-3 bg-cream-dark rounded-xl border border-navy/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-headline font-black text-navy text-xs">Day {day.day}</span>
                        <button
                          type="button"
                          onClick={() => setFormItinerary(formItinerary.filter((_, i) => i !== idx))}
                          className="text-red-500 text-xs hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                      <input
                        type="text"
                        value={day.title}
                        onChange={(e) => {
                          const updated = [...formItinerary]
                          updated[idx].title = e.target.value
                          setFormItinerary(updated)
                        }}
                        placeholder="Day Title"
                        className="w-full px-3 py-1.5 border rounded-lg text-xs"
                      />
                      <textarea
                        rows={2}
                        value={day.description}
                        onChange={(e) => {
                          const updated = [...formItinerary]
                          updated[idx].description = e.target.value
                          setFormItinerary(updated)
                        }}
                        placeholder="Day summary description..."
                        className="w-full px-3 py-1.5 border rounded-lg text-xs resize-none"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 4: FAQS & INCLUSIONS */}
              {activeTab === 'faqs' && (
                <div className="space-y-4">
                  <div>
                    <label className="block font-bold text-navy mb-1 text-xs">Inclusions (one per line)</label>
                    <textarea
                      rows={3}
                      value={formInclusions.join('\n')}
                      onChange={(e) => setFormInclusions(e.target.value.split('\n').filter(Boolean))}
                      placeholder="Transport from Delhi&#10;Hotel Stay&#10;Meals"
                      className="w-full px-3 py-2 border rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-navy mb-1 text-xs">Exclusions (one per line)</label>
                    <textarea
                      rows={3}
                      value={formExclusions.join('\n')}
                      onChange={(e) => setFormExclusions(e.target.value.split('\n').filter(Boolean))}
                      placeholder="Personal shopping&#10;Alcohol"
                      className="w-full px-3 py-2 border rounded-xl text-xs"
                    />
                  </div>

                  <div className="pt-2 border-t border-navy/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-navy text-xs">Trip FAQs</p>
                      <button
                        type="button"
                        onClick={() => setFormFAQs([...formFAQs, { question: '', answer: '' }])}
                        className="text-xs bg-navy text-white font-bold px-3 py-1.5 rounded-pill hover:bg-navy-700"
                      >
                        + Add FAQ
                      </button>
                    </div>

                    {formFAQs.map((faq, idx) => (
                      <div key={idx} className="p-3 bg-cream-dark rounded-xl border border-navy/10 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-navy text-xs">FAQ #{idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => setFormFAQs(formFAQs.filter((_, i) => i !== idx))}
                            className="text-red-500 text-xs"
                          >
                            Remove
                          </button>
                        </div>
                        <input
                          type="text"
                          value={faq.question}
                          onChange={(e) => {
                            const updated = [...formFAQs]
                            updated[idx].question = e.target.value
                            setFormFAQs(updated)
                          }}
                          placeholder="Question (e.g. Can I bring my guitar?)"
                          className="w-full px-3 py-1.5 border rounded-lg text-xs"
                        />
                        <textarea
                          rows={2}
                          value={faq.answer}
                          onChange={(e) => {
                            const updated = [...formFAQs]
                            updated[idx].answer = e.target.value
                            setFormFAQs(updated)
                          }}
                          placeholder="Answer..."
                          className="w-full px-3 py-1.5 border rounded-lg text-xs resize-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Modal Footer */}
              <div className="p-5 border-t border-navy/10 bg-cream-dark flex items-center justify-between -mx-6 -mb-6 mt-6">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 border border-navy/20 rounded-pill text-navy font-semibold text-xs hover:bg-white transition-colors"
                >
                  Cancel
                </button>

                <div className="flex items-center gap-2">
                  {activeTab !== 'faqs' && (
                    <button
                      type="button"
                      onClick={() => {
                        if (activeTab === 'basic') setActiveTab('dates')
                        else if (activeTab === 'dates') setActiveTab('itinerary')
                        else if (activeTab === 'itinerary') setActiveTab('faqs')
                      }}
                      className="px-4 py-2.5 bg-navy text-white rounded-pill font-bold text-xs hover:bg-navy-700"
                    >
                      Next Step →
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 bg-orange text-white font-bold px-6 py-2.5 rounded-pill hover:bg-orange-600 transition-colors text-xs shadow-orange disabled:opacity-70"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    {editingTrip ? 'Save Changes' : 'Publish Trip'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
