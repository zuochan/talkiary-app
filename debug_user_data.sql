-- Debug user data for problematic user
-- User ID: 868ebb54-6416-45bb-ab3c-5647ac783a97

-- Check if user exists in auth.users
SELECT 'auth.users' as table_name, id, email, created_at 
FROM auth.users 
WHERE id = '868ebb54-6416-45bb-ab3c-5647ac783a97';

-- Check if profile exists
SELECT 'profiles' as table_name, id, user_id, username, has_onboarded, created_at 
FROM public.profiles 
WHERE user_id = '868ebb54-6416-45bb-ab3c-5647ac783a97';

-- Check if workspace exists
SELECT 'workspaces' as table_name, id, user_id, name, is_home, created_at 
FROM public.workspaces 
WHERE user_id = '868ebb54-6416-45bb-ab3c-5647ac783a97';

-- Clean up the problematic user data
-- UNCOMMENT AND RUN THESE QUERIES TO FIX THE ISSUE:

-- Delete from workspaces first (due to foreign key constraints)
-- DELETE FROM public.workspaces WHERE user_id = '868ebb54-6416-45bb-ab3c-5647ac783a97';

-- Delete from profiles
-- DELETE FROM public.profiles WHERE user_id = '868ebb54-6416-45bb-ab3c-5647ac783a97';

-- Delete from auth.users (this will trigger the create_profile_and_workspace function when user signs up again)
-- DELETE FROM auth.users WHERE id = '868ebb54-6416-45bb-ab3c-5647ac783a97';