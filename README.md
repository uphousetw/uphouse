# Uphouse Marketing Site (MVP)

React + Vite + Tailwind CSS front-end for Uphouse Construction. All content is driven by Supabase, and the admin area lets you maintain projects, reset passwords, capture leads, and upload Cloudinary images directly from the project form.

## Contents
- [Features](#features)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Supabase Setup](#supabase-setup)
- [Admin Workflow](#admin-workflow)
- [Deployment (Cloudflare Pages)](#deployment-cloudflare-pages)
- [Next Steps](#next-steps)

## Features
- **Public site**: Home, About, Projects list, Project detail, Contact page.
- **Contact form**: Stores submissions in Supabase `leads`.
- **Admin (Supabase Auth)**:
  - Dashboard with project and lead metrics.
  - Project CRUD with inline Cloudinary uploads for hero and gallery images (URLs auto-filled and delete tokens stored).
  - Password reset trigger (emails sent via Supabase Auth).
  - Lead viewer with delete capability.

## Getting Started
```bash
npm install
npm run dev
```
Requires Node.js 18+ and npm 9+. Build with `npm run build` (output in `dist/`).

## Project Structure
- `src/layout/MainLayout.tsx` – public layout.
- `src/pages/*.tsx` – public pages.
- `src/layout/AdminLayout.tsx` – admin shell with role-based nav.
- `src/pages/admin/*.tsx` – admin dashboard, projects, project form, settings, leads.
- `src/data/projects.ts` – type mapping between Supabase rows and UI.
- `src/lib/supabaseClient.ts` – shared Supabase client.
- `scripts/check-admin-access.ts` – Playwright helper script.

## Environment Variables
Create `.env.local` (and mirror in production):
```
VITE_SUPABASE_URL=<Supabase Project URL>
VITE_SUPABASE_ANON_KEY=<Supabase anon key>
VITE_SUPABASE_RESET_REDIRECT=<optional reset redirect URL>
VITE_CLOUDINARY_CLOUD_NAME=<Cloudinary cloud name>
VITE_CLOUDINARY_UPLOAD_PRESET=<unsigned upload preset>
ADMIN_EMAIL=<Playwright admin email>
ADMIN_PASSWORD=<Playwright admin password>
APP_URL=http://localhost:5173
```
Cloudinary must have an **unsigned upload preset** that allows specifying folder/public_id. Supabase reset redirect must be whitelisted in Dashboard → Authentication → URL allow list.

## Supabase Setup
1. In Supabase SQL Editor execute:
   - `supabase/schema.sql` – tables (`projects`, `leads`, `profiles`), RLS, triggers, delete-token columns.
   - `supabase/seed_projects.sql` – optional starter project data.
2. Create admin user in Supabase Auth (Dashboard → Users → Add user).
3. Promote to admin:
   ```sql
   update public.profiles set role = 'admin' where user_id = '<USER_UUID>';
   ```
4. Update `.env.local`, then `npm install` and `npm run dev`.

## Admin Workflow
- Login: `/admin/login`.
- Dashboard: `/admin` (any authenticated user).
- Projects: `/admin/projects` → create (`/new`), edit (`/:slug/edit`), delete (auto-cleans Cloudinary images via stored delete tokens).
- Password reset: `/admin/settings` – send Supabase password-reset email.
- Leads: `/admin/leads` – view/delete contact submissions.
- Roles:
  - `editor` – dashboard + project management.
  - `admin` – full access (project uploads, settings, leads).

## Deployment (Cloudflare Pages)
1. Push repo to Git (e.g., GitHub).
2. Create Cloudflare Pages project linked to repo.
3. Build command: `npm run build`; output directory: `dist`.
4. Configure the environment variables listed above.
5. Merge to main branch to trigger new deployments.

## Next Steps
1. **Media library** – list existing Cloudinary assets or integrate Supabase Storage.
2. **Project states** – add draft/publish workflow or version history.
3. **Lead notifications** – use Supabase Edge Functions or third-party email services; optionally add Turnstile anti-spam.
4. **Testing/CI** – add Vitest/Playwright tests and GitHub Actions.
5. **SEO/i18n** – expand with OG metadata, sitemap, or multilingual content.

---

### Playwright Quick Check
```bash
npx tsx scripts/check-admin-access.ts
```
Automatically logs into `/admin/login` and prints Supabase REST responses. Requires the environment variables above.
