import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

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

    // Try insert first
    let { error: profileError } = await adminSupabase
      .from("profiles")
      .insert({
        id: userId,
        email,
        full_name: fullName,
        role,
      });

    // If insert failed (duplicate), try update
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

        // Look up the referral code and get the owner
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
