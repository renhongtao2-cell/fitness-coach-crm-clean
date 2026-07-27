import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const adminSupabase = await createAdminClient();

    // Get profile
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

    // Get all program assignments with nested program details and coach name
    const { data: assignmentsRaw } = await adminSupabase
      .from('coachee_programs')
      .select('*, programs:program_id(name, description, duration_weeks, level, weekly_structure, equipment), profiles!coachee_programs_coach_id_fkey(full_name)')
      .eq('coachee_id', coacheeId)
      .order('created_at', { ascending: false });

    const assignments = (assignmentsRaw || []).map((a) => ({
      ...a,
      programName: a.programs?.name,
      programDescription: a.programs?.description,
      durationWeeks: a.programs?.duration_weeks,
      programLevel: a.programs?.level,
      weeklyStructure: a.programs?.weekly_structure,
      equipment: a.programs?.equipment,
      coachName: a.profiles?.full_name,
    }));

    const activeAssignment = assignments.find((a) => a.status === 'active') || assignments[0];

    // Get body measurements
    const { data: measurements } = await adminSupabase
      .from('body_measurements')
      .select('*')
      .eq('coachee_id', coacheeId)
      .order('date', { ascending: false })
      .limit(30);

    // Get workout logs with sets detail
    let workoutLogs = [];
    if (activeAssignment?.id) {
      const { data: logs } = await adminSupabase
        .from('workout_logs')
        .select('*, workout_sets(*)')
        .eq('coachee_program_id', activeAssignment.id)
        .order('date', { ascending: false })
        .limit(20);
      workoutLogs = logs || [];
    }

    // Get messages between client and coach
    const { data: messages } = await adminSupabase
      .from('messages')
      .select('*')
      .or('coachee_id.eq.' + coacheeId)
      .neq('coach_id', coacheeId)
      .order('created_at', { ascending: false })
      .limit(50);

    // Calculate stats
    const totalWorkouts = workoutLogs.length;
    const completedWorkouts = workoutLogs.filter((l) => l.notes && l.notes.toLowerCase().includes('complete')).length;

    const latestMeasurement = measurements?.[0] || null;

    // Program progress calculation
    let programProgress = 0;
    let startDateStr = '';
    let nextSession = 'Check your program';
    if (activeAssignment?.start_date) {
      const startDate = new Date(activeAssignment.start_date);
      const now = new Date();
      const durationWeeks = activeAssignment.durationWeeks || 12;
      const totalDays = durationWeeks * 7;
      const elapsedDays = Math.max(0, Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
      programProgress = Math.min(100, Math.round((elapsedDays / totalDays) * 100));
      nextSession = now.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
      startDateStr = startDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }

    // Streak calculation
    let streak = 0;
    if (workoutLogs.length > 0) {
      const sortedLogs = [...workoutLogs].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      let checkDate = new Date();
      checkDate.setHours(0, 0, 0, 0);
      for (let i = 0; i < sortedLogs.length; i++) {
        const logDate = new Date(sortedLogs[i].date);
        logDate.setHours(0, 0, 0, 0);
        const diffDays = Math.floor((checkDate.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays <= 1) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }

    const unreadCount = (messages || []).filter((m) => !m.is_read && m.coachee_id === coacheeId).length;

    return NextResponse.json({
      coachee: profile,
      activeProgram: activeAssignment ? {
        ...activeAssignment,
        programName: activeAssignment.programName,
        programDescription: activeAssignment.programDescription,
        durationWeeks: activeAssignment.durationWeeks,
        programLevel: activeAssignment.programLevel,
        weeklyStructure: activeAssignment.weeklyStructure,
        equipment: activeAssignment.equipment,
        coachName: activeAssignment.coachName,
      } : null,
      programs: assignments,
      measurements: measurements || [],
      logs: workoutLogs,
      messages: (messages || []).reverse(),
      stats: {
        completedWorkouts,
        totalWorkouts,
        programProgress,
        streak: streak > 0 ? streak : 0,
        nextSession,
        unreadCount,
        latestMeasurement,
        startDate: startDateStr || 'TBA',
      }
    });
  } catch (error) {
    console.error('Client home API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST for marking workout complete or sending message
export async function POST(request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const adminSupabase = await createAdminClient();
    const { data: profile } = await adminSupabase
      .from('profiles')
      .select('id')
      .eq('email', user.email)
      .single();
    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

    const body = await request.json();
    const { action } = body;

    if (action === 'mark_complete') {
      const { exerciseLogId, notes } = body;
      if (!exerciseLogId) return NextResponse.json({ error: 'Missing log ID' }, { status: 400 });

      const { data: updated, error: updateErr } = await adminSupabase
        .from('workout_logs')
        .update({ notes: `Completed - ${notes || new Date().toISOString()}` })
        .eq('id', exerciseLogId)
        .select()
        .single();
      if (updateErr) throw updateErr;
      return NextResponse.json({ log: updated });
    }

    if (action === 'send_message') {
      // Delegate to the new /api/client/message for proper binding support
      const bindingRes = await adminSupabase
        .from('coach_client_bindings')
        .select('coach_id')
        .eq('client_id', profile.id)
        .eq('status', 'active')
        .limit(1)
        .single();
      
      if (!bindingRes.data) {
        // Fallback to old coachee_programs method for backward compat
        const programRes = await adminSupabase
          .from('coachee_programs')
          .select('coach_id')
          .eq('coachee_id', profile.id)
          .limit(1)
          .single();
        if (!programRes.data) return NextResponse.json({ error: 'No active coaching relationship found' }, { status: 403 });
        
        const { data: msg, error: msgErr } = await adminSupabase
          .from('messages')
          .insert({ coach_id: programRes.data.coach_id, coachee_id: profile.id, content: content.trim(), is_read: false })
          .select()
          .single();
        if (msgErr) throw msgErr;
        return NextResponse.json({ message: msg });
      }
      
      const { data: msg, error: msgErr } = await adminSupabase
        .from('messages')
        .insert({ coach_id: bindingRes.data.coach_id, coachee_id: profile.id, content: content.trim(), is_read: false })
        .select()
        .single();
      if (msgErr) throw msgErr;
      return NextResponse.json({ message: msg });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error('Client API POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
