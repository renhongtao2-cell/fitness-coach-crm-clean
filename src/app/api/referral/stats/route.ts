import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
    const adminSupabase = await createAdminClient();
    const userEmail = session.user.email;
    const { data: userProfile } = await adminSupabase.from('profiles').select('id').eq('email', userEmail).single();
    if (!userProfile) return NextResponse.json({ total: 0, converted: 0, pending: 0, rewardMonths: 0 });
    const { data: codeData } = await adminSupabase.from('referral_codes').select('code, owner_id').eq('owner_id', userProfile.id).maybeSingle();
    if (!codeData) return NextResponse.json({ total: 0, converted: 0, pending: 0, rewardMonths: 0 });
    const { count: totalCount } = await adminSupabase.from('referrals').select('*', { count: 'exact', head: true }).eq('referrer_id', codeData.owner_id);
    const { data: convertedData } = await adminSupabase.from('referrals').select('id').eq('referrer_id', codeData.owner_id).eq('status', 'converted');
    const converted = convertedData?.length || 0;
    const { data: pendingData } = await adminSupabase.from('referrals').select('id').eq('referrer_id', codeData.owner_id).eq('status', 'pending');
    const pending = pendingData?.length || 0;
    return NextResponse.json({ total: totalCount || 0, converted, pending, rewardMonths: converted });
  } catch (error: any) {
    console.error('Referral stats GET error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
