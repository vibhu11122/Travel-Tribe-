import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getAdminUsers, setAdminUsers, addAdminUser } from '@/lib/data/admin-store'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import type { AdminUser } from '@/lib/types'

const userSchema = z.object({
  email: z.string().email('Invalid email address'),
  full_name: z.string().min(2, 'Name is required'),
  phone: z.string().optional(),
  role: z.enum(['admin', 'trip_captain', 'traveler']).default('traveler'),
  is_admin: z.boolean().default(false),
  college: z.string().optional(),
  city: z.string().optional(),
  status: z.enum(['active', 'suspended']).default('active'),
})

// ─── GET /api/admin/users ───────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const role = searchParams.get('role')
    const status = searchParams.get('status')
    const query = searchParams.get('q')?.toLowerCase()

    if (isSupabaseConfigured()) {
      try {
        const { createClient } = await import('@/lib/supabase/server')
        const supabase = await createClient()
        let dbQuery = (supabase as any).from('profiles').select('*').order('created_at', { ascending: false })

        if (role && role !== 'all') dbQuery = dbQuery.eq('role', role)
        if (status && status !== 'all') dbQuery = dbQuery.eq('status', status)

        const { data, error } = await dbQuery
        if (!error && data && data.length > 0) {
          return NextResponse.json({ success: true, users: data })
        }
      } catch {}
    }

    let users = getAdminUsers()

    if (role && role !== 'all') {
      users = users.filter(u => u.role === role)
    }

    if (status && status !== 'all') {
      users = users.filter(u => u.status === status)
    }

    if (query) {
      users = users.filter(u =>
        u.full_name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query) ||
        (u.phone && u.phone.includes(query)) ||
        (u.college && u.college.toLowerCase().includes(query)) ||
        (u.city && u.city.toLowerCase().includes(query))
      )
    }

    return NextResponse.json({
      success: true,
      users,
      total: users.length,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch users' }, { status: 500 })
  }
}

// ─── POST /api/admin/users (Create User / Assign Role) ───────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = userSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const d = parsed.data
    const now = new Date().toISOString()
    const newUser: AdminUser = {
      id: `user_${Date.now()}`,
      email: d.email,
      full_name: d.full_name,
      phone: d.phone || '',
      role: d.role,
      is_admin: d.is_admin || d.role === 'admin',
      college: d.college || '',
      city: d.city || '',
      trips_booked: 0,
      total_spent: 0,
      status: d.status,
      created_at: now,
      last_active: now,
    }

    try {
      const { createClient } = await import('@/lib/supabase/server')
      const supabase = await createClient()
      await (supabase as any).from('profiles').insert(newUser as any)
    } catch {}

    addAdminUser(newUser)

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      user: newUser,
    }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create user' }, { status: 500 })
  }
}
