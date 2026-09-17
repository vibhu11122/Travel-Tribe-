import { NextRequest, NextResponse } from 'next/server'
import { getAdminPartners, setAdminPartners } from '@/lib/data/admin-store'
import type { AdminPartner } from '@/lib/types'

// ─── GET /api/admin/partners/[id] ───────────────────────────────────────────
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const partners = getAdminPartners()
    const partner = partners.find(p => p.id === id)

    if (!partner) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, partner })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch partner' }, { status: 500 })
  }
}

// ─── PUT /api/admin/partners/[id] ───────────────────────────────────────────
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const updates = await req.json()
    const partners = getAdminPartners()
    const index = partners.findIndex(p => p.id === id)

    if (index === -1) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 })
    }

    const updatedPartner: AdminPartner = {
      ...partners[index],
      ...updates,
      updated_at: new Date().toISOString(),
    }

    partners[index] = updatedPartner
    setAdminPartners([...partners])

    return NextResponse.json({
      success: true,
      message: 'Partner updated successfully',
      partner: updatedPartner,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update partner' }, { status: 500 })
  }
}

// ─── DELETE /api/admin/partners/[id] ────────────────────────────────────────
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const partners = getAdminPartners()
    const filtered = partners.filter(p => p.id !== id)

    if (filtered.length === partners.length) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 })
    }

    setAdminPartners(filtered)
    return NextResponse.json({ success: true, message: 'Partner deleted successfully' })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete partner' }, { status: 500 })
  }
}
