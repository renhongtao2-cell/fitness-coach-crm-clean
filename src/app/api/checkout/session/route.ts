import { NextResponse } from "next/server";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";

const MONTHLY_PLANS: Record<string, any> = {
  basic: { priceId: process.env.STRIPE_PRICE_BASIC || "", amount: 29, name: "Basic Plan" },
  pro: { priceId: process.env.STRIPE_PRICE_PRO || "", amount: 99, name: "Pro Plan" },
  enterprise: { priceId: process.env.STRIPE_PRICE_ENTERPRISE || "", amount: 299, name: "Enterprise Plan" },
};

const YEARLY_PLANS: Record<string, any> = {
  basic: { priceId: process.env.STRIPE_PRICE_BASIC_YEARLY || "", amount: 290, name: "Basic Plan (Yearly)" },
  pro: { priceId: process.env.STRIPE_PRICE_PRO_YEARLY || "", amount: 990, name: "Pro Plan (Yearly)" },
  enterprise: { priceId: process.env.STRIPE_PRICE_ENTERPRISE_YEARLY || "", amount: 2990, name: "Enterprise Plan (Yearly)" },
};

export async function POST(req: Request) {
  const body = await req.json();
  const { planType, billingCycle } = body;

  if (!planType || !MONTHLY_PLANS[planType]) {
    return NextResponse.json({ error: "Invalid plan type" }, { status: 400 });
  }

  const plans = billingCycle === "yearly" ? YEARLY_PLANS : MONTHLY_PLANS;
  const plan = plans[planType];

  if (!STRIPE_SECRET_KEY) {
    return NextResponse.json({
      error: "Stripe not configured",
    }, { status: 503 });
  }

  try {
    const stripe = (await import("stripe")).default;
    const stripeClient = new stripe(STRIPE_SECRET_KEY, { apiVersion: "2026-06-24.dahlia" });

    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{ price: plan.priceId, quantity: 1 }],
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/pricing?success=true`,
      cancel_url: `${req.headers.get("origin")}/pricing?canceled=true`,
      metadata: { planType, billingCycle },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

