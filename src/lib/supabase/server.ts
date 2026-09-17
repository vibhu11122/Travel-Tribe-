import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/lib/types/database'

import { isSupabaseConfigured } from './config'

export async function createClient() {
  const cookieStore = await cookies()
  const isConfigured = isSupabaseConfigured()
  const url = isConfigured ? process.env.NEXT_PUBLIC_SUPABASE_URL! : 'https://dummy.supabase.co'
  const key = isConfigured ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! : 'dummy-anon-key'

  return createServerClient<Database>(
    url,
    key,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server component — cookies cannot be set, that's OK
          }
        },
      },
    }
  )
}
