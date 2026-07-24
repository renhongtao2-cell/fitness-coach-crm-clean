import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

const PROMOTION_LIMIT = parseInt(process.env.PROMOTION_LIMIT || "100");
const PROMOTION_PLAN = "basic";
const PROMOTION_MONTHS = 3;
const PROMOTION_PRICE = 29;

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName, role, referralCode } = await request.json();

    if (!email || !password || !fullName) {
      return NextResponse.json({ error: "Please fill in all required fields" }, { status: 400 });
    }

    const allowedRoles = ["coach", "client"];
    if (!allowedRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid user role" }, { status: 400 });
    }

    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    // Step 1: Create user via GoTrue admin API (skip email confirmation)
    const createRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${SERVICE_ROLE_KEY}`,
        "apikey": SERVICE_ROLE_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        email_confirm: true,
        phone_confirm: true,
        user_metadata: { full_name: fullName, role },
      }),
    });

    if (!createRes.ok) {
      const errData = await createRes.json().catch(() => ({}));
      const errMsg = errData?.msg || errData?.message || "";
      if (createRes.status === 400 || createRes.status === 409 || errMsg.toLowerCase().includes("already") || errMsg.toLowerCase().includes("user with this email")) {
        return NextResponse.json({ error: "This email is already registered, please sign in" }, { status: 409 });
      }
      console.error("GoTrue admin create user error:", errData, "status:", createRes.status);
      return NextResponse.json({ error: "Failed to create user: " + errMsg }, { status: 500 });
    }

    const newUser = await createRes.json();
    const userId = newUser.id;

    // Step 2: Create profile using admin supabase client
    const adminSupabase = await createAdminClient();

    let { error: profileError } = await adminSupabase
      .from("profiles")
      .insert({
        id: userId,
        email,
        full_name: fullName,
        role,
      });

    if (profileError) {
      console.log("Insert failed, trying update:", profileError);
      const { error: updateError } = await adminSupabase
        .from("profiles")
        .update({ id: userId, role, full_name: fullName })
        .eq("email", email);
      if (updateError) {
        console.error("Profile update error:", updateError);
        return NextResponse.json({ error: "Failed to create user profile" }, { status: 500 });
      }
    }

    // Step 2.5: Handle referral code if provided
    if (referralCode) {
      try {
        const normalizedCode = referralCode.trim().toUpperCase();
        const { data: codeRecord } = await adminSupabase
          .from("referral_codes")
          .select("owner_id, code")
          .eq("code", normalizedCode)
          .single();
        if (codeRecord) {
          await adminSupabase.from("referrals").insert({
            referrer_id: codeRecord.owner_id,
            referee_id: userId,
            referral_code: codeRecord.code,
            status: "converted",
            converted_at: new Date().toISOString(),
          });
        }
      } catch (referralErr) {
        console.error("Referral processing error (non-fatal):", referralErr);
      }
    }

    // Step 2.6: Promotion - First N registrations get free basic plan for 3 months
    try {
      const { count, error: countError } = await adminSupabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      if (countError) {
        console.error("Count error:", countError);
      } else if (count !== null && count <= PROMOTION_LIMIT) {
        const periodEnd = new Date();
        periodEnd.setMonth(periodEnd.getMonth() + PROMOTION_MONTHS);

        await adminSupabase.from("subscriptions").insert({
          user_id: userId,
          status: "active",
          plan_type: PROMOTION_PLAN,
          stripe_subscription_id: null,
          stripe_customer_id: null,
          stripe_current_period_end: periodEnd.toISOString(),
          amount_cents: PROMOTION_PRICE * 100,
          currency: "usd",
          promo_note: `Launch Promo: First ${PROMOTION_LIMIT} users get ${PROMOTION_MONTHS} months of Basic ($${PROMOTION_PRICE}/mo plan)`,
          updated_at: new Date().toISOString(),
        });
        console.log(`[Promo] User ${userId} (${email}) is #${count} - granted ${PROMOTION_MONTHS} months Basic plan`);
      }
    } catch (promoErr) {
      console.error("Promotion processing error (non-fatal):", promoErr);
    }

    // Step 3: Sign in to get session
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
      console.error("Sign in error:", errData);
      return NextResponse.json({ error: "Sign in failed, please try again later" }, { status: 500 });
    }

    const signInData = await signInRes.json();

    return NextResponse.json({
      user: signInData.user,
      session: signInData,
      role: role,
      message: "Registration successful",
    });
  } catch (error: any) {
    console.error("Register error:", error);
    return NextResponse.json({ error: error.message || "Registration failed" }, { status: 500 });
  }
}
