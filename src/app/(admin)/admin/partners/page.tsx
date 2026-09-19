'use client'

import { useState, useEffect } from 'react'
import {
  Handshake,
  Plus,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  Clock,
  X,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  MessageCircle,
  ShieldCheck,
  Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils/format'
import type { AdminPartner } from '@/lib/types'

const CATEGORIES = ['All', 'Transport', 'Stay', 'Activities', 'Equipment']

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<AdminPartner[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingPartner, setEditingPartner] = useState<AdminPartner | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    category: 'Stay' as any,
    location: '',
    contact_person: '',
    phone: '',
    email: '',
    status: 'Active' as any,
    is_verified: true,
    commission_rate: '',
    notes: '',
  })

  async function fetchPartners() {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/partners', { cache: 'no-store' })
      const data = await res.json()
      if (data.partners) setPartners(data.partners)
    } catch (err) {
      console.error('Failed to fetch partners:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPartners()
  }, [])

  async function handleAddPartner(e: React.FormEvent) {
    e.preventDefault()
    try {
      setActionLoading(true)
      const res = await fetch('/api/admin/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (data.partner) {
        setPartners(prev => [data.partner, ...prev])
        setShowAddModal(false)
        setFormData({
          name: '',
          category: 'Stay',
          location: '',
          contact_person: '',
          phone: '',
          email: '',
          status: 'Active',
          is_verified: true,
          commission_rate: '',
          notes: '',
        })
      }
    } catch (err) {
      console.error('Failed to add partner:', err)
    } finally {
      setActionLoading(false)
    }
  }

  async function handleUpdatePartner(e: React.FormEvent) {
    e.preventDefault()
    if (!editingPartner) return
    try {
      setActionLoading(true)
      const res = await fetch(`/api/admin/partners/${editingPartner.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingPartner),
      })
      const data = await res.json()
      if (data.partner) {
        setPartners(prev => prev.map(p => p.id === editingPartner.id ? data.partner : p))
        setEditingPartner(null)
      }
    } catch (err) {
      console.error('Failed to update partner:', err)
    } finally {
      setActionLoading(false)
    }
  }

  async function handleDeletePartner(id: string) {
    if (!confirm('Are you sure you want to delete this vendor partner?')) return
    try {
      await fetch(`/api/admin/partners/${id}`, { method: 'DELETE' })
      setPartners(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      console.error('Failed to delete partner:', err)
    }
  }

  async function toggleVerification(id: string, current: boolean) {
    try {
      const res = await fetch(`/api/admin/partners/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_verified: !current }),
      })
      const data = await res.json()
      if (data.partner) {
        setPartners(prev => prev.map(p => p.id === id ? data.partner : p))
      }
    } catch {}
  }

  const filteredPartners = partners.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase()
    const matchesQuery = searchQuery === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.contact_person.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.includes(searchQuery) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesQuery
  })

  return (
    <div className="space-y-6">
      {/* ── Header ────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-headline font-black text-navy text-2xl">Travel & Vendor Partners</h2>
          <p className="text-navy/60 text-sm">Vetted operators, stays, transport providers, and activity coordinators across India.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-orange text-white font-bold px-5 py-2.5 rounded-pill hover:bg-orange-600 transition-colors text-sm shadow-orange"
        >
          <Plus className="w-4 h-4" /> Add Partner
        </button>
      </div>

      {/* ── Category Filters & Search ─────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                'px-4 py-2 rounded-pill text-xs font-bold transition-all whitespace-nowrap',
                selectedCategory === cat
                  ? 'bg-navy text-white shadow-sm'
                  : 'bg-white text-navy/60 border border-navy/10 hover:border-navy/30'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-navy/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search vendor name, location, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-full border border-navy/15 text-xs text-navy focus:outline-none focus:border-orange bg-white"
          />
        </div>
      </div>

      {/* ── Partners Grid ─────────────────────────────────────────── */}
      {loading ? (
        <div className="p-16 flex justify-center text-navy/40">
          <Loader2 className="w-6 h-6 animate-spin text-orange" />
        </div>
      ) : filteredPartners.length === 0 ? (
        <div className="bg-white rounded-xl shadow-card border border-navy/5 p-12 text-center text-navy/40 space-y-2">
          <Handshake className="w-10 h-10 mx-auto text-navy/20" />
          <p className="font-semibold text-navy">No vendor partners found</p>
          <p className="text-xs">Adjust your search or add a new vendor.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPartners.map((partner) => (
            <div key={partner.id} className="bg-white rounded-xl p-5 shadow-card border border-navy/5 space-y-3 relative group">
              <div className="flex items-start justify-between">
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-pill text-xs font-bold uppercase tracking-wider bg-cream-dark text-navy mb-1.5">
                    {partner.category}
                  </span>
                  <h3 className="font-headline font-black text-navy text-lg leading-tight">{partner.name}</h3>
                  <p className="text-navy/50 text-xs flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-orange" /> {partner.location}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    'px-2.5 py-0.5 rounded-pill text-xs font-bold',
                    partner.status === 'Active' ? 'bg-green-100 text-green-700' :
                    partner.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'
                  )}>
                    {partner.status}
                  </span>
                  <button
                    onClick={() => setEditingPartner(partner)}
                    className="text-navy/40 hover:text-navy p-1 rounded hover:bg-cream-dark transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeletePartner(partner.id)}
                    className="text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {partner.notes && (
                <p className="text-xs text-navy/70 bg-cream-dark/50 p-2.5 rounded-lg italic">
                  "{partner.notes}"
                </p>
              )}

              <div className="pt-2 border-t border-navy/5 text-xs space-y-1.5 text-navy/70">
                <div className="flex items-center justify-between">
                  <span>Contact Representative:</span>
                  <strong className="text-navy">{partner.contact_person}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-navy/40" /> Phone:</span>
                  <div className="flex items-center gap-2">
                    <a href={`tel:${partner.phone}`} className="text-orange hover:underline font-mono font-bold">
                      {partner.phone}
                    </a>
                    <a
                      href={`https://wa.me/${partner.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#25D366] hover:opacity-80"
                      title="WhatsApp Vendor"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-current" />
                    </a>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-navy/40" /> Email:</span>
                  <a href={`mailto:${partner.email}`} className="text-navy/80 hover:text-navy hover:underline">
                    {partner.email}
                  </a>
                </div>
                {partner.commission_rate && (
                  <div className="flex items-center justify-between text-forest font-semibold">
                    <span>Agreed Terms / Pricing:</span>
                    <span>{partner.commission_rate}</span>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-navy/5 flex items-center justify-between text-xs">
                <span className="text-navy/50">Trips Coordinated: <strong className="text-navy">{partner.trips_count}</strong></span>
                <button
                  onClick={() => toggleVerification(partner.id, partner.is_verified)}
                  className={cn(
                    'flex items-center gap-1 font-bold text-xs px-2.5 py-1 rounded-full border transition-all',
                    partner.is_verified
                      ? 'bg-forest/10 border-forest/30 text-forest'
                      : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-400'
                  )}
                >
                  <CheckCircle className="w-3.5 h-3.5" /> {partner.is_verified ? 'Verified Vendor' : 'Unverified'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Add Partner Modal ──────────────────────────────────────── */}
      {showAddModal && (
        <div className="fixed inset-0 bg-navy/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-navy/5">
              <h3 className="font-headline font-black text-navy text-xl">Add Vendor Partner</h3>
              <button onClick={() => setShowAddModal(false)} className="text-navy/40 hover:text-navy">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPartner} className="space-y-4 text-sm">
              <div>
                <label className="block font-bold text-navy mb-1">Company / Vendor Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Solang Adventure Outfitters"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-navy/15 text-navy"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-navy mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-navy/15 bg-white text-navy font-bold"
                  >
                    <option value="Transport">Transport</option>
                    <option value="Stay">Stay / Hotel / Camp</option>
                    <option value="Activities">Activities / Rafting</option>
                    <option value="Equipment">Equipment Rental</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-navy mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-navy/15 bg-white text-navy font-bold"
                  >
                    <option value="Active">Active</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-navy mb-1">Operating Location</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Manali, Himachal Pradesh"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-navy/15 text-navy"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-navy mb-1">Contact Person</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Suraj Negi"
                    value={formData.contact_person}
                    onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-navy/15 text-navy"
                  />
                </div>
                <div>
                  <label className="block font-bold text-navy mb-1">Phone</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 95992 33810"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-navy/15 text-navy"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-navy mb-1">Email</label>
                <input
                  type="email"
                  required
                  placeholder="vendor@himalayantravel.in"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-navy/15 text-navy"
                />
              </div>

              <div>
                <label className="block font-bold text-navy mb-1">Pricing Terms / Rates</label>
                <input
                  type="text"
                  placeholder="e.g. 10% B2B discount / ₹600 per pax"
                  value={formData.commission_rate}
                  onChange={(e) => setFormData({ ...formData, commission_rate: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-navy/15 text-navy"
                />
              </div>

              <div>
                <label className="block font-bold text-navy mb-1">Operational Notes</label>
                <textarea
                  rows={2}
                  placeholder="Fleet details, room capacity, safety certifications..."
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
                  {actionLoading ? 'Saving...' : 'Save Partner'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-3 border border-navy/15 rounded-pill text-navy font-semibold hover:bg-cream-dark transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Edit Partner Modal ─────────────────────────────────────── */}
      {editingPartner && (
        <div className="fixed inset-0 bg-navy/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-navy/5">
              <h3 className="font-headline font-black text-navy text-xl">Edit Partner Details</h3>
              <button onClick={() => setEditingPartner(null)} className="text-navy/40 hover:text-navy">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdatePartner} className="space-y-4 text-sm">
              <div>
                <label className="block font-bold text-navy mb-1">Company / Vendor Name</label>
                <input
                  type="text"
                  required
                  value={editingPartner.name}
                  onChange={(e) => setEditingPartner({ ...editingPartner, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-navy/15 text-navy font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-navy mb-1">Category</label>
                  <select
                    value={editingPartner.category}
                    onChange={(e) => setEditingPartner({ ...editingPartner, category: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-navy/15 bg-white text-navy font-bold"
                  >
                    <option value="Transport">Transport</option>
                    <option value="Stay">Stay</option>
                    <option value="Activities">Activities</option>
                    <option value="Equipment">Equipment</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-navy mb-1">Status</label>
                  <select
                    value={editingPartner.status}
                    onChange={(e) => setEditingPartner({ ...editingPartner, status: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-navy/15 bg-white text-navy font-bold"
                  >
                    <option value="Active">Active</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-navy mb-1">Location</label>
                <input
                  type="text"
                  required
                  value={editingPartner.location}
                  onChange={(e) => setEditingPartner({ ...editingPartner, location: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-navy/15 text-navy"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-navy mb-1">Contact Person</label>
                  <input
                    type="text"
                    required
                    value={editingPartner.contact_person}
                    onChange={(e) => setEditingPartner({ ...editingPartner, contact_person: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-navy/15 text-navy"
                  />
                </div>
                <div>
                  <label className="block font-bold text-navy mb-1">Phone</label>
                  <input
                    type="tel"
                    required
                    value={editingPartner.phone}
                    onChange={(e) => setEditingPartner({ ...editingPartner, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-navy/15 text-navy"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-navy mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={editingPartner.email}
                  onChange={(e) => setEditingPartner({ ...editingPartner, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-navy/15 text-navy"
                />
              </div>

              <div>
                <label className="block font-bold text-navy mb-1">Pricing Terms / Rates</label>
                <input
                  type="text"
                  value={editingPartner.commission_rate || ''}
                  onChange={(e) => setEditingPartner({ ...editingPartner, commission_rate: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-navy/15 text-navy"
                />
              </div>

              <div>
                <label className="block font-bold text-navy mb-1">Operational Notes</label>
                <textarea
                  rows={2}
                  value={editingPartner.notes || ''}
                  onChange={(e) => setEditingPartner({ ...editingPartner, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-navy/15 text-navy"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 bg-orange text-white font-bold py-3 rounded-pill hover:bg-orange-600 shadow-orange transition-colors"
                >
                  {actionLoading ? 'Saving...' : 'Update Partner'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingPartner(null)}
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
