import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

// POST /api/referral/apply
// Body: { code: string }
// Called when a new user signs up with a referral code
// Creates a referral record linking the new user (referee) to the referrer
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const code = (body?.code || '').trim().toUpperCase();

    if (!code) {
      return NextResponse.json({ error: 'Referral code required' }, { status: 400 });
    }

    const refereeId = session.user.id;
    const adminSupabase = await createAdminClient();

    // Find the referrer by code
    const { data: codeRow, error: codeErr } = await adminSupabase
      .from('referral_codes')
      .select('owner_id')
      .eq('code', code)
      .maybeSingle();

    if (codeErr) {
      console.error('Referral apply lookup error:', codeErr);
      return NextResponse.json({ error: codeErr.message }, { status: 500 });
    }

    if (!codeRow?.owner_id) {
      return NextResponse.json({ error: 'Invalid referral code' }, { status: 404 });
    }

    const referrerId = codeRow.owner_id;

    // Don't allow self-referral
    if (referrerId === refereeId) {
      return NextResponse.json({ error: 'Cannot use your own referral code' }, { status: 400 });
    }

    // Check if already applied
    const { data: existing } = await adminSupabase
      .from('referrals')
      .select('id')
      .eq('referee_id', refereeId)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ error: 'Referral already applied', alreadyApplied: true }, { status: 409 });
    }

    // Create referral record
    const { error: insertErr } = await adminSupabase
      .from('referrals')
      .insert({
        referrer_id: referrerId,
        referee_id: refereeId,
        referral_code: code,
        status: 'pending',
      });

    if (insertErr) {
      console.error('Referral insert error:', insertErr);
      return NextResponse.json({ error: insertErr.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error('Referral apply error:', e);
    return NextResponse.json({ error: e.message || 'Internal error' }, { status: 500 });
  }
}