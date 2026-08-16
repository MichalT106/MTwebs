import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

type ViteSupabaseEnvKey = 'VITE_MOTO_SUPABASE_URL' | 'VITE_MOTO_SUPABASE_ANON_KEY';

function requireEnv(name: ViteSupabaseEnvKey): string {
  const value = import.meta.env[name];
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(
      [
        `Missing required environment variable: ${name}.`,
        'Copy .env.example to .env in projects/moto-maintenance and set your Moto Maintenance Supabase credentials.',
      ].join(' '),
    );
  }
  return value.trim();
}

export function appUrl(): string {
  if (typeof window === 'undefined') return '';
  return new URL(import.meta.env.BASE_URL, window.location.origin).toString();
}

export const supabase: SupabaseClient<Database> = createClient<Database>(
  requireEnv('VITE_MOTO_SUPABASE_URL'),
  requireEnv('VITE_MOTO_SUPABASE_ANON_KEY'),
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'sb-moto-maintenance-auth',
    },
  },
);
