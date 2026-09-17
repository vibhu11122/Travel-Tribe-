'use client'

import { useState, useEffect } from 'react'
import {
  Users,
  Search,
  Plus,
  Shield,
  Compass,
  MapPin,
  GraduationCap,
  Mail,
  Phone,
  Calendar,
  X,
  CheckCircle2,
  AlertCircle,
  Ticket,
  ChevronRight,
  MessageCircle,
  Loader2,
} from 'lucide-react'
import { formatPrice, cn } from '@/lib/utils/format'
import type { AdminUser } from '@/lib/types'

const ROLE_BADGES: Record<string, { label: string, color: string, icon: any }> = {
  admin: { label: 'Admin', color: 'bg-orange/10 text-orange border-orange/20', icon: Shield },
  trip_captain: { label: 'Trip Captain', color: 'bg-forest/10 text-forest border-forest/20', icon: Compass },
  traveler: { label: 'Student Traveler', color: 'bg-navy/10 text-navy border-navy/20', icon: Users },
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRole, setSelectedRole] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [userBookings, setUserBookings] = useState<any[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  // Add user form
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    role: 'traveler' as any,
    college: '',
    city: '',
    status: 'active' as any,
  })

  async function fetchUsers() {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/users')
      const data = await res.json()
      if (data.users) {
        setUsers(data.users)
        if (!selectedUser && data.users.length > 0) {
          handleSelectUser(data.users[0])
        }
      }
    } catch (err) {
      console.error('Failed to fetch users:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  async function handleSelectUser(user: AdminUser) {
    setSelectedUser(user)
    try {
      const res = await fetch(`/api/admin/users/${user.id}`)
      const data = await res.json()
      if (data.bookings) {
        setUserBookings(data.bookings)
      }
    } catch {}
  }

  async function handleRoleUpdate(userId: string, newRole: string) {
    try {
      setActionLoading(true)
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      })
      const data = await res.json()
      if (data.user) {
        setUsers(prev => prev.map(u => u.id === userId ? data.user : u))
        setSelectedUser(data.user)
      }
    } catch (err) {
      console.error('Failed to update role:', err)
    } finally {
      setActionLoading(false)
    }
  }

  async function handleStatusToggle(userId: string, currentStatus: string) {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active'
    try {
      setActionLoading(true)
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      const data = await res.json()
      if (data.user) {
        setUsers(prev => prev.map(u => u.id === userId ? data.user : u))
        setSelectedUser(data.user)
      }
    } catch (err) {
      console.error('Failed to toggle status:', err)
    } finally {
      setActionLoading(false)
    }
  }

  async function handleAddUser(e: React.FormEvent) {
    e.preventDefault()
    try {
      setActionLoading(true)
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (data.user) {
        setUsers(prev => [data.user, ...prev])
        setSelectedUser(data.user)
        setShowAddModal(false)
        setFormData({
          full_name: '',
          email: '',
          phone: '',
          role: 'traveler',
          college: '',
          city: '',
          status: 'active',
        })
      }
    } catch (err) {
      console.error('Failed to add user:', err)
    } finally {
      setActionLoading(false)
    }
  }

  const filteredUsers = users.filter((u) => {
    const matchesRole = selectedRole === 'all' || u.role === selectedRole
    const matchesQuery = searchQuery === '' ||
      u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.phone && u.phone.includes(searchQuery)) ||
      (u.college && u.college.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.city && u.city.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesRole && matchesQuery
  })

  return (
    <div className="space-y-6">
      {/* ── Header ────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-headline font-black text-navy text-2xl">Users & Roles Directory</h2>
          <p className="text-navy/60 text-sm">Manage student profiles, trip captains, and administrator permissions.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-orange text-white font-bold px-5 py-2.5 rounded-pill hover:bg-orange-600 transition-colors text-sm shadow-orange"
        >
          <Plus className="w-4 h-4" /> Add User
        </button>
      </div>

      {/* ── Filters & Search ──────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex gap-2">
          {['all', 'admin', 'trip_captain', 'traveler'].map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={cn(
                'px-4 py-2 rounded-pill text-xs font-bold capitalize transition-all',
                selectedRole === role
                  ? 'bg-navy text-white shadow-sm'
                  : 'bg-white text-navy/60 border border-navy/10 hover:border-navy/30'
              )}
            >
              {role === 'all' ? 'All Roles' : role === 'trip_captain' ? 'Captains' : role}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-navy/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search name, college, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-full border border-navy/15 text-xs text-navy focus:outline-none focus:border-orange bg-white"
          />
        </div>
      </div>

      {/* ── User List & Detail Panel ──────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Users Table */}
        <div className="lg:col-span-7 bg-white rounded-xl shadow-card border border-navy/5 overflow-hidden">
          {loading ? (
            <div className="p-12 flex justify-center text-navy/40">
              <Loader2 className="w-6 h-6 animate-spin text-orange" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-cream-dark border-b border-navy/5">
                  <tr>
                    {['Member', 'Role', 'College / City', 'Trips', 'Status'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 font-bold text-navy/60 text-xs uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy/5">
                  {filteredUsers.map((u) => {
                    const badge = ROLE_BADGES[u.role] || ROLE_BADGES.traveler
                    const Icon = badge.icon
                    const isSelected = selectedUser?.id === u.id
                    return (
                      <tr
                        key={u.id}
                        onClick={() => handleSelectUser(u)}
                        className={cn(
                          'cursor-pointer transition-colors',
                          isSelected ? 'bg-orange/5 font-medium' : 'hover:bg-cream/50'
                        )}
                      >
                        <td className="px-4 py-3.5">
                          <p className="font-bold text-navy">{u.full_name}</p>
                          <p className="text-navy/40 text-xs">{u.email}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border', badge.color)}>
                            <Icon className="w-3 h-3" />
                            {badge.label}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="text-navy/80 text-xs font-semibold">{u.college || '—'}</p>
                          <p className="text-navy/40 text-[11px]">{u.city}</p>
                        </td>
                        <td className="px-4 py-3.5 font-bold text-orange">
                          {u.trips_booked}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={cn(
                            'px-2 py-0.5 rounded-full text-[11px] font-bold capitalize',
                            u.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                          )}>
                            {u.status}
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

        {/* Selected User Inspector */}
        <div className="lg:col-span-5">
          {selectedUser ? (
            <div className="bg-white rounded-xl shadow-card border border-navy/5 p-6 space-y-5 sticky top-20">
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-navy/5">
                <div>
                  <h3 className="font-headline font-black text-navy text-xl">{selectedUser.full_name}</h3>
                  <p className="text-navy/50 text-xs mt-0.5">{selectedUser.email}</p>
                </div>
                <button
                  onClick={() => handleStatusToggle(selectedUser.id, selectedUser.status)}
                  className={cn(
                    'text-xs font-bold px-3 py-1.5 rounded-pill border transition-colors',
                    selectedUser.status === 'active'
                      ? 'border-red-200 text-red-600 hover:bg-red-50'
                      : 'border-green-200 text-green-700 hover:bg-green-50'
                  )}
                >
                  {selectedUser.status === 'active' ? 'Suspend' : 'Activate'}
                </button>
              </div>

              {/* Role Switcher */}
              <div>
                <label className="text-xs font-bold text-navy/50 uppercase tracking-wider block mb-2">
                  Access & Permission Role
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['admin', 'trip_captain', 'traveler'] as const).map((r) => (
                    <button
                      key={r}
                      disabled={actionLoading}
                      onClick={() => handleRoleUpdate(selectedUser.id, r)}
                      className={cn(
                        'py-2 px-2 rounded-xl text-xs font-bold capitalize border transition-all text-center',
                        selectedUser.role === r
                          ? 'bg-navy text-white border-navy shadow-sm'
                          : 'bg-white text-navy/70 border-navy/15 hover:border-navy/30'
                      )}
                    >
                      {r === 'trip_captain' ? 'Trip Captain' : r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Profile Details */}
              <div className="bg-cream p-4 rounded-xl space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-navy/60 flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5 text-navy/40" /> College / Batch:</span>
                  <span className="font-bold text-navy">{selectedUser.college || 'Not Specified'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-navy/60 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-navy/40" /> Base City:</span>
                  <span className="font-semibold text-navy">{selectedUser.city || 'India'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-navy/60 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-navy/40" /> Contact Phone:</span>
                  <a href={`tel:${selectedUser.phone}`} className="font-bold text-orange hover:underline font-mono">
                    {selectedUser.phone || '—'}
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-navy/60">Total Expeditions:</span>
                  <span className="font-bold text-navy">{selectedUser.trips_booked} Trips</span>
                </div>
              </div>

              {/* Bookings History */}
              <div>
                <h4 className="font-bold text-navy text-xs uppercase tracking-wider mb-2">
                  Booking History ({userBookings.length})
                </h4>
                {userBookings.length === 0 ? (
                  <p className="text-xs text-navy/40 italic p-3 bg-cream-dark/50 rounded-lg">No active bookings recorded.</p>
                ) : (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {userBookings.map((b) => (
                      <div key={b.id} className="p-3 bg-cream-dark/60 rounded-xl text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-navy">{b.trip_title}</span>
                          <span className="font-bold text-forest">{formatPrice(b.total_amount)}</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-navy/50">
                          <span>{b.booking_code} · {b.travel_date}</span>
                          <span className="capitalize font-semibold text-orange">{b.booking_status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Contact Actions */}
              {selectedUser.phone && (
                <a
                  href={`https://wa.me/${selectedUser.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white font-bold py-2.5 rounded-pill hover:bg-[#20ba5a] transition-colors shadow-sm text-sm"
                >
                  <MessageCircle className="w-4 h-4 fill-current" /> WhatsApp Member
                </a>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-card border border-navy/5 p-12 text-center text-navy/40">
              Select a member from the directory to manage roles and bookings.
            </div>
          )}
        </div>
      </div>

      {/* ── Add User Modal ─────────────────────────────────────────── */}
      {showAddModal && (
        <div className="fixed inset-0 bg-navy/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-navy/5">
              <h3 className="font-headline font-black text-navy text-xl">Add New Team / User</h3>
              <button onClick={() => setShowAddModal(false)} className="text-navy/40 hover:text-navy">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-4 text-sm">
              <div>
                <label className="block font-bold text-navy mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aditi Rao"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-navy/15 text-navy"
                />
              </div>

              <div>
                <label className="block font-bold text-navy mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="aditi@college.ac.in"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-navy/15 text-navy"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-navy mb-1">Phone</label>
                  <input
                    type="tel"
                    placeholder="+91 95992 33810"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-navy/15 text-navy"
                  />
                </div>
                <div>
                  <label className="block font-bold text-navy mb-1">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-navy/15 bg-white text-navy font-bold"
                  >
                    <option value="traveler">Student Traveler</option>
                    <option value="trip_captain">Trip Captain</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-navy mb-1">College</label>
                  <input
                    type="text"
                    placeholder="e.g. IIM Bangalore"
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-navy/15 text-navy"
                  />
                </div>
                <div>
                  <label className="block font-bold text-navy mb-1">City</label>
                  <input
                    type="text"
                    placeholder="e.g. Delhi NCR"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-navy/15 text-navy"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 bg-orange text-white font-bold py-3 rounded-pill hover:bg-orange-600 shadow-orange transition-colors"
                >
                  {actionLoading ? 'Saving...' : 'Save User'}
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
    </div>
  )
}
