# Flowtask

A production-style to-do web app built with **React**, **Vite**, **TypeScript**, **Tailwind CSS v4**, **shadcn/ui-style** primitives, **framer-motion**, and **@dnd-kit**. Tasks and categories sync to **Supabase** (PostgreSQL + Auth + RLS). UI preferences (theme, filters) stay in **localStorage**.

## Features

- **Auth:** email + password sign up, sign in, sign out, password reset, session persistence
- **Tasks:** add, edit, delete, complete, notes, due dates, priorities, drag reorder (manual sort + single list)
- **Categories:** create, rename, delete (tasks move to **Inbox**), color accents, filter by list or **All tasks**
- **Search & filters:** text search (title + notes), status, priority, due date presets
- **Sort:** manual (drag), newest, oldest, priority, A → Z
- **Sync:** realtime updates across devices; optional import from legacy localStorage on first login
- **UI:** glassmorphism, mesh gradients, dark/light toggle, responsive sidebar + mobile sheet

## Quick start

```bash
npm install
cp .env.example .env   # add Supabase URL + anon key
npm run dev
```

Full backend setup: **[docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md)**

## Production build

```bash
npm run build
npm run preview
```

Output is in `dist/`.

## GitHub Pages

- `vite.config.ts` uses `base: './'` for project Pages URLs.
- Workflow: `.github/workflows/deploy-pages.yml`
- Add GitHub Actions secrets: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- Repo **Settings → Pages → GitHub Actions**

## Project layout

| Path | Role |
|------|------|
| `supabase/migrations/` | SQL schema, RLS, triggers |
| `src/lib/supabase.ts` | Typed Supabase client |
| `src/lib/api/` | Tasks, categories, import |
| `src/context/AuthContext.tsx` | Auth session + actions |
| `src/context/TodoContext.tsx` | Tasks state + cloud sync |
| `src/components/auth/` | Login, signup, reset, import |
| `src/lib/ui-persist.ts` | Local UI preferences |

## License

Private / your choice.
