import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

export async function POST(request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { coacheeEmail, programId } = body;

    if (!coacheeEmail || !programId) {
      return NextResponse.json({ error: 'coacheeEmail and programId are required' }, { status: 400 });
    }

    const adminSupabase = await createAdminClient();

    const { data: coachProfile, error: coachError } = await adminSupabase
      .from('profiles')
      .select('id')
      .eq('email', user.email)
      .single();

    if (coachError || !coachProfile) {
      return NextResponse.json({ error: 'Coach profile not found' }, { status: 404 });
    }

    const { data: coacheeProfile, error: coacheeError } = await adminSupabase
      .from('profiles')
      .select('id')
      .eq('email', coacheeEmail)
      .single();

    if (coacheeError || !coacheeProfile) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    const { data: existing } = await adminSupabase
      .from('coachee_programs')
      .select('id')
      .eq('coach_id', coachProfile.id)
      .eq('coachee_id', coacheeProfile.id)
      .eq('program_id', programId)
      .single();

    if (existing) {
      return NextResponse.json({ message: 'Already assigned', id: existing.id });
    }

    const { data, error } = await adminSupabase
      .from('coachee_programs')
      .insert({
        coach_id: coachProfile.id,
        coachee_id: coacheeProfile.id,
        program_id: programId,
        status: 'active',
      })
      .select('id')
      .single();

    if (error) throw error;

    return NextResponse.json({ message: 'Program assigned successfully', id: data?.id });
  } catch (error) {
    console.error('ASSIGN ERROR:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
