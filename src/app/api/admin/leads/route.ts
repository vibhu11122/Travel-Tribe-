import { NextRequest, NextResponse } from 'next/server'
import { getAdminLeads, setAdminLeads } from '@/lib/data/admin-store'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import type { LeadInquiry } from '@/lib/types'

// ─── GET /api/admin/leads ───────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const source = searchParams.get('source')
    const status = searchParams.get('status')
    const query = searchParams.get('q')?.toLowerCase()

    if (isSupabaseConfigured()) {
      try {
        const { createClient } = await import('@/lib/supabase/server')
        const supabase = await createClient()
        let dbQuery = (supabase as any).from('inquiries').select('*').order('created_at', { ascending: false })

        if (source && source !== 'all') dbQuery = dbQuery.eq('source', source)
        if (status && status !== 'all') dbQuery = dbQuery.eq('status', status)

        const { data, error } = await dbQuery
        if (!error && data && data.length > 0) {
          return NextResponse.json({ success: true, leads: data })
        }
      } catch {}
    }

    const dynamicLeads = getAdminLeads()
    let results = [...dynamicLeads]

    if (source && source !== 'all') {
      results = results.filter(l => l.source === source)
    }

    if (status && status !== 'all') {
      results = results.filter(l => l.status === status)
    }

    if (query) {
      results = results.filter(l =>
        (l.sender_name && l.sender_name.toLowerCase().includes(query)) ||
        (l.sender_phone && l.sender_phone.includes(query)) ||
        (l.message && l.message.toLowerCase().includes(query)) ||
        (l.trip_title && l.trip_title.toLowerCase().includes(query))
      )
    }

    return NextResponse.json({
      success: true,
      leads: results,
      total: results.length,
      stats: {
        total: dynamicLeads.length,
        new: dynamicLeads.filter(l => l.status === 'new').length,
        whatsapp: dynamicLeads.filter(l => l.source === 'whatsapp').length,
        converted: dynamicLeads.filter(l => l.status === 'converted').length,
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch leads' }, { status: 500 })
  }
}

// ─── PUT /api/admin/leads (Update Lead Status / Notes) ──────────────────────
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, status, internal_notes } = body

    if (!id) {
      return NextResponse.json({ error: 'Lead ID is required' }, { status: 400 })
    }

    const dynamicLeads = getAdminLeads()
    const index = dynamicLeads.findIndex(l => l.id === id)
    if (index === -1) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    dynamicLeads[index] = {
      ...dynamicLeads[index],
      ...(status ? { status } : {}),
      ...(internal_notes !== undefined ? { internal_notes } : {}),
      updated_at: new Date().toISOString(),
    }
    setAdminLeads([...dynamicLeads])

    try {
      const { createClient } = await import('@/lib/supabase/server')
      const supabase = await createClient()
      await (supabase as any).from('inquiries').update({
        ...(status ? { status } : {}),
        ...(internal_notes !== undefined ? { internal_notes } : {}),
      } as any).eq('id', id)
    } catch {}

    return NextResponse.json({
      success: true,
      message: 'Lead updated successfully',
      lead: dynamicLeads[index],
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update lead' }, { status: 500 })
  }
}

// ─── DELETE /api/admin/leads ────────────────────────────────────────────────
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Lead ID is required' }, { status: 400 })
    }

    const filtered = getAdminLeads().filter(l => l.id !== id)
    setAdminLeads(filtered)

    try {
      const { createClient } = await import('@/lib/supabase/server')
      const supabase = await createClient()
      await (supabase as any).from('inquiries').delete().eq('id', id)
    } catch {}

    return NextResponse.json({ success: true, message: 'Lead deleted' })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete lead' }, { status: 500 })
  }
}
