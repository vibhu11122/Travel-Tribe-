'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Loader2, ArrowRight, CheckCircle, ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils/format'

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
})
type Form = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const [authError, setAuthError] = useState('')
  const { register, handleSubmit, getValues, formState: { errors, isSubmitting } } = useForm<Form>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: Form) {
    setAuthError('')
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/update-password`,
      })
      if (error) { setAuthError(error.message); return }
      setSent(true)
    } catch {
      setAuthError('Something went wrong. Please try again.')
    }
  }

  if (sent) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="w-16 h-16 text-forest mx-auto mb-4" />
        <h2 className="text-2xl font-headline font-black text-navy mb-3">Reset link sent!</h2>
        <p className="text-navy/60 mb-2">
          We've sent a password reset link to:
        </p>
        <p className="font-bold text-navy mb-6">{getValues('email')}</p>
        <p className="text-navy/50 text-sm mb-8">Check your spam folder if you don't see it.</p>
        <Link href="/login" className="inline-flex items-center gap-2 text-orange font-bold hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-headline font-black text-navy mb-1">Reset your password</h1>
        <p className="text-navy/60">Enter your email and we'll send a reset link.</p>
      </div>

      {authError && (
        <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-semibold">
          {authError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-navy mb-1.5">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-navy/40" />
            <input {...register('email')} type="email" placeholder="you@email.com"
              className={cn('w-full pl-11 pr-4 py-3.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/30 bg-white',
                errors.email ? 'border-red-400' : 'border-navy/20')} />
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <button type="submit" disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-orange text-white font-bold py-4 rounded-pill hover:bg-orange-600 transition-colors disabled:opacity-70">
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
          {isSubmitting ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>

      <p className="text-center text-sm mt-6">
        <Link href="/login" className="text-navy/60 hover:text-navy flex items-center justify-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </Link>
      </p>
    </div>
  )
}
