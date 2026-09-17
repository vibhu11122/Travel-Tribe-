'use client'

import { useState, useEffect } from 'react'
import {
  TrendingUp,
  Users,
  DollarSign,
  MapPin,
  Calendar,
  Award,
  Download,
  MessageCircle,
  Globe,
  GraduationCap,
  ArrowUpRight,
  Loader2,
  PieChart,
} from 'lucide-react'
import { formatPrice, cn } from '@/lib/utils/format'

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('All Time')

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        setLoading(true)
        const res = await fetch('/api/admin/analytics')
        const json = await res.json()
        setData(json)
      } catch (err) {
        console.error('Failed to load analytics:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [])

  function downloadFinancialSummary() {
    if (!data) return
    const headers = ['Month', 'Revenue (INR)', 'Bookings Count', 'Travelers Count']
    const rows = data.monthly_revenue.map((m: any) => [m.month, m.revenue, m.bookings, m.travelers])
    const csvContent = [headers.join(','), ...rows.map((r: any) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `travel_tribe_financial_summary_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading || !data) {
    return (
      <div className="p-20 flex flex-col items-center justify-center text-navy/40 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-orange" />
        <p className="text-sm font-semibold">Calculating traction & financial analytics...</p>
      </div>
    )
  }

  const { metrics, monthly_revenue, top_destinations, channel_breakdown, top_colleges } = data
  const maxMonthlyRevenue = Math.max(...monthly_revenue.map((m: any) => m.revenue), 150000)

  return (
    <div className="space-y-8">
      {/* ── Header & Time Range ───────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-headline font-black text-navy text-2xl">Financials & Growth Analytics</h2>
          <p className="text-navy/60 text-sm">Aggregated revenue performance, customer acquisition, and destination traction.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white rounded-pill p-1 border border-navy/10 text-xs font-bold text-navy">
            {['30 Days', '90 Days', 'This Year', 'All Time'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={cn(
                  'px-3 py-1.5 rounded-pill transition-all',
                  timeRange === range ? 'bg-navy text-white shadow-sm' : 'text-navy/60 hover:text-navy'
                )}
              >
                {range}
              </button>
            ))}
          </div>
          <button
            onClick={downloadFinancialSummary}
            className="flex items-center gap-2 bg-orange text-white font-bold px-4 py-2.5 rounded-pill hover:bg-orange-600 transition-colors text-xs shadow-orange whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" /> Download Report
          </button>
        </div>
      </div>

      {/* ── Summary KPI Grid ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white rounded-2xl p-5 shadow-card border border-navy/5">
          <div className="flex items-center justify-between text-navy/40 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Gross Revenue</span>
            <DollarSign className="w-4 h-4 text-forest" />
          </div>
          <p className="text-3xl font-headline font-black text-navy">₹{metrics.total_revenue.toLocaleString('en-IN')}</p>
          <span className="text-xs text-forest font-bold mt-1 inline-flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +34% vs prior quarter
          </span>
        </div>

        {/* Total Profit */}
        <div className="bg-white rounded-2xl p-5 shadow-card border border-navy/5">
          <div className="flex items-center justify-between text-navy/40 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Net Operating Margin</span>
            <TrendingUp className="w-4 h-4 text-orange" />
          </div>
          <p className="text-3xl font-headline font-black text-orange">₹{metrics.total_profit.toLocaleString('en-IN')}</p>
          <span className="text-xs text-navy/50 font-semibold mt-1 inline-block">~18% avg operating margin</span>
        </div>

        {/* Paying Travelers */}
        <div className="bg-white rounded-2xl p-5 shadow-card border border-navy/5">
          <div className="flex items-center justify-between text-navy/40 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Paying Travelers</span>
            <Users className="w-4 h-4 text-skyblue" />
          </div>
          <p className="text-3xl font-headline font-black text-navy">{metrics.total_paying_travelers}+</p>
          <span className="text-xs text-forest font-semibold mt-1 inline-block">Avg 22 travelers per batch</span>
        </div>

        {/* Largest Batch Record */}
        <div className="bg-white rounded-2xl p-5 shadow-card border border-navy/5">
          <div className="flex items-center justify-between text-navy/40 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Single Batch Peak</span>
            <Award className="w-4 h-4 text-gold" />
          </div>
          <p className="text-3xl font-headline font-black text-navy">58 Travelers</p>
          <span className="text-xs text-navy/50 font-semibold mt-1 inline-block">52 MBA Batch + 6 Faculty</span>
        </div>
      </div>

      {/* ── Monthly Revenue Bar Graph ─────────────────────────────── */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-card border border-navy/5 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-headline font-black text-navy text-lg">Monthly Revenue & Bookings Trajectory</h3>
            <p className="text-navy/50 text-xs">Hover over bars to inspect detailed month-on-month metrics</p>
          </div>
          <span className="text-xs font-bold text-navy/40 bg-cream-dark px-3 py-1 rounded-pill">
            2026 Fiscal
          </span>
        </div>

        <div className="h-56 flex items-end justify-between gap-3 pt-8 px-2 border-b border-navy/5 pb-2">
          {monthly_revenue.map((item: any) => {
            const heightPercent = Math.max(12, Math.round((item.revenue / maxMonthlyRevenue) * 100))
            return (
              <div key={item.month} className="flex-1 flex flex-col items-center gap-2 group relative">
                {/* Hover Tooltip */}
                <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-all bg-navy text-white text-[11px] py-1 px-2.5 rounded-lg shadow-lg whitespace-nowrap pointer-events-none z-10 font-bold">
                  ₹{item.revenue.toLocaleString('en-IN')} · {item.travelers} Travelers
                </div>

                <div
                  className="w-full max-w-[48px] bg-orange rounded-t-lg group-hover:bg-navy transition-all duration-300 shadow-sm"
                  style={{ height: `${heightPercent}%` }}
                />
                <span className="text-xs font-bold text-navy/70 group-hover:text-orange transition-colors">
                  {item.month}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Two Column: Destination Share & Acquisition Channels ──── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Destination Breakdown */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-card border border-navy/5 space-y-5">
          <div>
            <h3 className="font-headline font-black text-navy text-lg">Top Destination Circuits</h3>
            <p className="text-navy/50 text-xs">Volume distribution and gross booking values</p>
          </div>

          <div className="space-y-4">
            {top_destinations.map((dest: any) => (
              <div key={dest.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="font-bold text-navy">{dest.name}</span>
                  <span className="text-navy/60 font-semibold">
                    {dest.travelers} travelers · <strong className="text-orange">{dest.revenue}</strong>
                  </span>
                </div>
                <div className="w-full h-2.5 bg-cream-dark rounded-full overflow-hidden">
                  <div
                    className="h-full bg-navy rounded-full transition-all duration-500"
                    style={{ width: dest.share }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Lead Channels & Top Colleges */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-card border border-navy/5 space-y-6">
          <div>
            <h3 className="font-headline font-black text-navy text-lg">Inquiry Channel Breakdown</h3>
            <p className="text-navy/50 text-xs">Source channels driving student reservations</p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-cream p-4 rounded-xl text-center space-y-1">
              <div className="w-8 h-8 rounded-full bg-[#25D366]/20 text-[#25D366] flex items-center justify-center mx-auto mb-1">
                <MessageCircle className="w-4 h-4 fill-current" />
              </div>
              <span className="text-2xl font-headline font-black text-navy">{channel_breakdown.whatsapp}</span>
              <span className="text-[11px] font-bold text-navy/50 block">WhatsApp Cloud</span>
            </div>

            <div className="bg-cream p-4 rounded-xl text-center space-y-1">
              <div className="w-8 h-8 rounded-full bg-orange/20 text-orange flex items-center justify-center mx-auto mb-1">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="text-2xl font-headline font-black text-navy">{channel_breakdown.college}</span>
              <span className="text-[11px] font-bold text-navy/50 block">College Quotes</span>
            </div>

            <div className="bg-cream p-4 rounded-xl text-center space-y-1">
              <div className="w-8 h-8 rounded-full bg-skyblue/20 text-skyblue flex items-center justify-center mx-auto mb-1">
                <Globe className="w-4 h-4" />
              </div>
              <span className="text-2xl font-headline font-black text-navy">{channel_breakdown.website}</span>
              <span className="text-[11px] font-bold text-navy/50 block">Website Direct</span>
            </div>
          </div>

          {/* Top Campus Communities */}
          <div className="pt-2 border-t border-navy/5">
            <h4 className="font-bold text-navy text-xs uppercase tracking-wider mb-3">
              Campus Distribution
            </h4>
            <div className="flex flex-wrap gap-2">
              {top_colleges.map((c: any) => (
                <span
                  key={c.college}
                  className="px-3 py-1.5 rounded-full bg-cream-dark text-navy text-xs font-bold border border-navy/5 flex items-center gap-1.5"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-orange" />
                  {c.college} <span className="text-navy/40">({c.count})</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
