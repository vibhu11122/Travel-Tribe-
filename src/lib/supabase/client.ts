import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/lib/types/database'
import { isSupabaseConfigured } from './config'

export function createClient() {
  const url = isSupabaseConfigured() ? process.env.NEXT_PUBLIC_SUPABASE_URL! : 'https://dummy.supabase.co'
  const key = isSupabaseConfigured() ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! : 'dummy-anon-key'
  return createBrowserClient<Database>(url, key)
}
