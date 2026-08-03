import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const adminSupabase = await createAdminClient();

    // Total referrals (where this user is the referrer)
    const { count: total, error: totalErr } = await adminSupabase
      .from('referrals')
      .select('id', { count: 'exact', head: true })
      .eq('referrer_id', userId);

    if (totalErr) {
      console.error('Referral stats total error:', totalErr);
      return NextResponse.json({ error: totalErr.message }, { status: 500 });
    }

    // Converted referrals
    const { count: converted, error: convertedErr } = await adminSupabase
      .from('referrals')
      .select('id', { count: 'exact', head: true })
      .eq('referrer_id', userId)
      .eq('status', 'converted');

    if (convertedErr) {
      console.error('Referral stats converted error:', convertedErr);
      return NextResponse.json({ error: convertedErr.message }, { status: 500 });
    }

    // Reward: 1 month per converted referral (capped at 12)
    const rewardMonths = Math.min(converted || 0, 12);

    return NextResponse.json({
      total: total || 0,
      converted: converted || 0,
      rewardMonths,
    });
  } catch (e: any) {
    console.error('Referral stats API error:', e);
    return NextResponse.json({ error: e.message || 'Internal error' }, { status: 500 });
  }
}