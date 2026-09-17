'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, CheckCircle, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils/format'

const INTERESTS = [
  'Adventure', 'Mountains', 'Beaches', 'Culture', 'Food', 'Nature', 'Photography', 'Relaxation', 'Backpacking'
]

const profileSchema = z.object({
  full_name: z.string().min(2, 'Name is required'),
  phone: z.string().optional(),
  college: z.string().optional(),
  city: z.string().optional(),
  budget_preference: z.enum(['budget', 'mid', 'premium']).optional(),
})
type ProfileForm = z.infer<typeof profileSchema>

export default function ProfilePage() {
  const [interests, setInterests] = useState<string[]>([])
  const [saved, setSaved] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
  })

  function toggleInterest(interest: string) {
    setInterests(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    )
  }

  async function onSubmit(data: ProfileForm) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('profiles').upsert({
      id: user.id,
      ...data,
      travel_interests: interests,
    } as any)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="max-w-xl space-y-8">
      {/* Avatar placeholder */}
      <div className="flex items-center gap-5">
        <div className="w-20 h-20 rounded-full bg-navy flex items-center justify-center">
          <User className="w-10 h-10 text-white" />
        </div>
        <div>
          <p className="font-bold text-navy">Profile Photo</p>
          <p className="text-navy/50 text-sm">Upload coming soon</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg p-6 shadow-card border border-navy/5 space-y-5">
        <h3 className="font-headline font-black text-navy text-lg">Personal Info</h3>

        <div>
          <label className="block text-sm font-bold text-navy mb-1.5">Full Name</label>
          <input {...register('full_name')} placeholder="Your name"
            className={cn('w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/30',
              errors.full_name ? 'border-red-400' : 'border-navy/20')} />
          {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-navy mb-1.5">Phone</label>
            <input {...register('phone')} type="tel" placeholder="10-digit mobile"
              className="w-full px-4 py-3 border border-navy/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/30" />
          </div>
          <div>
            <label className="block text-sm font-bold text-navy mb-1.5">City</label>
            <input {...register('city')} placeholder="Your city"
              className="w-full px-4 py-3 border border-navy/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/30" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-navy mb-1.5">College / Institution</label>
          <input {...register('college')} placeholder="Your college"
            className="w-full px-4 py-3 border border-navy/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/30" />
        </div>

        <div>
          <label className="block text-sm font-bold text-navy mb-1.5">Budget Preference</label>
          <select {...register('budget_preference')}
            className="w-full px-4 py-3 border border-navy/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/30 bg-white">
            <option value="">Select preference...</option>
            <option value="budget">Budget (₹3K–6K/person)</option>
            <option value="mid">Mid-range (₹6K–12K/person)</option>
            <option value="premium">Premium (₹12K+/person)</option>
          </select>
        </div>

        {/* Travel interests */}
        <div>
          <label className="block text-sm font-bold text-navy mb-3">Travel Interests</label>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map(interest => (
              <button key={interest} type="button" onClick={() => toggleInterest(interest)}
                className={cn('px-4 py-2 rounded-pill text-sm font-semibold transition-all',
                  interests.includes(interest) ? 'bg-orange text-white' : 'bg-cream-dark text-navy hover:bg-cream-muted')}>
                {interest}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" disabled={isSubmitting}
          className="flex items-center justify-center gap-2 w-full bg-navy text-white font-bold py-3.5 rounded-pill hover:bg-navy-700 transition-colors disabled:opacity-70">
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle className="w-4 h-4" /> : null}
          {isSubmitting ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}
