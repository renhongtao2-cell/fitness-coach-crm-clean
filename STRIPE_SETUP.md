# ============================================
# STRIPE SETUP GUIDE FOR FITCOACH CRM
# ============================================
#
# This guide walks you through configuring Stripe for payment processing.
#
# STEP 1: Get your Stripe API keys
#   1. Go to https://dashboard.stripe.com/apikeys
#   2. Copy the "Secret key" (starts with sk_live_ or sk_test_)
#   3. Make sure "Test mode" is ON while setting up
#
# STEP 2: Set up Subscription Products in Stripe Dashboard
#   1. Go to https://dashboard.stripe.com/products
#   2. Create 4 products: Basic, Pro, Enterprise
#   3. For each product, create 2 prices (Monthly + Yearly)
#      - Basic Monthly: \/mo
#      - Basic Yearly: \/yr
#      - Pro Monthly: \/mo
#      - Pro Yearly: \/yr
#      - Enterprise Monthly: \/mo
#      - Enterprise Yearly: \/yr
#   4. Copy the Price IDs (format: price_xxxxxxxxxxxx)
#
# STEP 3: Configure Environment Variables
#
# Add these to Vercel project settings (Environment Variables):
#   STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxx
#   STRIPE_PRICE_BASIC_MONTHLY=price_basic_monthly_id
#   STRIPE_PRICE_PRO_MONTHLY=price_pro_monthly_id
#   STRIPE_PRICE_ENTERPRISE_MONTHLY=price_enterprise_monthly_id
#   STRIPE_PRICE_BASIC_YEARLY=price_basic_yearly_id
#   STRIPE_PRICE_PRO_YEARLY=price_pro_yearly_id
#   STRIPE_PRICE_ENTERPRISE_YEARLY=price_enterprise_yearly_id
#   STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxx
#
# STEP 4: Set up Webhook
#   1. Go to https://dashboard.stripe.com/webhooks
#   2. Click "Add endpoint"
#   3. URL: https://your-domain.com/api/webhooks/stripe
#   4. Listen for events:
#      - checkout.session.completed
#      - customer.subscription.created
#      - customer.subscription.updated
#      - customer.subscription.deleted
#      - invoice.payment_succeeded
#      - invoice.payment_failed
#   5. Copy the webhook secret (whsec_xxx) and add to Vercel env
#
# STEP 5: Run Database Migration
#   1. Go to Supabase SQL Editor
#   2. Run: supabase/migrations/005_create_plan_features.sql
#
# VERIFICATION:
#   After setup, visit /pricing page and click "Upgrade Now"
#   You should be redirected to Stripe Checkout.
#   Payment success should redirect back to /pricing?success=true
# ============================================