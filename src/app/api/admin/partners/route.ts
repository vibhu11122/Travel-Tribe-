import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getAdminPartners, setAdminPartners, addAdminPartner } from '@/lib/data/admin-store'
import type { AdminPartner } from '@/lib/types'

const partnerSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  category: z.enum(['Transport', 'Stay', 'Activities', 'Equipment']).default('Stay'),
  location: z.string().min(2, 'Location is required'),
  contact_person: z.string().min(2, 'Contact person is required'),
  phone: z.string().min(10, 'Valid phone number required'),
  email: z.string().email('Valid email required'),
  status: z.enum(['Active', 'Under Review', 'Inactive']).default('Active'),
  is_verified: z.boolean().default(true),
  commission_rate: z.string().optional(),
  notes: z.string().optional(),
})

// ─── GET /api/admin/partners ────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const query = searchParams.get('q')?.toLowerCase()

    let partners = getAdminPartners()

    if (category && category !== 'All') {
      partners = partners.filter(p => p.category.toLowerCase() === category.toLowerCase())
    }

    if (status && status !== 'All') {
      partners = partners.filter(p => p.status.toLowerCase() === status.toLowerCase())
    }

    if (query) {
      partners = partners.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.location.toLowerCase().includes(query) ||
        p.contact_person.toLowerCase().includes(query) ||
        p.phone.includes(query) ||
        p.email.toLowerCase().includes(query)
      )
    }

    return NextResponse.json({
      success: true,
      partners,
      total: partners.length,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch partners' }, { status: 500 })
  }
}

// ─── POST /api/admin/partners (Create Vendor Partner) ───────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = partnerSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const d = parsed.data
    const newPartner: AdminPartner = {
      id: `p_${Date.now()}`,
      name: d.name,
      category: d.category,
      location: d.location,
      contact_person: d.contact_person,
      phone: d.phone,
      email: d.email,
      status: d.status,
      trips_count: 0,
      is_verified: d.is_verified,
      commission_rate: d.commission_rate || '',
      notes: d.notes || '',
      created_at: new Date().toISOString(),
    }

    addAdminPartner(newPartner)

    return NextResponse.json({
      success: true,
      message: 'Partner added successfully',
      partner: newPartner,
    }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create partner' }, { status: 500 })
  }
}
