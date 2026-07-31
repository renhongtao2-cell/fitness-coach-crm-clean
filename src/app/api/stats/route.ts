import { NextResponse } from 'next/server';

// We need a Supabase client that bypasses RLS
// Fetch it dynamically to avoid issues with module-level init
async function getSupabaseAdmin() {
  const { createServerClient } = await import('@supabase/ssr');
  const { cookies } = await import('next/headers');

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() { return []; },
        setAll() {},
      },
    }
  );
}

export async function GET() {
  try {
    // First verify the user is logged in via standard auth
    const { createClient } = await import('@/lib/supabase/server');
    const ssb = await createClient();
    const { data: { session }, error } = await ssb.auth.getSession();
    
    if (error || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Use admin client (service role key) to bypass RLS and see ALL profiles
    const supabase = await getSupabaseAdmin();
    
    // Get today's date in Asia/Shanghai timezone (UTC+8)
    const now = new Date();
    const shanghaiTime = new Date(now.getTime() + 8 * 3600000 - now.getTimezoneOffset() * 60000);
    const todayStart = shanghaiTime.toISOString().split('T')[0];

    const [{ data: allProfiles }, { data: coachProfiles }, { data: clientProfiles }, { data: todayProfiles }] = await Promise.all([
      supabase.from('profiles').select('*'),
      supabase.from('profiles').select('*').eq('role', 'coach'),
      supabase.from('profiles').select('*').eq('role', 'client'),
      supabase.from('profiles').select('*').gte('created_at', todayStart),
    ]);

    const all = allProfiles || [];
    const coaches = coachProfiles || [];
    const clients = clientProfiles || [];
    const today = todayProfiles || [];

    const todayCoachCount = today.filter((p: any) => p.role === 'coach').length;
    const todayClientCount = today.filter((p: any) => p.role === 'client').length;

    return NextResponse.json({
      totalUsers: all.length,
      totalCoaches: coaches.length,
      totalClients: clients.length,
      todayRegistrations: today.length,
      todayRegistrationBreakdown: {
        coaches: todayCoachCount,
        clients: todayClientCount,
      },
    });
  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
