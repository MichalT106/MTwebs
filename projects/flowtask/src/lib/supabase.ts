import { createClient, type SupabaseClient } from '@supabase/supabase-js'

import type { Database } from '@/types/database'

type ViteSupabaseEnvKey = 'VITE_SUPABASE_URL' | 'VITE_SUPABASE_ANON_KEY'

function requireEnv(name: ViteSupabaseEnvKey): string {
  const value = import.meta.env[name]

  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(
      [
        `Missing required environment variable: ${name}.`,
        'Copy .env.example to .env in the project root and set your Supabase credentials.',
        'See .env.example for where to find Project URL and anon public key in the dashboard.',
      ].join(' '),
    )
  }

  return value.trim()
}

const supabaseUrl = requireEnv('VITE_SUPABASE_URL')
const supabaseAnonKey = requireEnv('VITE_SUPABASE_ANON_KEY')

export const supabase: SupabaseClient<Database> = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
)
