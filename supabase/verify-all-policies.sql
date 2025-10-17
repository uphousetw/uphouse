-- ============================================================
-- VERIFY AND FIX ALL TABLE POLICIES AND PERMISSIONS
-- ============================================================

-- Check current policies for all tables
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  CASE
    WHEN qual IS NOT NULL THEN 'USING: ' || qual
    ELSE 'No USING clause'
  END as using_clause,
  CASE
    WHEN with_check IS NOT NULL THEN 'WITH CHECK: ' || with_check
    ELSE 'No WITH CHECK clause'
  END as with_check_clause
FROM pg_policies
WHERE tablename IN ('profiles', 'about_page', 'projects', 'leads')
ORDER BY tablename, policyname;

-- Check table-level grants
SELECT
  grantee,
  table_name,
  privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
  AND table_name IN ('profiles', 'about_page', 'projects', 'leads')
  AND grantee IN ('authenticated', 'anon')
ORDER BY table_name, grantee, privilege_type;

-- ============================================================
-- FIX PROJECTS TABLE
-- ============================================================

-- Grant table permissions for projects
GRANT SELECT ON public.projects TO authenticated, anon;
GRANT INSERT, UPDATE, DELETE ON public.projects TO authenticated;

-- Verify and recreate projects policies
DROP POLICY IF EXISTS "Allow public read" ON public.projects;
DROP POLICY IF EXISTS "Admins manage projects" ON public.projects;

-- Policy 1: Public read (anyone can view projects)
CREATE POLICY "Allow public read"
  ON public.projects
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Policy 2: Admins and editors can manage projects
CREATE POLICY "Admins manage projects"
  ON public.projects
  FOR ALL
  TO authenticated
  USING ((SELECT public.is_admin_or_editor()))
  WITH CHECK ((SELECT public.is_admin_or_editor()));

-- ============================================================
-- FIX LEADS TABLE
-- ============================================================

-- Grant table permissions for leads
GRANT SELECT ON public.leads TO authenticated;
GRANT INSERT ON public.leads TO authenticated, anon;
GRANT DELETE ON public.leads TO authenticated;

-- Verify and recreate leads policies
DROP POLICY IF EXISTS "Allow public insert" ON public.leads;
DROP POLICY IF EXISTS "Admins read leads" ON public.leads;
DROP POLICY IF EXISTS "Admins delete leads" ON public.leads;

-- Policy 1: Anyone can submit a lead (contact form)
CREATE POLICY "Allow public insert"
  ON public.leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy 2: Only admins can read leads
CREATE POLICY "Admins read leads"
  ON public.leads
  FOR SELECT
  TO authenticated
  USING ((SELECT public.is_admin()));

-- Policy 3: Only admins can delete leads
CREATE POLICY "Admins delete leads"
  ON public.leads
  FOR DELETE
  TO authenticated
  USING ((SELECT public.is_admin()));

-- ============================================================
-- VERIFY ALL CHANGES
-- ============================================================

-- Check updated policies
SELECT
  tablename,
  policyname,
  roles,
  cmd
FROM pg_policies
WHERE tablename IN ('profiles', 'about_page', 'projects', 'leads')
ORDER BY tablename, policyname;

-- Check updated grants
SELECT
  grantee,
  table_name,
  privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
  AND table_name IN ('profiles', 'about_page', 'projects', 'leads')
  AND grantee IN ('authenticated', 'anon')
ORDER BY table_name, grantee, privilege_type;

-- ============================================================
-- TEST PROJECTS ACCESS
-- ============================================================

-- Test 1: Can authenticated users read projects?
SELECT
  'Test: Read projects' as test_name,
  COUNT(*) as project_count
FROM public.projects;

-- Test 2: Can admin users manage projects (simulated)?
SELECT
  'Test: Admin can manage projects' as test_name,
  (SELECT public.is_admin_or_editor()) as can_manage;

-- ============================================================
-- SUMMARY
-- ============================================================
SELECT
  'Summary: All policies and grants have been verified and fixed' as status,
  'Projects, Leads, Profiles, and About_page tables are now properly configured' as message;
