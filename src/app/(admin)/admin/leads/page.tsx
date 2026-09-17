'use client'

import { useState, useEffect } from 'react'
import {
  Inbox,
  MessageCircle,
  Download,
  Search,
  Phone,
  Mail,
  Calendar,
  MapPin,
  CheckCircle2,
  Clock,
  UserCheck,
  AlertCircle,
  X,
  FileSpreadsheet,
  Save,
  Loader2,
  Ticket,
} from 'lucide-react'
import { cn } from '@/lib/utils/format'
import type { LeadInquiry } from '@/lib/types'

const STATUSES = ['all', 'new', 'contacted', 'quoted', 'converted', 'lost']
const SOURCES = [
  { id: 'all', label: 'All Channels' },
  { id: 'whatsapp', label: 'WhatsApp Leads', icon: MessageCircle },
  { id: 'website', label: 'Website Inquiries', icon: Inbox },
  { id: 'college', label: 'College Leads', icon: Calendar },
]

const STATUS_CONFIG: Record<string, { label: string; badge: string }> = {
  new: { label: 'New', badge: 'bg-orange text-white' },
  contacted: { label: 'Contacted', badge: 'bg-blue-100 text-blue-700' },
  quoted: { label: 'Quote Sent', badge: 'bg-purple-100 text-purple-700' },
  converted: { label: 'Converted 🎉', badge: 'bg-green-100 text-green-700' },
  lost: { label: 'Closed / Lost', badge: 'bg-navy/10 text-navy/60' },
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<LeadInquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [activeSource, setActiveSource] = useState('all')
  const [activeStatus, setActiveStatus] = useState('all')
  const [search, setSearch] = useState('')
  const [selectedLead, setSelectedLead] = useState<LeadInquiry | null>(null)
  const [notesDraft, setNotesDraft] = useState('')
  const [savingNotes, setSavingNotes] = useState(false)

  async function loadLeads() {
    try {
      const res = await fetch(`/api/admin/leads?source=${activeSource}&status=${activeStatus}&q=${encodeURIComponent(search)}`)
      const data = await res.json()
      if (data.leads) {
        setLeads(data.leads)
        if (selectedLead) {
          const updated = data.leads.find((l: LeadInquiry) => l.id === selectedLead.id)
          if (updated) setSelectedLead(updated)
        }
      }
    } catch (err) {
      console.error('Failed to load leads:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLeads()
  }, [activeSource, activeStatus, search])

  function selectLead(lead: LeadInquiry) {
    setSelectedLead(lead)
    setNotesDraft(lead.internal_notes || '')
  }

  async function updateStatus(newStatus: string) {
    if (!selectedLead) return
    try {
      await fetch('/api/admin/leads', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedLead.id, status: newStatus }),
      })
      await loadLeads()
    } catch (err) {
      console.error('Failed to update status:', err)
    }
  }

  async function convertToBooking() {
    if (!selectedLead) return
    try {
      const res = await fetch('/api/admin/leads/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead_id: selectedLead.id }),
      })
      const data = await res.json()
      if (data.success) {
        alert(`Success! Created Booking ${data.booking.booking_code} and reserved capacity.`)
        await loadLeads()
      }
    } catch (err) {
      console.error('Failed to convert lead:', err)
    }
  }

  async function saveNotes() {
    if (!selectedLead) return
    setSavingNotes(true)
    try {
      await fetch('/api/admin/leads', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedLead.id, internal_notes: notesDraft }),
      })
      await loadLeads()
    } catch (err) {
      console.error('Failed to save notes:', err)
    } finally {
      setSavingNotes(false)
    }
  }

  const counts = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    whatsapp: leads.filter(l => l.source === 'whatsapp').length,
    converted: leads.filter(l => l.status === 'converted').length,
  }

  return (
    <div className="space-y-6">
      {/* ── Header & Export Action ───────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-headline font-black text-navy text-2xl">Inquiries & WhatsApp Leads</h2>
          <p className="text-navy/60 text-sm">
            Manage incoming traveler inquiries, college batch quotes, and WhatsApp spot reservations.
          </p>
        </div>

        <a
          href="/api/admin/leads/export"
          download
          className="flex items-center gap-2 bg-white border-2 border-navy/20 text-navy font-bold px-4 py-2.5 rounded-pill text-xs hover:bg-cream-dark transition-all shadow-sm w-fit"
        >
          <FileSpreadsheet className="w-4 h-4 text-forest" /> Export CSV
        </a>
      </div>

      {/* ── Summary Counters ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl shadow-card border border-navy/5">
          <span className="text-navy/50 text-xs font-bold block">All Leads</span>
          <span className="text-2xl font-headline font-black text-navy">{counts.total}</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl shadow-card border border-navy/5">
          <span className="text-orange text-xs font-bold block">New / Unhandled</span>
          <span className="text-2xl font-headline font-black text-orange">{counts.new}</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl shadow-card border border-navy/5">
          <span className="text-[#25D366] text-xs font-bold block">WhatsApp Inbound</span>
          <span className="text-2xl font-headline font-black text-[#25D366]">{counts.whatsapp}</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl shadow-card border border-navy/5">
          <span className="text-forest text-xs font-bold block">Converted</span>
          <span className="text-2xl font-headline font-black text-forest">{counts.converted}</span>
        </div>
      </div>

      {/* ── Channel Tabs & Search Filters ─────────────────────────── */}
      <div className="bg-white p-4 rounded-2xl shadow-card border border-navy/5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Channel Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {SOURCES.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSource(s.id)}
                className={cn(
                  'px-4 py-2 rounded-pill text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap',
                  activeSource === s.id
                    ? 'bg-navy text-white shadow-sm'
                    : 'bg-cream-dark text-navy/60 hover:text-navy hover:bg-cream-muted'
                )}
              >
                {s.icon && <s.icon className="w-3.5 h-3.5" />}
                {s.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-navy/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search leads, phone, trip..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-navy/15 rounded-xl text-xs bg-cream/40 focus:outline-none focus:ring-2 focus:ring-orange/30 text-navy"
            />
          </div>
        </div>

        {/* Status Filter Chips */}
        <div className="flex gap-2 flex-wrap pt-2 border-t border-navy/5 text-xs">
          <span className="text-navy/40 font-bold self-center mr-1">Status:</span>
          {STATUSES.map((st) => (
            <button
              key={st}
              onClick={() => setActiveStatus(st)}
              className={cn(
                'px-3 py-1 rounded-full font-semibold transition-all capitalize',
                activeStatus === st
                  ? 'bg-orange text-white'
                  : 'bg-cream text-navy/60 hover:bg-cream-dark'
              )}
            >
              {st === 'all' ? 'All' : st}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main Layout: Leads List + Detail Panel ─────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Leads List (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          {leads.map((lead) => {
            const isSelected = selectedLead?.id === lead.id
            const statusConfig = STATUS_CONFIG[lead.status] || { label: lead.status, badge: 'bg-navy/10 text-navy' }

            return (
              <div
                key={lead.id}
                onClick={() => selectLead(lead)}
                className={cn(
                  'bg-white rounded-2xl p-4 shadow-card border cursor-pointer transition-all hover:border-orange/30 space-y-2',
                  isSelected ? 'border-orange ring-2 ring-orange/15 shadow-orange' : 'border-navy/5'
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {lead.source === 'whatsapp' ? (
                      <span className="p-1.5 rounded-full bg-[#25D366]/15 text-[#25D366]">
                        <MessageCircle className="w-4 h-4" />
                      </span>
                    ) : (
                      <span className="p-1.5 rounded-full bg-orange/15 text-orange">
                        <Inbox className="w-4 h-4" />
                      </span>
                    )}
                    <div>
                      <h4 className="font-headline font-black text-navy text-sm leading-tight">
                        {lead.sender_name || 'Traveler'}
                      </h4>
                      <p className="text-[11px] text-navy/50 font-mono mt-0.5">
                        {lead.sender_phone || 'No phone'} · {new Date(lead.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>

                  <span className={cn('px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize flex-shrink-0', statusConfig.badge)}>
                    {statusConfig.label}
                  </span>
                </div>

                <p className="text-navy/70 text-xs line-clamp-2 leading-relaxed bg-cream/40 p-2.5 rounded-xl">
                  "{lead.message}"
                </p>

                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="font-bold text-orange truncate max-w-[240px]">
                    📍 {lead.trip_title || 'General Travel Query'}
                  </span>
                  {lead.internal_notes && (
                    <span className="text-navy/40 text-[10px] italic">📝 Has notes</span>
                  )}
                </div>
              </div>
            )
          })}

          {leads.length === 0 && !loading && (
            <div className="bg-white rounded-2xl p-12 text-center shadow-card border border-navy/5 space-y-2">
              <Inbox className="w-10 h-10 text-navy/20 mx-auto" />
              <h4 className="font-headline font-black text-navy text-base">No inquiries found</h4>
              <p className="text-navy/50 text-xs">Try resetting search filters or trigger a test webhook.</p>
            </div>
          )}
        </div>

        {/* Lead Detail Panel (5 cols) */}
        <div className="lg:col-span-5">
          {selectedLead ? (
            <div className="bg-white rounded-2xl p-5 shadow-card border border-navy/10 space-y-5 sticky top-20">
              <div className="flex items-start justify-between pb-3 border-b border-navy/10">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-navy/40 block mb-1">
                    {selectedLead.source} inquiry
                  </span>
                  <h3 className="font-headline font-black text-navy text-lg">{selectedLead.sender_name || 'Traveler'}</h3>
                  <p className="text-xs text-navy/50">Received: {new Date(selectedLead.created_at).toLocaleString('en-IN')}</p>
                </div>
                <button onClick={() => setSelectedLead(null)} className="text-navy/40 hover:text-navy p-1">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Status Selector */}
              <div>
                <label className="block text-xs font-bold text-navy mb-1.5">Lead Status</label>
                <select
                  value={selectedLead.status}
                  onChange={(e) => updateStatus(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl bg-cream-dark text-navy font-bold text-xs capitalize focus:outline-none"
                >
                  <option value="new">New (Needs Response)</option>
                  <option value="contacted">Contacted</option>
                  <option value="quoted">Quote Sent</option>
                  <option value="converted">Converted 🎉</option>
                  <option value="lost">Lost / Closed</option>
                </select>
              </div>

              {/* Full Message */}
              <div>
                <label className="block text-xs font-bold text-navy mb-1">Inquiry Message</label>
                <div className="bg-cream/60 p-3.5 rounded-xl border border-navy/10 text-xs text-navy leading-relaxed whitespace-pre-wrap">
                  {selectedLead.message}
                </div>
              </div>

              {/* Contact Info Card */}
              <div className="bg-cream-dark p-3 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-navy/60">Phone:</span>
                  <strong className="text-navy font-mono">{selectedLead.sender_phone || 'N/A'}</strong>
                </div>
                {selectedLead.sender_email && (
                  <div className="flex items-center justify-between">
                    <span className="text-navy/60">Email:</span>
                    <strong className="text-navy">{selectedLead.sender_email}</strong>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-navy/60">Selected Trip:</span>
                  <strong className="text-orange">{selectedLead.trip_title || 'General'}</strong>
                </div>
              </div>

              {/* Quick Contact Actions */}
              <div className="grid grid-cols-2 gap-2">
                {selectedLead.sender_phone && (
                  <>
                    <a
                      href={`https://wa.me/${selectedLead.sender_phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hey ${selectedLead.sender_name || 'there'}! This is your Trip Captain from Travel Tribe regarding your ${selectedLead.trip_title || 'trip'} inquiry.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 py-2.5 bg-[#25D366] text-white rounded-pill text-xs font-bold hover:bg-[#20ba5a] transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Reply
                    </a>
                    <a
                      href={`tel:${selectedLead.sender_phone}`}
                      className="flex items-center justify-center gap-1.5 py-2.5 bg-navy text-white rounded-pill text-xs font-bold hover:bg-navy-dark transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" /> Call Lead
                    </a>
                  </>
                )}
              </div>

              {/* Convert to Booking Direct Interlock */}
              {selectedLead.status !== 'converted' && (
                <button
                  onClick={convertToBooking}
                  className="flex items-center justify-center gap-2 w-full bg-orange text-white font-bold py-2.5 rounded-pill hover:bg-orange-600 transition-colors shadow-orange text-xs"
                >
                  <Ticket className="w-4 h-4" /> Convert to Confirmed Booking 🎉
                </button>
              )}

              {/* Internal Notes */}
              <div className="space-y-2 pt-2 border-t border-navy/10">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-navy">Internal Team Notes</label>
                  <button
                    onClick={saveNotes}
                    disabled={savingNotes}
                    className="text-xs text-orange font-bold hover:underline flex items-center gap-1"
                  >
                    {savingNotes ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                    Save Notes
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={notesDraft}
                  onChange={(e) => setNotesDraft(e.target.value)}
                  placeholder="Add notes about discounts offered, group size, or follow-up dates..."
                  className="w-full p-2.5 border rounded-xl text-xs text-navy resize-none bg-white focus:ring-2 focus:ring-orange/30"
                />
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-10 text-center shadow-card border border-navy/5 text-navy/40 space-y-2">
              <UserCheck className="w-8 h-8 mx-auto text-navy/20" />
              <p className="text-xs font-semibold">Select an inquiry from the list to view full details, add internal notes, and reply directly on WhatsApp.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
