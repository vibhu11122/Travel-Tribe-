/**
 * Supabase configuration and connectivity checker
 * Prevents DNS lookup timeouts on dummy/placeholder URLs
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) return false
  if (
    url.includes('placeholder') ||
    url.includes('your-project-id') ||
    !url.startsWith('https://') ||
    key === 'placeholder_anon_key' ||
    key.includes('placeholder')
  ) {
    return false
  }

  return true
}
