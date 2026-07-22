import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const stripe = (await import("stripe")).default;
  const signature = req.headers.get("stripe-signature") || "";
  const body = await req.text();

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any;
        const userId = session.metadata?.userId;
        const planType = session.metadata?.planType;
        if (userId && planType) {
          await supabase
            .from("subscriptions")
            .upsert({
              user_id: userId,
              status: "active",
              plan_type: planType,
              stripe_subscription_id: session.subscription as string,
              stripe_customer_id: session.customer as string,
            }, { onConflict: "user_id" });
        }
        break;
      }
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as any;
        const subscriptionId = invoice.subscription as string;
        await supabase
          .from("invoices")
          .insert({
            user_id: invoice.metadata?.userId,
            subscription_id: subscriptionId,
            amount_cents: invoice.amount_paid,
            status: "paid",
            stripe_invoice_id: invoice.id,
            paid_at: new Date(invoice.paid_at * 1000).toISOString(),
          });
        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object as any;
        await supabase
          .from("invoices")
          .insert({
            user_id: invoice.metadata?.userId,
            subscription_id: invoice.subscription as string,
            amount_cents: invoice.amount_due,
            status: "failed",
            stripe_invoice_id: invoice.id,
          });
        break;
      }
      case "customer.subscription.updated": {
        const sub = event.data.object as any;
        await supabase
          .from("subscriptions")
          .update({
            status: sub.status,
            stripe_current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
          })
          .eq("stripe_subscription_id", sub.id);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Webhook error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

