import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getServiceClient } from '@/lib/supabase/service';

// Generate a random referral code (8 chars, uppercase alphanumeric)
function generateReferralCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // skip confusing chars (0/O, 1/I)
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const adminSupabase = await getServiceClient();

    // Check if user already has a referral code
    const { data: existing, error: lookupErr } = await adminSupabase
      .from('referral_codes')
      .select('code')
      .eq('owner_id', userId)
      .maybeSingle();

    if (lookupErr) {
      console.error('Referral code lookup error:', lookupErr);
      return NextResponse.json({ error: lookupErr.message }, { status: 500 });
    }

    if (existing?.code) {
      return NextResponse.json({ code: existing.code });
    }

    // Generate a new unique code (retry up to 5 times on collision)
    let newCode = '';
    for (let attempt = 0; attempt < 5; attempt++) {
      const candidate = generateReferralCode();
      const { data: conflict } = await adminSupabase
        .from('referral_codes')
        .select('code')
        .eq('code', candidate)
        .maybeSingle();
      if (!conflict) {
        newCode = candidate;
        break;
      }
    }

    if (!newCode) {
      return NextResponse.json({ error: 'Failed to generate unique code' }, { status: 500 });
    }

    // Insert the new code
    const { error: insertErr } = await adminSupabase
      .from('referral_codes')
      .insert({ owner_id: userId, code: newCode });

    if (insertErr) {
      console.error('Referral code insert error:', insertErr);
      return NextResponse.json({ error: insertErr.message }, { status: 500 });
    }

    return NextResponse.json({ code: newCode });
  } catch (e: any) {
    console.error('Referral code API error:', e);
    return NextResponse.json({ error: e.message || 'Internal error' }, { status: 500 });
  }
}