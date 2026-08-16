# Supabase setup for Motorcycle Maintenance

This setup is for **Motorcycle Maintenance only**.

Use a **new** Supabase project. Do not reuse the Flowtask project, URL, or keys.

---

## 1. Create a Supabase project

1. Open [supabase.com/dashboard](https://supabase.com/dashboard).
2. Create a new project (name it something like `moto-maintenance`).
3. Wait until the database is ready.

## 2. Enable Email authentication

1. Open **Authentication** → **Providers** → **Email**.
2. Enable the **Email** provider.

## 3. Enable email confirmation

On the same Email provider screen:

1. Enable **Confirm email**.
2. Leave it ON. New users must verify before they can open the motorcycle dashboard.

## 4. Configure redirect URLs

Open **Authentication** → **URL Configuration**.

**Site URL** (production):

```text
https://michaltkac.com/moto-maintenance/
```

**Redirect URLs** — add all of these:

```text
http://localhost:5173/moto-maintenance/
http://localhost:5173/moto-maintenance/**
https://michaltkac.com/moto-maintenance/
https://michaltkac.com/moto-maintenance/**
```

Do not add Flowtask URLs here.

## 5. Run the database migration

1. Open **SQL Editor** → **New query**.
2. Paste the full contents of:

```text
projects/moto-maintenance/supabase/migrations/20260817000001_moto_schema.sql
```

3. Click **Run**.

This creates:

- `moto_motorcycles`
- `moto_maintenance_items`
- `moto_custom_maintenance_types`

plus indexes, foreign keys, `updated_at` triggers, RLS policies (`auth.uid()` = owner only), and realtime publication.

## 6. Copy the project URL and anon key

In **Project Settings** → **API**:

1. Copy **Project URL**.
2. Copy the **anon** / **publishable** public key.

Do **not** copy or use the service-role key in the frontend.

## 7. Local environment

In `projects/moto-maintenance`, copy `.env.example` to `.env` and set:

```env
VITE_MOTO_SUPABASE_URL=https://YOUR_MOTO_PROJECT.supabase.co
VITE_MOTO_SUPABASE_ANON_KEY=your_moto_anon_public_key
```

Then:

```bash
npm install
npm run dev
```

The app is served at `http://localhost:5173/moto-maintenance/`.

## 8. Production GitHub secrets

Repo **Settings** → **Secrets and variables** → **Actions**. Add:

| Secret | Value |
|--------|--------|
| `VITE_MOTO_SUPABASE_URL` | Moto project URL |
| `VITE_MOTO_SUPABASE_ANON_KEY` | Moto anon / publishable key |

Leave existing Flowtask secrets (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) unchanged.

The site build (`.github/workflows/deploy.yml`) passes the Moto secrets only into the Motorcycle Maintenance app.

---

## After setup

- Register in Motorcycle Maintenance → check email → verify → log in.
- Existing local data (`moto-maintenance:v1`) can still be imported on first login.
- Flowtask accounts and data stay in the Flowtask project. The same email can exist in both projects as two separate users.
