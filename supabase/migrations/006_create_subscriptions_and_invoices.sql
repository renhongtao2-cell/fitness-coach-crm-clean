-- =====================================================
-- 006 - create subscriptions & invoices
-- =====================================================
-- 这两个表是代码运行时依赖的，但此前不在正式迁移链中：
--   * subscriptions 仅定义在仓库根目录的 seed_demo.sql（演示种子文件，
--     不会被 supabase migrations 自动应用）；
--   * invoices 在整个仓库中没有任何建表语句，完全缺失。
-- 注册接口会 INSERT subscriptions，账单页会 SELECT invoices，
-- Stripe webhook 会读写 subscriptions —— 缺表会导致运行时 500。
-- 本文件可重复执行（IF NOT EXISTS / DROP POLICY IF EXISTS）。
-- =====================================================

-- ===================== subscriptions =====================
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'free',
  plan_type TEXT NOT NULL DEFAULT 'free',
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  stripe_current_period_end TIMESTAMPTZ,
  amount_cents INTEGER DEFAULT 0,
  currency TEXT DEFAULT 'usd',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- 替换 seed_demo.sql 里宽泛的 allow_all_sub 策略，改为用户只能访问自己的订阅
DROP POLICY IF EXISTS allow_all_sub ON subscriptions;
DROP POLICY IF EXISTS "Users manage own subscription" ON subscriptions;
CREATE POLICY "Users manage own subscription"
  ON subscriptions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_sub ON subscriptions(stripe_subscription_id);

-- ===================== invoices =====================
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  amount_cents INTEGER NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'usd',
  status TEXT NOT NULL DEFAULT 'paid',
  description TEXT,
  stripe_invoice_id TEXT,
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users view own invoices" ON invoices;
CREATE POLICY "Users view own invoices"
  ON invoices FOR SELECT
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_subscription_id ON invoices(subscription_id);
