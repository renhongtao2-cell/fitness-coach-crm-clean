# ============================================
# FITCOACH CRM - PAYMENT SETUP COMPLETE GUIDE
# ============================================

## STEP 1: Get your existing Stripe Keys (5 minutes)

1. Open https://dashboard.stripe.com/settings/developers/keys
2. You should see keys already created:
   - Secret Key: sk_test_xxxxxxxxxxxx  OR  sk_live_xxxxxxxxxxxx
   - Webhook Secret: whsec_xxxxxxxxxxxx

3. If you don't see them, go to https://dashboard.stripe.com/apikeys and create a new Secret Key

## STEP 2: Create Pricing Products (10 minutes)

Go to https://dashboard.stripe.com/products

For EACH of these products, click "Add product":

### Product 1: Basic
- Name: "Basic Plan"
- Pricing type: "Recurring"
- Interval: "Monthly", Amount: $29
- Click "Create price"
- Then click "Create another price" under same product
- Interval: "Yearly", Amount: $290
- Copy BOTH Price IDs (format: price_xxx)

### Product 2: Pro
- Name: "Pro Plan"
- Pricing type: "Recurring"
- Interval: "Monthly", Amount: $99
- Click "Create price"
- Then create Yearly price at $990
- Copy BOTH Price IDs

### Product 3: Enterprise
- Name: "Enterprise Plan"
- Pricing type: "Recurring"
- Interval: "Monthly", Amount: $299
- Click "Create price"
- Then create Yearly price at $2990
- Copy BOTH Price IDs

## STEP 3: Configure Webhook (2 minutes)

Go to https://dashboard.stripe.com/webhooks

1. Click "Add endpoint"
2. URL: https://fitness-coach-crm-five.vercel.app/api/webhooks/stripe
3. Select events:
   [x] checkout.session.completed
   [x] customer.subscription.created
   [x] customer.subscription.updated
   [x] customer.subscription.deleted
   [x] invoice.payment_succeeded
   [x] invoice.payment_failed
4. Click "Add endpoint"
5. Copy the Webhook Secret (starts with whsec_)

## STEP 4: Add ALL values to Vercel (5 minutes)

Go to https://vercel.com/dashboard → fitness-coach-crm → Environment Variables

ADD EVERYTHING BELOW (Environment → All environments):

| Variable Name | Where to get it | Example |
|---|---|---|
| STRIPE_SECRET_KEY | Step 1 | sk_test_xxxxx |
| STRIPE_PRICE_BASIC_MONTHLY | Step 2 Basic product | price_1Qxxxx |
| STRIPE_PRICE_PRO_MONTHLY | Step 2 Pro product | price_1Qxxxx |
| STRIPE_PRICE_ENTERPRISE_MONTHLY | Step 2 Enterprise product | price_1Qxxxx |
| STRIPE_PRICE_BASIC_YEARLY | Step 2 Basic product | price_1Qxxxx |
| STRIPE_PRICE_PRO_YEARLY | Step 2 Pro product | price_1Qxxxx |
| STRIPE_PRICE_ENTERPRISE_YEARLY | Step 2 Enterprise product | price_1Qxxxx |
| STRIPE_WEBHOOK_SECRET | Step 3 | whsec_xxxxx |
| SUPABASE_URL | Already set | https://arxmmamibjisvknacoun.supabase.co |
| SUPABASE_ANON_KEY | Already set | sb_publishable_siuJ... |

## STEP 5: Run DB Migration in Supabase (2 minutes)

Go to https://app.supabase.com/project/arxmmamibjisvknacoun/sql/new

Paste this entire SQL block and hit Run:

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

INSERT INTO plan_features (feature_key, feature_name, feature_desc, plan_type, limit_value) VALUES
('coachees', 'Clients', 'Max managed clients', 'free', 5),
('programs', 'Training Plans', 'Active plans', 'free', 5),
('ai_generations', 'AI Generation', 'Monthly AI generations', 'free', 5),
('storage', 'Training Logs', 'Stored workout records', 'free', 50),
('messages', 'Messages', 'Client messages per month', 'free', 50),
('coachees', 'Clients', 'Max managed clients', 'basic', 20),
('programs', 'Training Plans', 'Active plans', 'basic', 20),
('ai_generations', 'AI Generation', 'Monthly AI generations', 'basic', 20),
('storage', 'Training Logs', 'Stored workout records', 'basic', 200),
('messages', 'Messages', 'Client messages per month', 'basic', 200),
('coachees', 'Clients', 'Max managed clients', 'pro', 50),
('programs', 'Training Plans', 'Active plans', 'pro', 50),
('ai_generations', 'AI Generation', 'Monthly AI generations', 'pro', 50),
('storage', 'Training Logs', 'Stored workout records', 'pro', 500),
('messages', 'Messages', 'Client messages per month', 'pro', 500),
('coachees', 'Clients', 'Max managed clients', 'enterprise', -1),
('programs', 'Training Plans', 'Active plans', 'enterprise', -1),
('ai_generations', 'AI Generation', 'Monthly AI generations', 'enterprise', -1),
('storage', 'Training Logs', 'Stored workout records', 'enterprise', -1),
('messages', 'Messages', 'Client messages per month', 'enterprise', -1);

CREATE INDEX IF NOT EXISTS idx_plan_features_plan_type ON plan_features(plan_type);
CREATE INDEX IF NOT EXISTS idx_plan_features_feature_key ON plan_features(feature_key);

## STEP 6: Test (2 minutes)

After all env vars are set, Vercel auto-deploys. Wait ~2 min.

1. Visit: https://fitness-coach-crm-five.vercel.app/pricing
2. Login as: renhongtao2@gmail.com
3. Click "Upgrade Now" on any plan
4. Should redirect to Stripe test checkout page
5. Use card: 4242 4242 4242 4242
6. Any future date, any CVC
7. Click Pay → Success!

============================================