-- Migration: 004_allow_coaches_view_all_profiles
-- Description: Allow authenticated coaches to view all profiles for dashboard stats

-- Drop existing restrictive policies that prevent coaches from seeing clients
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Coaches can view public profiles" ON profiles;

-- New policy: Authenticated users (any logged-in user) can view all profiles
CREATE POLICY "Authenticated users can view all profiles" ON profiles
    FOR SELECT
    USING (auth.uid() IS NOT NULL);

-- Coaches can insert new profiles (for referral flow)
CREATE POLICY "Coach can insert profiles" ON profiles
    FOR INSERT
    WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'coach'));
