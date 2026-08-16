/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MOTO_SUPABASE_URL: string;
  readonly VITE_MOTO_SUPABASE_ANON_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
