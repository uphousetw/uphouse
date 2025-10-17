# Uphouse Marketing Site (MVP)

React + Vite + Tailwind CSS front-end for Uphouse Construction. All content is driven by Supabase, and the admin area lets you maintain projects, reset passwords, capture leads, and upload Cloudinary images directly from the project form.

## Contents
- [Features](#features)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Supabase Setup](#supabase-setup)
- [Admin Workflow](#admin-workflow)
- [Supabase RLS Best Practices](#supabase-rls-best-practices)
- [Deployment (Cloudflare Pages)](#deployment-cloudflare-pages)
- [Next Steps](#next-steps)

## Features
- **Public site**: Home, About, Projects list, Project detail, Contact page.
- **Contact form**: Stores submissions in Supabase `leads`.
- **Admin area (powered by Supabase Auth)**:
  - Secure authentication using **Supabase Auth** with email/password login (no third-party auth providers like Clerk).
  - Role-based access control (admin and editor roles) stored in `public.profiles` table.
  - User ID consistency: `auth.users.id` is referenced as `profiles.user_id` with `on delete cascade`.
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

This project uses **Supabase Auth** for authentication (not Clerk or other third-party providers). The authentication system connects user IDs across tables to ensure proper admin access.

### 1. Database Setup

Execute the schema in Supabase SQL Editor:

```bash
# Run the schema file that creates all tables, RLS policies, and triggers
supabase/schema.sql
```

This creates:
- **`auth.users`** – Supabase Auth's built-in user table (managed by Supabase)
- **`public.profiles`** – User profile table with role-based access control
  - `user_id uuid primary key references auth.users on delete cascade`
  - `role` (admin or editor)
  - Automatically created via `handle_new_user()` trigger when a user signs up
- **`public.projects`** – Project data with RLS policies checking `is_admin_or_editor()`
- **`public.leads`** – Contact form submissions with RLS policies checking `is_admin()`

### 2. How User IDs Connect Across Tables

The authentication system maintains ID consistency:

```
auth.users.id (UUID) ←── references ─── public.profiles.user_id (UUID)
                                              ↓
                                    Used by auth.uid() in RLS policies
```

- When a user signs up in `auth.users`, the `on_auth_user_created` trigger automatically creates a matching row in `public.profiles` with `user_id = auth.users.id`
- RLS policies use `auth.uid()` to get the current user's ID and check it against `profiles.user_id`
- The `on delete cascade` ensures profiles are deleted when auth users are deleted

### 3. Create Your First Admin User

1. **Create user in Supabase Auth**:
   - Go to Authentication → Users in Supabase Dashboard
   - Click "Add user" → "Create new user"
   - Enter email and password
   - Copy the user's UUID

2. **Promote user to admin role**:
   ```sql
   -- Replace <USER_UUID> with the UUID from step 1
   update public.profiles
   set role = 'admin'
   where user_id = '<USER_UUID>';
   ```

3. **Verify the setup**:
   ```sql
   -- Check that the profile exists and has admin role
   select user_id, role, full_name
   from public.profiles
   where role = 'admin';
   ```

### 4. Environment Variables

Update `.env.local` with your Supabase credentials:

```env
VITE_SUPABASE_URL=<Your Supabase Project URL>
VITE_SUPABASE_ANON_KEY=<Your Supabase anon key>
```

Then run:
```bash
npm install
npm run dev
```

### 5. Test Admin Login

- Navigate to `http://localhost:5173/admin/login`
- Log in with the admin email/password you created
- You should be redirected to `/admin` dashboard with full access

## Admin Workflow

### Authentication Flow
1. **Login**: Navigate to `/admin/login`
2. **Sign in with Supabase Auth**: Enter email and password
3. **Session management**:
   - `AuthProvider` checks `auth.uid()` and fetches matching profile from `public.profiles`
   - Session persists via Supabase Auth tokens (JWT)
   - `RequireAuth` component protects admin routes

### Admin Pages
- **Login**: `/admin/login` - Email/password authentication via Supabase Auth
- **Dashboard**: `/admin` - Available to all authenticated users (editor and admin)
- **Projects**: `/admin/projects`
  - Create (`/new`), edit (`/:slug/edit`), delete
  - Auto-cleans Cloudinary images via stored delete tokens
  - Protected by `is_admin_or_editor()` RLS policy
- **Password reset**: `/admin/settings` - Trigger Supabase password-reset email
- **Leads**: `/admin/leads` - View/delete contact submissions (admin only)

### Role-Based Access
- **`editor`** role:
  - Access dashboard
  - Full project management (CRUD operations)
- **`admin`** role:
  - All editor permissions
  - Plus: settings access, lead management, and additional admin features

### How Roles Work with RLS
The `public.profiles` table stores user roles, and RLS policies enforce permissions:
```sql
-- Helper function checks if current user is admin
create function public.is_admin() returns boolean as $$
  select exists (
    select 1 from public.profiles
    where user_id = auth.uid() and role = 'admin'
  );
$$;

-- Projects table uses this in RLS policy
create policy "Admins manage projects"
  on public.projects
  for all
  using (public.is_admin_or_editor());
```

## Supabase RLS Best Practices

This project follows Supabase's recommended best practices for Row Level Security (RLS) to ensure optimal performance and security.

### 1. **Wrap Functions in SELECT for Performance**
Always wrap `auth.uid()` and custom functions in `SELECT` statements:
```sql
-- ❌ Slower (function called per row)
using (auth.uid() = user_id)

-- ✅ Faster (function cached per statement via initPlan)
using ((SELECT auth.uid()) = user_id)
```
**Performance improvement:** Up to 94% faster on large tables.

### 2. **Use Security Definer Functions**
Create helper functions with `SECURITY DEFINER` to bypass RLS on join tables:
```sql
CREATE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$;
```
**Performance improvement:** Up to 99.9% faster for complex joins.

### 3. **Specify Roles Explicitly**
Always use `TO authenticated` or `TO anon` in policies to prevent unnecessary checks:
```sql
-- ❌ Applies to all roles (including unauthenticated)
CREATE POLICY "example" ON table FOR SELECT USING (true);

-- ✅ Only applies to specific roles
CREATE POLICY "example" ON table FOR SELECT
  TO authenticated, anon
  USING (true);
```

### 4. **Add Indexes on RLS Columns**
Create indexes on columns used in RLS policies:
```sql
CREATE INDEX user_id_idx ON projects (user_id);
CREATE INDEX team_id_idx ON projects (team_id);
```
**Performance improvement:** Over 100x faster on large tables.

### 5. **Grant Table Permissions**
RLS policies control row-level access, but you must also grant table-level permissions:
```sql
-- Grant table permissions
GRANT SELECT ON public.profiles TO authenticated;
GRANT SELECT ON public.projects TO authenticated, anon;
GRANT INSERT, UPDATE, DELETE ON public.projects TO authenticated;
```

### 6. **Add Filters to Queries**
Don't rely solely on RLS for filtering—add explicit filters in your queries:
```sql
-- ❌ Relies only on RLS
const { data } = supabase.from('projects').select()

-- ✅ Adds explicit filter (helps query planner)
const { data } = supabase.from('projects').select().eq('user_id', userId)
```

### RLS Performance Benchmarks
Based on Supabase's official testing on 100K row tables:

| Optimization | Before | After | Improvement |
|---|---|---|---|
| Add index on user_id | 171ms | <0.1ms | 99.94% |
| Wrap auth.uid() in SELECT | 179ms | 9ms | 95% |
| Use security definer function | 11,000ms | 7ms | 99.94% |
| Add explicit filter | 171ms | 9ms | 95% |
| Specify TO authenticated | 170ms | <0.1ms | 99.94% |

### Verification Scripts
Run these to verify and fix RLS policies:
```bash
# Verify all policies and permissions
supabase/verify-all-policies.sql

# Fix common policy issues
supabase/fix-policies.sql
```

**References:**
- [Supabase RLS Performance Guide](https://supabase.com/docs/guides/troubleshooting/rls-performance-and-best-practices-Z5Jjwv)
- [Row Level Security Documentation](https://supabase.com/docs/guides/database/postgres/row-level-security)

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
