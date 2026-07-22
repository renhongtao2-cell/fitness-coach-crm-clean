import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/server';

function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return 'FIT-' + result;
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
    const adminSupabase = await createAdminClient();
    const userEmail = session.user.email;
    const { data: userProfile, error: profileError } = await adminSupabase
      .from('profiles').select('id').eq('email', userEmail).single();
    if (profileError || !userProfile) return NextResponse.json({ error: 'Profile not found' }, { status: 500 });
    let { data: existingCode, error: fetchError } = await adminSupabase
      .from('referral_codes').select('code').eq('owner_id', userProfile.id).maybeSingle();
    if (fetchError) return NextResponse.json({ error: 'Failed to get referral code' }, { status: 500 });
    if (existingCode) return NextResponse.json({ code: existingCode.code });
    let newCode = generateReferralCode();
    let exists = true;
    while (exists) {
      const check = await adminSupabase.from('referral_codes').select('id').eq('code', newCode).maybeSingle();
      exists = !!check.data;
      if (exists) newCode = generateReferralCode();
    }
    const { error: insertError } = await adminSupabase.from('referral_codes').insert({ owner_id: userProfile.id, code: newCode });
    if (insertError) return NextResponse.json({ error: 'Failed to create referral code' }, { status: 500 });
    return NextResponse.json({ code: newCode });
  } catch (error: any) {
    console.error('Referral code GET error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
