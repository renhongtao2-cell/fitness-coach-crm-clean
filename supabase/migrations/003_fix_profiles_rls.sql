-- Allow coaches to read all client profiles
DROP POLICY IF EXISTS \"Coaches can view all profiles\" ON profiles;
CREATE POLICY \"Coaches can view all profiles\" ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'coach'
    )
  );

-- Allow inserting profiles via admin (service role bypasses RLS anyway)
DROP POLICY IF EXISTS \"Anyone can insert profiles\" ON profiles;
CREATE POLICY \"Anyone can insert profiles\" ON profiles FOR INSERT
  WITH CHECK (true);

-- Allow updating profiles
DROP POLICY IF EXISTS \"Users can update own profile\" ON profiles;
CREATE POLICY \"Users can update own profile\" ON profiles FOR UPDATE
  USING (auth.uid() = id);
