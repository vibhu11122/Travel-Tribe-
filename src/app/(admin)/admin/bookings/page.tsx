'use client'

import { useState, useEffect } from 'react'
import {
  Ticket,
  Search,
  Plus,
  Download,
  Phone,
  Mail,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  MessageCircle,
  DollarSign,
  ChevronRight,
  Edit2,
  Trash2,
  FileText,
  Loader2,
} from 'lucide-react'
import { formatPrice, cn } from '@/lib/utils/format'
import type { AdminBooking } from '@/lib/types'

const STATUS_OPTIONS = ['All', 'pending', 'confirmed', 'completed', 'cancelled']

const STATUS_COLORS: Record<string, string> = {
  confirmed: 'bg-green-100 text-green-700 border-green-200',
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  completed: 'bg-navy/10 text-navy border-navy/20',
  cancelled: 'bg-red-100 text-red-600 border-red-200',
}

const PAYMENT_COLORS: Record<string, string> = {
  paid: 'bg-emerald-100 text-emerald-800',
  partial: 'bg-amber-100 text-amber-800',
  pending: 'bg-rose-100 text-rose-800',
  refunded: 'bg-gray-100 text-gray-700',
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<AdminBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBooking, setSelectedBooking] = useState<AdminBooking | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  // New Booking Form State
  const [formData, setFormData] = useState({
    trip_id: '1',
    trip_title: 'Manali Adventure Tribe',
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    num_travelers: 1,
    total_amount: 7999,
    amount_paid: 7999,
    payment_status: 'paid' as any,
    booking_status: 'confirmed' as any,
    travel_date: 'Dec 20–25, 2026',
    notes: '',
  })

  async function fetchBookings() {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/bookings', { cache: 'no-store' })
      const data = await res.json()
      if (data.bookings) {
        setBookings(data.bookings)
        if (!selectedBooking && data.bookings.length > 0) {
          setSelectedBooking(data.bookings[0])
        }
      }
    } catch (err) {
      console.error('Failed to fetch bookings:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  async function handleStatusChange(id: string, newStatus: string) {
    try {
      setActionLoading(true)
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking_status: newStatus }),
      })
      const data = await res.json()
      if (data.booking) {
        setBookings(prev => prev.map(b => b.id === id ? data.booking : b))
        setSelectedBooking(data.booking)
      }
    } catch (err) {
      console.error('Failed to update booking status:', err)
    } finally {
      setActionLoading(false)
    }
  }

  async function handlePaymentUpdate(id: string, newPaymentStatus: string, amount: number) {
    try {
      setActionLoading(true)
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_status: newPaymentStatus, amount_paid: amount }),
      })
      const data = await res.json()
      if (data.booking) {
        setBookings(prev => prev.map(b => b.id === id ? data.booking : b))
        setSelectedBooking(data.booking)
      }
    } catch (err) {
      console.error('Failed to update payment:', err)
    } finally {
      setActionLoading(false)
    }
  }

  async function handleSaveNotes(id: string, notes: string) {
    try {
      await fetch(`/api/admin/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      })
    } catch (err) {
      console.error('Failed to save notes:', err)
    }
  }

  async function handleDeleteBooking(id: string) {
    if (!confirm('Are you sure you want to delete this booking record?')) return
    try {
      await fetch(`/api/admin/bookings/${id}`, { method: 'DELETE' })
      setBookings(prev => prev.filter(b => b.id !== id))
      setSelectedBooking(null)
    } catch (err) {
      console.error('Failed to delete booking:', err)
    }
  }

  async function handleCreateBooking(e: React.FormEvent) {
    e.preventDefault()
    try {
      setActionLoading(true)
      const res = await fetch('/api/admin/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (data.booking) {
        setBookings(prev => [data.booking, ...prev])
        setSelectedBooking(data.booking)
        setShowCreateModal(false)
        setFormData({
          trip_id: '1',
          trip_title: 'Manali Adventure Tribe',
          customer_name: '',
          customer_email: '',
          customer_phone: '',
          num_travelers: 1,
          total_amount: 7999,
          amount_paid: 7999,
          payment_status: 'paid',
          booking_status: 'confirmed',
          travel_date: 'Dec 20–25, 2026',
          notes: '',
        })
      }
    } catch (err) {
      console.error('Failed to create booking:', err)
    } finally {
      setActionLoading(false)
    }
  }

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = selectedStatus === 'All' || b.booking_status.toLowerCase() === selectedStatus.toLowerCase()
    const matchesQuery = searchQuery === '' ||
      b.booking_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customer_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customer_phone.includes(searchQuery) ||
      b.trip_title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesQuery
  })

  const totalRevenue = bookings.reduce((sum, b) => sum + (b.total_amount || 0), 0)
  const totalCollected = bookings.reduce((sum, b) => sum + (b.amount_paid || 0), 0)
  const pendingAmount = totalRevenue - totalCollected

  return (
    <div className="space-y-6">
      {/* ── Page Header & Stats Strip ──────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-headline font-black text-navy text-2xl">Bookings & Payments Roster</h2>
          <p className="text-navy/60 text-sm">Manage student trip reservations, payment ledger, and traveler manifests.</p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/api/admin/bookings/export"
            download
            className="flex items-center gap-2 bg-white text-navy font-bold px-4 py-2.5 rounded-pill border border-navy/15 hover:bg-cream-dark transition-colors text-sm shadow-sm"
          >
            <Download className="w-4 h-4 text-forest" /> Export CSV
          </a>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-orange text-white font-bold px-5 py-2.5 rounded-pill hover:bg-orange-600 transition-colors text-sm shadow-orange"
          >
            <Plus className="w-4 h-4" /> Add Booking
          </button>
        </div>
      </div>

      {/* ── Summary Stats Strip ───────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-card border border-navy/5">
          <span className="text-xs font-bold text-navy/40 uppercase tracking-wider block">Total Bookings</span>
          <p className="text-2xl font-headline font-black text-navy mt-1">{bookings.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-card border border-navy/5">
          <span className="text-xs font-bold text-navy/40 uppercase tracking-wider block">Booked Revenue</span>
          <p className="text-2xl font-headline font-black text-navy mt-1">₹{totalRevenue.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-card border border-navy/5">
          <span className="text-xs font-bold text-navy/40 uppercase tracking-wider block">Collected Cash</span>
          <p className="text-2xl font-headline font-black text-forest mt-1">₹{totalCollected.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-card border border-navy/5">
          <span className="text-xs font-bold text-navy/40 uppercase tracking-wider block">Pending Balance</span>
          <p className="text-2xl font-headline font-black text-orange mt-1">₹{pendingAmount.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* ── Filters & Search ──────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={cn(
                'px-4 py-2 rounded-pill text-xs font-bold capitalize transition-all whitespace-nowrap',
                selectedStatus === status
                  ? 'bg-navy text-white shadow-sm'
                  : 'bg-white text-navy/60 border border-navy/10 hover:border-navy/30'
              )}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-navy/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search code, name, phone, trip..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-full border border-navy/15 text-xs text-navy focus:outline-none focus:border-orange bg-white"
          />
        </div>
      </div>

      {/* ── Main Bookings Grid & Side Detail Drawer ────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Table Container */}
        <div className="lg:col-span-7 bg-white rounded-xl shadow-card border border-navy/5 overflow-hidden">
          {loading ? (
            <div className="p-12 flex justify-center text-navy/40">
              <Loader2 className="w-6 h-6 animate-spin text-orange" />
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="p-12 text-center text-navy/40 space-y-2">
              <Ticket className="w-10 h-10 mx-auto text-navy/20" />
              <p className="font-semibold text-navy">No bookings found</p>
              <p className="text-xs">Try adjusting filters or create a new booking.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-cream-dark border-b border-navy/5">
                  <tr>
                    {['Booking', 'Traveler', 'Trip', 'Amount', 'Status'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 font-bold text-navy/60 text-xs uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy/5">
                  {filteredBookings.map((b) => {
                    const isSelected = selectedBooking?.id === b.id
                    return (
                      <tr
                        key={b.id}
                        onClick={() => setSelectedBooking(b)}
                        className={cn(
                          'cursor-pointer transition-colors',
                          isSelected ? 'bg-orange/5 font-medium' : 'hover:bg-cream/50'
                        )}
                      >
                        <td className="px-4 py-3.5">
                          <span className="font-mono text-xs font-bold text-navy block">{b.booking_code}</span>
                          <span className="text-[10px] text-navy/40">
                            {new Date(b.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="font-bold text-navy text-sm">{b.customer_name}</p>
                          <p className="text-navy/50 text-xs flex items-center gap-1">
                            <Users className="w-3 h-3 text-orange" /> {b.num_travelers} {b.num_travelers === 1 ? 'Traveler' : 'Travelers'}
                          </p>
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="font-bold text-navy text-xs line-clamp-1">{b.trip_title}</p>
                          <p className="text-navy/40 text-[11px]">{b.travel_date}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="font-bold text-navy text-xs">{formatPrice(b.total_amount)}</p>
                          <span className={cn('text-[10px] px-1.5 py-0.5 rounded font-bold uppercase', PAYMENT_COLORS[b.payment_status])}>
                            {b.payment_status}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={cn('px-2.5 py-1 rounded-full text-xs font-bold capitalize border', STATUS_COLORS[b.booking_status])}>
                            {b.booking_status}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Selected Booking Side Inspector Panel */}
        <div className="lg:col-span-5">
          {selectedBooking ? (
            <div className="bg-white rounded-xl shadow-card border border-navy/5 p-6 space-y-5 sticky top-20">
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-navy/5">
                <div>
                  <span className="text-xs font-mono font-bold text-orange uppercase tracking-wider block">
                    {selectedBooking.booking_code}
                  </span>
                  <h3 className="font-headline font-black text-navy text-xl mt-0.5">{selectedBooking.customer_name}</h3>
                  <p className="text-navy/50 text-xs">{selectedBooking.trip_title}</p>
                </div>
                <button
                  onClick={() => handleDeleteBooking(selectedBooking.id)}
                  className="text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                  title="Delete Booking"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Status Actions */}
              <div>
                <label className="text-xs font-bold text-navy/50 uppercase tracking-wider block mb-2">
                  Update Booking Status
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {['pending', 'confirmed', 'completed', 'cancelled'].map((s) => (
                    <button
                      key={s}
                      disabled={actionLoading}
                      onClick={() => handleStatusChange(selectedBooking.id, s)}
                      className={cn(
                        'py-1.5 rounded-lg text-xs font-bold capitalize transition-all',
                        selectedBooking.booking_status === s
                          ? 'bg-navy text-white shadow-sm'
                          : 'bg-cream-dark text-navy/70 hover:bg-cream-muted'
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact Shortcuts */}
              <div className="bg-cream p-3.5 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-navy/60 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-navy/40" /> Phone:</span>
                  <a href={`tel:${selectedBooking.customer_phone}`} className="font-bold text-orange hover:underline font-mono">
                    {selectedBooking.customer_phone}
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-navy/60 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-navy/40" /> Email:</span>
                  <a href={`mailto:${selectedBooking.customer_email}`} className="font-semibold text-navy hover:underline">
                    {selectedBooking.customer_email}
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-navy/60 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-navy/40" /> Travel Date:</span>
                  <span className="font-bold text-navy">{selectedBooking.travel_date}</span>
                </div>
              </div>

              {/* Payment Ledger */}
              <div className="border border-navy/10 rounded-xl p-4 space-y-3 bg-white">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-navy text-sm">Payment Ledger</span>
                  <span className={cn('px-2 py-0.5 rounded text-xs font-bold uppercase', PAYMENT_COLORS[selectedBooking.payment_status])}>
                    {selectedBooking.payment_status}
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between text-navy/60">
                    <span>Total Package Cost:</span>
                    <strong className="text-navy">{formatPrice(selectedBooking.total_amount)}</strong>
                  </div>
                  <div className="flex items-center justify-between text-forest">
                    <span>Paid to Date:</span>
                    <strong>{formatPrice(selectedBooking.amount_paid)}</strong>
                  </div>
                  <div className="flex items-center justify-between text-orange font-bold pt-1 border-t border-navy/5">
                    <span>Remaining Balance:</span>
                    <span>{formatPrice(Math.max(0, selectedBooking.total_amount - selectedBooking.amount_paid))}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => handlePaymentUpdate(selectedBooking.id, 'paid', selectedBooking.total_amount)}
                    className="flex-1 bg-forest text-white text-xs font-bold py-2 rounded-lg hover:bg-forest-600 transition-colors"
                  >
                    Mark Fully Paid
                  </button>
                  <button
                    onClick={() => handlePaymentUpdate(selectedBooking.id, 'partial', Math.round(selectedBooking.total_amount / 2))}
                    className="px-3 bg-cream-dark text-navy text-xs font-bold py-2 rounded-lg hover:bg-cream-muted"
                  >
                    50% Partial
                  </button>
                </div>
              </div>

              {/* Traveler Roster */}
              <div>
                <h4 className="font-bold text-navy text-xs uppercase tracking-wider mb-2">
                  Traveler Manifest ({selectedBooking.travelers.length})
                </h4>
                <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                  {selectedBooking.travelers.map((t, idx) => (
                    <div key={idx} className="bg-cream-dark/60 p-2.5 rounded-lg text-xs space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-navy">{idx + 1}. {t.name}</span>
                        {t.gender && <span className="text-navy/50">{t.age}y · {t.gender}</span>}
                      </div>
                      {t.emergency_contact && (
                        <p className="text-[11px] text-navy/50">Emergency: {t.emergency_contact}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* WhatsApp Action Button */}
              <a
                href={`https://wa.me/${selectedBooking.customer_phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `Hey ${selectedBooking.customer_name}! 🎒 This is your Trip Captain from Travel Tribe regarding your booking ${selectedBooking.booking_code} for ${selectedBooking.trip_title}. Your status is currently: ${selectedBooking.booking_status.toUpperCase()}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white font-bold py-2.5 rounded-pill hover:bg-[#20ba5a] transition-colors shadow-sm text-sm"
              >
                <MessageCircle className="w-4 h-4 fill-current" /> Chat on WhatsApp
              </a>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-card border border-navy/5 p-12 text-center text-navy/40">
              Select a booking from the list to view full details.
            </div>
          )}
        </div>
      </div>

      {/* ── Create Booking Modal ───────────────────────────────────── */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-navy/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-navy/5">
              <h3 className="font-headline font-black text-navy text-xl">Create New Student Booking</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-navy/40 hover:text-navy">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBooking} className="space-y-4 text-sm">
              <div>
                <label className="block font-bold text-navy mb-1">Trip Name</label>
                <input
                  type="text"
                  required
                  value={formData.trip_title}
                  onChange={(e) => setFormData({ ...formData, trip_title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-navy/15 text-navy font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-navy mb-1">Customer Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={formData.customer_name}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-navy/15 text-navy"
                  />
                </div>
                <div>
                  <label className="block font-bold text-navy mb-1">Phone (10 Digits)</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 95992 33810"
                    value={formData.customer_phone}
                    onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-navy/15 text-navy font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-navy mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="rahul@college.edu"
                  value={formData.customer_email}
                  onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-navy/15 text-navy"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-navy mb-1">Travelers</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.num_travelers}
                    onChange={(e) => setFormData({ ...formData, num_travelers: parseInt(e.target.value) || 1 })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-navy/15 text-navy"
                  />
                </div>
                <div>
                  <label className="block font-bold text-navy mb-1">Total (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.total_amount}
                    onChange={(e) => setFormData({ ...formData, total_amount: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-navy/15 text-navy font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-navy mb-1">Paid (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.amount_paid}
                    onChange={(e) => setFormData({ ...formData, amount_paid: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-navy/15 text-forest font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-navy mb-1">Booking Status</label>
                  <select
                    value={formData.booking_status}
                    onChange={(e) => setFormData({ ...formData, booking_status: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-navy/15 bg-white text-navy font-bold"
                  >
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-navy mb-1">Payment Status</label>
                  <select
                    value={formData.payment_status}
                    onChange={(e) => setFormData({ ...formData, payment_status: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-navy/15 bg-white text-navy font-bold"
                  >
                    <option value="paid">Paid</option>
                    <option value="partial">Partial</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-navy mb-1">Internal Notes</label>
                <textarea
                  rows={2}
                  placeholder="Add any special requirements, seat requests, or diet info..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-navy/15 text-navy"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 bg-orange text-white font-bold py-3 rounded-pill hover:bg-orange-600 shadow-orange transition-colors"
                >
                  {actionLoading ? 'Creating...' : 'Save & Confirm Booking'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-5 py-3 border border-navy/15 rounded-pill text-navy font-semibold hover:bg-cream-dark transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
