import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { data: sub, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Subscription fetch error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      subscription: sub || { status: 'free', plan_type: 'free', user_id: user.id },
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('GET subscriptions error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await req.json();
    const { planType, stripeSubscriptionId, stripeCustomerId, periodEnd, amountCents } = body;

    if (!planType || !['free', 'basic', 'pro', 'enterprise'].includes(planType)) {
      return NextResponse.json({ error: 'Invalid plan type' }, { status: 400 });
    }

    const { data: existing } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    const subData: Record<string, any> = {
      user_id: user.id,
      status: 'active',
      plan_type: planType,
      stripe_subscription_id: stripeSubscriptionId || null,
      stripe_customer_id: stripeCustomerId || null,
      stripe_current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
      amount_cents: amountCents || 0,
      currency: 'usd',
      updated_at: new Date().toISOString(),
    };

    let result;
    if (existing && existing.id) {
      result = await supabase
        .from('subscriptions')
        .update(subData)
        .eq('id', existing.id)
        .select()
        .single();
    } else {
      result = await supabase
        .from('subscriptions')
        .insert(subData)
        .select()
        .single();
    }

    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    }

    return NextResponse.json({ subscription: result.data });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('POST subscriptions error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}