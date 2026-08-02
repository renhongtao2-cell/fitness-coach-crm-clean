import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';

const MONTHLY_PLANS: Record<string, any> = {
  basic: { priceId: process.env.STRIPE_PRICE_BASIC_MONTHLY || '', amount: 29, name: 'Basic Plan' },
  pro: { priceId: process.env.STRIPE_PRICE_PRO_MONTHLY || '', amount: 99, name: 'Pro Plan' },
  enterprise: { priceId: process.env.STRIPE_PRICE_ENTERPRISE_MONTHLY || '', amount: 299, name: 'Enterprise Plan' },
};

const YEARLY_PLANS: Record<string, any> = {
  basic: { priceId: process.env.STRIPE_PRICE_BASIC_YEARLY || '', amount: 290, name: 'Basic Plan (Yearly)' },
  pro: { priceId: process.env.STRIPE_PRICE_PRO_YEARLY || '', amount: 990, name: 'Pro Plan (Yearly)' },
  enterprise: { priceId: process.env.STRIPE_PRICE_ENTERPRISE_YEARLY || '', amount: 2990, name: 'Enterprise Plan (Yearly)' },
};

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { planType, billingCycle } = body;

    if (!planType || !MONTHLY_PLANS[planType]) {
      return NextResponse.json({ error: 'Invalid plan type' }, { status: 400 });
    }

    const plans = billingCycle === 'yearly' ? YEARLY_PLANS : MONTHLY_PLANS;
    const plan = plans[planType];

    if (!STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Stripe not configured. Please set STRIPE_SECRET_KEY in environment variables.' },
        { status: 503 }
      );
    }

    if (!plan.priceId) {
      console.warn('Price ID missing for:', planType, billingCycle);
      // Fallback: use monthly price as default
      return NextResponse.json(
        { error: `Stripe price ID not configured for ${planType} ${billingCycle}. Please set STRIPE_PRICE_${planType.toUpperCase()}${billingCycle === "yearly" ? "_YEARLY" : "_MONTHLY"} in Vercel env vars.` },
        { status: 503 }
      );
    }

    const stripe = (await import('stripe')).default;
    const stripeClient = new stripe(STRIPE_SECRET_KEY, { apiVersion: '2026-06-24.dahlia' });

    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: plan.priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${request.headers.get('origin')}/pricing?success=true`,
      cancel_url: `${request.headers.get('origin')}/pricing?canceled=true`,
      metadata: {
        userId: user.id,
        planType,
        billingCycle,
      },
      customer_email: user.email || undefined,
      subscription_data: {
        metadata: {
          userId: user.id,
          planType,
          billingCycle,
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Checkout session error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
