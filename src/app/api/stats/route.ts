import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const adminSupabase = await createAdminClient();
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

    // Parallel queries for total counts and today's counts
    const [coachesAll, clientsAll, coachesToday, clientsToday] = await Promise.all([
      adminSupabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'coach'),
      adminSupabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'client'),
      adminSupabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'coach').gte('created_at', startOfToday),
      adminSupabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'client').gte('created_at', startOfToday),
    ]);

    const totalCoaches = coachesAll.count ?? 0;
    const totalClients = clientsAll.count ?? 0;
    const todayCoaches = coachesToday.count ?? 0;
    const todayClients = clientsToday.count ?? 0;

    return NextResponse.json({
      totalCoaches,
      totalClients,
      totalUsers: totalCoaches + totalClients,
      todayRegistrations: todayCoaches + todayClients,
      todayRegistrationBreakdown: {
        coaches: todayCoaches,
        clients: todayClients,
      },
    });
  } catch (error: any) {
    console.error('Stats GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 });
}

export async function PUT(request: NextRequest) {
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 });
}

export async function PATCH(request: NextRequest) {
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 });
}

export async function DELETE(request: NextRequest) {
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 });
}