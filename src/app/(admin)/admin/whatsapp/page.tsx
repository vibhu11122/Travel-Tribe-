'use client'

import { useState } from 'react'
import {
  MessageCircle,
  Send,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  Shield,
  Zap,
  Terminal,
  RefreshCw,
  Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils/format'

export default function AdminWhatsAppConsole() {
  const [testPhone, setTestPhone] = useState('919599233810')
  const [testMessage, setTestMessage] = useState('Hey there! 🎒 This is a live test from Travel Tribe WhatsApp Cloud API.')
  const [sending, setSending] = useState(false)
  const [testResult, setTestResult] = useState<any>(null)

  // Webhook Simulator State
  const [simName, setSimName] = useState('Kavya Sharma')
  const [simPhone, setSimPhone] = useState('919811122233')
  const [simMsg, setSimMsg] = useState('Hey Tribe! Want to reserve 2 spots for the Manali Adventure on Dec 20.')
  const [simulating, setSimulating] = useState(false)
  const [simResult, setSimResult] = useState<any>(null)

  const [copiedUrl, setCopiedUrl] = useState(false)
  const [copiedToken, setCopiedToken] = useState(false)

  const webhookUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/api/webhooks/whatsapp`
    : 'https://traveltribe.in/api/webhooks/whatsapp'

  const verifyToken = 'travel_tribe_verify_token_2026'

  async function handleSendTest(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    setTestResult(null)
    try {
      const res = await fetch('/api/admin/whatsapp/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: testPhone, message: testMessage }),
      })
      const data = await res.json()
      setTestResult(data)
    } catch (err: any) {
      setTestResult({ error: err.message || 'Network error' })
    } finally {
      setSending(false)
    }
  }

  async function handleSimulateWebhook(e: React.FormEvent) {
    e.preventDefault()
    setSimulating(true)
    setSimResult(null)

    const samplePayload = {
      object: 'whatsapp_business_account',
      entry: [
        {
          id: 'WHATSAPP_BUSINESS_ACCOUNT_ID',
          changes: [
            {
              value: {
                messaging_product: 'whatsapp',
                metadata: { display_phone_number: '919876543210', phone_number_id: '123456789' },
                contacts: [{ profile: { name: simName }, wa_id: simPhone }],
                messages: [
                  {
                    from: simPhone,
                    id: `wamid_sim_${Date.now()}`,
                    timestamp: Math.floor(Date.now() / 1000).toString(),
                    type: 'text',
                    text: { body: simMsg },
                  },
                ],
              },
              field: 'messages',
            },
          ],
        },
      ],
    }

    try {
      const res = await fetch('/api/webhooks/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(samplePayload),
      })
      const data = await res.json()
      setSimResult({ status: res.status, data })
    } catch (err: any) {
      setSimResult({ error: err.message })
    } finally {
      setSimulating(false)
    }
  }

  function copy(text: string, type: 'url' | 'token') {
    navigator.clipboard.writeText(text)
    if (type === 'url') {
      setCopiedUrl(true)
      setTimeout(() => setCopiedUrl(false), 2000)
    } else {
      setCopiedToken(true)
      setTimeout(() => setCopiedToken(false), 2000)
    }
  }

  return (
    <div className="space-y-8">
      {/* ── Header ───────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-[#25D366]/20 text-[#25D366]">
              <MessageCircle className="w-4 h-4" />
            </span>
            <span className="font-bold text-xs text-navy/60 uppercase tracking-wider">Meta Graph API v20.0</span>
          </div>
          <h2 className="font-headline font-black text-navy text-2xl">WhatsApp Business Cloud API Console</h2>
          <p className="text-navy/60 text-sm">
            Monitor webhook endpoints, test live message delivery, and simulate incoming traveler inquiries.
          </p>
        </div>

        <a
          href="https://developers.facebook.com/apps"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-navy text-white font-bold px-4 py-2.5 rounded-pill text-xs hover:bg-navy-700 transition-colors w-fit"
        >
          Meta Developers Portal <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* ── Webhook Configuration Card ───────────────────────────── */}
      <div className="bg-white rounded-2xl p-6 shadow-card border border-navy/5 space-y-4">
        <h3 className="font-headline font-black text-navy text-base flex items-center gap-2">
          <Zap className="w-4 h-4 text-orange" /> Meta Webhook Endpoint Configuration
        </h3>
        <p className="text-navy/60 text-xs leading-relaxed">
          Configure these values inside your Meta App Dashboard under <strong>WhatsApp → Configuration → Callback URL</strong>.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-3.5 bg-cream-dark rounded-xl border border-navy/10 space-y-1.5">
            <span className="text-[11px] font-bold text-navy/50 uppercase tracking-wider block">Callback URL (Webhook)</span>
            <div className="flex items-center justify-between gap-2">
              <code className="text-xs font-mono font-bold text-navy truncate">{webhookUrl}</code>
              <button onClick={() => copy(webhookUrl, 'url')} className="text-orange hover:text-orange-600 p-1 flex-shrink-0">
                {copiedUrl ? <CheckCircle2 className="w-4 h-4 text-forest" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="p-3.5 bg-cream-dark rounded-xl border border-navy/10 space-y-1.5">
            <span className="text-[11px] font-bold text-navy/50 uppercase tracking-wider block">Verify Token</span>
            <div className="flex items-center justify-between gap-2">
              <code className="text-xs font-mono font-bold text-navy">{verifyToken}</code>
              <button onClick={() => copy(verifyToken, 'token')} className="text-orange hover:text-orange-600 p-1 flex-shrink-0">
                {copiedToken ? <CheckCircle2 className="w-4 h-4 text-forest" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        <div className="p-3 bg-[#25D366]/10 rounded-xl border border-[#25D366]/20 flex items-center justify-between text-xs text-navy font-semibold">
          <span>Required Webhook Event Field: <strong>messages</strong></span>
          <span className="text-forest flex items-center gap-1 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" /> Ready for Subscription
          </span>
        </div>
      </div>

      {/* ── Two Column: Live Message Sender & Inbound Webhook Simulator ─ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Live Message Sender */}
        <div className="bg-white rounded-2xl p-6 shadow-card border border-navy/5 space-y-4">
          <h3 className="font-headline font-black text-navy text-base flex items-center gap-2">
            <Send className="w-4 h-4 text-orange" /> Send WhatsApp Test Message
          </h3>
          <p className="text-navy/60 text-xs">
            Send an outbound test message via Meta WhatsApp Business Cloud API.
          </p>

          <form onSubmit={handleSendTest} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-navy mb-1">Recipient Phone (Country code + digits)</label>
              <input
                type="text"
                required
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
                placeholder="e.g. 919876543210"
                className="w-full px-3.5 py-2.5 border rounded-xl font-mono text-navy"
              />
            </div>

            <div>
              <label className="block font-bold text-navy mb-1">Message Text</label>
              <textarea
                rows={3}
                required
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 border rounded-xl text-navy resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold py-3 rounded-pill hover:bg-[#20ba5a] transition-all shadow-sm disabled:opacity-70"
            >
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {sending ? 'Dispatching via Meta API...' : 'Send WhatsApp Message'}
            </button>
          </form>

          {testResult && (
            <div className={cn(
              'p-3.5 rounded-xl border text-xs font-mono space-y-1',
              testResult.success ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
            )}>
              <p className="font-bold">{testResult.success ? '✓ Message Sent Successfully' : '✗ Dispatch Failed'}</p>
              <pre className="text-[11px] overflow-x-auto whitespace-pre-wrap">{JSON.stringify(testResult, null, 2)}</pre>
            </div>
          )}
        </div>

        {/* 2. Inbound Webhook Simulator */}
        <div className="bg-white rounded-2xl p-6 shadow-card border border-navy/5 space-y-4">
          <h3 className="font-headline font-black text-navy text-base flex items-center gap-2">
            <Terminal className="w-4 h-4 text-forest" /> Simulate Inbound Webhook Event
          </h3>
          <p className="text-navy/60 text-xs">
            Test how the system parses incoming traveler messages, matches trips, and saves leads.
          </p>

          <form onSubmit={handleSimulateWebhook} className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-navy mb-1">Sender Name</label>
                <input
                  type="text"
                  value={simName}
                  onChange={(e) => setSimName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-navy"
                />
              </div>
              <div>
                <label className="block font-bold text-navy mb-1">Sender Phone</label>
                <input
                  type="text"
                  value={simPhone}
                  onChange={(e) => setSimPhone(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-navy font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-navy mb-1">Incoming Message</label>
              <textarea
                rows={3}
                value={simMsg}
                onChange={(e) => setSimMsg(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl text-navy resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={simulating}
              className="w-full flex items-center justify-center gap-2 bg-navy text-white font-bold py-3 rounded-pill hover:bg-navy-700 transition-all disabled:opacity-70"
            >
              {simulating ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              {simulating ? 'Processing Webhook...' : 'Simulate Inbound Event'}
            </button>
          </form>

          {simResult && (
            <div className="p-3.5 bg-cream-dark rounded-xl border border-navy/10 text-xs font-mono space-y-1">
              <p className="font-bold text-forest">✓ Webhook Processed (Status {simResult.status})</p>
              <p className="text-navy/60 text-[11px]">Check the Inquiries tab to view the newly extracted lead!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
