import { NextRequest, NextResponse } from 'next/server'
import { getAdminUsers, setAdminUsers, getAdminBookings } from '@/lib/data/admin-store'
import type { AdminUser } from '@/lib/types'

// ─── GET /api/admin/users/[id] (User Profile & Booking History) ──────────────
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const users = getAdminUsers()
    const user = users.find(u => u.id === id || u.email === id)

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const bookings = getAdminBookings().filter(b => b.customer_email.toLowerCase() === user.email.toLowerCase())

    return NextResponse.json({
      success: true,
      user,
      bookings,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch user' }, { status: 500 })
  }
}

// ─── PUT /api/admin/users/[id] (Update Role / Status) ────────────────────────
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const updates = await req.json()
    const users = getAdminUsers()
    const index = users.findIndex(u => u.id === id || u.email === id)

    if (index === -1) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const updatedUser: AdminUser = {
      ...users[index],
      ...updates,
      is_admin: updates.role === 'admin' ? true : (updates.is_admin ?? users[index].is_admin),
      last_active: new Date().toISOString(),
    }

    users[index] = updatedUser
    setAdminUsers([...users])

    try {
      const { createClient } = await import('@/lib/supabase/server')
      const supabase = await createClient()
      await (supabase as any).from('profiles').update(updates as any).eq('id', updatedUser.id)
    } catch {}

    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
      user: updatedUser,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update user' }, { status: 500 })
  }
}

// ─── DELETE /api/admin/users/[id] ───────────────────────────────────────────
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const users = getAdminUsers()
    const filtered = users.filter(u => u.id !== id && u.email !== id)

    if (filtered.length === users.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    setAdminUsers(filtered)

    try {
      const { createClient } = await import('@/lib/supabase/server')
      const supabase = await createClient()
      await (supabase as any).from('profiles').delete().eq('id', id)
    } catch {}

    return NextResponse.json({ success: true, message: 'User deleted successfully' })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete user' }, { status: 500 })
  }
}
