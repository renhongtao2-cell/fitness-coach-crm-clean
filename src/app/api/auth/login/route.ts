import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password cannot be empty" }, { status: 400 });
    }

    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    // Sign in via GoTrue token endpoint
    const signInRes = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SERVICE_ROLE_KEY,
      },
      body: JSON.stringify({ email, password }),
    });

    if (!signInRes.ok) {
      const errData = await signInRes.json().catch(() => ({}));
      return NextResponse.json({ error: errData?.msg || errData?.message || "Incorrect email or password" }, { status: 401 });
    }

    const signInData = await signInRes.json();

    // Fetch profile
    const adminSupabase = await createAdminClient();
    const { data: profile } = await adminSupabase
      .from("profiles")
      .select("*")
      .eq("email", email)
      .single();

    return NextResponse.json({
      user: signInData.user,
      session: signInData,
      profile: profile,
    });
  } catch (error: any) {
    console.error("Login API error:", error);
    return NextResponse.json({ error: error.message || "Sign in failed" }, { status: 500 });
  }
}
