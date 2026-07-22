import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { exercise, note } = body;

    if (!exercise) return NextResponse.json({ error: 'Please enter training content' }, { status: 400 });

    const adminSupabase = await createAdminClient();

    const { data: profile } = await adminSupabase
      .from('profiles')
      .select('id')
      .eq('email', user.email)
      .single();
    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

    // Try to find an active coachee_program
    let { data: cp } = await adminSupabase
      .from('coachee_programs')
      .select('id')
      .eq('coachee_id', profile.id)
      .eq('status', 'active')
      .limit(1)
      .single();

    // If no active program exists, check if any coachee_program exists at all
    if (!cp) {
      const { data: anyCp } = await adminSupabase
        .from('coachee_programs')
        .select('id')
        .eq('coachee_id', profile.id)
        .order('created_at', { ascending: true })
        .limit(1)
        .single();

      if (anyCp) {
        // Activate it
        const { data: activated } = await adminSupabase
          .from('coachee_programs')
          .update({ status: 'active' })
          .eq('id', anyCp.id)
          .select('id')
          .single();
        cp = activated;
      }
    }

    if (!cp) {
      return NextResponse.json({ error: 'No training plan available, please contact your coach' }, { status: 400 });
    }

    const { data, error } = await adminSupabase
      .from('workout_logs')
      .insert({
        coachee_program_id: cp.id,
        week_number: 1,
        day_of_week: new Date().getDay(),
        notes: note || '',
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ log: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}