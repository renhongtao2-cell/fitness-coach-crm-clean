import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const adminSupabase = await createAdminClient();

    const { data: profile } = await adminSupabase
      .from('profiles')
      .select('id, full_name, email, role')
      .eq('email', user.email)
      .single();

    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    if (profile.role !== 'client') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const coacheeId = profile.id;

    const { data: assignments } = await adminSupabase
      .from('coachee_programs')
      .select('*, programs(name, level, duration_weeks)')
      .eq('coachee_id', coacheeId)
      .order('created_at', { ascending: false });

    const { data: measurements } = await adminSupabase
      .from('body_measurements')
      .select('*')
      .eq('coachee_id', coacheeId)
      .order('date', { ascending: false });

    const { data: logs } = await adminSupabase
      .from('workout_logs')
      .select('*')
      .eq('coachee_programs.coachee_id', coacheeId)
      .order('date', { ascending: false });

    const { data: messages } = await adminSupabase
      .from('messages')
      .select('*')
      .or('coachee_id.eq.' + coacheeId + ',coach_id.eq.' + coacheeId)
      .order('created_at', { ascending: false });

    const flatPrograms = (assignments || []).map(a => ({ ...a, duration_weeks: a.programs?.duration_weeks, level: a.programs?.level, name: a.programs?.name || a.name }));
    return NextResponse.json({
      coachee: profile,
      programs: flatPrograms,
      measurements: measurements || [],
      logs: logs || [],
      messages: messages || [],
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}