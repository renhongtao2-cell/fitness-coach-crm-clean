-- =====================================================
-- Create coach-client binding table (run in Supabase SQL Editor)
-- =====================================================

CREATE TABLE IF NOT EXISTS coach_client_bindings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(coach_id, client_id)
);

ALTER TABLE coach_client_bindings ENABLE ROW LEVEL SECURITY;

-- Coaches can manage their own bindings
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'coach_manage_bindings') THEN
    CREATE POLICY coach_manage_bindings ON coach_client_bindings FOR ALL USING (
      (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'coach'))
      AND coach_id = auth.uid()
    );
  END IF;
END $$;

-- Clients can view their own bindings
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'client_view_bindings') THEN
    CREATE POLICY client_view_bindings ON coach_client_bindings FOR SELECT USING (client_id = auth.uid());
  END IF;
END $$;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_ccb_coach_id ON coach_client_bindings(coach_id);
CREATE INDEX IF NOT EXISTS idx_ccb_client_id ON coach_client_bindings(client_id);
CREATE INDEX IF NOT EXISTS idx_ccb_status ON coach_client_bindings(status);