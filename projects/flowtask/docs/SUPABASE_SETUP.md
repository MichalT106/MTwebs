# Supabase setup for Flowtask

## 1. Create a Supabase project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) and create a project.
2. Wait for the database to finish provisioning.

## 2. Run the database migration

In the Supabase dashboard:

1. Open **SQL Editor** → **New query**.
2. Paste the contents of `supabase/migrations/20240519000001_initial_schema.sql`.
3. Click **Run**.

This creates `categories` and `tasks` tables, RLS policies, the new-user Inbox trigger, and realtime publication.

Alternatively, with the [Supabase CLI](https://supabase.com/docs/guides/cli):

```bash
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

## 3. Configure authentication

1. **Authentication** → **Providers** → enable **Email**.
2. **Authentication** → **URL configuration**:
   - **Site URL**: your production URL (e.g. `https://YOUR_USER.github.io/flowtask/`).
   - **Redirect URLs**: add local dev and production URLs, for example:
     - `http://localhost:5173`
     - `http://localhost:5173/**`
     - `https://YOUR_USER.github.io/flowtask/**`

Password reset emails use the app URL as `redirectTo`; users land back on Flowtask to set a new password.

## 4. Local environment variables

Copy `.env.example` to `.env` in the project root and set:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_public_key
```

Find both under **Project Settings** → **API** (Project URL and `anon` public key).

```bash
npm install
npm run dev
```

## 5. GitHub Pages + Actions

1. Repo **Settings** → **Secrets and variables** → **Actions** → add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
2. **Settings** → **Pages** → source: **GitHub Actions**.
3. Push to `main`; `.github/workflows/deploy-pages.yml` builds with those secrets.

Vite embeds `VITE_*` values at build time, which is required for static hosting.

## 6. Optional: Email confirmation

If **Confirm email** is enabled under **Authentication** → **Providers** → **Email**, new users must verify before signing in. Disable it for faster local testing, or keep it for production.

## Architecture overview

| Layer | Location |
|-------|----------|
| SQL schema + RLS | `supabase/migrations/` |
| Supabase client | `src/lib/supabase.ts` |
| API (tasks, categories, import) | `src/lib/api/` |
| Auth state | `src/context/AuthContext.tsx` |
| Tasks + sync | `src/context/TodoContext.tsx` |
| UI preferences (theme, filters) | `src/lib/ui-persist.ts` (localStorage) |
| Legacy import source | `src/lib/persist.ts` (`loadLegacyState`) |
