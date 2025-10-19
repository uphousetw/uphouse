-- Test if the logged-in user can read their own profile
-- This simulates what happens when the app tries to fetch the profile

-- First, check what auth.uid() returns (should return user's UUID when logged in)
SELECT 'Current auth.uid()' as test, auth.uid() as result;

-- Test reading profile with the current policies
SELECT
  'Read own profile test' as test,
  user_id,
  role,
  full_name
FROM public.profiles
WHERE user_id = auth.uid();

-- Check the exact policy conditions
SELECT
  tablename,
  policyname,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY policyname;

-- Test if the policy condition works
SELECT
  'Policy condition test' as test,
  user_id,
  role,
  ((SELECT auth.uid()) = user_id) as policy_check
FROM public.profiles
WHERE user_id = 'c12f56fa-94be-4316-8ce9-afb8c335560a';
