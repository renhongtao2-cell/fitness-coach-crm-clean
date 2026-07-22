import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
    const body = await request.json();
    const { referralCode } = body;
    if (!referralCode) return NextResponse.json({ success: false, message: 'Please provide a referral code' });
    const adminSupabase = await createAdminClient();
    const currentUserEmail = session.user.email;
    const { data: currentUserProfile } = await adminSupabase.from('profiles').select('id').eq('email', currentUserEmail).single();
    if (!currentUserProfile) return NextResponse.json({ success: false, message: 'Profile not found' });
    const { data: codeRecord, error: codeError } = await adminSupabase.from('referral_codes').select('owner_id, code').eq('code', referralCode.trim().toUpperCase()).maybeSingle();
    if (codeError || !codeRecord) return NextResponse.json({ success: false, message: 'Invalid referral code' });
    if (codeRecord.owner_id === currentUserProfile.id) return NextResponse.json({ success: false, message: 'Cannot use your own referral code' });
    const { data: existingReferral } = await adminSupabase.from('referrals').select('id').eq('referrer_id', codeRecord.owner_id).eq('referee_id', currentUserProfile.id);
    if (existingReferral && existingReferral.length > 0) return NextResponse.json({ success: false, message: 'You have already used this referral code' });
    const { error: referralError } = await adminSupabase.from('referrals').insert({ referrer_id: codeRecord.owner_id, referee_id: currentUserProfile.id, referral_code: codeRecord.code, status: 'converted', converted_at: new Date().toISOString() });
    if (referralError) return NextResponse.json({ success: false, message: 'Failed to apply referral code' });
    return NextResponse.json({ success: true, message: 'Referral code applied successfully!' });
  } catch (error: any) {
    console.error('Referral apply POST error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
