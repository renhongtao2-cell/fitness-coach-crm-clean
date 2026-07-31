import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const planType = searchParams.get("plan_type") || "all";

  let query = supabase.from("plan_features").select("*").order("plan_type").order("feature_key");
  if (planType !== "all") {
    query = query.eq("plan_type", planType);
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ features: data || [] });
}

