import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("invoices")
    .select("*, subscription_id")
    .eq("user_id", user.id)
    .order("issued_at", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Enrich with plan type from subscription
  const enriched = await Promise.all((data || []).map(async (inv: any) => {
    if (inv.subscription_id) {
      const { data: sub } = await supabase
        .from("subscriptions")
        .select("plan_type")
        .eq("id", inv.subscription_id)
        .single();
      return { ...inv, subscription_plan: sub?.plan_type ? `订阅 - ${sub.plan_type}` : "订阅费" };
    }
    return { ...inv, subscription_plan: "订阅费" };
  }));

  return NextResponse.json({ invoices: enriched || [] });
}

