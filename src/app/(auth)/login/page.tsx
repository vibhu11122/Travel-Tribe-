'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils/format'

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})
type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginForm) {
    setAuthError('')
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })
      if (error) {
        if (error.message.includes('Invalid login')) {
          setAuthError('Incorrect email or password. Please try again.')
        } else {
          setAuthError(error.message)
        }
        return
      }
      router.push('/dashboard')
      router.refresh()
    } catch {
      setAuthError('Something went wrong. Please try again.')
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-headline font-black text-navy mb-1">Welcome back.</h1>
        <p className="text-navy/60">Your tribe is waiting.</p>
      </div>

      {authError && (
        <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-semibold">
          {authError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-navy mb-1.5">Email</label>
          <input
            {...register('email')}
            type="email"
            autoComplete="email"
            placeholder="you@email.com"
            className={cn(
              'w-full px-4 py-3.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/30 bg-white text-navy',
              errors.email ? 'border-red-400' : 'border-navy/20'
            )}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-bold text-navy">Password</label>
            <Link href="/forgot-password" className="text-orange text-xs font-semibold hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Your password"
              className={cn(
                'w-full px-4 py-3.5 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/30 bg-white text-navy',
                errors.password ? 'border-red-400' : 'border-navy/20'
              )}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-navy/40 hover:text-navy">
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-orange text-white font-bold py-4 rounded-pill hover:bg-orange-600 transition-colors shadow-orange disabled:opacity-70 text-base mt-2"
        >
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
          {isSubmitting ? 'Logging in...' : 'Log In'}
        </button>
      </form>

      <div className="flex items-center my-6">
        <div className="flex-1 h-px bg-navy/10" />
        <span className="px-4 text-navy/40 text-sm">or</span>
        <div className="flex-1 h-px bg-navy/10" />
      </div>

      <button
        onClick={() => alert('Google login coming soon!')}
        className="w-full flex items-center justify-center gap-3 border-2 border-navy/20 text-navy font-semibold py-3.5 rounded-pill hover:bg-cream-dark transition-colors"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continue with Google
      </button>

      <p className="text-center text-navy/60 text-sm mt-6">
        Don't have an account?{' '}
        <Link href="/signup" className="text-orange font-bold hover:underline">
          Join the tribe →
        </Link>
      </p>
    </div>
  )
}
