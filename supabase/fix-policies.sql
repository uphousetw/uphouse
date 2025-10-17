-- ============================================================
-- FIX RLS POLICIES - Supabase Best Practices
-- ============================================================

-- First, let's check if the is_admin function exists
SELECT proname FROM pg_proc WHERE proname = 'is_admin';

-- Recreate the helper functions with proper security
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE user_id = auth.uid()
      AND role = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_admin_or_editor()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE user_id = auth.uid()
      AND role IN ('admin', 'editor')
  );
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin_or_editor() TO authenticated;

-- ============================================================
-- PROFILES TABLE POLICIES
-- ============================================================

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins manage profiles" ON public.profiles;

-- Policy 1: Users can read their own profile
-- Best practice: Use (select auth.uid()) for better performance
CREATE POLICY "Users read own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- Policy 2: Admins can manage all profiles
CREATE POLICY "Admins manage profiles"
  ON public.profiles
  FOR ALL
  TO authenticated
  USING ((SELECT public.is_admin()))
  WITH CHECK ((SELECT public.is_admin()));

-- ============================================================
-- ABOUT_PAGE TABLE POLICIES
-- ============================================================

-- Enable RLS
ALTER TABLE public.about_page ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public read" ON public.about_page;
DROP POLICY IF EXISTS "Admins manage about page" ON public.about_page;

-- Policy 1: Public read access (including anonymous users)
CREATE POLICY "Allow public read"
  ON public.about_page
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Policy 2: Only admins can insert/update/delete
CREATE POLICY "Admins manage about page"
  ON public.about_page
  FOR ALL
  TO authenticated
  USING ((SELECT public.is_admin()))
  WITH CHECK ((SELECT public.is_admin()));

-- ============================================================
-- VERIFY POLICIES
-- ============================================================

-- Check profiles policies
SELECT
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY policyname;

-- Check about_page policies
SELECT
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'about_page'
ORDER BY policyname;

-- ============================================================
-- TEST THE POLICIES
-- ============================================================

-- Test 1: Check if current user can read their profile
SELECT
  'Test: Read own profile' as test_name,
  user_id,
  role,
  full_name
FROM public.profiles
WHERE user_id = auth.uid();

-- Test 2: Check if is_admin() function works
SELECT
  'Test: is_admin() function' as test_name,
  public.is_admin() as is_admin_result;

-- Test 3: Check if user can read about_page
SELECT
  'Test: Read about_page' as test_name,
  id,
  title
FROM public.about_page
LIMIT 1;
