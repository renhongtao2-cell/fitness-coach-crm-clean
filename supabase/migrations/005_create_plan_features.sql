-- plan_features table: defines feature limits for each subscription tier
CREATE TABLE IF NOT EXISTS plan_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_key VARCHAR(50) NOT NULL,
  feature_name VARCHAR(100) NOT NULL,
  feature_desc TEXT NOT NULL,
  plan_type VARCHAR(20) NOT NULL CHECK (plan_type IN ('free', 'basic', 'pro', 'enterprise')),
  limit_value INTEGER,
  is_feature BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE plan_features ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS public_read_plan_features ON plan_features;
CREATE POLICY public_read_plan_features ON plan_features FOR SELECT USING (true);
DROP POLICY IF EXISTS admin_manage_plan_features ON plan_features;
CREATE POLICY admin_manage_plan_features ON plan_features FOR ALL USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'coach'));

-- Seed data: plan feature limits for all tiers
INSERT INTO plan_features (feature_key, feature_name, feature_desc, plan_type, limit_value) VALUES
-- Free plan
('coachees', 'Clients', 'Max managed clients', 'free', 5),
('programs', 'Training Plans', 'Active plans', 'free', 5),
('ai_generations', 'AI Generation', 'Monthly AI generations', 'free', 5),
('storage', 'Training Logs', 'Stored workout records', 'free', 50),
('messages', 'Messages', 'Client messages per month', 'free', 50),

-- Basic plan
('coachees', 'Clients', 'Max managed clients', 'basic', 20),
('programs', 'Training Plans', 'Active plans', 'basic', 20),
('ai_generations', 'AI Generation', 'Monthly AI generations', 'basic', 20),
('storage', 'Training Logs', 'Stored workout records', 'basic', 200),
('messages', 'Messages', 'Client messages per month', 'basic', 200),
('custom_branding', 'Custom Branding', 'White-label options', 'basic', NULL),
('api_access', 'API Access', 'REST API access', 'basic', NULL),

-- Pro plan
('coachees', 'Clients', 'Max managed clients', 'pro', 50),
('programs', 'Training Plans', 'Active plans', 'pro', 50),
('ai_generations', 'AI Generation', 'Monthly AI generations', 'pro', 50),
('storage', 'Training Logs', 'Stored workout records', 'pro', 500),
('messages', 'Messages', 'Client messages per month', 'pro', 500),
('custom_branding', 'Custom Branding', 'White-label options', 'pro', NULL),
('api_access', 'API Access', 'REST API access', 'pro', NULL),
('white_label', 'White Label', 'Remove branding', 'pro', NULL),

-- Enterprise plan
('coachees', 'Clients', 'Max managed clients', 'enterprise', -1),
('programs', 'Training Plans', 'Active plans', 'enterprise', -1),
('ai_generations', 'AI Generation', 'Monthly AI generations', 'enterprise', -1),
('storage', 'Training Logs', 'Stored workout records', 'enterprise', -1),
('messages', 'Messages', 'Client messages per month', 'enterprise', -1),
('custom_branding', 'Custom Branding', 'White-label options', 'enterprise', NULL),
('api_access', 'API Access', 'Full REST API + webhooks', 'enterprise', NULL),
('white_label', 'White Label', 'Remove all branding', 'enterprise', NULL),
('priority_support', 'Priority Support', 'Dedicated support channel', 'enterprise', NULL),
('custom_integrations', 'Custom Integrations', 'Tailored API integrations', 'enterprise', NULL);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_plan_features_plan_type ON plan_features(plan_type);
CREATE INDEX IF NOT EXISTS idx_plan_features_feature_key ON plan_features(feature_key);