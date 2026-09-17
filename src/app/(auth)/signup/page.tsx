'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2, ArrowRight, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils/format'

const signupSchema = z.object({
  full_name: z.string().min(2, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm_password: z.string(),
  agree_terms: z.literal(true, { errorMap: () => ({ message: 'You must agree to the terms' }) }),
}).refine(d => d.password === d.confirm_password, {
  message: "Passwords don't match",
  path: ['confirm_password'],
})

type SignupForm = z.infer<typeof signupSchema>

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState('')
  const [success, setSuccess] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  })

  async function onSubmit(data: SignupForm) {
    setAuthError('')
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: { full_name: data.full_name, phone: data.phone },
        },
      })
      if (error) {
        setAuthError(error.message)
        return
      }
      setSuccess(true)
    } catch {
      setAuthError('Something went wrong. Please try again.')
    }
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="w-16 h-16 text-forest mx-auto mb-4" />
        <h2 className="text-2xl font-headline font-black text-navy mb-3">Check your inbox!</h2>
        <p className="text-navy/60 mb-6">
          We've sent a verification email to your address. Click the link to verify and then log in.
        </p>
        <Link href="/login"
          className="inline-flex items-center gap-2 bg-orange text-white font-bold px-6 py-3 rounded-pill hover:bg-orange-600 transition-colors">
          Go to Login
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-headline font-black text-navy mb-1">Start your adventure.</h1>
        <p className="text-navy/60">Join 200+ travelers in the tribe.</p>
      </div>

      {authError && (
        <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-semibold">
          {authError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-navy mb-1.5">Full Name</label>
          <input {...register('full_name')} placeholder="Your full name"
            className={cn('w-full px-4 py-3.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/30 bg-white',
              errors.full_name ? 'border-red-400' : 'border-navy/20')} />
          {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-bold text-navy mb-1.5">Email</label>
          <input {...register('email')} type="email" placeholder="you@email.com"
            className={cn('w-full px-4 py-3.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/30 bg-white',
              errors.email ? 'border-red-400' : 'border-navy/20')} />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-bold text-navy mb-1.5">Phone <span className="text-navy/40 font-normal">(optional)</span></label>
          <input {...register('phone')} type="tel" placeholder="10-digit mobile"
            className="w-full px-4 py-3.5 border border-navy/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/30 bg-white" />
        </div>

        <div>
          <label className="block text-sm font-bold text-navy mb-1.5">Password</label>
          <div className="relative">
            <input {...register('password')} type={showPassword ? 'text' : 'password'} placeholder="Min. 8 characters"
              className={cn('w-full px-4 py-3.5 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/30 bg-white',
                errors.password ? 'border-red-400' : 'border-navy/20')} />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-navy/40 hover:text-navy">
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-bold text-navy mb-1.5">Confirm Password</label>
          <input {...register('confirm_password')} type="password" placeholder="Re-enter password"
            className={cn('w-full px-4 py-3.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/30 bg-white',
              errors.confirm_password ? 'border-red-400' : 'border-navy/20')} />
          {errors.confirm_password && <p className="text-red-500 text-xs mt-1">{errors.confirm_password.message}</p>}
        </div>

        <div className="flex items-start gap-3">
          <input {...register('agree_terms')} type="checkbox" id="terms"
            className="mt-0.5 w-4 h-4 accent-orange cursor-pointer" />
          <label htmlFor="terms" className="text-sm text-navy/70 cursor-pointer">
            I agree to Travel Tribe's{' '}
            <Link href="/terms" className="text-orange hover:underline">Terms of Service</Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-orange hover:underline">Privacy Policy</Link>
          </label>
        </div>
        {errors.agree_terms && <p className="text-red-500 text-xs">{errors.agree_terms.message}</p>}

        <button type="submit" disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-orange text-white font-bold py-4 rounded-pill hover:bg-orange-600 transition-colors shadow-orange disabled:opacity-70 text-base mt-1">
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
          {isSubmitting ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <p className="text-center text-navy/60 text-sm mt-6">
        Already have an account?{' '}
        <Link href="/login" className="text-orange font-bold hover:underline">Log in</Link>
      </p>
    </div>
  )
}
