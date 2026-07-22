import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: '未授权' }, { status: 401 });

    const adminSupabase = await createAdminClient();

    // Get coach profile
    const { data: coachProfile } = await adminSupabase
      .from('profiles')
      .select('id')
      .eq('email', user.email)
      .single();
    if (!coachProfile) return NextResponse.json({ error: '未找到教练档案' }, { status: 404 });

    // Get coachee IDs linked to this coach
    const { data: assignments } = await adminSupabase
      .from('coachee_programs')
      .select('coachee_id')
      .eq('coach_id', coachProfile.id);
    const coacheeIds = assignments?.map((a: any) => a.coachee_id) || [];

    if (coacheeIds.length === 0) {
      return NextResponse.json({ coachees: [] });
    }

    // Get coachee profiles
    const { data: profiles } = await adminSupabase
      .from('profiles')
      .select('id, full_name, email, fitness_level, goals')
      .in('id', coacheeIds);

    // Get measurements for each coachee
    const { data: measurements } = await adminSupabase
      .from('body_measurements')
      .select('*')
      .in('coachee_id', coacheeIds)
      .order('date', { ascending: true });

    // Get workout logs
    const { data: logs } = await adminSupabase
      .from('workout_logs')
      .select('*, coachee_programs!inner(coachee_id)')
      .in('coachee_programs.coachee_id', coacheeIds)
      .order('date', { ascending: false });

    // Get assignments with program info
    const { data: progAssignments } = await adminSupabase
      .from('coachee_programs')
      .select('*, programs(name, level, ai_generated)')
      .eq('coach_id', coachProfile.id)
      .order('created_at', { ascending: false });

    return NextResponse.json({
      coachees: profiles || [],
      measurements: measurements || [],
      logs: logs || [],
      assignments: progAssignments || [],
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}