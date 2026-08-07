import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  const signature = req.headers.get('stripe-signature') || '';
  const body = await req.text();

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not set');
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  try {
    const stripe = (await import('stripe')).default;
    const stripeClient = new stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2026-06-24.dahlia' });

    let event;
    try {
      event = stripeClient.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: unknown) {
      const e = err as Error;
      console.error('Stripe webhook signature verification failed:', e.message);
      return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
    }

    // FIX: Webhook 由 Stripe 触发、没有用户会话，必须用 service-role admin client，
    // 不能用 anon client（否则 RLS 把请求当匿名，订阅可能写不进库 → 付费用户停在 free）。
    // server.ts 里已存在 createAdminClient()，使用 SUPABASE_SERVICE_ROLE_KEY。
    const supabase = await createAdminClient();

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        const userId = session.metadata?.userId;
        const planType = session.metadata?.planType;

        if (userId && planType) {
          const { data: existing } = await supabase
            .from('subscriptions')
            .select('id')
            .eq('user_id', userId)
            .single();

          const subData: Record<string, any> = {
            user_id: userId,
            plan_type: planType,
            status: 'active',
            stripe_subscription_id: session.subscription as string,
            stripe_customer_id: session.customer as string,
            updated_at: new Date().toISOString(),
          };

          if (existing) {
            await supabase.from('subscriptions').update(subData).eq('id', existing.id);
          } else {
            await supabase.from('subscriptions').insert(subData);
          }

          console.log('[Webhook] Subscription activated for user', userId, 'plan:', planType);
        }
        break;
      }

      case 'customer.subscription.created': {
        const sub = event.data.object as any;
        const userId = sub.metadata?.userId;
        const planType = sub.metadata?.planType;

        if (userId && planType) {
          const { data: existing } = await supabase
            .from('subscriptions')
            .select('id')
            .eq('user_id', userId)
            .single();

          const subData: Record<string, any> = {
            user_id: userId,
            plan_type: planType,
            status: sub.status || 'active',
            stripe_subscription_id: sub.id,
            stripe_customer_id: sub.customer,
            stripe_current_period_end: sub.current_period_end
              ? new Date(sub.current_period_end * 1000).toISOString()
              : null,
            updated_at: new Date().toISOString(),
          };

          if (existing) {
            await supabase.from('subscriptions').update(subData).eq('id', existing.id);
          } else {
            await supabase.from('subscriptions').insert(subData);
          }

          console.log('[Webhook] subscription.created for user', userId, 'plan:', planType);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object as any;
        const planMap: Record<string, string> = {
          price_basic: 'basic',
          price_pro: 'pro',
          price_enterprise: 'enterprise',
        };

        let planType = sub.metadata?.planType;
        if (!planType) {
          const lineItem = sub.items?.data?.[0];
          if (lineItem?.price) {
            const priceId = lineItem.price.id;
            if (priceId.includes('basic')) planType = 'basic';
            else if (priceId.includes('pro')) planType = 'pro';
            else if (priceId.includes('enterprise')) planType = 'enterprise';
          }
        }

        const { data: existing } = await supabase
          .from('subscriptions')
          .select('id, user_id')
          .eq('stripe_subscription_id', sub.id)
          .single();

        if (existing) {
          const updateData: Record<string, any> = {
            status: sub.status,
            stripe_current_period_end: sub.current_period_end
              ? new Date(sub.current_period_end * 1000).toISOString()
              : null,
            updated_at: new Date().toISOString(),
          };

          if (planType && planType !== existing.user_id) {
            updateData.plan_type = planType;
          }

          await supabase.from('subscriptions').update(updateData).eq('id', existing.id);
          console.log('[Webhook] subscription.updated for sub', sub.id, 'status:', sub.status);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as any;
        await supabase
          .from('subscriptions')
          .update({ status: 'canceled', updated_at: new Date().toISOString() })
          .eq('stripe_subscription_id', sub.id);
        console.log('[Webhook] subscription.deleted for sub', sub.id);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as any;
        console.log('[Webhook] invoice.payment_succeeded for', invoice.subscription);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as any;
        console.error('[Webhook] invoice.payment_failed for', invoice.subscription);
        const { data: subData } = await supabase
          .from('subscriptions')
          .select('id')
          .eq('stripe_subscription_id', invoice.subscription)
          .single();

        if (subData?.id) {
          await supabase
            .from('subscriptions')
            .update({ status: 'past_due', updated_at: new Date().toISOString() })
            .eq('id', subData.id);
        }
        break;
      }

      default:
        console.log('[Webhook]Unhandled event type:', event.type);
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('[Webhook] Error processing event:', err.message, err.stack);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
